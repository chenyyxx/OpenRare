import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db";

const unfollow = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, targetEmail } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        following: {
          disconnect: {
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

export default unfollow;
