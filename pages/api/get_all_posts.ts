// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db";

const get_all_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        include: {
            user: true,
            section: true,
            votes: {
                include: {
                    user: true,
                }
            },
            _count: {
                select: {comments:true}
            }
        }
    })
    
    res.status(200).json(posts)
}

export default get_all_posts