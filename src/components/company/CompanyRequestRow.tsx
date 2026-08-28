import { TableCell, TableRow } from "@/components/ui/table.tsx";
import type { IRequestCompany } from "@/types/company/IRequestCompany.ts";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useNavigate } from "react-router";

type CompanyRequestRowProps = {
    request: IRequestCompany;
    index: number;
};

const CompanyRequestRow = ({ request, index }: CompanyRequestRowProps) => {
    const navigate = useNavigate();
    const isApproved = request.isApprove === true;
    const isPending = request.isApprove === null || request.isApprove === undefined;
    const status = isPending
        ? { label: "На розгляді", className: "bg-amber-100 text-amber-800", icon: Clock3 }
        : request.isApprove
            ? { label: "Схвалено", className: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 }
            : { label: "Відмовлено", className: "bg-red-100 text-red-800", icon: XCircle };
    const StatusIcon = status.icon;

    return (
        <TableRow
            className={isApproved ? "cursor-pointer" : undefined}
            onClick={isApproved ? () => navigate(`/dashboard/companies/${request.companyId ?? request.id}`) : undefined}
            onKeyDown={isApproved ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/dashboard/companies/${request.companyId ?? request.id}`);
                }
            } : undefined}
            tabIndex={isApproved ? 0 : undefined}
            role={isApproved ? "link" : undefined}
        >
            <TableCell className="w-16 text-muted-foreground">{index}</TableCell>
            <TableCell className="min-w-52 font-medium">{request.name}</TableCell>
            <TableCell>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                    <StatusIcon className="size-3.5" />
                    {status.label}
                </span>
            </TableCell>
            <TableCell className="min-w-64 max-w-md text-muted-foreground">
                {request.message || <span className="italic">-</span>}
            </TableCell>
        </TableRow>
    );
};

export default CompanyRequestRow;