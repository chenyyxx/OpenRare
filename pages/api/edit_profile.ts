// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../db";

const edit_profile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { profileEdits } = req.body;
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session)
  console.log("profile", profileEdits)
  if (!session) {
    return res.status(500).json({ error: "You have to be logged in." });
  }
  try {
    const user = await prisma.user.update({
      where: {
        email: profileEdits.user.email,
      },
      data: {
        name: profileEdits.name,
        description: profileEdits.description,
      },
    });
    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default edit_profile;
