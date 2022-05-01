import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import prisma from "../../db";
// const prisma = new PrismaClient()

const get_all_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    const { post } = req.body;
    const session = await getSession({ req });
    // console.log(session)
    if (!session) {
        return res.status(500).json({ error: "You have to be logged in." });
    }
    try {
        const newPost = await prisma.post.create({
            data: {   
                user: {
                    connect: {email: post.user.email}
                },
                title: post.title,
                content: post.content,
                section: {
                    connect: { id : post.sectionId}
                }
            },
        })
        res.status(200).json(newPost)
    } catch (e) {
        return res.status(500).json({ error: e });
    }
    
}

export default get_all_posts