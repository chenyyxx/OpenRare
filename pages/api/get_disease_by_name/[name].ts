import { PrismaClient } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const get_disease_by_name = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
    const name = req.query.name
    const disease = await prisma.disease.findFirst({
    where: {
      name: name as string,
    },
    include: {
      users: true,
      posts: {
        include: {
          user: true,
          disease: true,
          votes: true,
          _count: {
            select: { comments: true },
          },
        },
      },
    },
  });
  res.status(200).json(disease);
};

export default get_disease_by_name;