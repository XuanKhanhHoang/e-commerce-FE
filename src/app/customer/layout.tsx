import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { customerRole } from "../api/auth/[...nextauth]/roles.enum";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  if (
    !session ||
    session.user?.value.ROLE != customerRole ||
    !session.user.access_token
  )
    return redirect("/auth/login");
  return <>{children}</>;
}
