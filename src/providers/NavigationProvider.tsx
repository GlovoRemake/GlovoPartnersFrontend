import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setNavigate } from "@/utils/navigation.ts";

export function NavigationProvider() {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return null;
}
