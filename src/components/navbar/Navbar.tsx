import {apiPartner, useGetProfileQuery, useLogoutMutation} from "@/services/apiPartner.ts";
import {Button} from "@/components/ui/button.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import { LogoutSquare01Icon } from "@hugeicons/core-free-icons";
import {Spinner} from "@/components/ui/spinner.tsx";
import { useAppDispatch } from "@/store/hooks";
import { redirectToLogin } from "@/utils/navigation";
import { logout as logoutAction } from "@/store/slices/authSlice";

const Navbar = () => {
    const {data: user} = useGetProfileQuery();

    const dispatch = useAppDispatch();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch(logoutAction());
            dispatch(apiPartner.util.resetApiState());
            redirectToLogin();
        }
    };

    return (
        <>
            <div className={"w-full flex justify-center p-2"}>
                <div className={"bg-white h-13 max-w-[1200px] w-full shadow-[0_14px_70px_rgba(20,32,43,0.16)] rounded-xl flex items-center px-5"}>
                    <div className={"w-full flex justify-between"}>
                        <div className={"flex items-center"}>
                            <h1 className={"font-semibold text-foreground"}>Glovo Partners</h1>
                        </div>
                        <div className={"flex gap-3 items-center"}>
                            <p className={"text-sm"}>{user?.firstName} {user?.lastName}</p>
                            <Button
                                type="submit"
                                size="sm"
                                variant={"destructive"}
                                className={"w-8 h-8 cursor-pointer"}
                                disabled={isLoading}
                                onClick={() => handleLogout()}
                            >
                                {isLoading ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <HugeiconsIcon icon={LogoutSquare01Icon} size={10}/>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;