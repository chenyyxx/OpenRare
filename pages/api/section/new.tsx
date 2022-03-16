
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma'

const handler = async (
    req: NextApiRequest, 
    res: NextApiResponse) => {
    try {
    // create the post with also an upvote as default
        const newSection = await prisma.section.create({
            data: {
                name: "test_section_4",
            },
        });
        // return the post
        return res.json(newSection);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
};

export default handler;