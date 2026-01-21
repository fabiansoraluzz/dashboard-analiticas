'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Acción para crear Usuario
export async function createUser(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    await prisma.user.create({
        data: { name, email, role }
    })

    // Refrescar la vista de usuarios automáticamente
    revalidatePath("/users")
}

export async function updateUser(formData: FormData) {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    await prisma.user.update({
        where: { id },
        data: { name, email, role }
    })

    revalidatePath("/users")
}

// --- USUARIOS ---
export async function deleteUser(userId: string) {
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath("/users")
}

// --- PRODUCTOS ---
export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    // Importante: Convertir de string a número para la base de datos
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)

    await prisma.product.create({
        data: {
            name,
            category,
            price,
            stock,
            status: 'active'
        }
    })

    revalidatePath("/products")
}

export async function deleteProduct(productId: string) {
    await prisma.product.delete({ where: { id: productId } })
    revalidatePath("/products")
}

export async function updateProductStock(id: string, increment: boolean) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return

    await prisma.product.update({
        where: { id },
        data: { stock: increment ? product.stock + 1 : Math.max(0, product.stock - 1) }
    })
    revalidatePath("/products")
}

// --- NOTIFICACIONES ---
export async function markNotificationAsRead(id: string) {
    await prisma.notification.update({
        where: { id },
        data: { isRead: true }
    })
    revalidatePath("/")
}

export async function clearAllNotifications() {
    await prisma.notification.deleteMany()
    revalidatePath("/")
}

// 3. Acción para Guardar Configuración (Simulada para este caso)
export async function updateSettings(formData: FormData) {
    // Aquí guardarías en una tabla 'Settings' si existiera
    // Por ahora simulamos un delay para que se sienta real
    await new Promise(resolve => setTimeout(resolve, 1000))
    revalidatePath("/settings")
    return { message: "Configuración guardada correctamente" }
}

export async function updateProfile(formData: FormData) {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email }
        })
        // Revalidamos
        revalidatePath("/profile")
        revalidatePath("/", "layout")
    } catch (error) {
        throw error;
    }
}

export async function registerSale(formData: FormData) {
    const productId = formData.get("productId") as string;
    const quantityRaw = formData.get("quantity") as string;
    const quantity = Number(quantityRaw);

    try {
        // --- VALIDACIONES ---
        if (isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
            return { success: false, message: "La cantidad debe ser un número entero positivo." };
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return { success: false, message: "El producto seleccionado no existe." };
        }

        if (product.stock < quantity) {
            // Retornamos false pero SIN lanzar error (evita el 500 en consola)
            return {
                success: false,
                message: `Stock insuficiente. Solo quedan ${product.stock} unidades.`
            };
        }

        // --- TRANSACCIÓN ---
        await prisma.$transaction([
            prisma.product.update({
                where: { id: productId },
                data: { stock: { decrement: quantity } }
            }),
            prisma.sale.create({
                data: {
                    amount: product.price * quantity,
                    category: product.category,
                    customerName: "Cliente Mostrador",
                    customerEmail: "cliente@local.com",
                    status: "completed",
                    date: new Date(),
                    region: "Sucursal Central"
                }
            })
        ]);

        revalidatePath("/");
        revalidatePath("/products");

        return { success: true, message: "Venta registrada exitosamente." };

    } catch (error) {
        console.error("Error interno:", error);
        return { success: false, message: "Ocurrió un error inesperado en el servidor." };
    }
}