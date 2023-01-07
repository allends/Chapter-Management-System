import { Session } from "next-auth";

export type UserSession = ({
  role: string,
  id: string,
} & Session) | null