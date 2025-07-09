import {
  User as UserModel,
  UserId,
  BasisType,
  NatureType,
  VoucherType,
  TransactionTypes,
  TransactionHead,
  WithId,
  Invoice as InvoiceModel,
  ChartOfAccount as ChartOfAccountModel,
  ChartOfAccountId,
  AccountTypeHead,
} from "@pos/shared-models";
import { AppError } from "../AppError";
import { CreateInvoiceInput } from "../schemas/invoice.schema";
import { db } from "../firebase";
import { Invoice } from "../db-collections/invoice.collection";
import { Transaction } from "../db-collections/transaction.collection";
import { Product } from "../db-collections/product.collection";
import { WriteBatch } from "firebase-admin/firestore";
import { ChartOfAccount } from "../db-collections/chartOfAccount.collection";
import { RESERVE_ACCOUNT_ID } from "../constants/reserveChartOfAccount";
import { AccountBalance } from "../db-collections/accountBalance.collection";
import dayjs from "dayjs";
import { AccountBalanceCounter } from "./accountBalanceCounter.service";

type omitType = "createdBy" | "updatedBy" | "deletedAt" | "deletedBy";
export type EditData = Omit<UserModel, omitType | "createdBy" | "createdAt">;
const defaultInvoice_CoaId = RESERVE_ACCOUNT_ID.ProductSales;

export class InvoiceService {
  async create(reqData: CreateInvoiceInput, createdBy: UserId) {
    const productIds = reqData.items.map((item) => item.id);
    try {
      const productObj = new Product();
      const targetProducts = await productObj.getByIds(productIds);

      //#region input validating
      const numOfErrors = new Array<string>();
      reqData.items.forEach((item, index) => {
        const targetProduct = targetProducts.find((tP) => tP.id === item.id);
        if (!targetProduct) {
          numOfErrors.push(`items[${index}].${item.id} is invalid`);
        } else {
          if (targetProduct.qty < item.qty) {
            numOfErrors.push(`items[${index}].qty #${item.id} is insufficient`);
          }
        }
      });
      if (numOfErrors.length) {
        throw new AppError(400, numOfErrors.join(",")); //TODO:
      }
      // #endregion
      let invoiceTotal = 0;
      const now = new Date();
      const invoiceItems = reqData.items.map((item) => {
        const targetProduct = targetProducts.find(
          (tProduct) => tProduct.id === item.id
        )!;
        invoiceTotal +=
          item.qty * targetProduct.salesRate - (item.discount ?? 0);
        return {
          productId: item.id,
          name: targetProduct.name,
          description: null,
          qty: item.qty,
          rate: targetProduct.salesRate,
          discount: item.discount,
        };
      });
      if (reqData.discount) {
        invoiceTotal -= reqData.discount ?? 0;
      }
      const batch = db.batch();
      const invoiceObj = new Invoice();
      const newInvoice = invoiceObj.create(
        batch,
        {
          status: 1,
          totalAmount: invoiceTotal,
          discount: reqData.discount,
          subject: reqData.subject,
          items: invoiceItems,
          targetUserId: reqData.targetUserId,

          //default fields
          createdAt: now,
          createdBy,
          updatedAt: now,
          updatedBy: createdBy,
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
        },
        reqData.id
      );
      //updating qty of products
      invoiceItems.forEach((item) => {
        const matchProduct = targetProducts.find(
          (p) => p.id === item.productId
        )!;
        productObj.update(
          item.productId,
          {
            qty: matchProduct.qty - item.qty,
            updatedAt: now,
            updatedBy: createdBy,
          },
          batch
        );
      });

      await this.runTransaction(
        batch,
        newInvoice,
        now,
        createdBy,
        reqData.deposits
      );
      await batch.commit();
      return newInvoice;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  private async runTransaction(
    batch: WriteBatch,
    invoice: WithId<InvoiceModel>,
    createdAt: Date,
    createdBy: UserId,
    reqCashAccounts?: { id: string; amount: number }[]
  ) {
    const isAccrual = Boolean(!reqCashAccounts?.length);
    let cashAccounts: Array<WithId<ChartOfAccountModel>> | null;
    if (!isAccrual && reqCashAccounts) {
      const chartOfAccountObj = new ChartOfAccount();
      const targetChartOfAccounts = await chartOfAccountObj.getByIds(
        reqCashAccounts.map((i) => i.id)
      );
      // #region validating cash account ids
      const missMatchAccountMessages: ChartOfAccountId[] = [];
      reqCashAccounts.forEach((rcoa, index) => {
        if (!targetChartOfAccounts.find((tcoa) => tcoa.id === rcoa.id)) {
          missMatchAccountMessages.push(
            `deposits.[${index}].id ${rcoa.id} is invalid`
          );
        }
      });
      if (missMatchAccountMessages.length) {
        throw new AppError(400, missMatchAccountMessages.join(","));
      }
      //#endregion
      cashAccounts = targetChartOfAccounts;
    }
    const accountBalance = new AccountBalance();
    const currentBalanceId = dayjs(createdAt).format("YYYY-MM-DD");
    const currentBalance = await accountBalance.get(currentBalanceId);
    const balanceCounter = new AccountBalanceCounter(currentBalance);

    const transactionObj = new Transaction();
    const transactionCommonData = {
      type: TransactionTypes.Invoice,
      basisType: isAccrual ? BasisType.Accrual : BasisType.Cash,
      referenceNo: null, //default
      remark: invoice.subject,
      forVoucherType: VoucherType.Invoice,
      forVoucherId: invoice.id,
      sourceVoucherType: VoucherType.Invoice,
      sourceVoucherId: invoice.id,
      createdAt,
      createdBy,
    };
    const headCoaIdsSet = new Set<string>();
    const transactionHeads = new Array<TransactionHead>();

    if (isAccrual) {
      const receivableCoaId = RESERVE_ACCOUNT_ID.Receivable;
      headCoaIdsSet.add(receivableCoaId);
      //receivable transaction head
      const receivableHead = {
        coaId: receivableCoaId,
        name: "Receivable", //TODO: add chart of account name
        nature: NatureType.debit,
        amount: invoice.totalAmount,
      };
      transactionHeads.push(receivableHead);
      balanceCounter.add(receivableHead, AccountTypeHead.ASSET);
    } else {
      //cash-transaction heads; increasing (i.e. debit)
      reqCashAccounts?.forEach((rCashAccount) => {
        const matchedAccount = cashAccounts!.find(
          (acc) => acc.id === rCashAccount.id
        )!;
        headCoaIdsSet.add(rCashAccount.id);
        const cashHead = {
          coaId: rCashAccount.id,
          name: matchedAccount.name,
          nature: NatureType.debit,
          amount: rCashAccount.amount,
        };
        transactionHeads.push(cashHead);
        balanceCounter.add(cashHead, matchedAccount.accountTypeHead);
      });
    }
    //increase income head (i.e. credit)
    const incomeHead = {
      coaId: defaultInvoice_CoaId,
      name: "income", //TODO: add chart of account name
      nature: NatureType.credit,
      amount: invoice.totalAmount,
    };
    transactionHeads.push(incomeHead);
    balanceCounter.add(incomeHead, AccountTypeHead.INCOME);
    transactionObj.create(batch, {
      ...transactionCommonData,
      headCoaIds: [...headCoaIdsSet, defaultInvoice_CoaId],
      heads: transactionHeads,
    });
    const newAccountBalance = balanceCounter.get();
    accountBalance.set(batch, newAccountBalance, currentBalanceId);
  }
}
