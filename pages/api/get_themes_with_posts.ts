import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const get_themes_with_posts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        posts: {
          take: 3, // Get 3 recent posts for preview
          orderBy: {
            createdAt: 'desc',
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
      orderBy: {
        name: 'asc',
      },
    })

    // Transform the data to match the expected format
    const themesWithPosts = themes.map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      icon: theme.icon,
      color: theme.color,
      guidelines: theme.guidelines,
      postCount: theme._count.posts,
      recentPosts: theme.posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        author: post.user.name || 'Anonymous',
        disease: post.disease.name,
      })),
    }))

    res.status(200).json(themesWithPosts)
  } catch (e) {
    console.error("Error fetching themes with posts:", e);
    res.status(500).json({ error: "Failed to fetch themes with posts" })
  }
}

export default get_themes_with_posts