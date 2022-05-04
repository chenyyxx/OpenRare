This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


# OpenRare

## Motivation

## Project Description

OpenRare is an open source project created with Next.js. OpenRare is a platform/website/forum that aims to help people with rare diseases to connect with each other and help each other. Users of this website are free to share any thoughts, view related informations, provide useful advices and express any feelings by viewing and writing posts and comments in the forum. The website comes with a set of sections that represent different types of rare diseases defined by NORD (National Organization of Rare Diseases). Users can feel free to follow any sections. Users can write posts in the section they followed. We aim to let people in the rare disease community interact and share information with each other by enabling them viewing posts, writing posts and commenting posts. Users can also like and star a post if they think the information of the post is particularly useful. Users can also follow each other to get first handed updates on information and posts they are interested in.

## Tech Stacks
**Frontend**: `Next.js`, `Chakra UI`, `Figma`

This project uses Figma to create a design prototype, and uses Next.js as framework to create the frontend user interface. This project uses Chakra UI to style the components and UI.

**Backend**: `Next-Auth`, `Vercel`, `Next.js`, `AWS RDS (PostgresSQL)`, `Prisma`

This project uses Next.js to create a serverless website. The data of this website is stored in AWS using its PostgresSQL RDS service. This project use Nex-Auth for the management of User authentication and Authorization. The project uses Prisma to handle database query and ORM. The whole website is deployed and hosted on Vercel.
## TODO: V0.1
**Urgent**
1. fix the user authentication and authorization
2. Allow user to register with email and password, add facebook account log in functionality
3. complete the comment feature
4. complete the vote feature
5. complete the star feature
6. complete the api of join section
7. complete the api of follow user
8. complete the sorting of posts by most view, most likes, and time

**Later**
1. Make the rich editor be able to include images and videos (Use draft.js)
2. Replace test sections name with real rare diseases
3. buy a public url endpoint
4. buy a business email endpoint
5. have someone design the logo of the website


## Future Development

### Next Release:
1. Add a functionable autocomplete search bar that allows user to search all the information in the platform including section, posts, and users.
2. Add translation engine to the website to allow user from all around the world to access the website at ease without language barriers
3. Make the UI design responsive and compatible with different mobile devices
4. connect to CMS and content providers to automatically add useful posts, blogs resources and papers to section corresponding to different diseases.

### Future Release:
1. Add DM and chartoom functionality to the website to allow users who follow each other to have a more intimate connections
2. Added recommendation engine to the website to recommend posts to users



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



## For further feature that allows the rich text editor to include images/videos
Refer

https://betterprogramming.pub/how-to-implement-a-rich-text-editor-in-your-react-app-5c64d56ddec7