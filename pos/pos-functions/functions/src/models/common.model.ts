import { ActiveSession, UserId, WithId } from "@pos/shared-models";

export interface CustomAuth {
  authUserId: UserId;
  session: WithId<Pick<ActiveSession, "role" | "shopId" | "shopRole">>;
}
