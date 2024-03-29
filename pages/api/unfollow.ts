import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db";

const unfollow = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, targetId } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        following: {
          disconnect: {
            id: targetId,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default unfollow;
