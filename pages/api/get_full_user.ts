import { PrismaClient } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../db";

const get_full_user = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;
  const full_user = await prisma.user.findFirst({
    where: { email: String(email) },
    include: {
      posts: {
        include: {
          user: true,
          section: true,
          votes: true,
          _count: {
            select: { comments: true },
          },
        },
      },
      sections: {
        include: {
          _count: {
            select: { posts: true, users: true },
          },
        },
      },
      votes: true,
      comments: true,
      followedBy: true,
      following: true,
    },
  });
  // console.log(full_user)
  res.status(200).json(full_user);
};

export default get_full_user;
