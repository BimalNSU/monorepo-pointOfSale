import { ChartOfAccountId } from "./common.model";

//Note: here openningBalance ID will be like '2024-01-31', '2024-02-01'
export interface AccountBalance {
  accounts: { id: ChartOfAccountId; amount: number }[];
}
