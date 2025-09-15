import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_theme_posts = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Theme ID is required' });
  }

  try {
    // Get theme details
    const theme = await prisma.theme.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    // Get all posts for this theme
    const posts = await prisma.post.findMany({
      where: { themeId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        disease: {
          select: {
            id: true,
            name: true,
          },
        },
        theme: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all diseases that have posts in this theme for filtering
    const diseases = await prisma.disease.findMany({
      where: {
        posts: {
          some: {
            themeId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const responseData = {
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        guidelines: theme.guidelines,
        color: theme.color,
        postCount: theme._count.posts,
      },
      posts,
      diseases,
    };

    res.status(200).json(responseData);
  } catch (e) {
    console.error("Error fetching theme posts:", e);
    res.status(500).json({ error: "Failed to fetch theme posts" });
  }
}

export default get_theme_posts