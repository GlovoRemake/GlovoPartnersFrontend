import { Button } from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { useGetAllCompanyTypesQuery } from "@/services/apiCompany.ts";
import type { ICompanyType } from "@/types/company/ICompanyType";
import { Check } from "lucide-react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";

type CompanyTypeSelectorProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>;
    parentFieldName: Path<TFieldValues>;
    childFieldName: Path<TFieldValues>;
    label?: string;
    childLabel?: string;
};

const CompanyTypeSelector = <TFieldValues extends FieldValues>({
    control,
    parentFieldName,
    childFieldName,
    label = "Категорія компанії",
    childLabel = "Підкатегорії компанії",
}: CompanyTypeSelectorProps<TFieldValues>) => {
    const { data: companyTypes, isLoading: isCompanyTypesLoading, isError: isCompanyTypesError } = useGetAllCompanyTypesQuery();

    const { field: parentField } = useController({
        control,
        name: parentFieldName,
    });

    const { field: childField } = useController({
        control,
        name: childFieldName,
    });

    const selectedParentTypeId = Number(parentField.value ?? 0);
    const selectedChildTypeIds = Array.isArray(childField.value) ? childField.value : [];
    const parentCompanyTypes = (companyTypes ?? []).filter((type: ICompanyType) => type.parentTypeId == null);
    const childCompanyTypes = (companyTypes ?? []).filter((type: ICompanyType) => type.parentTypeId === selectedParentTypeId);

    const handleParentChange = (value: string) => {
        const nextParentId = Number(value);
        parentField.onChange(nextParentId);
        childField.onChange([]);
    };

    const handleChildToggle = (typeId: number) => {
        const isSelected = selectedChildTypeIds.includes(typeId);
        const nextIds = isSelected
            ? selectedChildTypeIds.filter((id) => id !== typeId)
            : [...selectedChildTypeIds, typeId];

        childField.onChange(nextIds);
    };

    return (
        <>
            <div className="space-y-2">
                <label htmlFor="company-type-parent" className="text-sm font-medium">{label}</label>
                <Select
                    value={selectedParentTypeId ? String(selectedParentTypeId) : ""}
                    items={parentCompanyTypes.map((type) => ({
                        value: String(type.id),
                        label: type.name,
                    }))}
                    onValueChange={handleParentChange}
                    disabled={isCompanyTypesLoading || isCompanyTypesError}
                >
                    <SelectTrigger id="company-type-parent" className="w-full">
                        <SelectValue placeholder={isCompanyTypesLoading ? "Завантаження..." : "Оберіть категорію"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{label}</SelectLabel>
                            {parentCompanyTypes.map((type) => (
                                <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {isCompanyTypesError && <p className="text-sm text-destructive">Не вдалося завантажити категорії компанії.</p>}
            </div>

            <div className="space-y-2">
                <span className="text-sm font-medium">{childLabel}</span>
                {selectedParentTypeId ? (
                    childCompanyTypes.length > 0 ? (
                        <div className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
                            {childCompanyTypes.map((type) => {
                                const isSelected = selectedChildTypeIds.includes(type.id);
                                return (
                                    <Button
                                        key={type.id}
                                        type="button"
                                        variant={isSelected ? "default" : "outline"}
                                        className="justify-start"
                                        aria-pressed={isSelected}
                                        onClick={() => handleChildToggle(type.id)}
                                    >
                                        {isSelected && <Check />}
                                        {type.name}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">Для цієї категорії підкатегорій немає.</p>
                    )
                ) : (
                    <p className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">Спочатку оберіть категорію компанії.</p>
                )}
            </div>
        </>
    );
};

export default CompanyTypeSelector;
