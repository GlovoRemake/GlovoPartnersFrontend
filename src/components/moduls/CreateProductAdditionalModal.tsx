import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Trash2} from "lucide-react";
import {useForm, useFieldArray, useWatch} from "react-hook-form";
import type {ICreateAdditionalGroup} from "@/types/additional/ICreateAdditionalGroup";
import {Input} from "@/components/ui/input.tsx";
import {useAddMutation as useAddAdditionalMutation} from "@/services/apiProductAdditional.ts";
import {useState} from "react";

type Props = {
    companyId: string
    productId: number
}

const CreateProductAdditionalModal = ({ companyId, productId } : Props) => {

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors}
    } = useForm<ICreateAdditionalGroup>({
        defaultValues: {
            name: "",
            minChoice: 0,
            maxChoice: 1,
            additionals: [{name: "", price: 0}]
        }
    });

    const [createAddition, {isLoading: isCreating}] = useAddAdditionalMutation();

    const {fields, append, remove} = useFieldArray({
        control,
        name: "additionals"
    });

    const minChoice = useWatch({control, name: "minChoice"});

    const [open, setOpen] = useState(false);

    const onSubmit = async (data: ICreateAdditionalGroup) => {
        if (data.additionals.length < data.minChoice) {
            setError("additionals", {
                type: "validate",
                message: `Додайте щонайменше ${data.minChoice} додатків`
            });
            return;
        }

        clearErrors("additionals");

        try {
            await createAddition({
                companyId: companyId,
                productId: productId,
                body: data
            }).unwrap();

            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Dialog open={open}
                onOpenChange={(open) => {
                    setOpen(open);

                    if (!open) {
                        reset();
                    }
                }}>
            <DialogTrigger render={
                <Button
                    type="button"
                    className="cursor-pointer w-fit px-2 flex gap-1"
                    variant="default"
                    size="icon-sm"
                    aria-label="Додатки"
                    title="Додатки"
                >
                    <Plus/> Додати
                </Button>
            }/>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-1">
                    <DialogTitle>Додавання додатку</DialogTitle>
                    <DialogDescription>Заповніть поля для додавання</DialogDescription>
                </DialogHeader>

                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>

                    <div className="space-y-2 col-span-2">
                        <label htmlFor="name" className="text-sm font-medium">Назва</label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Наприклад: Додаткові інгредієнти"
                            {...register("name", {required: "Вкажіть назву"})}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="minChoice" className="text-sm font-medium">Мін. вибір</label>
                        <Input
                            id="minChoice"
                            type="number"
                            min={0}
                            {...register("minChoice", {
                                required: "Вкажіть мін. вибір",
                                valueAsNumber: true,
                                min: {value: 0, message: "Мін. вибір не може бути менше 0"}
                            })}
                        />
                        {errors.minChoice && <p className="text-sm text-destructive">{errors.minChoice.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="maxChoice" className="text-sm font-medium">Макс. вибір</label>
                        <Input
                            id="maxChoice"
                            type="number"
                            min={minChoice ?? 0}
                            {...register("maxChoice", {
                                required: "Вкажіть макс. вибір",
                                valueAsNumber: true,
                                validate: (value) =>
                                    value >= minChoice ||
                                    "Макс. вибір не може бути меншим за мін. вибір"
                            })}
                        />
                        {errors.maxChoice && <p className="text-sm text-destructive">{errors.maxChoice.message}</p>}
                    </div>

                    <div className="col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Додатки</p>
                                <p className="text-xs text-muted-foreground">Додайте доступні додатки</p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({name: "", price: 0})}
                            >
                                <Plus className="size-4"/> Додати
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-start gap-2 rounded-md border p-2">

                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-muted-foreground">Назва</label>
                                        <Input
                                            placeholder="Сир"
                                            {...register(`additionals.${index}.name`, {required: "Вкажіть назву"})}
                                        />
                                        {errors.additionals?.[index]?.name &&
                                            <p className="text-xs text-destructive">
                                                {errors.additionals[index]?.name?.message}
                                            </p>
                                        }
                                    </div>

                                    <div className="w-24 space-y-1">
                                        <label className="text-xs text-muted-foreground">Ціна</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="0"
                                            {...register(`additionals.${index}.price`, {
                                                valueAsNumber: true,
                                                min: {value: 0, message: "Ціна ≥ 0"}
                                            })}
                                        />
                                        {errors.additionals?.[index]?.price &&
                                            <p className="text-xs text-destructive">
                                                {errors.additionals[index]?.price?.message}
                                            </p>
                                        }
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

                        {errors.additionals?.message &&
                            <p className="text-sm text-destructive">{errors.additionals.message}</p>
                        }
                    </div>

                    <div className="col-span-2 flex justify-end border-t pt-4">
                        <Button type="submit" disabled={isCreating}>Зберегти</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProductAdditionalModal;