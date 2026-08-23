import './App.css'
// import {useEffect} from "react";
// import {useLoginMutation, useSendRequestCompanyMutation} from "@/services/apiPartner.ts";
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from "@/pages/RegisterPage.tsx";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import DashboardLayout from './components/layouts/DashboardLayout';
import HomeDashboard from './pages/Dashboard/HomeDashboard';

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
                <Route index element={<HomeDashboard />}/>
            </Route>
        </Routes>
        {/* <div className={"bg-black w-full h-screen"}>
            <h1 className={"text-4xl text-green-500"}>Get started</h1>
        </div> */}
    </>
  )
}

export default App
