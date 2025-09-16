import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_user_replies = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email } = req.query

        // Validate email parameter
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                error: 'Email parameter is required and must be a string' 
            })
        }

        // First, get the user ID
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true }
        })

        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            })
        }

        // Fetch replies to user's posts (comments on user's posts)
        const postReplies = await prisma.comment.findMany({
            where: {
                post: {
                    userId: user.id
                },
                userId: {
                    not: user.id // Exclude user's own comments
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        // Fetch replies to user's comments (subcomments on user's comments)
        const commentReplies = await prisma.subComment.findMany({
            where: {
                comment: {
                    userId: user.id
                },
                userId: {
                    not: user.id // Exclude user's own subcomments
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                comment: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            }
        })

        // Format the replies data
        const formattedReplies = [
            // Post replies (comments on user's posts)
            ...postReplies.map(reply => ({
                id: reply.id.toString(),
                content: reply.content,
                createdAt: reply.createdAt,
                parentType: 'post' as const,
                parent: {
                    id: reply.post?.id.toString() || '',
                    title: reply.post?.title || ''
                }
            })),
            // Comment replies (subcomments on user's comments)
            ...commentReplies.map(reply => ({
                id: reply.id.toString(),
                content: reply.content,
                createdAt: reply.createdAt,
                parentType: 'comment' as const,
                parent: {
                    id: reply.comment.id.toString(),
                    content: reply.comment.content
                }
            }))
        ]

        // Sort all replies by creation date (newest first)
        formattedReplies.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        res.status(200).json({
            replies: formattedReplies,
            count: formattedReplies.length
        })
    } catch (error) {
        console.error('Error fetching user replies:', error)
        res.status(500).json({ 
            error: 'Internal server error while fetching user replies' 
        })
    }
}

export default get_user_replies