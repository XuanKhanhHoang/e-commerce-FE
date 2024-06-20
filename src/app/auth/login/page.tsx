import FacebookLoginButton from "@/components/auth/login/fbLoginButton";
import LoginByPasswordForm from "@/components/auth/login/loginByPasswordForm";

export default function LoginRegister({
  searchParams,
}: {
  searchParams: { error: string | undefined; any: any[] };
}) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Đăng nhập
            </h1>
            <LoginByPasswordForm />
            <span className="text-sm font-light text-center block mx-auto !my-2">
              Hoặc
            </span>
            <FacebookLoginButton isError={searchParams.error != undefined} />
            <p className="text-sm font-light text-gray-500 text-center mt-5">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline "
              >
                Đăng kí
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
