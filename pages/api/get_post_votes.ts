import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"

const prisma = new PrismaClient()

const get_post_votes = async (req: NextApiRequest, res: NextApiResponse) => {
    const {postId} = req.query
    console.log(postId)
    const votes = await prisma.vote.findMany({
        where : { postId : Number(postId)},
        include : {
            user: true
        }
    })
    res.status(200).json(votes)
}

export default get_post_votes