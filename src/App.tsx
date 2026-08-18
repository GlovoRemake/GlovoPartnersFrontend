import './App.css'
import {useEffect} from "react";
import {useLoginMutation, useSendRequestCompanyMutation} from "@/services/apiPartner.ts";

function App() {
    const [testLogin] = useLoginMutation();
    const [send] = useSendRequestCompanyMutation();

    useEffect(() => {
        const test = async () => {
            try {
                await testLogin({
                    email: "rocafig361@jobraux.com",
                    password: "123123123",
                });

                await send({
                    name: "123123",
                    description: "123123"
                });
            } catch (e) {
                console.error(e);
            }
        }


        test();
    }, []);

  return (
    <>
        <div className={"bg-black w-full h-screen"}>
            <h1 className={"text-4xl text-green-500"}>Get started</h1>
        </div>
    </>
  )
}

export default App
