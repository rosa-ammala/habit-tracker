import { prisma } from "../src/config/prisma";

async function main() {
  const categories = [
    { name: "Health", icon: "health.svg" },
    { name: "Fitness", icon: "dumbbell.svg" },
    { name: "Learning", icon: "book.svg" },
    { name: "Hobby", icon: "hobby.svg" },
    { name: "Finance", icon: "money.svg" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { icon: category.icon },
      create: category,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Categories seeded");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });