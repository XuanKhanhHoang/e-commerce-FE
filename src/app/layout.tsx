import "@/assets/fontawesome/css/all.min.css";
import Header from "@/components/layout/header/header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Footer from "@/components/layout/footer/footer";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import ReduxProvider from "@/redux/Provider";
import CustomFetch from "@/utils/fetch";
import { userGeneral } from "@/components/dto/user.dto";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
const poppins = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Shop",
  description: "E-Commerce Shop",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLogoutPage: boolean = pathname.toLowerCase() == "/auth/logout";
  let session = await getServerSession(options);
  let categoryList: categoryList = [];
  let accessToken = session?.user?.access_token;
  let newData: { access_token: string; value: userGeneral } | undefined;
  let isValidToken = true;
  try {
    const checkValidAccessToken = async () => {
      if (accessToken)
        return await CustomFetch("/auth/refreshinfobyaccesstoken", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          next: { revalidate: 300 },
          cache: undefined,
        });
      return undefined;
    };
    const [categoryResponse, checkValidTokenResponse] = await Promise.all([
      CustomFetch("/product/categorylist", {
        next: { revalidate: 300 },
        cache: undefined,
      }),
      checkValidAccessToken(),
    ]);
    if (categoryResponse.ok) categoryList = await categoryResponse.json();
    if (checkValidTokenResponse != undefined)
      if ((checkValidTokenResponse as unknown as Response).ok) {
        newData = await (checkValidTokenResponse as unknown as Response).json();
      } else isValidToken = false;
    else isValidToken = true;
    console.log(isValidToken);
  } catch (error) {
    isValidToken = false;
    console.log(error);
  }

  if (!isValidToken && !isLogoutPage) return redirect("/auth/logout");
  return (
    <html lang="en">
      <body className={poppins.className + " bg-gray-200"}>
        <ReduxProvider>
          <NextAuthProvider>
            <Header
              categoryList={categoryList}
              sessionProps={session}
              auth={{ isValidToken, data: newData }}
            />
            <ToastContainer />
            <div className=" max-w-[1230px] mx-auto px-2">{children}</div>
            <Footer />
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
