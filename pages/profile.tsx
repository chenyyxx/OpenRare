import React from 'react';
import {
  Box,
  useColorModeValue,
  VStack,
  Flex,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Post from '../components/post';
import LeftSideBar from '../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import LargeProfile from '../components/large_profile';
import ProfileRightPanel from '../components/profile_right_panel';

export default function Profile({
  posts,
}: {
  posts: Post[]
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <VStack minH="full" p={"24px"} spacing={"24px"}>
                <LeftSideBar/>
                <ProfileRightPanel/>
            </VStack>
            <Box>
                <Box pt="24px" pl="24px" pr="24px" >
                    <LargeProfile/>
                </Box>
                <Wrap pt="24px" pl="24px" pr="24px">
                    <WrapItem><Button colorScheme='teal' variant='solid' rounded={20}>Home</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>My Sections</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>My Posts</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Starred Posts</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Comments</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Messages</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Notifications</Button></WrapItem>
                </Wrap>
                <VStack p="24px" minH="full" spacing={"24px"}>
                    {posts.map((post) => (
                        <Post post={post} key={post.id}/>
                        )
                    )}
                </VStack>
              
            </Box>
        </Flex>
    </Box>
  );
}

export async function getStaticProps() {
  // Fetch data from external API
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {mode: "cors"})
  const posts = await res.json()

  // Pass data to the page via props
  return { props: { posts } }
}