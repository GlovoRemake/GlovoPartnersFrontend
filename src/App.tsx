import './App.css'
// import {useEffect} from "react";
// import {useLoginMutation, useSendRequestCompanyMutation} from "@/services/apiPartner.ts";
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from "@/pages/RegisterPage.tsx";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import DashboardLayout from './components/layouts/DashboardLayout';
import HomeDashboard from './pages/Dashboard/HomeDashboard';
import ProfileDashboard from './pages/Dashboard/ProfileDashboard';
import SendRequestDashboard from './pages/Dashboard/SendRequestDashboard';
import CompaniesDashboard from './pages/Dashboard/CompaniesDashboard';
import CompanyDashboard from './pages/Dashboard/CompanyDashboard.tsx';
import CategoryProductsDashboard from './pages/Dashboard/CategoryProductsDashboard';
import AffiliateDashboard from "@/pages/Dashboard/AffiliateDashboard.tsx";
import AffiliateProductsDashboard from "@/pages/Dashboard/AffiliateProductsDashboard.tsx";

function App() {
    // const [testLogin] = useLoginMutation();
    // const [send] = useSendRequestCompanyMutation();

    // useEffect(() => {
    //     const test = async () => {
    //         try {
    //             await testLogin({
    //                 email: "rocafig361@jobraux.com",
    //                 password: "123123123",
    //             });

    //             await send({
    //                 name: "123123",
    //                 description: "123123"
    //             });
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }


    //     test();
    // }, []);

    return (
        <>
            <Routes>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<HomeDashboard />} />
                    <Route path="profile" element={<ProfileDashboard />} />
                    <Route path="company-request" element={<SendRequestDashboard />} />
                    <Route path="companies" element={<CompaniesDashboard />} />
                    <Route path="companies/:companyId" element={<CompanyDashboard />} />
                    <Route path="companies/:companyId/affiliates/:affiliateId" element={<AffiliateDashboard />} />
                    <Route path="companies/:companyId/affiliates/:affiliateId/categories/:categoryId" element={<AffiliateProductsDashboard />} />
                    <Route path="companies/:companyId/categories/:categoryId" element={<CategoryProductsDashboard />} />
                </Route>
            </Routes>
            {/* <div className={"bg-black w-full h-screen"}>
            <h1 className={"text-4xl text-green-500"}>Get started</h1>
        </div> */}
        </>
    )
}

export default App
