import { options } from "@/app/api/auth/[...nextauth]/options";
import UpdateDetail from "@/components/customer/update_userdetail/UpdateDetail";
import { UserFullDetail } from "@/components/dto/user.dto";
import CustomFetch from "@/utils/fetch";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const access_token = (await getServerSession(options))?.user?.access_token;
  let user: UserFullDetail;
  try {
    let response = await CustomFetch("/customer/customer_detail", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    if (!response.ok) {
      user = await response.json();
      console.log(user);
      redirect("/");
      return;
    }
    user = await response.json();
    return (
      <div className="max-w-screen-xl mx-auto my-5 p-5">
        <UpdateDetail userDetail={user} access_token={access_token as string} />
      </div>
    );
  } catch (error) {
    console.log(error);
    redirect("/");
  }
}
