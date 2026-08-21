import { LockPasswordIcon, MailAtSign02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import type { IPartnerLogin } from "@/types/partner/IPartnerLogin"
import {useLoginMutation} from "@/services/apiPartner.ts";
import type {ApiError} from "@/types/api/ApiError.ts";
import {useState} from "react";
import {useNavigate} from "react-router";
const loginImageSrc = "/login-image.png"


const LoginPage = () => {
    const [login, {isLoading: isLogining}] = useLoginMutation();

    const navigate = useNavigate();

    const [loginError, setLoginError] = useState<string | null>(null)

    const {register, handleSubmit} = useForm<IPartnerLogin>();

    const onSubmit = async (data: IPartnerLogin) => {
      try {
        setLoginError(null);
        await login(data).unwrap();
          navigate("/dashboard");
    } catch (error: any) {
        const errors = error?.data?.errors;

        console.error(errors);

        errors.forEach((err: ApiError) => {
            if (err.field == "LoginError") {
                setLoginError("Невірна пошта або пароль");
            }
        });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f8] p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(20,32,43,0.16)] lg:grid-cols-2">
        <section className="flex min-h-[34rem] items-center justify-center px-6 py-12 sm:px-14 lg:min-h-[39rem]">
          <form className="flex w-full max-w-md flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-4xl font-bold tracking-tight text-[#17212b]">Login</h1>

            <div className="flex w-full flex-col gap-4">
                {loginError && (
                    <>
                        <p className="text-md text-primary mt-6 border-1 border-red-400 bg-red-100 px-4 py-3 rounded-xl text-red-500 flex items-center gap-2">
                            <HugeiconsIcon icon={AlertCircleIcon} size={17} />
                            {loginError}
                        </p>
                    </>
                )}

              {/* Email */}
              <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                <InputGroupAddon className="pl-4 text-[#707982]">
                  <HugeiconsIcon icon={MailAtSign02Icon} size={20} />
                </InputGroupAddon>
                <InputGroupInput type="email" placeholder="Email" aria-label="Email" className="px-3 text-base" {...register("email")} required />
              </InputGroup>

              {/* Password */}
              <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                <InputGroupAddon className="pl-4 text-[#707982]">
                  <HugeiconsIcon icon={LockPasswordIcon} size={20} />
                </InputGroupAddon>
                <InputGroupInput type="password" placeholder="Password" aria-label="Password" className="px-3 text-base" {...register("password")} required />
              </InputGroup>
            </div>

            <Button
                type="submit" size="lg"
                className="mt-2 h-14 w-full rounded-full bg-[#fece18] text-lg font-semibold text-[#17212b] hover:bg-[#f4bb00]"
                disabled={isLogining}
            >
                {isLogining ? (
                    <>
                        <Spinner className={'size-5'}/>
                    </>
                ) : (
                    <>Login</>
                )}
            </Button>
              <div className={"flex gap-1"}>
                  <p className="h-auto p-0 text-sm font-normal text-[#6f7880]">
                      Want to be a partner?
                  </p>
                  <Button onClick={() => navigate("/auth/register")} type="button" variant="link" className="h-auto p-0 text-sm font-normal text-primary">
                       Register
                  </Button>
              </div>
          </form>
        </section>

        <section className="flex min-h-[20rem] items-center justify-center bg-[#fdcc14] p-8 sm:p-12 lg:min-h-[39rem] relative" aria-label="Login illustration">
            <div className={"absolute z-10 right-8 bottom-0 w-[200px]"}>
                <p className="text-[30px] mb-8 text-white font-bold leading-none text-end">
                    Glovo Partners
                </p>
            </div>

            <img src={loginImageSrc} alt="" className="h-full max-h-[32rem] w-full object-contain z-1" />
        </section>
      </div>
    </div>
  )
}

export default LoginPage
