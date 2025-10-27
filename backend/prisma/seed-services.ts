import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Classic Manicure',
        nameEs: 'Manicura Clásica',
        description: 'Professional nail shaping, cuticle care, and polish application',
        descriptionEs: 'Forma profesional de uñas, cuidado de cutículas y aplicación de esmalte',
        duration: 45,
        price: 35.00,
        category: 'NAILS',
        isActive: true,
      },
      {
        name: 'Gel Manicure',
        nameEs: 'Manicura de Gel',
        description: 'Long-lasting gel polish with professional application',
        descriptionEs: 'Esmalte de gel de larga duración con aplicación profesional',
        duration: 60,
        price: 50.00,
        category: 'NAILS',
        isActive: true,
      },
      {
        name: 'Deluxe Pedicure',
        nameEs: 'Pedicura de Lujo',
        description: 'Rejuvenating foot treatment with exfoliation, massage, and polish',
        descriptionEs: 'Tratamiento rejuvenecedor de pies con exfoliación, masaje y esmalte',
        duration: 60,
        price: 45.00,
        category: 'NAILS',
        isActive: true,
      },
      {
        name: 'Acrylic Full Set',
        nameEs: 'Juego Completo de Acrílico',
        description: 'Complete acrylic nail extensions with custom length',
        descriptionEs: 'Extensiones de uñas acrílicas completas con longitud personalizada',
        duration: 90,
        price: 65.00,
        category: 'NAILS',
        isActive: true,
      },
      {
        name: 'Nail Art Design',
        nameEs: 'Diseño de Arte de Uñas',
        description: 'Custom nail art designs by expert artists',
        descriptionEs: 'Diseños de arte de uñas personalizados por artistas expertos',
        duration: 30,
        price: 20.00,
        category: 'NAILS',
        isActive: true,
      },
      {
        name: 'Spa Package',
        nameEs: 'Paquete de Spa',
        description: 'Complete manicure and pedicure with massage',
        descriptionEs: 'Manicura y pedicura completa con masaje',
        duration: 120,
        price: 95.00,
        category: 'SPA',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${services.count} services`);

  // Create employee users and team members
  const employees = [
    {
      email: 'maria@yysalon.com',
      username: 'maria',
      fullName: 'Maria Rodriguez',
      phoneNumber: '+15551234501',
      specialty: 'Nail Art Specialist',
      bio: 'Expert in intricate nail designs with 10+ years of experience',
      bioEs: 'Experta en diseños de uñas intrincados con más de 10 años de experiencia',
    },
    {
      email: 'sophie@yysalon.com',
      username: 'sophie',
      fullName: 'Sophie Chen',
      phoneNumber: '+15551234502',
      specialty: 'Manicure & Pedicure Expert',
      bio: 'Specializes in relaxing spa treatments and classic nail care',
      bioEs: 'Se especializa en tratamientos de spa relajantes y cuidado clásico de uñas',
    },
    {
      email: 'jessica@yysalon.com',
      username: 'jessica',
      fullName: 'Jessica Williams',
      phoneNumber: '+15551234503',
      specialty: 'Acrylic & Gel Specialist',
      bio: 'Master of acrylic extensions and gel applications',
      bioEs: 'Maestra en extensiones acrílicas y aplicaciones de gel',
    },
  ];

  for (const emp of employees) {
    const passwordHash = await bcrypt.hash('employee123', 10);

    // Create user
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        username: emp.username,
        fullName: emp.fullName,
        phoneNumber: emp.phoneNumber,
        passwordHash,
        role: 'EMPLOYEE',
      },
    });

    // Create team member profile
    const teamMember = await prisma.teamMember.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialty: emp.specialty,
        bio: emp.bio,
        bioEs: emp.bioEs,
        isAvailable: true,
      },
    });

    // Create availability for Monday-Friday (9 AM - 6 PM)
    // dayOfWeek: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 0=Sunday
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.create({
        data: {
          teamMemberId: teamMember.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isActive: true,
        },
      });
    }

    // Saturday (9 AM - 5 PM)
    await prisma.availability.create({
      data: {
        teamMemberId: teamMember.id,
        dayOfWeek: 6,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
    });

    console.log(`Created employee: ${emp.fullName}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
