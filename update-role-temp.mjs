import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const bookings = await prisma.booking.findMany({
  select: {
    id: true,
    customerName: true,
    customerEmail: true,
    status: true,
    userId: true,
    businessId: true,
  },
});
console.log("Total bookings:", bookings.length);
console.table(bookings);
await prisma.$disconnect();
