import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed optimizado...')

    // 1. Limpiar base de datos
    // El orden importa para evitar errores de claves foráneas si las hubiera
    await prisma.sale.deleteMany()
    await prisma.websiteTraffic.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️  Datos anteriores eliminados.')

    // 2. Crear Admin
    await prisma.user.create({
        data: {
            email: 'admin@dashboard.com',
            name: 'Admin Portfolio',
            role: 'admin',
        },
    })

    // 3. Generar Ventas (Usando createMany para evitar saturar conexiones)
    const salesData = []
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Software', 'Servicios']
    const regions = ['Norte', 'Sur', 'Este', 'Oeste', 'Europa', 'Latam']
    const statuses = ['completed', 'completed', 'completed', 'pending', 'failed']

    for (let i = 0; i < 200; i++) {
        const saleDate = faker.date.past({ years: 0.5 })

        salesData.push({
            amount: parseFloat(faker.finance.amount({ min: 20, max: 500, dec: 2 })),
            status: faker.helpers.arrayElement(statuses),
            customerName: faker.person.fullName(),
            customerEmail: faker.internet.email(),
            category: faker.helpers.arrayElement(categories),
            region: faker.helpers.arrayElement(regions),
            date: saleDate,
            createdAt: saleDate, // Coincidir fecha de creación con fecha de venta
            updatedAt: saleDate  // Obligatorio en createMany si no tiene default en DB
        })
    }

    // ¡AQUÍ ESTÁ LA MAGIA! Una sola petición en lugar de 200
    await prisma.sale.createMany({
        data: salesData,
    })

    console.log('✅ 200 Ventas generadas en un solo lote.')

    // 4. Generar Tráfico Web
    const trafficData = []
    const daysToGenerate = 180

    for (let i = 0; i < daysToGenerate; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        trafficData.push({
            date: date,
            visitors: faker.number.int({ min: 100, max: 1000 }),
            pageViews: faker.number.int({ min: 300, max: 2500 }),
            source: faker.helpers.arrayElement(['Google', 'Social', 'Direct', 'Email']),
        })
    }

    await prisma.websiteTraffic.createMany({
        data: trafficData,
    })

    console.log('✅ Historial de tráfico web generado.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })