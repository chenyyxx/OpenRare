import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db";

const follow = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, targetEmail } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        following: {
          connect: {
            email: targetEmail,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default follow;