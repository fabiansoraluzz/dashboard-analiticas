import { PrismaClient } from '@prisma/client'

// Evita que TypeScript se queje por añadir propiedades a global
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'], // Opcional: Esto te muestra las consultas SQL en la terminal (útil para debug)
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma