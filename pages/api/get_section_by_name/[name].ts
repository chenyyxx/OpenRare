import { PrismaClient } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const get_section_by_name = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
    const name = req.query.name
    const sections = await prisma.section.findFirst({
    where: {
      name: name as string,
    },
    include: {
      users: true,
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
    },
  });
  res.status(200).json(sections);
};

export default get_section_by_name;
