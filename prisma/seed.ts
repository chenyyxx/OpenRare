import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Load NORD disease list
const nordDiseasesPath = path.join(__dirname, "../NORD_LIST/rare_disease_list.json");
const nordDiseases = JSON.parse(fs.readFileSync(nordDiseasesPath, "utf8"));

async function main() {
  // Create the 4 initial themes
  const themes = [
    {
      id: "personal-stories",
      name: "Personal Stories",
      description: "Share your journey and experiences with rare diseases",
      icon: "user",
      color: "#F59E0B",
      guidelines:
        "Share personal experiences, journeys, milestones, and life with rare diseases. This is a space for authentic stories and personal reflections.",
    },
    {
      id: "help-support",
      name: "Help & Support",
      description:
        "Ask questions, seek advice, and offer help to community members",
      icon: "heart",
      color: "#3B82F6",
      guidelines:
        "Ask questions, seek advice, and offer help to community members. This is a caring space for mutual support and assistance.",
    },
    {
      id: "events",
      name: "Events",
      description:
        "Share upcoming events, conferences, and community gatherings",
      icon: "calendar",
      color: "#8B5CF6",
      guidelines:
        "Share upcoming events, conferences, support group meetings, and community gatherings. Help the community stay connected and informed about relevant events.",
    },
    {
      id: "research-information",
      name: "Research & Information",
      description:
        "Share research findings, medical information, and educational content",
      icon: "book",
      color: "#10B981",
      guidelines:
        "Share research findings, medical information, treatment updates, and educational content. This is a space for evidence-based information and learning.",
    },
  ];

  console.log("Seeding themes...");

  for (const theme of themes) {
    const existingTheme = await prisma.theme.findUnique({
      where: { name: theme.name },
    });

    if (!existingTheme) {
      await prisma.theme.create({
        data: theme,
      });
      console.log(`Created theme: ${theme.name}`);
    } else {
      console.log(`Theme already exists: ${theme.name}`);
    }
  }

  // Ensure "Other" and "General" disease options exist
  const defaultDiseases = [
    {
      name: "Other",
      definition: "For rare diseases not listed in our database",
      description:
        "Select this option if your rare disease is not available in the list",
      picture: "",
    },
    {
      name: "General",
      definition:
        "General discussions not specific to a particular rare disease",
      description:
        "For general discussions about rare diseases or community topics",
      picture: "",
    },
  ];

  console.log("Seeding default diseases...");

  for (const disease of defaultDiseases) {
    const existingDisease = await prisma.disease.findUnique({
      where: { name: disease.name },
    });

    if (!existingDisease) {
      await prisma.disease.create({
        data: disease,
      });
      console.log(`Created disease: ${disease.name}`);
    } else {
      console.log(`Disease already exists: ${disease.name}`);
    }
  }

  // Seed NORD rare disease list
  console.log("Seeding NORD rare disease list...");
  
  let createdCount = 0;
  let existingCount = 0;
  
  for (const nordDisease of nordDiseases) {
    const existingDisease = await prisma.disease.findUnique({
      where: { name: nordDisease.name },
    });

    if (!existingDisease) {
      await prisma.disease.create({
        data: {
          name: nordDisease.name,
          definition: nordDisease.definition,
          description: nordDisease.definition, // Using definition as description since that's what we have
          picture: "", // No picture data in NORD list
        },
      });
      createdCount++;
      
      // Log progress every 100 diseases
      if (createdCount % 100 === 0) {
        console.log(`Created ${createdCount} diseases so far...`);
      }
    } else {
      existingCount++;
    }
  }
  
  console.log(`NORD disease seeding completed: ${createdCount} created, ${existingCount} already existed`);
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
