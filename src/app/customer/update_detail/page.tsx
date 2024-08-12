import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  district,
  districtList,
  provine,
  provineList,
} from "@/components/customer/customer_info/customerInfor";
import UpdateDetail from "@/components/customer/update_userdetail/UpdateDetail";
import { UserFullDetail } from "@/components/dto/user.dto";
import CustomFetch from "@/utils/fetch";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const access_token = (await getServerSession(options))?.user?.access_token;
  let user: UserFullDetail;
  let provineList: provineList | undefined;
  let districtList: districtList | undefined;
  let address: {
    district: district | undefined;
    provine: provine | undefined;
    rest: string | undefined;
  } = { district: undefined, provine: undefined, rest: undefined };
  try {
    let [, userDetailResponse] = await Promise.all([
      fetch("https://vapi.vnappmob.com/api/province/", {
        cache: "force-cache",
      }).then(async (res) => {
        if (res.ok) {
          provineList = await res.json();
        }
      }),
      CustomFetch("/customer/customer_detail", {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }),
    ]);
    // if (!userDetailResponse.ok) {
    //   redirect("/");
    // }
    user = await userDetailResponse.json();
    let [provineId, districtId, rest] = (user as UserFullDetail).address.split(
      ",",
      3
    );
    address.rest = rest;
    address.provine = provineList?.results.find(
      (item) => item.province_id == provineId
    );
    await fetch(
      `https://vapi.vnappmob.com/api/province/district/${provineId}`,
      {
        cache: "force-cache",
      }
    ).then(async (res) => {
      if (res.ok) {
        districtList = await res.json();
        let a = districtList?.results.find((item, index) => {
          {
            return item.district_id == districtId;
          }
        });
        address.district = a;
      } else console.log(await res.json());
    });
    return (
      <div className="max-w-screen-xl mx-auto my-5 p-5">
        <UpdateDetail
          userDetail={user}
          access_token={access_token as string}
          provineList={provineList}
          address={address}
          districtList={districtList}
        />
      </div>
    );
  } catch (error) {
    console.log(error);
    redirect("/");
  }
}
