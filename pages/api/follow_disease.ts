import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db";

const followDisease = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, diseaseId } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        diseases: {
          connect: {
            id: Number(diseaseId),
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default followDisease;