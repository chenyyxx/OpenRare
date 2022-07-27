// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../db";
// const prisma = new PrismaClient()

const vote = async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    if (method == "POST") {
        const user_vote = req.body;
        console.log(user_vote);
        const session = await getSession({ req });

        if (!session) {
            return res.status(500).json({ error: "You have to be logged in." });
        }
        try {
            // find all user votes
            const votes = await prisma.vote.findMany({
                where: {
                    user: {
                        email: user_vote.user.email,
                    },
                },
            });
            // check if the user has voted on this post
            const hasVoted = votes.find(
                (vote) => vote.postId === user_vote.postId
            );
            console.log("has the user voted: ", hasVoted);
            // console.log(user_vote.user.id)
            if (hasVoted) {
                if (hasVoted.voteType != user_vote.voteType) {
                    const updateVote = await prisma.vote.update({
                        where: {
                            id: Number(hasVoted.id),
                        },
                        data: {
                            voteType: user_vote.voteType,
                        },
                    });
                    console.log("updated vote", updateVote);
                    res.status(200).json(updateVote);
                } else {
                    const deleteVote = await prisma.vote.delete({
                        where: {
                            id: Number(hasVoted.id),
                        },
                    });
                    console.log("deleted vote", deleteVote);
                    res.status(200).json(deleteVote);
                }
            } else {
                const createVote = await prisma.vote.create({
                    data: {
                        voteType: user_vote.voteType,
                        post: {
                            connect: {
                                id: Number(user_vote.postId),
                            },
                        },
                        user: {
                            connect: {
                                email: user_vote.user.email,
                            },
                        },
                    },
                });
                console.log("created vote", createVote);
                res.status(200).json(createVote);
            }
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    } else {
        const { postId } = req.query;
        console.log(postId);
        const votes = await prisma.vote.findMany({
            where: { postId: Number(postId) },
            include: {
                user: true,
            },
        });
        res.status(200).json(votes);
    }
};

export default vote;
