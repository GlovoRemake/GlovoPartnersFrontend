import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useSendRequestCompanyMutation } from "@/services/apiPartner.ts";
import type { ISendRequestCompany } from "@/types/partner/ISendRequestCompany.ts";
import { ArrowLeft, Building2, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const SendRequestDashboard = () => {
    const [isSent, setIsSent] = useState(false);
    const [sendRequest, { isLoading, isError }] = useSendRequestCompanyMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ISendRequestCompany>();
    const navigate = useNavigate();

    const onSubmit = async (form: ISendRequestCompany) => {
        try {
            await sendRequest(form).unwrap();
            reset();
            setIsSent(true);
        } catch {
            setIsSent(false);
        }
    };

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <Button variant="ghost" className="mb-8 px-0 p-2.5" onClick={() => navigate("/dashboard")}>
                <ArrowLeft />
                Назад до дашборда
            </Button>

            <div className="mb-8 max-w-2xl">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Підключення компанії</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Надішліть запит на підключення</h1>
                <p className="mt-2 text-muted-foreground">Розкажіть про компанію, яку хочете підключити до партнерської мережі.</p>
            </div>

            <section className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                        <Building2 className="size-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Дані компанії</h2>
                        <p className="text-sm text-muted-foreground">Усі поля обов’язкові для заповнення</p>
                    </div>
                </div>

                {isSent && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        Запит успішно надіслано. Ми зв’яжемося з вами після його розгляду.
                    </div>
                )}

                {isError && (
                    <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                        Не вдалося надіслати запит. Перевірте дані та спробуйте ще раз.
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-2">
                        <label htmlFor="company-name" className="text-sm font-medium">Назва компанії</label>
                        <Input
                            id="company-name"
                            placeholder="Наприклад, ТОВ «Міська доставка»"
                            aria-invalid={errors.name ? "true" : "false"}
                            {...register("name", {
                                required: "Вкажіть назву компанії",
                                onChange: () => setIsSent(false),
                            })}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="company-description" className="text-sm font-medium">Опис компанії</label>
                        <Textarea
                            id="company-description"
                            placeholder="Коротко опишіть напрям роботи та особливості компанії"
                            className="min-h-32"
                            aria-invalid={errors.description ? "true" : "false"}
                            {...register("description", {
                                required: "Додайте опис компанії",
                                onChange: () => setIsSent(false),
                            })}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Send />}
                        {isLoading ? "Надсилання..." : "Надіслати запит"}
                    </Button>
                </form>
            </section>
        </main>
    );
};

export default SendRequestDashboard;