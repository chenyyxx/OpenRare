import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/react"
import { authOptions } from "./auth/[...nextauth]"
import prisma from "../../db";
// const prisma = new PrismaClient()

const get_all_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const comment = req.body;
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
        return res.status(500).json({ error: "You have to be logged in." });
    }
    try {
        const newComment = await prisma.comment.create({
            data: {   
                user: {
                    connect: {email: comment.user.email}
                },
                content: comment.content,
                post: {
                    connect: { id : comment.postId}
                }
            },
        })
        res.status(200).json(newComment)
    } catch (e) {
        return res.status(500).json({ error: e });
    }
    
}

export default get_all_posts