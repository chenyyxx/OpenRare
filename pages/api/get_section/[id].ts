import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const get_all_sections = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id
    const sections = await prisma.section.findMany({
        where : {
            id: Number(id)
        },
        include: {
            users: true,
            posts: {
                include: {
                    user: true,
                    section: true,
                    votes: true,
                    _count: {
                        select: {comments:true}
                    }
                }
            },
        }
    })
    res.status(200).json(sections)
}

export default get_all_sections