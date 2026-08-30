import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {GripVertical, Loader, Plus, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import type {IUpdateAdditionalGroup} from "@/types/additional/IUpdateAdditionalGroup";
import {TableCell, TableRow} from "@/components/ui/table.tsx";
import {useUpdateMutation as useUpdateAdditionMutation} from "@/services/apiProductAdditional.ts";

interface UpdateProductAdditionalRowProps {
    additional: IUpdateAdditionalGroup;
    companyId: string;
    additionalId: number;

    draggable?: boolean;
    isDragging?: boolean;
    isReordering?: boolean;

    onDragStart?: (event: React.DragEvent) => void;
    onDragOver?: (event: React.DragEvent) => void;
    onDrop?: (event: React.DragEvent) => void;
    onDragEnd?: () => void;
}

const UpdateProductAdditionalRow = ({
                                        additional,
                                        companyId,
                                        additionalId,
                                        draggable,
                                        isDragging,
                                        isReordering,
                                        onDragStart,
                                        onDragOver,
                                        onDrop,
                                        onDragEnd,
                                    }: UpdateProductAdditionalRowProps) => {

    const [open, setOpen] = useState(false);

    const [updateAddition, {isLoading}] = useUpdateAdditionMutation();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors},
    } = useForm<IUpdateAdditionalGroup>({
        defaultValues: additional,
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "additionals",
    });

    const minChoice = useWatch({
        control,
        name: "minChoice",
    });

    useEffect(() => {
        if (open) {
            reset(additional);
        }
    }, [open, additional, reset]);

    const onSubmit = async (data: IUpdateAdditionalGroup) => {
        if (data.additionals.length < data.minChoice) {
            setError("additionals", {
                type: "validate",
                message: `Додайте щонайменше ${data.minChoice} додатків`,
            });
            return;
        }

        clearErrors("additionals");

        try {
            await updateAddition({
                companyId,
                additionalId: additionalId,
                body: data,
            }).unwrap();

            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            reset(additional);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    <TableRow
                        draggable={draggable}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onDragEnd={onDragEnd}
                        className={`transition-all duration-200 cursor-pointer ${
                            isDragging
                                ? "scale-[0.98] opacity-40"
                                : "hover:bg-muted/50"
                        }`}
                    >
                        <TableCell className="flex items-center gap-2">
                            {isReordering ? (
                                <Loader className="size-4 animate-spin text-muted-foreground" />
                            ) : (
                                <GripVertical className="size-4 shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing" />
                            )}

                            {additional.name}
                        </TableCell>
                    </TableRow>
                }
            />

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-1">
                    <DialogTitle>Редагування додатку</DialogTitle>
                    <DialogDescription>
                        Змініть дані групи та додатків
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="grid gap-4 sm:grid-cols-2"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-2 col-span-2">
                        <label
                            htmlFor={`name-${additionalId}`}
                            className="text-sm font-medium"
                        >
                            Назва
                        </label>

                        <Input
                            id={`name-${additionalId}`}
                            type="text"
                            placeholder="Наприклад: Додаткові інгредієнти"
                            {...register("name", {
                                required: "Вкажіть назву",
                            })}
                        />

                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor={`minChoice-${additionalId}`}
                            className="text-sm font-medium"
                        >
                            Мін. вибір
                        </label>

                        <Input
                            id={`minChoice-${additionalId}`}
                            type="number"
                            min={0}
                            {...register("minChoice", {
                                required: "Вкажіть мін. вибір",
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: "Мін. вибір не може бути менше 0",
                                },
                            })}
                        />

                        {errors.minChoice && (
                            <p className="text-sm text-destructive">
                                {errors.minChoice.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor={`maxChoice-${additionalId}`}
                            className="text-sm font-medium"
                        >
                            Макс. вибір
                        </label>

                        <Input
                            id={`maxChoice-${additionalId}`}
                            type="number"
                            min={minChoice ?? 0}
                            {...register("maxChoice", {
                                required: "Вкажіть макс. вибір",
                                valueAsNumber: true,
                                validate: (value) =>
                                    value >= minChoice ||
                                    "Макс. вибір не може бути меншим за мін. вибір",
                            })}
                        />

                        {errors.maxChoice && (
                            <p className="text-sm text-destructive">
                                {errors.maxChoice.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Додатки
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Додайте доступні додатки
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        id: null,
                                        name: "",
                                        price: 0,
                                    })
                                }
                            >
                                <Plus className="size-4"/>
                                Додати
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-end gap-2 rounded-md border p-2"
                                >
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-muted-foreground">
                                            Назва
                                        </label>

                                        <Input
                                            placeholder="Сир"
                                            {...register(
                                                `additionals.${index}.name`,
                                                {
                                                    required:
                                                        "Вкажіть назву",
                                                },
                                            )}
                                        />

                                        {errors.additionals?.[index]?.name && (
                                            <p className="text-xs text-destructive">
                                                {errors.additionals[index]?.name?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-24 space-y-1">
                                        <label className="text-xs text-muted-foreground">
                                            Ціна
                                        </label>

                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="0"
                                            {...register(
                                                `additionals.${index}.price`,
                                                {
                                                    required:
                                                        "Вкажіть ціну",
                                                    valueAsNumber: true,
                                                    min: {
                                                        value: 0,
                                                        message: "Ціна ≥ 0",
                                                    },
                                                },
                                            )}
                                        />

                                        {errors.additionals?.[index]?.price && (
                                            <p className="text-xs text-destructive">
                                                {errors.additionals[index]?.price?.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        disabled={fields.length === 1}
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="size-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {errors.additionals?.message && (
                            <p className="text-sm text-destructive">
                                {errors.additionals.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 flex justify-end border-t pt-4">
                        <Button type="submit" disabled={isLoading}>
                            Зберегти
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProductAdditionalRow;