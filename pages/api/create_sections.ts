import { PrismaClient } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sections from "../../NORD_LIST/rare_disease_list.json";

const prisma = new PrismaClient();

const data = sections.map((s) => ({
    name: s.name,
    description: s.definition,
    picture:
        "https://images.unsplash.com/photo-1628699265231-97b2a3e7b9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    definition: s.link,
}));

const create_test_data = async (req: NextApiRequest, res: NextApiResponse) => {
    const newSections = await prisma.section.createMany({
        data: data
    });

    // const posts = await prisma.post.findMany()
    res.status(200).json(newSections);
};

export default create_test_data;
