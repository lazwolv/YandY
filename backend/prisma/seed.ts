import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create customer user
  const customerPhone = '555-123-4567';
  const customerUsername = customerPhone.replace(/\D/g, '').slice(-10); // '5551234567'
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { phoneNumber: customerPhone },
    update: {},
    create: {
      email: `${customerUsername}@yysalon.temp`,
      username: customerUsername,
      phoneNumber: customerPhone,
      passwordHash: customerPassword,
      fullName: 'Jane Customer',
      role: 'CUSTOMER',
      points: 0,
    },
  });
  console.log('✓ Customer created:', customer.phoneNumber);

  // Create employee user (nail tech)
  const employeePhone = '555-987-6543';
  const employeeUsername = employeePhone.replace(/\D/g, '').slice(-10); // '5559876543'
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.upsert({
    where: { phoneNumber: employeePhone },
    update: {},
    create: {
      email: `${employeeUsername}@yysalon.temp`,
      username: employeeUsername,
      phoneNumber: employeePhone,
      passwordHash: employeePassword,
      fullName: 'Sarah Martinez',
      role: 'EMPLOYEE',
      points: 0,
    },
  });
  console.log('✓ Nail Tech created:', employee.phoneNumber);

  // Create team member profile for employee
  const teamMember = await prisma.teamMember.upsert({
    where: { userId: employee.id },
    update: {},
    create: {
      userId: employee.id,
      bio: 'Experienced nail technician with 5+ years of expertise in nail art and design.',
      bioEs: 'Técnica de uñas experimentada con más de 5 años de experiencia en arte y diseño de uñas.',
      specialty: 'Nail Technician',
      specialtyEs: 'Técnica de Uñas',
      isAvailable: true,
    },
  });
  console.log('✓ Team member profile created for:', employee.fullName);

  // Create sample services
  const services = [
    {
      name: 'Manicure',
      nameEs: 'Manicura',
      description: 'Classic manicure with nail shaping, cuticle care, and polish',
      descriptionEs: 'Manicura clásica con forma de uñas, cuidado de cutículas y esmalte',
      duration: 45,
      price: 35.00,
      category: 'Nails',
    },
    {
      name: 'Pedicure',
      nameEs: 'Pedicura',
      description: 'Relaxing pedicure with foot soak, exfoliation, and polish',
      descriptionEs: 'Pedicura relajante con remojo de pies, exfoliación y esmalte',
      duration: 60,
      price: 50.00,
      category: 'Nails',
    },
    {
      name: 'Gel Nails',
      nameEs: 'Uñas de Gel',
      description: 'Long-lasting gel nail application with UV curing',
      descriptionEs: 'Aplicación de uñas de gel de larga duración con curado UV',
      duration: 90,
      price: 65.00,
      category: 'Nails',
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });

    if (!existing) {
      await prisma.service.create({
        data: service,
      });
    }
  }
  console.log('✓ Sample services created');

  // Create availability for the team member (Monday to Friday, 9 AM - 5 PM)
  const availabilitySchedule = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
  ];

  for (const slot of availabilitySchedule) {
    const existing = await prisma.availability.findFirst({
      where: {
        teamMemberId: teamMember.id,
        dayOfWeek: slot.dayOfWeek,
      },
    });

    if (!existing) {
      await prisma.availability.create({
        data: {
          teamMemberId: teamMember.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        },
      });
    }
  }
  console.log('✓ Availability schedule created');

  console.log('\n✅ Seeding complete!');
  console.log('\n📱 Login with Phone Number + Password:');
  console.log('   👤 Customer:');
  console.log('      Phone: 555-123-4567');
  console.log('      Password: customer123');
  console.log('\n   💅 Nail Tech (Employee):');
  console.log('      Phone: 555-987-6543');
  console.log('      Password: employee123');
  console.log('\n💡 Tip: You can enter the phone number in any format (with or without dashes)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
