import { useEffect, useMemo, useRef, useState } from "react";
import {
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
    type HubConnection,
} from "@microsoft/signalr";
import {
    ChefHat,
    ChevronDown,
    ClipboardList,
    Package,
    Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {useGetAffiliateOrdersQuery, useGetAffiliateProductsQuery} from "@/services/apiAffiliate.ts";
import { OrderStatus } from "@/types/order/OrderStatus";
import type {IOrder} from "@/types/order/IOrder.ts";
import APP_ENV from "@/utils/env.ts";

const HUB_URL = `${APP_ENV.API_URL}/hubs/partner`;

const HUB_METHODS = {
    join: "JoinAffiliate",
    ready: "MarkOrderReady",
    handedToCourier: "MarkOrderHandedToCourier",
};

const HUB_EVENTS = {
    created: "NewOrder",
    updated: "OrderUpdated",
    statusUpdated: "OrderStatusUpdated",
};

const getAccessToken = () => localStorage.getItem("accessToken") ?? "";

const ACTIVE_STATUSES = [
    OrderStatus.Created,
    OrderStatus.Scheduled,
    OrderStatus.Cooking,
    OrderStatus.WaitingCourier,
    OrderStatus.Delivering,
    OrderStatus.Completed,
];

const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Created:
            return "Нове";
        case OrderStatus.Scheduled:
            return "Заплановано";
        case OrderStatus.Cooking:
            return "Готується";
        case OrderStatus.WaitingCourier:
            return "Очікує кур'єра";
        case OrderStatus.Delivering:
            return "Доставляється";
        case OrderStatus.Completed:
            return "Завершено";
        case OrderStatus.Cancelled:
            return "Скасовано";
        default:
            return "Невідомо";
    }
};

const getStatusClass = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Created:
            return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
        case OrderStatus.Cooking:
            return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
        case OrderStatus.WaitingCourier:
            return "bg-green-500/15 text-green-600 dark:text-green-400";
        case OrderStatus.Delivering:
            return "bg-primary/15 text-foreground";
        default:
            return "bg-muted text-muted-foreground";
    }
};

type Props = {
    affiliateId: string;
};

