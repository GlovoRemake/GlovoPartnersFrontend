import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";

const DashboardLayout = () => {
    return (
        <>
            <Navbar />

            <div>
                <Outlet />
            </div>
        </>
    )
}

export default DashboardLayout;