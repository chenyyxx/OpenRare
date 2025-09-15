import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const get_themes_with_posts = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        posts: {
          take: 3, // Get 3 recent posts for preview
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
            disease: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    // Define custom theme order: Personal Stories, Research & Information, Help & Support, Events
    const themeOrder = [
      "Personal Stories",
      "Research & Information",
      "Help & Support",
      "Events",
    ];

    // Transform the data to match the expected format
    const themesWithPosts = themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      icon: theme.icon,
      color: theme.color,
      guidelines: theme.guidelines,
      postCount: theme._count.posts,
      recentPosts: theme.posts.map((post) => ({
        id: post.id.toString(),
        title: post.title,
        author: post.user.name || "Anonymous",
        disease: post.disease.name,
      })),
    }));

    // Sort themes according to custom order
    const sortedThemes = themesWithPosts.sort((a, b) => {
      const indexA = themeOrder.indexOf(a.name);
      const indexB = themeOrder.indexOf(b.name);

      // If theme not found in order array, put it at the end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    res.status(200).json(sortedThemes);
  } catch (e) {
    console.error("Error fetching themes with posts:", e);
    res.status(500).json({ error: "Failed to fetch themes with posts" });
  }
};

export default get_themes_with_posts;
