import { NextAuthOptions, Session, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import fetch from "@/utils/fetch";
import { userGeneral } from "@/components/dto/user.dto";
export const options: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialProvider({
      id: "user",
      name: "user",
      type: "credentials",
      credentials: {
        login_name: {
          type: "text",
        },
        password: {
          type: "text",
        },
        access_token: {
          type: "text",
        },
        value: {
          value: "",
        },
      },
      async authorize(credentials, req): Promise<any> {
        let res: Response = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login_name: credentials?.login_name,
            password: credentials?.password,
          }),
        });
        if (!res.ok) return null;
        let user: { access_token: string; value: userGeneral } =
          await res.json();
        return user;
      },
    }),
    // CredentialProvider({
    //   id: "admin",
    //   name: "admin",
    //   type: "credentials",
    //   credentials: {
    //     username: {
    //       label: "UserName",
    //       type: "text",
    //       placeholder: "",
    //     },
    //     password: {
    //       label: "Password",
    //       type: "text",
    //       placeholder: "",
    //     },
    //   },
    //   async authorize(credentials, req): Promise<any> {
    //     let res: Response = await fetch(
    //       "http://localhost:8081/auth/AdminLogin",
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           username: credentials?.username,
    //           password: credentials?.password,
    //         }),
    //       }
    //     );
    //     if (!res.ok) return null;
    //     let user: any = await res.json();
    //     if (res.ok && "value" in user) {
    //       console.log("kkk ", user);
    //       return user;
    //     }
    //     return null;
    //   },
    // }),
    // FacebookProvider({

    // })
  ],
  callbacks: {
    async jwt({ token, user = undefined }) {
      return { ...user, ...token };
    },
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: { ...token },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  // events: {
  //   updateUser: async ({ user }) => {},
  // },
};
