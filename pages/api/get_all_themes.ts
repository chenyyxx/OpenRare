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
    })

    // Define custom theme order: Personal Stories, Research & Information, Help & Support, Events
    const themeOrder = [
      'Personal Stories',
      'Research & Information', 
      'Help & Support',
      'Events'
    ];

    // Sort themes according to custom order
    const sortedThemes = themes.sort((a, b) => {
      const indexA = themeOrder.indexOf(a.name);
      const indexB = themeOrder.indexOf(b.name);
      
      // If theme not found in order array, put it at the end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });

    res.status(200).json(sortedThemes)
  } catch (e) {
    console.error("Error fetching themes:", e);
    res.status(500).json({ error: "Failed to fetch themes" })
  }
}

export default get_all_themes