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
  let categoryList: {
    id: number;
    name: String;
    icon: String;
  }[] = [];
  try {
    let res: Response = await fetch(
      "http://localhost:8081/api/v1/product/categorylist",
      {
        cache: "no-store",
      }
    );
    if (res.ok) categoryList = await res.json();
  } catch (error) {}
  let session = await getServerSession(options);
  return (
    <html lang="en">
      <body className={poppins.className + " bg-gray-200"}>
        <NextAuthProvider>
          <Header categoryList={categoryList} sessionProps={session} />
          <ToastContainer />

          <div className=" max-w-[1230px] mx-auto px-2">{children}</div>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
