import { Session, UserId, WithId } from "@pos/shared-models";

export interface CustomAuth {
  authUserId: UserId;
  session: WithId<Pick<Session, "userId" | "role" | "shopId" | "shopRole">>;
}
