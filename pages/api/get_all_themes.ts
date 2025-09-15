import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const get_all_themes = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const themes = await prisma.theme.findMany({
      include: {
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
    res.status(200).json(themes)
  } catch (e) {
    console.error("Error fetching themes:", e);
    res.status(500).json({ error: "Failed to fetch themes" })
  }
}

export default get_all_themes