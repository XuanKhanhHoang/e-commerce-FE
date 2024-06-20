import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { customerRole } from "../../api/auth/[...nextauth]/roles.enum";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    (await getServerSession(options))?.user?.value.user_id != undefined &&
    (await getServerSession(options))?.user?.value.ROLE == customerRole
  ) {
    return redirect("/");
  }
  return <div>{children}</div>;
}
