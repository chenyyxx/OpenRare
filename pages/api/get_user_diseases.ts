import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../db"

const get_user_diseases = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.query
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    try {
        const user = await prisma.user.findFirst({
            where: { email: String(email) },
            select: {
                diseases: {
                    select: {
                        id: true,
                        name: true,
                        _count: {
                            select: {
                                posts: true,
                                users: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json(user.diseases)
    } catch (error) {
        console.error('Error fetching user diseases:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export default get_user_diseases