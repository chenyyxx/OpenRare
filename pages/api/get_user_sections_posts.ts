import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"

const prisma = new PrismaClient()

const get_full_user = async (req: NextApiRequest, res: NextApiResponse) => {
    const {email} = req.query
    const full_user = await prisma.user.findFirst({
        where : { email : String(email)},
        select: {
            sections: {
                select: {
                    posts: {
                        include: {
                            user: true,
                            section: true,
                            votes: true,
                            _count: {
                                select: {comments:true}
                            }
                        }
                    }
                }
            }
        }
    })
    res.status(200).json(full_user)
}

export default get_full_user