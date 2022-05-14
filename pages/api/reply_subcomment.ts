import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import prisma from "../../db";
// const prisma = new PrismaClient()

const get_all_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const subComment = req.body;
    console.log(subComment)
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(500).json({ error: "You have to be logged in." });
    }
    try {
        const newSubComment = await prisma.subComment.create({
            data: {   
                user: {
                    connect: {email: subComment.user.email}
                },
                content: subComment.content,
                parent: {
                    connect: { id : subComment.parentId}
                },
                comment: {
                    connect: {id: subComment.commentId}
                }
            },
        })
        res.status(200).json(newSubComment)
    } catch (e) {
        return res.status(500).json({ error: e });
    }
    
}

export default get_all_posts