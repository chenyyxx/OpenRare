// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/react"
import { authOptions } from "./auth/[...nextauth]"
import prisma from "../../db";

const create_post = async (req: NextApiRequest, res: NextApiResponse) => {
    const { post } = req.body;
    const session = await getServerSession(req, res, authOptions)
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

export default create_post