"use client";
import CustomFetch from "@/utils/fetch";
import { Button, Radio, Typography } from "@material-tailwind/react";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserFullDetail } from "@/components/dto/user.dto";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";
import {
  district,
  districtList,
  provine,
  provineList,
} from "../customer_info/customerInfor";

export default function UpdateDetail({
  userDetail,
  access_token,
  provineList,
  address,
  districtList: districtListProps,
}: {
  userDetail: UserFullDetail;
  access_token: string;
  provineList: provineList | undefined;
  districtList: districtList | undefined;
  address: {
    district: district | undefined;
    provine: provine | undefined;
    rest: string | undefined;
  };
}) {
  const defaultDistrictListOnj: districtList = {
    results: [],
  };
  const router = useRouter();
  const mounted = useRef(0);

  const [districtList, setDistrictList] = useState<districtList>(
    districtListProps || defaultDistrictListOnj
  );
  const [curProvineIndex, setCurProvineIndex] = useState(
    provineList?.results.findIndex(
      (item) => item.province_id == address.provine?.province_id
    ) || 1
  );
  const [curDistrictIndex, setCurDistrictIndex] = useState<number>(
    districtListProps?.results.findIndex(
      (item) => item.district_id == address.district?.district_id
    ) || 1
  );

  const [image, setImage] = useState<string>(
    () => getWebViewLinkFromWebContentLink(userDetail.avartar) || ""
  );
  const [firstName, setFirstName] = useState<string>(userDetail.first_name);
  const [lastName, setLastName] = useState<string>(userDetail.last_name);
  const [userName, setUserName] = useState<string>(userDetail.login_name);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userDetail.phone_number
  );
  const [restAddress, setRestAddress] = useState<string>(address?.rest || "");
  const [isMale, setIsMale] = useState<boolean>(userDetail.gender);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  const handleUpdateDetail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData();
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !isValidPhoneNumber(phoneNumber) ||
      !restAddress
    )
      return;
    formData.set("last_name", lastName);
    formData.set("first_name", firstName);
    formData.set("phone_number", phoneNumber);
    formData.set("gender", "" + isMale);
    formData.set(
      "address",
      `${provineList?.results[curProvineIndex].province_id || "01"},${
        districtList?.results[curDistrictIndex].district_id || "001"
      },${restAddress}`
    );

    if (image) {
      let avatar = document.getElementById("avatar") as HTMLInputElement;
      formData.set("avatar", avatar.files![0]);
    }

    try {
      const response = await CustomFetch("/customer/update_detail", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      setIsLoading(false);

      if (response.ok) {
        return toast.success("Thay đổi thông tin thành công", {
          autoClose: 400,
          onClose: () => {
            router.push("/customer");
            router.refresh();
          },
        });
      }
      let res = (await response.json()) as { message: string };
      if (response.status == 409) {
        if (res.message.includes("phone_number")) {
          toast.error("Số điện thoại đã tồn tại", { autoClose: 400 });
        } else {
          toast.error("Tên tài khoản đã tồn tại", { autoClose: 400 });
        }
        return;
      }
      if (response.status == 400) {
        toast.error("Vui lòng chọn ảnh đúng định dạng jpg|webp|png|jpeg !", {
          autoClose: 800,
        });
        return;
      }
      console.log(res);
      toast.error("Có lỗi xảy ra", { autoClose: 400 });
    } catch (error) {
      setIsLoading(false);
      toast.error("Có lỗi xảy ra", { autoClose: 400 });
      console.error("Error sending form data:", error);
    }
  };

  useEffect(() => {
    const getDistrictList = async () => {
      setIsLoading(true);
      try {
        await fetch(
          `https://vapi.vnappmob.com/api/province/district/${
            provineList?.results[curProvineIndex].province_id || "01"
          }`,
          {
            cache: "force-cache",
          }
        ).then(async (res) => {
          if (res.ok) {
            let districtListTmp = await res.json();
            setDistrictList(districtListTmp);
            setCurDistrictIndex(1);
          }
        });
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    };
    if (mounted.current < 1) {
      mounted.current += 1;
      return;
    }
    getDistrictList();
  }, [curProvineIndex]);
  return (
    <div className="max-w-screen-xl mx-auto my-5 p-5">
      <form className="md:flex no-wrap md:-mx-2 " onSubmit={handleUpdateDetail}>
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="bg-white p-3 border-t-4 border-green-400">
            <img
              src={image || "/logo.png"}
              alt=""
              className="h-[200px] mx-auto"
            />
            <label
              htmlFor="avatar"
              className=" mt-2 align-mdle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-500 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block mx-auto"
            >
              Thay đổi ảnh đại diện
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="invisible "
              accept=".jpeg,.png,.webp"
              onChange={onImageChange}
            />
          </div>
          <div className="my-4" />
        </div>
        <div className="w-full md:w-9/12 mx-2 ">
          <div className="bg-white p-1 md:p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span className="tracking-we text-center">
                Cập nhật thông tin
              </span>
            </div>
            <div className="text-gray-700">
              <div className="flex text-sm flex-wrap">
                <div className="w-1/2">
                  <div className="px-3 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Họ
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={
                        (lastName.length == 0
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      required
                    />
                    {lastName.length == 0 && (
                      <Typography
                        placeholder={""}
                        variant="small"
                        color="red"
                        className="mt-2 flex items-center gap-1 font-normal"
                      >
                        Họ không được để trống
                      </Typography>
                    )}
                  </div>
                </div>
                <div className=" w-1/2">
                  <div className="px-4 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      name="first_name"
                      className={
                        (firstName.length == 0
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      required
                    />
                    {firstName.length == 0 && (
                      <Typography
                        placeholder={""}
                        variant="small"
                        color="red"
                        className="mt-2 flex items-center gap-1 font-normal"
                      >
                        Tên không được để trống
                      </Typography>
                    )}
                  </div>
                </div>
                <div className=" w-1/2">
                  <div className="px-4 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      className={
                        (userName.length == 0
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      name="user_name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                    {userName.length == 0 && (
                      <Typography
                        placeholder={""}
                        variant="small"
                        color="red"
                        className="mt-2 flex items-center gap-1 font-normal"
                      >
                        Tên đăng nhập không được để trống
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <div className="px-3 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      className={
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      disabled
                      value={userDetail.email}
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <div className="px-4 py-2 font-semibold inline-block my-auto">
                    Giới tính
                  </div>
                  <Radio
                    name="gender"
                    label="Nam"
                    checked={isMale}
                    crossOrigin={""}
                    value={"true"}
                    onClick={(e) => setIsMale(true)}
                  />
                  <Radio
                    name="gender"
                    label="Nữ"
                    value={"false"}
                    checked={!isMale}
                    crossOrigin={""}
                    onClick={(e) => setIsMale(false)}
                  />
                </div>
                <div className="w-1/2">
                  <div className="px-4 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className={
                        (!isValidPhoneNumber(phoneNumber)
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      name="phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    {!isValidPhoneNumber(phoneNumber) && (
                      <Typography
                        placeholder={""}
                        variant="small"
                        color="red"
                        className="mt-2 flex items-center gap-1 font-normal"
                      >
                        Số điện thoại không hợp lệ
                      </Typography>
                    )}
                  </div>
                </div>
                <div className=" w-full">
                  <div className="px-4 py-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Địa chỉ
                    </label>
                    <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                      <span className="text-sm font-normal w-[90px]">
                        Tỉnh thành :
                      </span>
                      <select
                        value={curProvineIndex}
                        onChange={(e) => {
                          let index = Number(e.target.value);
                          console.log(index);
                          setCurProvineIndex(!isNaN(index) ? index : 1);
                        }}
                        className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                      >
                        {provineList?.results &&
                          provineList?.results.map((item, index) => {
                            return (
                              <option value={index} key={item.province_id}>
                                {item.province_name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                      <span className="text-sm font-normal w-[90px]">
                        Quận huyện :
                      </span>
                      <select
                        value={curDistrictIndex}
                        onChange={(e) => {
                          let index = Number(e.target.value);
                          setCurDistrictIndex(!isNaN(index) ? index : 1);
                        }}
                        className="bg-gray-50 border w-full md:w-80 border-gray-300 text-gray-900 text-sm rounded-sm mt-2"
                      >
                        {districtList?.results &&
                          districtList?.results.map((item, index) => {
                            return (
                              <option value={index} key={item.district_id}>
                                {item.district_name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="flex flex-row ms-2 justify-between items-center flex-wrap">
                      <span className="text-sm font-normal ">
                        Địa chỉ chính xác (Xã,số nhà,...) :
                      </span>
                      <input
                        type="text"
                        value={restAddress}
                        onChange={(e) => setRestAddress(e.target.value)}
                        className={
                          (restAddress.length == 0
                            ? " border-red-600 "
                            : "border-gray-300") +
                          "bg-gray-50 border w-full md:w-80  text-gray-900 text-sm rounded-sm mt-2"
                        }
                        name="address_rest"
                        required
                      />
                      {restAddress.length == 0 && (
                        <Typography
                          placeholder={""}
                          variant="small"
                          color="red"
                          className="mt-2 flex items-center gap-1 font-normal"
                        >
                          Địa chỉ không được để trống
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              placeholder={undefined}
              color="green"
              className="block me-0 ms-auto"
              type="submit"
            >
              {isLoading ? "Loading... " : "Xác nhận cập nhật thông tin"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
