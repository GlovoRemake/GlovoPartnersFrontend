# 🏪 Glovo Partners Frontend

> Веб-кабінет для партнерів (закладів) платформи доставки **GlovoRemake**: керування закладом, меню та замовленнями в реальному часі.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

## 📖 Про проєкт

Frontend-застосунок для **партнерів** екосистеми GlovoRemake. Працює поверх [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI) і отримує оновлення в реальному часі через **SignalR** (наприклад, нові замовлення).

<!-- TODO: 2–3 речення про реальні сторінки: логін, дашборд, меню, замовлення, налаштування закладу тощо -->

## ✨ Можливості

<!-- TODO: залиште лише реалізоване -->
- 🔐 Авторизація партнера
- 🍽️ Керування меню та товарами (завантаження зображень через `FormData`)
- 🧾 Перегляд і обробка замовлень
- ⚡ Оновлення в реальному часі (SignalR)
- 📱 Адаптивний інтерфейс

## 🧰 Технологічний стек

| Категорія | Технології |
|---|---|
| Фреймворк | React 19, React Router 7 |
| Мова / збірка | TypeScript, Vite |
| Стилі та UI | Tailwind CSS 4, shadcn/ui, Base UI, `motion` |
| Іконки | Lucide, Hugeicons |
| Стан | Redux Toolkit, React Redux |
| Форми | React Hook Form |
| Real-time | `@microsoft/signalr` |
| Якість коду | ESLint, `typescript-eslint` |
| Деплой | Docker (Node 20 → Nginx) |

## 🚀 Швидкий старт

### Вимоги

- Node.js 20+
- npm
- Запущений [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI)

### Встановлення та запуск

```bash
git clone https://github.com/GlovoRemake/GlovoPartnersFrontend.git
cd GlovoPartnersFrontend

npm install
cp .env.example .env     # заповніть значення
npm run dev
```

### Доступні скрипти

| Команда | Опис |
|---|---|
| `npm run dev` | Dev-сервер Vite з HMR |
| `npm run build` | Перевірка типів (`tsc -b`) та production-збірка |
| `npm run preview` | Локальний перегляд production-збірки |
| `npm run lint` | Перевірка ESLint |

## ⚙️ Конфігурація

Змінні середовища задаються у `.env` (приклад — `.env.example`).

| Змінна | Опис |
|---|---|
| `VITE_PUBLIC_API_URL` | Базова адреса GlovoAPI <!-- TODO: перевірте назву за .env.example --> |

> Усі змінні для клієнта мають префікс `VITE_` і потрапляють у збірку — **не зберігайте в них секрети**.

## 🐳 Docker

Multi-stage збірка: Node 20 збирає застосунок, Nginx віддає статику на порту **80**.

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t glovo-partners-frontend .

docker run -d -p 8080:80 glovo-partners-frontend
```

Адреса API вшивається **під час збірки** через `--build-arg VITE_API_URL`. Конфіг Nginx — у `nginx.conf`.

## 🗂️ Структура

```
├── public/            # Статичні файли
├── src/               # Код застосунку
├── nginx.conf         # Конфіг Nginx для production
├── Dockerfile
├── components.json    # Налаштування shadcn/ui
└── vite.config.ts
```

## 🔗 Екосистема GlovoRemake

| Репозиторій | Призначення |
|---|---|
| [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI) | Backend (ASP.NET Core, .NET 10) |
| **GlovoPartnersFrontend** | Кабінет партнера (цей репозиторій) |
| [GlovoAdmin](https://github.com/GlovoRemake/GlovoAdmin) | Адмін-панель |
| [GlovoMobile](https://github.com/GlovoRemake/GlovoMobile) | Мобільний застосунок клієнта |
| [GlovoRidersMobile](https://github.com/GlovoRemake/GlovoRidersMobile) | Мобільний застосунок кур'єра |

## 🤝 Внесок

1. Fork → гілка `feature/...`
2. `npm run lint` та `npm run build` без помилок
3. Pull Request

## 📄 Ліцензія

<!-- TODO: додайте LICENSE -->

> ℹ️ Навчальний / фан-проєкт, **не пов'язаний із Glovo**.
