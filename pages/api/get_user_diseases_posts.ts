import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import prisma from "../../db"

const get_user_diseases_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    const {email} = req.query
    const full_user = await prisma.user.findFirst({
        where : { email : String(email)},
        select: {
            diseases: {
                select: {
                    posts: {
                        include: {
                            user: true,
                            disease: true,
                            theme: true,
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

export default get_user_diseases_posts