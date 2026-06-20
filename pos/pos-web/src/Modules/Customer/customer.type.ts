import { Customer, WithId } from "@pos/shared-models";

export interface CustomerRow extends Omit<WithId<Customer>, "createdAt"> {
  createdAt: string;
}
