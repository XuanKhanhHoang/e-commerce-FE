"use client";
import CustomFetch from "@/utils/fetch";
import { Button, Radio, Typography } from "@material-tailwind/react";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { UserFullDetail } from "@/components/dto/user.dto";
import { getWebViewLinkFromWebContentLink } from "@/utils/handleDriveImage";

export default function UpdateDetail({
  userDetail,
  access_token,
}: {
  userDetail: UserFullDetail;
  access_token: string;
}) {
  const router = useRouter();
  const [image, setImage] = useState<string>(
    () => getWebViewLinkFromWebContentLink(userDetail.avartar) || ""
  );
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  const [firstNameIsError, setFirstNameIsError] = useState<boolean>(false);
  const [lastNameIsError, setLastNameIsError] = useState<boolean>(false);
  const [userNameIsError, setUserNameIsError] = useState<boolean>(false);
  const [phoneNumberIsError, setPhoneNumberIsError] = useState<boolean>(false);
  const [addressIsError, setAddressIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUpdateDetail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    let isValid = true;
    const formData = new FormData(e.currentTarget);
    if (formData.get("first_name")?.toString().trim().length == 0) {
      setFirstNameIsError(true);
      isValid = false;
    }
    if (formData.get("last_name")?.toString().trim().length == 0) {
      setLastNameIsError(true);
      isValid = false;
    }
    if (!isValidPhoneNumber(formData.get("phone_number")?.toString() || "")) {
      setPhoneNumberIsError(true);
      isValid = false;
    }
    if (formData.get("user_name")?.toString().trim().length == 0) {
      setUserNameIsError(true);
      isValid = false;
    }
    if (formData.get("address")?.toString().trim().length == 0) {
      setAddressIsError(true);
      isValid = false;
    }
    if (!isValid) {
      return setIsLoading(false);
    }
    if (!formData.has("avatar") && (formData.get("avatar") as any)?.size == 0)
      formData.delete("avatar");

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
          onClose: () => router.replace("/customer"),
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
              className="align-mdle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-500 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block mx-auto"
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
                      defaultValue={userDetail.last_name}
                      className={
                        (false ? " border-red-600 " : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      required
                    />
                    {lastNameIsError && (
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
                      defaultValue={userDetail.first_name}
                      name="first_name"
                      className={
                        (firstNameIsError
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      required
                    />
                    {firstNameIsError && (
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
                        (false ? " border-red-600 " : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      name="user_name"
                      defaultValue={userDetail.login_name}
                      required
                    />
                    {lastNameIsError && (
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
                <div className="w-1/2">
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
                    defaultChecked={userDetail.gender}
                    crossOrigin={""}
                    value={"true"}
                  />
                  <Radio
                    name="gender"
                    label="Nữ"
                    value={"false"}
                    defaultChecked={!userDetail.gender}
                    crossOrigin={""}
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
                        (phoneNumberIsError
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      name="phone_number"
                      defaultValue={userDetail.phone_number}
                      required
                    />
                    {phoneNumberIsError && (
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
                  <p className="px-4 py-2 text-wrap">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      defaultValue={userDetail.address}
                      className={
                        (addressIsError
                          ? " border-red-600 "
                          : "border-gray-300") +
                        " bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 "
                      }
                      name="address"
                      required
                    />
                    {addressIsError && (
                      <Typography
                        placeholder={""}
                        variant="small"
                        color="red"
                        className="mt-2 flex items-center gap-1 font-normal"
                      >
                        Địa chỉ không được để trống
                      </Typography>
                    )}
                  </p>
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
