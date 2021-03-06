
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from "../../../db";

const get_post = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id
    const post = await prisma.post.findFirst({
        where : {
            id: Number(id)
        },
        include: {
            section: true,
            user: {
                include: {
                    sections: true
                }
            },
            comments: {
                include: {
                    user: true,
                    subComments: {
                        include: {
                            user: true,
                            parent: {
                                include: {
                                    user: true,
                                }
                            }
                        }
                    }
                }
            },
            votes: true,
        }
    })
    res.status(200).json(post)
}

export default get_post