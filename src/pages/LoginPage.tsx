import { LockPasswordIcon, MailAtSign02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import type { IPartnerLogin } from "@/types/partner/IPartnerLogin"

const loginImageSrc = "/login-image.png"

const LoginPage = () => {
  const {register, handleSubmit} = useForm<IPartnerLogin>();

  const onSubmit = (data: IPartnerLogin) => {
    console.log(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f8] p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(20,32,43,0.16)] lg:grid-cols-2">
        <section className="flex min-h-[34rem] items-center justify-center px-6 py-12 sm:px-14 lg:min-h-[39rem]">
          <form className="flex w-full max-w-md flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-4xl font-bold tracking-tight text-[#17212b]">Login</h1>

            <div className="flex w-full flex-col gap-4">
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

            <Button type="button" variant="link" className="h-auto p-0 text-sm font-normal text-[#6f7880]">
              Forgot password?
            </Button>
            <Button type="submit" size="lg" className="mt-2 h-14 w-full rounded-full bg-[#fece18] text-lg font-semibold text-[#17212b] hover:bg-[#f4bb00]">
              Login
            </Button>
          </form>
        </section>

        <section className="flex min-h-[20rem] items-center justify-center bg-[#fdcc14] p-8 sm:p-12 lg:min-h-[39rem]" aria-label="Login illustration">
            <img src={loginImageSrc} alt="" className="h-full max-h-[32rem] w-full object-contain" />
        </section>
      </div>
    </div>
  )
}

export default LoginPage
