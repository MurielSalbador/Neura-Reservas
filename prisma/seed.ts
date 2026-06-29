import { PrismaClient, BookingMode, BookingStatus, PaymentStatus, UserRole } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "tuReserva2024_salt").digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // Admin predefinido
  await prisma.user.upsert({
    where: { email: "admin@reservas.com" },
    update: { password: hashPassword("admin123") },
    create: {
      name: "Administrador",
      email: "admin@reservas.com",
      phone: "+54 341 000-0000",
      password: hashPassword("admin123"),
      role: UserRole.admin,
    },
  });

  // Users
  const juan = await prisma.user.upsert({
    where: { email: "juan@email.com" },
    update: { password: hashPassword("juan123") },
    create: {
      name: "Juan Pérez",
      email: "juan@email.com",
      phone: "+54 341 555-0001",
      password: hashPassword("juan123"),
      role: UserRole.client,
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: "maria@email.com" },
    update: { password: hashPassword("maria123") },
    create: {
      name: "María García",
      email: "maria@email.com",
      phone: "+54 341 555-0002",
      password: hashPassword("maria123"),
      role: UserRole.owner,
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: "carlos@email.com" },
    update: { password: hashPassword("carlos123") },
    create: {
      name: "Carlos López",
      email: "carlos@email.com",
      phone: "+54 341 555-0003",
      password: hashPassword("carlos123"),
      role: UserRole.client,
    },
  });

  // Categories
  const cats = [
    { name: "Canchas", slug: "canchas", icon: "⚽", color: "#22c55e", order: 1, description: "Canchas deportivas de fútbol, básquet, tenis y más" },
    { name: "Salones", slug: "salones", icon: "🎉", color: "#a855f7", order: 2, description: "Salones de eventos para fiestas, casamientos y reuniones" },
    { name: "Peluquerías", slug: "peluquerias", icon: "✂️", color: "#f97316", order: 3, description: "Peluquerías y barberías profesionales" },
    { name: "Estética", slug: "estetica", icon: "💆", color: "#ec4899", order: 4, description: "Centros de estética, spa y bienestar" },
    { name: "Gimnasios", slug: "gimnasios", icon: "🏋️", color: "#3b82f6", order: 5, description: "Gimnasios y centros fitness" },
    { name: "Estudios", slug: "estudios", icon: "📸", color: "#eab308", order: 6, description: "Estudios fotográficos y de video" },
    { name: "Restaurantes", slug: "restaurantes", icon: "🍽️", color: "#ef4444", order: 7, description: "Restaurantes con reserva de mesa" },
    { name: "Consultorios", slug: "consultorios", icon: "🏥", color: "#06b6d4", order: 8, description: "Consultorios médicos y profesionales" },
    { name: "Quinchos", slug: "quinchos", icon: "🏊", color: "#10b981", order: 9, description: "Quinchos y complejos recreativos" },
    { name: "Alojamientos", slug: "alojamientos", icon: "🏨", color: "#f59e0b", order: 10, description: "Alojamientos y espacios temporales" },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of cats) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // Businesses
  const businesses = [
    {
      name: "Complejo La Superiora",
      slug: "complejo-la-superiora",
      description: "El mejor complejo de canchas de fútbol en Rosario. Canchas de césped sintético de última generación, vestuarios y bar.",
      coverUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
      address: "Av. Circunvalación 1234",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-1001",
      email: "info@superiora.com",
      rating: 4.8,
      reviewCount: 124,
      minPrice: 12000,
      isActive: true,
      isFeatured: true,
      tag: "Popular",
      bookingMode: BookingMode.hourly,
      categoryId: categoryMap["canchas"],
      ownerId: maria.id,
      resources: [
        { name: "Cancha 1", description: "Fútbol 5 - Césped sintético", price: 12000, capacity: 10 },
        { name: "Cancha 2", description: "Fútbol 7 - Césped sintético", price: 15000, capacity: 14 },
        { name: "Cancha 3", description: "Fútbol 11 - Césped natural", price: 20000, capacity: 22 },
      ],
    },
    {
      name: "Salón Imperial",
      slug: "salon-imperial",
      description: "El salón de eventos más elegante de Funes. Capacidad para 300 personas, catering propio y servicio de decoración.",
      coverUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      address: "Ruta 9 km 12",
      city: "Funes",
      province: "Santa Fe",
      phone: "+54 341 555-2001",
      email: "eventos@salonimp.com",
      rating: 4.9,
      reviewCount: 89,
      minPrice: 150000,
      isActive: true,
      isFeatured: true,
      tag: "Nuevo",
      bookingMode: BookingMode.daily,
      categoryId: categoryMap["salones"],
      ownerId: maria.id,
      resources: [
        { name: "Salón Principal", description: "Capacidad 300 personas", price: 150000, capacity: 300 },
        { name: "Salón VIP", description: "Capacidad 80 personas", price: 80000, capacity: 80 },
      ],
    },
    {
      name: "Studio Hair",
      slug: "studio-hair",
      description: "Peluquería y barbería premium en el corazón de Rosario. Especialistas en coloración y tratamientos capilares.",
      coverUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
      address: "Córdoba 2500",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-3001",
      email: "turnos@studiohair.com",
      rating: 4.7,
      reviewCount: 203,
      minPrice: 8000,
      isActive: true,
      isFeatured: true,
      tag: "Popular",
      bookingMode: BookingMode.appointment,
      categoryId: categoryMap["peluquerias"],
      ownerId: maria.id,
      resources: [
        { name: "Juan", description: "Especialista en color", price: 8000, duration: 30 },
        { name: "María", description: "Coloración y tratamientos", price: 12000, duration: 90 },
        { name: "Pedro", description: "Barbero clásico", price: 6000, duration: 45 },
      ],
    },
    {
      name: "Bella Estética",
      slug: "bella-estetica",
      description: "Centro de estética integral. Depilación, faciales, masajes y tratamientos corporales de alta gama.",
      coverUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      address: "San Martín 1800",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-4001",
      email: "turnos@bellaestetica.com",
      rating: 4.6,
      reviewCount: 156,
      minPrice: 6000,
      isActive: true,
      isFeatured: true,
      tag: "Nuevo",
      bookingMode: BookingMode.appointment,
      categoryId: categoryMap["estetica"],
      ownerId: maria.id,
      resources: [
        { name: "Gabinete 1", description: "Tratamientos faciales", price: 8000, duration: 60 },
        { name: "Gabinete 2", description: "Depilación y corporales", price: 6000, duration: 45 },
        { name: "Sala de masajes", description: "Masajes relajantes y terapéuticos", price: 12000, duration: 60 },
      ],
    },
    {
      name: "FitLife Gym",
      slug: "fitlife-gym",
      description: "Gimnasio moderno con equipamiento de última generación. Clases de spinning, crossfit y entrenamiento funcional.",
      coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      address: "Pellegrini 900",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-5001",
      email: "info@fitlife.com",
      rating: 4.5,
      reviewCount: 78,
      minPrice: 3500,
      isActive: true,
      isFeatured: false,
      tag: null,
      bookingMode: BookingMode.hourly,
      categoryId: categoryMap["gimnasios"],
      ownerId: maria.id,
      resources: [
        { name: "Sala de Musculación", description: "Equipamiento completo", price: 3500, capacity: 20 },
        { name: "Sala Spinning", description: "15 bicicletas", price: 4000, capacity: 15 },
        { name: "Sala Crossfit", description: "Box de entrenamiento funcional", price: 5000, capacity: 10 },
      ],
    },
    {
      name: "Foto Art Studio",
      slug: "foto-art-studio",
      description: "Estudio fotográfico profesional. Sesiones de fotos, alquiler de estudio y producción audiovisual.",
      coverUrl: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80",
      address: "Entre Ríos 1400",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-6001",
      email: "reservas@fotoart.com",
      rating: 4.8,
      reviewCount: 45,
      minPrice: 15000,
      isActive: true,
      isFeatured: false,
      tag: null,
      bookingMode: BookingMode.hourly,
      categoryId: categoryMap["estudios"],
      ownerId: maria.id,
      resources: [
        { name: "Estudio Principal", description: "200m², fondo blanco y gris", price: 15000, capacity: 5 },
        { name: "Estudio Chico", description: "80m², ideal para retratos", price: 8000, capacity: 3 },
      ],
    },
    {
      name: "La Parrilla del Parque",
      slug: "la-parrilla-del-parque",
      description: "Restaurante especializado en carnes a la parrilla. Ambiente familiar, carta de vinos seleccionada.",
      coverUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      address: "Parque Independencia s/n",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-7001",
      email: "reservas@laparrilla.com",
      rating: 4.4,
      reviewCount: 312,
      minPrice: 2000,
      isActive: true,
      isFeatured: false,
      tag: null,
      bookingMode: BookingMode.appointment,
      categoryId: categoryMap["restaurantes"],
      ownerId: maria.id,
      resources: [
        { name: "Mesa 2 personas", description: "Interior, vista al jardín", price: 2000, capacity: 2 },
        { name: "Mesa 4 personas", description: "Interior o exterior", price: 0, capacity: 4 },
        { name: "Salón privado", description: "Hasta 20 personas", price: 50000, capacity: 20 },
      ],
    },
    {
      name: "Consultorio Dr. García",
      slug: "consultorio-dr-garcia",
      description: "Médico clínico y pediatra. Atención de lunes a sábado con sistema de turnos online.",
      coverUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
      address: "Corrientes 800 - Piso 3",
      city: "Rosario",
      province: "Santa Fe",
      phone: "+54 341 555-8001",
      email: "turnos@drgarcia.com",
      rating: 4.9,
      reviewCount: 267,
      minPrice: 5000,
      isActive: true,
      isFeatured: false,
      tag: null,
      bookingMode: BookingMode.appointment,
      categoryId: categoryMap["consultorios"],
      ownerId: maria.id,
      resources: [
        { name: "Dr. García - Clínica", description: "Medicina clínica general", price: 5000, duration: 30 },
        { name: "Dr. García - Pediatría", description: "Atención pediátrica", price: 5500, duration: 30 },
      ],
    },
  ];

  const createdBusinesses: Record<string, { id: string; resources: { id: string; name: string }[] }> = {};

  for (const biz of businesses) {
    const { resources, ...bizData } = biz;
    const existing = await prisma.business.findUnique({ where: { slug: bizData.slug } });
    if (!existing) {
      const created = await prisma.business.create({ data: bizData });
      const createdResources = [];
      for (const res of resources) {
        const r = await prisma.resource.create({
          data: { ...res, businessId: created.id },
        });
        createdResources.push({ id: r.id, name: r.name });
      }
      createdBusinesses[bizData.slug] = { id: created.id, resources: createdResources };
    }
  }

  // Bookings (sample data)
  if (
    createdBusinesses["complejo-la-superiora"] &&
    createdBusinesses["studio-hair"] &&
    createdBusinesses["salon-imperial"]
  ) {
    const superiora = createdBusinesses["complejo-la-superiora"];
    const studioHair = createdBusinesses["studio-hair"];
    const salonImperial = createdBusinesses["salon-imperial"];

    const now = new Date();
    const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
    const setTime = (d: Date, h: number, m = 0) => {
      const nd = new Date(d);
      nd.setHours(h, m, 0, 0);
      return nd;
    };

    const bookingsData = [
      {
        customerName: juan.name,
        customerEmail: juan.email,
        businessId: superiora.id,
        resourceId: superiora.resources[0].id,
        userId: juan.id,
        date: setTime(addDays(now, 2), 20),
        startTime: setTime(addDays(now, 2), 20),
        endTime: setTime(addDays(now, 2), 21),
        mode: BookingMode.hourly,
        totalAmount: 12000,
        depositAmount: 3000,
        paidAmount: 3000,
        paymentStatus: PaymentStatus.partial,
        status: BookingStatus.confirmed,
      },
      {
        customerName: juan.name,
        customerEmail: juan.email,
        businessId: studioHair.id,
        resourceId: studioHair.resources[0].id,
        userId: juan.id,
        date: setTime(addDays(now, 4), 11),
        startTime: setTime(addDays(now, 4), 11),
        endTime: setTime(addDays(now, 4), 11, 30),
        mode: BookingMode.appointment,
        totalAmount: 8000,
        depositAmount: 0,
        paidAmount: 0,
        paymentStatus: PaymentStatus.pending,
        status: BookingStatus.pending,
      },
      {
        customerName: juan.name,
        customerEmail: juan.email,
        businessId: salonImperial.id,
        resourceId: salonImperial.resources[0].id,
        userId: juan.id,
        date: setTime(addDays(now, 7), 19),
        mode: BookingMode.daily,
        totalAmount: 150000,
        depositAmount: 50000,
        paidAmount: 50000,
        paymentStatus: PaymentStatus.partial,
        status: BookingStatus.confirmed,
      },
      {
        customerName: carlos.name,
        customerEmail: carlos.email,
        businessId: superiora.id,
        resourceId: superiora.resources[1].id,
        userId: carlos.id,
        date: setTime(addDays(now, -3), 18),
        startTime: setTime(addDays(now, -3), 18),
        endTime: setTime(addDays(now, -3), 19),
        mode: BookingMode.hourly,
        totalAmount: 15000,
        depositAmount: 5000,
        paidAmount: 15000,
        paymentStatus: PaymentStatus.paid,
        status: BookingStatus.completed,
      },
      {
        customerName: carlos.name,
        customerEmail: carlos.email,
        businessId: superiora.id,
        resourceId: superiora.resources[0].id,
        userId: carlos.id,
        date: setTime(now, 19),
        startTime: setTime(now, 19),
        endTime: setTime(now, 20),
        mode: BookingMode.hourly,
        totalAmount: 12000,
        depositAmount: 3000,
        paidAmount: 3000,
        paymentStatus: PaymentStatus.partial,
        status: BookingStatus.confirmed,
      },
    ];

    for (const booking of bookingsData) {
      await prisma.booking.create({ data: booking });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
