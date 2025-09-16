import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_user_favorites = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email } = req.query

        // Validate email parameter
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                error: 'Email parameter is required and must be a string' 
            })
        }

        // Fetch posts that the user has upvoted
        const userFavorites = await prisma.post.findMany({
            where: {
                votes: {
                    some: {
                        user: {
                            email: email
                        },
                        voteType: 'UPVOTE'
                    }
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
            posts: userFavorites,
            count: userFavorites.length
        })
    } catch (error) {
        console.error('Error fetching user favorites:', error)
        res.status(500).json({ 
            error: 'Internal server error while fetching user favorites' 
        })
    }
}

export default get_user_favorites