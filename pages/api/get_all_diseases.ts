import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const get_all_diseases = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        users: true,
        posts: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    res.status(200).json(diseases)
  } catch (e) {
    console.error("Error fetching diseases:", e);
    res.status(500).json({ error: "Failed to fetch diseases" })
  }
}

export default get_all_diseases