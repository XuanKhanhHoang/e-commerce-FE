import { userGeneral } from "@/components/dto/user.dto";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    user?: {
      access_token: string;
      value: userGeneral;
    } & DefaultSession["user"];
  }
  interface User {
    access_token: string;
    value: userGeneral;
  }
}
