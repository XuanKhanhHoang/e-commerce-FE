import { NextAuthOptions, Session, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { userGeneral } from "@/components/dto/user.dto";
import FacebookProvider from "next-auth/providers/facebook";
import CustomFetch from "@/utils/fetch";
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
        let res: Response = await CustomFetch("/auth/login", {
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
    FacebookProvider({
      clientId: process.env.FB_CLIENT_APP_ID as string,
      clientSecret: process.env.FB_CLIENT_APP_SECRET as string,
      authorization: {
        url: "https://www.facebook.com/v11.0/dialog/oauth",
        params: {
          scope: "openid email public_profile",
          response_type: "code",
        },
      },
      token: {
        url: "https://graph.facebook.com/oauth/access_token",
        async request(context) {
          // Lấy token từ Facebook
          const params = new URLSearchParams({
            client_id: context.provider.clientId as string,
            redirect_uri: context.provider.callbackUrl as string,
            client_secret: context.provider.clientSecret as string,
            code: context.params.code as string,
          }).toString();
          const res = await fetch(
            "https://graph.facebook.com/oauth/access_token" + "?" + params,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          if (!res.ok) throw new Error("facebook authentication failed");
          const token = (await res.json()) as {
            access_token: string;
            token_type: string;
            expires_in: number;
            id_token: string;
          };

          return { tokens: token };
        },
      },
      // userinfo: {
      //   request({ tokens, client, provider }) {
      //     return {};
      //   },
      // },
      // checks:()=>{

      // }
      async profile(profile, tokens) {
        // Gửi token đến API khác để xác thực
        const customAuthRes = await CustomFetch("/auth/login_by_facebook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: tokens.access_token,
          }),
        });

        if (!customAuthRes.ok) throw new Error("server authentication failed");
        const customAuthData: { access_token: string; value: userGeneral } =
          await customAuthRes.json();
        return {
          id: "01010100",
          ...customAuthData,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
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
    signIn: "/auth/login",
  },
};