const AffiliateOrders = ({ affiliateId }: Props) => {
    const { data, isLoading, isError, refetch } =
        useGetAffiliateOrdersQuery(affiliateId);

    const {data: products} = useGetAffiliateProductsQuery(affiliateId);

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    const connectionRef = useRef<HubConnection | null>(null);
    const refetchRef = useRef(refetch);

    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    // Початковий список із REST
    useEffect(() => {
        if (data) {
            setOrders(data);
        }
    }, [data]);

    /*
     * SignalR
     */
    useEffect(() => {
        let cancelled = false;

        const connection = new HubConnectionBuilder()
            .withUrl(HUB_URL, { accessTokenFactory: getAccessToken })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(LogLevel.Warning)
            .build();

        const upsert = (order: IOrder) => {
            if (!order || order.id === undefined) return;

            setOrders((prev) =>
                prev.some((x) => x.id === order.id)
                    ? prev.map((x) =>
                        x.id === order.id ? { ...x, ...order } : x
                    )
                    : [order, ...prev]
            );
        };

        connection.on(HUB_EVENTS.created, upsert);
        connection.on(HUB_EVENTS.updated, upsert);

        connection.on(HUB_EVENTS.statusUpdated, (payload) => {
            if (
                payload?.orderId === undefined ||
                payload?.status === undefined
            ) {
                return;
            }

            setOrders((prev) =>
                prev.map((x) =>
                    x.id === payload.id
                        ? { ...x, status: payload.status }
                        : x
                )
            );
        });

        connection.onreconnecting(() => setConnected(false));

        connection.onreconnected(async () => {
            try {
                await connection.invoke(HUB_METHODS.join, affiliateId);
                setConnected(true);
                // Підтягуємо те, що могли пропустити, поки не було зв'язку
                refetchRef.current();
            } catch (error) {
                console.error("SignalR rejoin error:", error);
            }
        });

        connection.onclose(() => setConnected(false));

        const start = async () => {
            try {
                await connection.start();

                if (cancelled) {
                    await connection.stop();
                    return;
                }

                await connection.invoke(HUB_METHODS.join, affiliateId);

                connectionRef.current = connection;
                setConnected(true);
            } catch (error) {
                if (!cancelled) {
                    console.error("SignalR connection error:", error);
                }
            }
        };

        start();

        return () => {
            cancelled = true;
            connectionRef.current = null;
            connection.stop().catch(() => {});
        };
    }, [affiliateId]);

    const runAction = async (
        orderId: number,
        method: string,
        nextStatus: OrderStatus
    ) => {
        const connection = connectionRef.current;

        if (!connection || connection.state !== HubConnectionState.Connected) {
            setActionError("Немає з'єднання з сервером. Спробуйте ще раз.");
            return;
        }

        setPendingId(orderId);
        setActionError(null);

        try {
            await connection.invoke(method, orderId);

            setOrders((prev) =>
                prev.map((x) =>
                    x.id === orderId ? { ...x, status: nextStatus } : x
                )
            );
        } catch (error) {
            console.error("Order action error:", error);
            setActionError("Не вдалося змінити статус замовлення.");
        } finally {
            setPendingId(null);
        }
    };

    const activeOrders = useMemo(
        () =>
            orders
                .filter((x) => ACTIVE_STATUSES.includes(x.status))
                .sort((a, b) => b.id - a.id),
        [orders]
    );

    return (
        <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
                        <ClipboardList className="size-6" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Замовлення філії
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Нові замовлення з'являються автоматично.
                            Натисніть на замовлення, щоб побачити, що
                            потрібно приготувати.
                        </p>
                    </div>
                </div>

                <span
                    className={`mt-1 flex shrink-0 items-center gap-2 text-xs ${
                        connected
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                    }`}
                >
                    <span
                        className={`size-2 rounded-full ${
                            connected ? "bg-green-500" : "bg-muted-foreground"
                        }`}
                    />
                    {connected ? "Онлайн" : "Підключення..."}
                </span>
            </div>

            {actionError && (
                <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {actionError}
                </p>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/40 p-6 text-sm text-muted-foreground">
                    <Spinner />
                    Завантаження замовлень...
                </div>
            ) : isError ? (
                <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                    Не вдалося завантажити замовлення.
                    <button
                        type="button"
                        className="ml-1 font-medium underline"
                        onClick={() => refetch()}
                    >
                        Спробувати ще раз
                    </button>
                </div>
            ) : activeOrders.length === 0 ? (
                <p className="rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                    Активних замовлень немає.
                </p>
            ) : (
                <ul className="grid gap-3">
                    {activeOrders.map((order) => {
                        const isExpanded = expandedId === order.id;
                        const isPending = pendingId === order.id;

                        const canMarkReady =
                            order.status === OrderStatus.Created ||
                            order.status === OrderStatus.Cooking;

                        const canHandOver =
                            order.status === OrderStatus.WaitingCourier;

                        return (
                            <li
                                key={order.id}
                                className="overflow-hidden rounded-xl border border-border bg-muted/40"
                            >
                                <button
                                    type="button"
                                    aria-expanded={isExpanded}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                    onClick={() =>
                                        setExpandedId(
                                            isExpanded ? null : order.id
                                        )
                                    }
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            Замовлення #{order.id}
                                        </p>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {order.products?.length ?? 0} поз.
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>

                                        <ChevronDown
                                            className={`size-4 text-muted-foreground transition-transform ${
                                                isExpanded ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-border px-4 py-3">
                                        <h3 className="mb-2 text-sm font-semibold">
                                            Що потрібно приготувати
                                        </h3>

                                        {order.products?.length ? (
                                            <ul className="grid gap-2">
                                                {order.products.map((item) => (
                                                    <li
                                                        key={item.productId}
                                                        className="flex items-start justify-between gap-3 rounded-lg bg-card px-3 py-2 text-sm"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="font-medium">
                                                                {products?.find(x => x.id == item.productId)?.name}
                                                            </p>

                                                            {item.additionals.map((additional) => (
                                                                <p key={additional.additionalId} className="ml-5 text-gray-500">
                                                                    - {additional.name}
                                                                </p>
                                                            ))}
                                                        </div>

                                                        <span className="shrink-0 font-semibold">
                                                            × {item.count}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Список страв порожній.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {(canMarkReady ||
                                    canHandOver ||
                                    order.status ===
                                    OrderStatus.Delivering) && (
                                    <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-3">
                                        {canMarkReady && (
                                            <Button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() =>
                                                    runAction(
                                                        order.id,
                                                        HUB_METHODS.ready,
                                                        OrderStatus.WaitingCourier
                                                    )
                                                }
                                            >
                                                {isPending ? (
                                                    <Spinner />
                                                ) : (
                                                    <ChefHat />
                                                )}
                                                Замовлення готове
                                            </Button>
                                        )}

                                        {canHandOver && (
                                            <Button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() =>
                                                    runAction(
                                                        order.id,
                                                        HUB_METHODS.handedToCourier,
                                                        OrderStatus.Delivering
                                                    )
                                                }
                                            >
                                                {isPending ? (
                                                    <Spinner />
                                                ) : (
                                                    <Package />
                                                )}
                                                Замовлення передане кур'єру
                                            </Button>
                                        )}

                                        {order.status ===
                                            OrderStatus.Delivering && (
                                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Truck className="size-4" />
                                                Кур'єр уже в дорозі
                                            </span>
                                            )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default AffiliateOrders;