import {
    LockPasswordIcon,
    MailAtSign02Icon, TelephoneIcon, PinCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {useRegisterMutation, useVerifyCodeMutation} from "@/services/apiPartner";
import type { ApiError } from "@/types/api/ApiError";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import { motion } from "motion/react";
import type {IPartnerRegister} from "@/types/partner/IPartnerRegister.ts";
import type {IPartnerVerifyCode} from "@/types/partner/IPartnerVerifyCode.ts";

const RegisterPage = () => {
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [verifyEmail, {isLoading: isVefifing}] = useVerifyCodeMutation();
    const location = useLocation();

    const navigate = useNavigate();

    const [hide, setHide] = useState<boolean>(true)
    const [isCodeSended, setIsCodeSended] = useState<boolean>(false)

    useEffect(() => {
        const set = () => {
            if (location.state?.from == "/auth/login")
            {
                setTimeout(() => {
                    setHide(false);
                }, 200)
            } else {
                setHide(false);
            }
        }

        set();
    }, [])

    const { register: registerForm, handleSubmit, watch, formState: {errors}, setError, setValue: setFormValue } = useForm<IPartnerRegister>();
    const { register: verifyRegister, handleSubmit: verifyHandle, watch: verifyWatch, formState: {errors: verifyError}, setError: verifySetError, setValue } = useForm<IPartnerVerifyCode>();

    const onSubmit = async (data: IPartnerRegister) => {
        try {
            await register(data).unwrap();

            setValue("email", data.email)
            setValue("code", "")

            setHide(true);
            setTimeout(() => {
                setIsCodeSended(true);
                setHide(false);
            }, 200)
        } catch (error: any) {
            const errors = error?.data?.errors;

            console.error(errors);

            errors.forEach((err: ApiError) => {
                if (err.field === "Email") {
                    setError("email", {
                        message: "This email is already registered",
                    })
                }

                if (err.field === "Phone") {
                    setError("phone", {
                        message: "This phone is already registered",
                    })
                }

                if (err.field === "AlreadySended") {
                    setValue("email", data.email)
                    setValue("code", "")

                    setHide(true);
                    setTimeout(() => {
                        setIsCodeSended(true);
                        setHide(false);
                    }, 200)
                }
            });
        }
    };

    const onVerifing = async (data: IPartnerVerifyCode) => {
        try {
            await verifyEmail(data).unwrap();
            navigate("/dashboard");
        } catch (error: any) {
            const errors = error?.data?.errors;

            console.error(errors);

            errors.forEach((err: ApiError) => {
                if (err.field === "BadCode") {
                    verifySetError("code", {
                        message: "Bad code",
                    })
                }

                if (err.field === "ExpiredCode") {
                    verifySetError("code", {
                        message: "Code is expired",
                    })
                }
            });
        }
    }

    return (
        <div className={`${hide ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}>
            {/* Main register */}
            {!isCodeSended ? (
                <motion.form
                    className={`flex w-full max-w-md flex-col items-center gap-5`}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-4xl font-bold tracking-tight text-[#17212b]">
                        Register
                    </h1>

                    <div className="flex w-full flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {/* FirstName */}
                            <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                                <InputGroupAddon className="pl-4 text-[#707982]">
                                    F
                                </InputGroupAddon>

                                <InputGroupInput
                                    id={'name'}
                                    type="text"
                                    placeholder="First name"
                                    aria-label="First name"
                                    className="px-3 text-base"
                                    {...registerForm("firstName")}
                                    required
                                />
                            </InputGroup>

                            {/* LastName */}
                            <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                                <InputGroupAddon className="pl-4 text-[#707982]">
                                    L
                                </InputGroupAddon>

                                <InputGroupInput
                                    type="text"
                                    placeholder="Last name"
                                    aria-label="Last name"
                                    className="px-3 text-base"
                                    {...registerForm("lastName")}
                                    required
                                />
                            </InputGroup>
                        </div>

                        {/* Email */}
                        <div>
                            <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                                <InputGroupAddon className={`pl-4 ${errors.email ? "text-red-400" : "text-[#707982]"}`}>
                                    <HugeiconsIcon
                                        icon={MailAtSign02Icon}
                                        size={20}
                                    />
                                </InputGroupAddon>

                                <InputGroupInput
                                    type="email"
                                    placeholder="Email"
                                    aria-label="Email"
                                    className={`
                                        px-3 text-base 
                                        ${errors.email ?
                                            "text-red-400":
                                            ""}
                                    `}
                                    {...registerForm("email")}
                                    required
                                />
                            </InputGroup>

                            {errors.email && (
                                <p className={"text-sm text-red-400 ml-4"}>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                                <InputGroupAddon className={`pl-4 ${errors.phone ? "text-red-400" : "text-[#707982]"}`}>
                                    <HugeiconsIcon
                                        icon={TelephoneIcon}
                                        size={20}
                                    />
                                </InputGroupAddon>

                                <InputGroupInput
                                    type="phone"
                                    placeholder="Phone"
                                    aria-label="Phone"
                                    className={`
                                        px-3 text-base 
                                        ${errors.phone ?
                                        "text-red-400":
                                        ""}
                                    `}
                                    {...registerForm("phone")}
                                    required
                                />
                            </InputGroup>

                            {errors.phone && (
                                <p className={"text-sm text-red-400 ml-4"}>
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                            <InputGroupAddon className="pl-4 text-[#707982]">
                                <HugeiconsIcon
                                    icon={LockPasswordIcon}
                                    size={20}
                                />
                            </InputGroupAddon>

                            <InputGroupInput
                                type="password"
                                placeholder="Password"
                                aria-label="Password"
                                className="px-3 text-base"
                                {...registerForm("password")}
                                required
                            />
                        </InputGroup>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="mt-2 h-14 w-full rounded-full bg-[#fece18] text-lg font-semibold text-[#17212b] hover:bg-[#f4bb00]"
                        disabled={isRegistering}
                    >
                        {isRegistering ? (
                            <Spinner className="size-5" />
                        ) : (
                            "Register"
                        )}
                    </Button>

                    <div className="flex gap-1">
                        <p className="p-0 text-sm font-normal text-[#6f7880]">
                            Already a partner?
                        </p>

                        <Button
                            onClick={() => {
                                setHide(true);
                                setTimeout(() => {
                                    navigate("/auth/login", {
                                        state: { from: location.pathname }
                                    });
                                }, 200)
                            }}
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-sm font-normal text-primary"
                        >
                            Login
                        </Button>
                    </div>
                </motion.form>
            ) : (
                <>
                    {/* Verify Code */}
                    <motion.form
                        className={`flex w-full max-w-md flex-col items-center gap-5`}
                        onSubmit={verifyHandle(onVerifing)}
                    >
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-bold tracking-tight text-[#17212b]">
                                Check your email
                            </h1>

                            <h1 className="text-md font tracking-tight text-[#17212b] text-center">
                                We sent an email with code to {verifyWatch("email")}
                            </h1>
                        </div>

                        <div className="flex w-full flex-col gap-4">
                            {/* Code */}
                            <div>
                                <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                                    <InputGroupAddon className={`pl-4 ${verifyError.code ? "text-red-400" : "text-[#707982]"}`}>
                                        <HugeiconsIcon
                                            icon={PinCodeIcon}
                                            size={20}
                                        />
                                    </InputGroupAddon>

                                    <InputGroupInput
                                        id={"code"}
                                        type="text"
                                        placeholder="Code from email"
                                        aria-label="Code from email"
                                        className={`
                                        px-3 text-base 
                                        ${verifyError.code ?
                                            "text-red-400":
                                            ""}
                                    `}
                                        {...verifyRegister("code")}
                                        required
                                    />
                                </InputGroup>

                                {verifyError.code && (
                                    <p className={"text-sm text-red-400 ml-4"}>
                                        {verifyError.code.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-sm font-normal text-[#6f7880]"
                                onClick={() => {
                                    setHide(true);
                                    setTimeout(() => {
                                        setFormValue("firstName", watch("firstName"))
                                        setIsCodeSended(false);
                                        setHide(false);
                                    }, 200)
                                }}
                            >
                                Change email
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="mt-2 h-14 w-full rounded-full bg-[#fece18] text-lg font-semibold text-[#17212b] hover:bg-[#f4bb00]"
                            disabled={isVefifing}
                        >
                            {isVefifing ? (
                                <Spinner className="size-5" />
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </motion.form>
                </>
            )}




        </div>
    );
};

export default RegisterPage;