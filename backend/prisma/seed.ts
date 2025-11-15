import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // ============================================
  // 1. CREATE ADMIN USER
  // ============================================
  console.log('\n👤 Creating Admin User...');

  const adminPassword = await bcrypt.hash('Admin123!@#', 10);
  const admin = await prisma.user.upsert({
    where: { phoneNumber: '+17024269735' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'lazcodes@gmail.com',
      username: '17024269735', // Phone number without + or -
      fullName: 'Laz Martinez',
      phoneNumber: '+17024269735',
      passwordHash: adminPassword,
      role: 'ADMIN',
      languagePreference: 'en',
    },
  });
  console.log('✅ Admin created:', admin.phoneNumber);

  // ============================================
  // 2. CREATE TEST CUSTOMER (Jane)
  // ============================================
  console.log('\n👤 Creating Test Customer...');

  const janePassword = await bcrypt.hash('Test123!@#', 10);
  const jane = await prisma.user.upsert({
    where: { email: 'jane.test@yysalon.com' },
    update: { passwordHash: janePassword, phoneNumber: '+19995551234', username: '19995551234' },
    create: {
      email: 'jane.test@yysalon.com',
      username: '19995551234', // Phone number without +
      fullName: 'Jane Smith',
      phoneNumber: '+19995551234',
      passwordHash: janePassword,
      role: 'CUSTOMER',
      languagePreference: 'en',
      points: 0,
    },
  });
  console.log('✅ Test customer created: Jane Smith (+19995551234)');

  // ============================================
  // 3. CREATE SERVICES
  // ============================================
  console.log('\n💅 Creating Services...');

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
  console.log(`✅ Created ${services.count} services`);

  // ============================================
  // 4. CREATE EMPLOYEES
  // ============================================
  console.log('\n💼 Creating Employees...');

  // Real Employees (WITH default availability)
  const realEmployees = [
    {
      email: 'yane@yysalon.com',
      fullName: 'Yaneidis Hidalgo',
      phoneNumber: '+17027899516',
      specialty: 'Acrylic & Gel Specialist',
      specialtyEs: 'Especialista en Acrílico y Gel',
      bio: 'Expert in intricate nail designs with 10+ years of experience',
      bioEs: 'Experta en diseños de uñas intrincados con más de 10 años de experiencia',
      hasDefaultSchedule: true,
    },
    {
      email: 'yaile@yysalon.com',
      fullName: 'Yailex Hidalgo',
      phoneNumber: '+17022345489',
      specialty: 'Nail Art Specialist',
      specialtyEs: 'Especialista en Arte de Uñas',
      bio: 'Specializes in relaxing spa treatments and classic nail care',
      bioEs: 'Se especializa en tratamientos de spa relajantes y cuidado clásico de uñas',
      hasDefaultSchedule: true,
    },
    {
      email: 'laura@yysalon.com',
      fullName: 'Diana Laura Martinez',
      phoneNumber: '+17253032144',
      specialty: 'Acrylic & Gel Specialist',
      specialtyEs: 'Especialista en Acrílico y Gel',
      bio: 'Master of acrylic extensions and gel applications',
      bioEs: 'Maestra en extensiones acrílicas y aplicaciones de gel',
      hasDefaultSchedule: true,
    },
  ];

  // Mock Employee (NO default schedule - will set via UI)
  const mockEmployee = {
    email: 'sarah@yysalon.com',
    fullName: 'Sarah Thompson',
    phoneNumber: '+15551234567',
    specialty: 'Pedicure Specialist',
    specialtyEs: 'Especialista en Pedicura',
    bio: 'Expert in luxury pedicure treatments and foot care',
    bioEs: 'Experta en tratamientos de pedicura de lujo y cuidado de pies',
    hasDefaultSchedule: false, // No default availability - will be set by employee
  };

  const allEmployees = [...realEmployees, mockEmployee];

  for (const emp of allEmployees) {
    const passwordHash = await bcrypt.hash('Test123!@#', 10);

    // Extract username from phone number (digits only)
    const username = emp.phoneNumber.replace(/\D/g, ''); // Remove +, -, etc.

    // Create user
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: { passwordHash, phoneNumber: emp.phoneNumber, username },
      create: {
        email: emp.email,
        username,
        fullName: emp.fullName,
        phoneNumber: emp.phoneNumber,
        passwordHash,
        role: 'EMPLOYEE',
        languagePreference: 'en',
      },
    });

    // Create team member profile
    const teamMember = await prisma.teamMember.upsert({
      where: { userId: user.id },
      update: { hasDefaultSchedule: emp.hasDefaultSchedule },
      create: {
        userId: user.id,
        specialty: emp.specialty,
        specialtyEs: emp.specialtyEs,
        bio: emp.bio,
        bioEs: emp.bioEs,
        isAvailable: true,
        hasDefaultSchedule: emp.hasDefaultSchedule,
      },
    });

    // Only create default availability for real employees
    if (emp.hasDefaultSchedule) {
      // Monday-Friday (9 AM - 6 PM)
      for (let day = 1; day <= 5; day++) {
        const existing = await prisma.availability.findFirst({
          where: {
            teamMemberId: teamMember.id,
            dayOfWeek: day,
          },
        });

        if (!existing) {
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
      }

      // Saturday (9 AM - 5 PM)
      const existingSaturday = await prisma.availability.findFirst({
        where: {
          teamMemberId: teamMember.id,
          dayOfWeek: 6,
        },
      });

      if (!existingSaturday) {
        await prisma.availability.create({
          data: {
            teamMemberId: teamMember.id,
            dayOfWeek: 6,
            startTime: '09:00',
            endTime: '17:00',
            isActive: true,
          },
        });
      }
    }

    console.log(`✅ Created employee: ${emp.fullName}${emp.hasDefaultSchedule ? ' (with default schedule)' : ' (schedule to be set)'}`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📱 Login Credentials (use phone number as username):');
  console.log('\n👑 ADMIN:');
  console.log('   Login: +17024269735');
  console.log('   Password: Admin123!@#');
  console.log('\n🧪 TEST CUSTOMER (Jane):');
  console.log('   Login: +19995551234');
  console.log('   Password: Test123!@#');
  console.log('\n💼 EMPLOYEES:');
  console.log('   Password (all): Test123!@#');
  console.log('   - Yaneidis:     +17027899516');
  console.log('   - Yailex:       +17022345489');
  console.log('   - Diana Laura:  +17253032144');
  console.log('   - Sarah:        +15551234567 (NO schedule - will set via UI)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
