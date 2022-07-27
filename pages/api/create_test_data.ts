import { PrismaClient } from '@prisma/client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Post from '../../components/post';
import Section from '../../components/section';


const prisma = new PrismaClient()

const create_test_data = async (req: NextApiRequest, res: NextApiResponse) => {    
    // use `prisma` in your application to read and write data in your DB

    // create test sections
    const newSections = await prisma.section.createMany({
        data: [
            {
                name: "test section 1",
                description: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
                picture: "https://images.unsplash.com/photo-1628699265231-97b2a3e7b9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                definition: "google.com"
            },
            {
                name: "test section 2",
                description: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
                picture: "https://images.unsplash.com/photo-1628699265231-97b2a3e7b9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                definition: "google.com"
            },
            {
                name: "test section 3",
                description: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
                picture: "https://images.unsplash.com/photo-1628699265231-97b2a3e7b9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                definition: "google.com"
            },
            {
                name: "test section 4",
                description: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
                picture: "https://images.unsplash.com/photo-1628699265231-97b2a3e7b9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                definition: "google.com"
            },
        ]
    })
    
    // create a new post
    const newPosts = await prisma.post.create({
        data: {   
            user: {
                connect: {email: "chenyx.eric2013@gmail.com"}
            },
            title: "test post 5",
            content: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
            section: {
                connect: { name : "test section 3"}
            }
        },
    })

    // const updateUsers = await prisma.user.update({
    //     where: {email : "chenyx.eric2013@gmail.com"},
    //     data: {
    //         sections: {
    //             create: [
    //                 {
    //                     JoinedAt: new Date(),
    //                     section: {
    //                         connect: {name : "test section 1"}
    //                     }
    //                 },
    //                 {
    //                     JoinedAt: new Date(),
    //                     section: {
    //                         connect: {name : "test section 2"}
    //                     }
    //                 },
    //                 {
    //                     JoinedAt: new Date(),
    //                     section: {
    //                         connect: {name : "test section 3"}
    //                     }
    //                 },
    //                 {
    //                     JoinedAt: new Date(),
    //                     section: {
    //                         connect: {name : "test section 4"}
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // })
    
    // const sections = await prisma.section.findMany()
    const posts = await prisma.post.findMany()
    res.status(200).json(posts)
}

export default create_test_data
