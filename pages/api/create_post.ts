// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../db";

const create_post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { post } = req.body;
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(500).json({ error: "You have to be logged in." });
  }

  // Validate required fields
  if (!post.title || post.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!post.content || post.content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }
  if (!post.themeId || post.themeId.trim() === "") {
    return res.status(400).json({ error: "Theme selection is required" });
  }
  if (!post.diseaseId) {
    return res.status(400).json({ error: "Disease selection is required" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        user: {
          connect: { email: post.user.email },
        },
        title: post.title.trim(),
        content: post.content.trim(),
        theme: {
          connect: { id: post.themeId },
        },
        disease: {
          connect: { id: post.diseaseId },
        },
      },
      include: {
        theme: true,
        disease: true,
        user: true,
      },
    });
    res.status(200).json(newPost);
  } catch (e) {
    console.error("Error creating post:", e);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

export default create_post;
