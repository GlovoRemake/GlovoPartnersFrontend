import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";

const loginImageSrc = "/login-image.png";

const FADE_DURATION = 200;
const IMAGE_DURATION = 1000;

const AuthLayout = () => {
    const location = useLocation();

    const isRegister = location.pathname.includes("/register");

    const [displayedRoute, setDisplayedRoute] = useState(
        location.pathname
    );

    const [contentVisible, setContentVisible] = useState(true);

    // Коли URL змінився
    useEffect(() => {
        const set = () => {
            if (location.pathname === displayedRoute) {
                return;
            }

            // 1. Спочатку ховаємо старий контент
            setContentVisible(false);

            // 2. Чекаємо поки він затухне
            const timer = setTimeout(() => {
                setDisplayedRoute(location.pathname);

                // 3. Чекаємо поки картинка переїде
                setTimeout(() => {
                    setContentVisible(true);
                }, IMAGE_DURATION);
            }, FADE_DURATION);

            return () => clearTimeout(timer);
        }

        set();
    }, [location.pathname]);

    const displayedIsRegister =
        displayedRoute.includes("/register");

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f7f8] p-4 sm:p-8">

            <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(20,32,43,0.16)]">

                {/* DESKTOP */}
                <div className="relative hidden h-[39rem] lg:block">

                    {/* CONTENT */}

                    <div
                        className={`
                            absolute top-0 z-10
                            flex h-full w-1/2
                            items-center justify-center
                            px-14
                            ${displayedIsRegister
                            ? "left-1/2"
                            : "left-0"
                        }
                        `}
                    >
                        <motion.div
                            animate={{
                                opacity: contentVisible ? 1 : 0,
                            }}
                            transition={{
                                duration: FADE_DURATION / 1000,
                                ease: "easeInOut",
                            }}
                            className="w-full max-w-md"
                        >
                            <Outlet />
                        </motion.div>
                    </div>

                    {/* IMAGE */}

                    <motion.div
                        className="absolute top-0 z-20 h-full w-1/2 bg-[#fdcc14]"
                        animate={{
                            left: isRegister ? "0%" : "50%",
                        }}
                        transition={{
                            duration: IMAGE_DURATION / 1000,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="relative flex h-full items-center justify-center p-8 sm:p-12">

                            <img
                                src={loginImageSrc}
                                alt=""
                                className="z-[1] h-full max-h-[32rem] w-full object-contain"
                            />

                            <motion.div
                                className="absolute bottom-0 z-10 w-[200px]"
                                animate={{
                                    left: isRegister ? 32 : "auto",
                                    right: isRegister ? "auto" : 32,
                                }}
                                transition={{
                                    duration: IMAGE_DURATION / 1000,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <motion.p
                                    className="mb-8 text-[30px] font-bold leading-none text-white"
                                    animate={{
                                        textAlign: isRegister ? "left" : "right",
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                >
                                    Glovo Partners
                                </motion.p>
                            </motion.div>

                        </div>
                    </motion.div>
                </div>

                {/* MOBILE */}

                <div className="flex flex-col lg:hidden">

                    <div className="relative flex min-h-[20rem] items-center justify-center bg-[#fdcc14] p-8 sm:p-12">

                        <img
                            src={loginImageSrc}
                            alt=""
                            className="h-full max-h-[18rem] w-full object-contain"
                        />

                        <div
                            className={`
                                absolute bottom-0
                                ${isRegister
                                ? "left-8 text-left"
                                : "right-8 text-right"
                            }
                            `}
                        >
                            <p className="mb-6 text-[26px] font-bold leading-none text-white">
                                Glovo Partners
                            </p>
                        </div>

                    </div>

                    <div className="flex min-h-[34rem] items-center justify-center px-6 py-12 sm:px-14">

                        <motion.div
                            animate={{
                                opacity: contentVisible ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.300,
                            }}
                            className="w-full max-w-md"
                        >
                            <Outlet />
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;