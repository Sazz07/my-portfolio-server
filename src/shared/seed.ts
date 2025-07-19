import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create technology categories
  const frontendCategory = await prisma.technologyCategory.upsert({
    where: { value: 'frontend' },
    update: {},
    create: {
      name: 'Frontend',
      value: 'frontend',
    },
  });

  const backendCategory = await prisma.technologyCategory.upsert({
    where: { value: 'backend' },
    update: {},
    create: {
      name: 'Backend',
      value: 'backend',
    },
  });

  const devopsCategory = await prisma.technologyCategory.upsert({
    where: { value: 'devops' },
    update: {},
    create: {
      name: 'DevOps',
      value: 'devops',
    },
  });

  // Create some common technologies
  const commonTechnologies = [
    // Frontend
    { name: 'React', categoryId: frontendCategory.id },
    { name: 'Next.js', categoryId: frontendCategory.id },
    { name: 'Vue.js', categoryId: frontendCategory.id },
    { name: 'Angular', categoryId: frontendCategory.id },
    { name: 'TypeScript', categoryId: frontendCategory.id },
    { name: 'JavaScript', categoryId: frontendCategory.id },
    { name: 'HTML', categoryId: frontendCategory.id },
    { name: 'CSS', categoryId: frontendCategory.id },
    { name: 'Tailwind CSS', categoryId: frontendCategory.id },
    { name: 'Bootstrap', categoryId: frontendCategory.id },

    // Backend
    { name: 'Node.js', categoryId: backendCategory.id },
    { name: 'Express.js', categoryId: backendCategory.id },
    { name: 'Python', categoryId: backendCategory.id },
    { name: 'Django', categoryId: backendCategory.id },
    { name: 'Flask', categoryId: backendCategory.id },
    { name: 'Java', categoryId: backendCategory.id },
    { name: 'Spring Boot', categoryId: backendCategory.id },
    { name: 'C#', categoryId: backendCategory.id },
    { name: '.NET', categoryId: backendCategory.id },
    { name: 'PHP', categoryId: backendCategory.id },
    { name: 'Laravel', categoryId: backendCategory.id },
    { name: 'PostgreSQL', categoryId: backendCategory.id },
    { name: 'MongoDB', categoryId: backendCategory.id },
    { name: 'MySQL', categoryId: backendCategory.id },

    // DevOps
    { name: 'Docker', categoryId: devopsCategory.id },
    { name: 'Kubernetes', categoryId: devopsCategory.id },
    { name: 'AWS', categoryId: devopsCategory.id },
    { name: 'Azure', categoryId: devopsCategory.id },
    { name: 'Google Cloud', categoryId: devopsCategory.id },
    { name: 'Git', categoryId: devopsCategory.id },
    { name: 'GitHub Actions', categoryId: devopsCategory.id },
    { name: 'Jenkins', categoryId: devopsCategory.id },
    { name: 'Nginx', categoryId: devopsCategory.id },
    { name: 'Linux', categoryId: devopsCategory.id },
  ];

  for (const tech of commonTechnologies) {
    await prisma.technology.upsert({
      where: { name: tech.name },
      update: {},
      create: {
        name: tech.name,
        value: tech.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: tech.categoryId,
      },
    });
  }

  console.log(
    'Technology categories and common technologies seeded successfully'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
