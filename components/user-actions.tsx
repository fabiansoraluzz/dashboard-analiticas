"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { deleteUser } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react";
import { EditUserDialog } from "./edit-user-dialog"; // <--- Importamos el modal

interface UserActionsProps {
    user: any;
}

export function UserActions({ user }: UserActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteUser(user.id);
            toast.success("Usuario eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar usuario");
        }
    };

    return (
        <>
            {/* Renderizamos el Modal aquí, controlado por el estado */}
            <EditUserDialog
                user={user}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Al hacer clic, abrimos el modal */}
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        onClick={handleDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}