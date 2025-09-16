import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_user_comments = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email } = req.query

        // Validate email parameter
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                error: 'Email parameter is required and must be a string' 
            })
        }

        // Fetch user's comments with post context
        const userComments = await prisma.comment.findMany({
            where: {
                user: {
                    email: email
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                        disease: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        // Transform the data to match the expected format
        const formattedComments = userComments.map(comment => ({
            id: comment.id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            post: {
                id: comment.post?.id.toString() || '',
                title: comment.post?.title || '',
                disease: {
                    name: comment.post?.disease?.name || ''
                }
            }
        }))

        res.status(200).json({
            comments: formattedComments,
            count: formattedComments.length
        })
    } catch (error) {
        console.error('Error fetching user comments:', error)
        res.status(500).json({ 
            error: 'Internal server error while fetching user comments' 
        })
    }
}

export default get_user_comments