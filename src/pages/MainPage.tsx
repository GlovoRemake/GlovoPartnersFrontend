import { ArrowRight, BarChart3, Bike, Store } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen overflow-hidden bg-[#f7f7f3] text-[#17212b]">
            <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
                <a href="/" aria-label="Glovo Partners, головна" className="flex items-center gap-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#ffc244] text-lg font-black">G</span>
                    <span className="text-lg font-extrabold tracking-tight">Glovo <span className="font-medium">Partners</span></span>
                </a>
                <nav className="flex items-center gap-2 sm:gap-4" aria-label="Основна навігація">
                    <a href="#benefits" className="hidden px-3 py-2 text-sm font-semibold text-[#59636c] transition-colors hover:text-[#17212b] sm:inline-flex">Переваги</a>
                    <Button variant="ghost" className="h-10 px-3 font-semibold" onClick={() => navigate("/auth/login")}>Увійти</Button>
                    <Button className="h-10 rounded-full bg-[#ffc244] px-5 font-bold text-[#17212b] hover:bg-[#f4b62c]" onClick={() => navigate("/auth/register")}>Стати партнером</Button>
                </nav>
            </header>

            <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-12 lg:pb-28 lg:pt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="relative z-10 max-w-xl"
                >
                    <p className="mb-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#7b5a12]">
                        <span className="size-2 rounded-full bg-[#ffc244]" />
                        Ваш бізнес. Більше можливостей.
                    </p>
                    <h1 className="max-w-2xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.5rem]">
                        Більше замовлень.<br />
                        <span className="relative inline-block">Більше зростання.<span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 bg-[#ffc244] sm:h-4" /></span>
                    </h1>
                    <p className="mt-7 max-w-lg text-lg leading-8 text-[#59636c] sm:text-xl">
                        Приєднуйтеся до Glovo та знаходьте нових клієнтів у вашому місті. Ми допоможемо вашому закладу зростати.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button className="h-13 rounded-full bg-[#ffc244] px-7 text-base font-bold text-[#17212b] hover:bg-[#f4b62c]" onClick={() => navigate("/auth/register")}>
                            Почати співпрацю <ArrowRight className="ml-2 size-4" />
                        </Button>
                        <Button variant="ghost" className="h-12 rounded-full px-6 text-base font-semibold" onClick={() => navigate("/auth/login")}>
                            Уже маєте акаунт? Увійти
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
                    className="relative mx-auto w-full max-w-2xl lg:ml-auto"
                >
                    <div className="absolute -right-10 -top-8 h-40 w-40 rounded-full bg-[#ffc244] sm:-right-5 sm:h-52 sm:w-52" />
                    <div className="absolute -bottom-8 -left-6 h-36 w-36 rounded-full border-[18px] border-[#e8a792] sm:-bottom-10 sm:h-48 sm:w-48" />
                    <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2rem] bg-[#e8e4d9] shadow-[0_24px_60px_-28px_rgba(23,33,43,0.35)]">
                        <img
                            src="photo-landing.jpg"
                            alt="Свіжа страва, готова до доставки"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#17212b]/35 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/80">Ваш заклад на мапі міста</p>
                                <p className="mt-1 text-xl font-extrabold sm:text-2xl">Смак, який знаходять</p>
                            </div>
                            <span className="grid size-11 place-items-center rounded-full bg-[#ffc244] text-[#17212b]"><ArrowRight className="size-5" /></span>
                        </div>
                    </div>
                    <div className="absolute -left-2 top-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg sm:-left-8 sm:top-12">
                        <span className="grid size-10 place-items-center rounded-xl bg-[#fff2ca] text-[#9a6b00]"><BarChart3 className="size-5" /></span>
                        <span><span className="block text-sm font-extrabold">Час зростати</span><span className="block text-xs text-[#68727b]">Нові клієнти поруч</span></span>
                    </div>
                </motion.div>
            </section>

            <section id="benefits" className="border-t border-[#e7e8e3] bg-white">
                <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
                    <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#9a6b00]">Партнерство, що працює</p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Зосередьтеся на своїй справі</h2>
                        </div>
                        <p className="max-w-md text-base leading-7 text-[#68727b]">Ми подбаємо про доставку та допоможемо вашому бізнесу бути ближче до клієнтів.</p>
                    </div>
                    <div className="grid gap-8 border-t border-[#e7e8e3] pt-8 sm:grid-cols-3 sm:gap-6">
                        <article className="flex gap-4">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fff2ca] text-[#785500]"><Store className="size-5" /></span>
                            <div><h3 className="font-bold">Більше видимості</h3><p className="mt-1 text-sm leading-6 text-[#68727b]">Покажіть свій заклад людям, які шукають щось смачне поруч.</p></div>
                        </article>
                        <article className="flex gap-4">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e5f1e9] text-[#356548]"><Bike className="size-5" /></span>
                            <div><h3 className="font-bold">Зручна доставка</h3><p className="mt-1 text-sm leading-6 text-[#68727b]">Доставляйте замовлення клієнтам без власної кур’єрської команди.</p></div>
                        </article>
                        <article className="flex gap-4">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f8e8e2] text-[#92553e]"><BarChart3 className="size-5" /></span>
                            <div><h3 className="font-bold">Контроль у ваших руках</h3><p className="mt-1 text-sm leading-6 text-[#68727b]">Керуйте меню, закладом і замовленнями в одному місці.</p></div>
                        </article>
                    </div>
                    <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#17212b] px-6 py-7 text-white sm:flex-row sm:items-center sm:px-9">
                        <div><p className="text-xl font-extrabold">Готові до нових можливостей?</p><p className="mt-1 text-sm text-white/70">Розпочніть партнерство вже сьогодні.</p></div>
                        <Button className="h-11 rounded-full bg-[#ffc244] px-6 font-bold text-[#17212b] hover:bg-[#f4b62c]" onClick={() => navigate("/auth/register")}>
                            Зареєструватися <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </div>
                </div>
            </section>

            <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-[#68727b] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                <span className="font-bold text-[#17212b]">Glovo Partners</span>
                <span>Партнерство для вашого бізнесу</span>
            </footer>
        </main>
    );
};

export default MainPage;