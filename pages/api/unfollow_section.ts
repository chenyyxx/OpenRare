import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db";

const followSection = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, sectionId } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        sections: {
          disconnect: {
            id: Number(sectionId),
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default followSection;
