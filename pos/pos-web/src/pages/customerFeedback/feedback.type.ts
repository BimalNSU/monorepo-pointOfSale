import { CustomerFeedback, WithId } from "@pos/shared-models";

export type FeedbackRow = WithId<
  Omit<CustomerFeedback, "createdAt"> & {
    createdAt: string;
  }
>;
