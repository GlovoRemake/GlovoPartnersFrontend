import type { NavigateFunction } from "react-router";

let navigate: NavigateFunction | null = null;

export function setNavigate(navigateFn: NavigateFunction) {
    navigate = navigateFn;
}

export function redirectToLogin() {
    if (navigate) {
        navigate("/auth/login", { replace: true });
    }
}
