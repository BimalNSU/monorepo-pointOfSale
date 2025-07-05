import { BkashService } from "../services/bkash.service";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
interface BkashPayload {
  Type: string;
  MessageId: string;
  Token: string;
  TopicArn: string;
  Message: string;
  SubscribeURL: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
}
interface PayloadMessage {
  dateTime: string; //"20180419122246"
  debitMSISDN: string; //"8801700000001"
  creditOrganizationName: string;
  creditShortCode: string;
  trxID: string;
  transactionStatus: string;
  transactionType: string; // Transaction type defines transaction channels
  amount: string; // Transaction Amount (Actual Amount - Coupon Amount)
  currency: string; //e.g. 'BDT'
  transactionReference: string; //"User inputed reference value."
  merchantInvoiceNumber: string;
}
export class BkashMiddleware {
  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    const body = req.body as BkashPayload;

    if (body.Type === "SubscriptionConfirmation" && body.SubscribeURL) {
      // Confirm SNS subscription
      try {
        console.log("Confirming subscription:", body.SubscribeURL);
        await axios.get(body.SubscribeURL);
        res.status(200).send("Subscription confirmed");
      } catch (e) {
        res.status(500).send("Subscription confirmation failed");
      }
    }
    if (body.Type === "Notification") {
      try {
        const message = JSON.parse(body.Message) as PayloadMessage;
        // Store to Firestore
        const data = {
          completedTime: message.dateTime, // "20180419122246"
          customerMobile: message.debitMSISDN, //"8801700000001"
          status: message.transactionStatus,
          // transactionType: message.transactionType,
          amount: Number(message.amount),
          reference: message.transactionReference ?? null,
          merchantInvoiceNumber: message.merchantInvoiceNumber ?? null,
        };
        await new BkashService().create(data, message.trxID);
        res.status(200).send("Notification received");
      } catch (e) {
        res
          .status(500)
          .json({ error: "Internal server error. Please try again later." });
      }
    }
  }
}
