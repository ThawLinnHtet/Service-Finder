import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  nrcStateSeeds,
  nrcTownshipSeeds,
  validateNrcSeedData,
} from "./seed-data/nrc";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run seed");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const PASSWORD_SALT_ROUNDS = 12;

const DEFAULT_ADMIN_CITY = "Yangon";
const DEFAULT_ADMIN_TOWNSHIP = "Hlaing";
const DEFAULT_ADMIN_LATITUDE = 16.8661;
const DEFAULT_ADMIN_LONGITUDE = 96.1951;

const categorySeeds = [
  {
    name: "Cleaning Services",
    skills: ["House Cleaning", "Deep Cleaning", "Office Cleaning"],
  },
  {
    name: "Repair Services",
    skills: ["Phone Repair", "Laptop Repair", "TV Repair"],
  },
  {
    name: "Building Services",
    skills: ["Masonry", "Painting", "Carpentry"],
  },
  {
    name: "Education",
    skills: ["Math", "English", "IELTS", "Physics"],
  },
  {
    name: "Electrical Services",
    skills: ["Wiring", "Lighting Installation", "Electrical Repair"],
  },
  {
    name: "Moving Services",
    skills: ["House Moving", "Furniture Moving", "Packing"],
  },
] as const;

type AdminSeedInput = {
  username: string;
  email: string;
  phone: string;
  password: string;
};

const resolveAdminSeedInput = (): AdminSeedInput | null => {
  const username = process.env.ADMIN_USERNAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const phone = process.env.ADMIN_PHONE?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  const values = [username, email, phone, password];
  const providedCount = values.filter((value) => typeof value === "string" && value.length > 0)
    .length;

  if (providedCount === 0) {
    return null;
  }

  if (providedCount !== values.length) {
    throw new Error(
      "Admin seed requires ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD",
    );
  }

  return {
    username: username as string,
    email: email as string,
    phone: phone as string,
    password: password as string,
  };
};

const run = async (): Promise<void> => {
  validateNrcSeedData();

  for (const categorySeed of categorySeeds) {
    const category = await prisma.category.upsert({
      where: { name: categorySeed.name },
      update: {},
      create: { name: categorySeed.name },
    });

    for (const skillName of categorySeed.skills) {
      await prisma.skill.upsert({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: skillName,
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          name: skillName,
        },
      });
    }
  }

  for (const stateSeed of nrcStateSeeds) {
    await prisma.nrcState.upsert({
      where: { code: stateSeed.code },
      update: {
        name: stateSeed.name,
        nameMm: stateSeed.nameMm,
      },
      create: {
        code: stateSeed.code,
        name: stateSeed.name,
        nameMm: stateSeed.nameMm,
      },
    });
  }

  for (const townshipSeed of nrcTownshipSeeds) {
    await prisma.nrcTownship.upsert({
      where: {
        stateCode_code: {
          stateCode: townshipSeed.stateCode,
          code: townshipSeed.code,
        },
      },
      update: {
        codeMm: townshipSeed.codeMm,
        name: townshipSeed.name,
        nameMm: townshipSeed.nameMm,
      },
      create: {
        stateCode: townshipSeed.stateCode,
        code: townshipSeed.code,
        codeMm: townshipSeed.codeMm,
        name: townshipSeed.name,
        nameMm: townshipSeed.nameMm,
      },
    });
  }

  const adminSeedInput = resolveAdminSeedInput();

  if (adminSeedInput) {
    const passwordHash = await bcrypt.hash(adminSeedInput.password, PASSWORD_SALT_ROUNDS);

    await prisma.user.upsert({
      where: {
        email: adminSeedInput.email,
      },
      update: {
        username: adminSeedInput.username,
        phone: adminSeedInput.phone,
        passwordHash,
        role: "ADMIN",
        city: DEFAULT_ADMIN_CITY,
        township: DEFAULT_ADMIN_TOWNSHIP,
        latitude: DEFAULT_ADMIN_LATITUDE,
        longitude: DEFAULT_ADMIN_LONGITUDE,
      },
      create: {
        username: adminSeedInput.username,
        email: adminSeedInput.email,
        phone: adminSeedInput.phone,
        passwordHash,
        role: "ADMIN",
        city: DEFAULT_ADMIN_CITY,
        township: DEFAULT_ADMIN_TOWNSHIP,
        latitude: DEFAULT_ADMIN_LATITUDE,
        longitude: DEFAULT_ADMIN_LONGITUDE,
      },
    });
  }
};

run()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed successfully");
  })
  .catch(async (error: unknown) => {
    await prisma.$disconnect();
    console.error("Seed failed", error);
    process.exit(1);
  });
