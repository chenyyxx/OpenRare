import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_user_posts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email } = req.query

        // Validate email parameter
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                error: 'Email parameter is required and must be a string' 
            })
        }

        // Fetch user's posts with all required information
        const userPosts = await prisma.post.findMany({
            where: {
                user: {
                    email: email
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true,
                disease: true,
                theme: true,
                votes: true,
                _count: {
                    select: { comments: true }
                }
            }
        })

        res.status(200).json({
            posts: userPosts,
            count: userPosts.length
        })
    } catch (error) {
        console.error('Error fetching user posts:', error)
        res.status(500).json({ 
            error: 'Internal server error while fetching user posts' 
        })
    }
}

export default get_user_posts