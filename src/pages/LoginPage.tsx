import {
    LockPasswordIcon,
    MailAtSign02Icon,
    AlertCircleIcon,
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
import type { IPartnerLogin } from "@/types/partner/IPartnerLogin";
import { useLoginMutation } from "@/services/apiPartner";
import type { ApiError } from "@/types/api/ApiError";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import { motion } from "motion/react";

const LoginPage = () => {
    const [login, { isLoading: isLogining }] = useLoginMutation();

    const navigate = useNavigate();
    const location = useLocation();

    const [loginError, setLoginError] = useState<string | null>(null);

    const { register, handleSubmit } = useForm<IPartnerLogin>();
    const [hide, setHide] = useState<boolean>(true)

    useEffect(() => {
        const set = () => {
            if (location.state?.from == "/auth/register")
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

    const onSubmit = async (data: IPartnerLogin) => {
        try {
            setLoginError(null);

            await login(data).unwrap();

            navigate("/dashboard");
        } catch (error: any) {
            const errors = error?.data?.errors;

            console.error(errors);

            if (!Array.isArray(errors)) {
                setLoginError("Невірна пошта або пароль");
                return;
            }

            errors.forEach((err: ApiError) => {
                if (err.field === "LoginError") {
                    setLoginError("Невірна пошта або пароль");
                }
            });
        }
    };

    return (
        <motion.form
            className={`flex w-full max-w-md flex-col items-center gap-5 ${hide ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-4xl font-bold tracking-tight text-[#17212b]">
                Login
            </h1>

            <div className="flex w-full flex-col gap-4">
                {loginError && (
                    <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2 rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-500"
                    >
                        <HugeiconsIcon
                            icon={AlertCircleIcon}
                            size={17}
                        />

                        {loginError}
                    </motion.p>
                )}

                {/* Email */}
                <InputGroup className="h-14 rounded-xl bg-[#f3f4f5]">
                    <InputGroupAddon className="pl-4 text-[#707982]">
                        <HugeiconsIcon
                            icon={MailAtSign02Icon}
                            size={20}
                        />
                    </InputGroupAddon>

                    <InputGroupInput
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        className="px-3 text-base"
                        {...register("email")}
                        required
                    />
                </InputGroup>

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
                        {...register("password")}
                        required
                    />
                </InputGroup>
            </div>

            <Button
                type="submit"
                size="lg"
                className="mt-2 h-14 w-full rounded-full bg-[#fece18] text-lg font-semibold text-[#17212b] hover:bg-[#f4bb00]"
                disabled={isLogining}
            >
                {isLogining ? (
                    <Spinner className="size-5" />
                ) : (
                    "Login"
                )}
            </Button>

            <div className="flex gap-1">
                <p className="p-0 text-sm font-normal text-[#6f7880]">
                    Want to be a partner?
                </p>

                <Button
                    onClick={() => {
                        setHide(true);
                        setTimeout(() => {
                            navigate("/auth/register", {
                                state: { from: location.pathname }
                            });
                        }, 200)
                    }}
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm font-normal text-primary"
                >
                    Register
                </Button>
            </div>
        </motion.form>
    );
};

export default LoginPage;