import React from 'react';
import {
  Box,
  useColorModeValue,
  VStack,
  HStack,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Heading,
  Text,
  Stack,
  StackDivider,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import SmallProfile from '../components/small_profile';
import Nav from "../components/nav";
import Post from '../components/post';
import LeftSideBar from '../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import LargeProfile from '../components/large_profile';
import ProfileRightPanel from '../components/right_panel';
import test_sections from '../test_sections.json'
import SmallSection from '../components/small_section';
import { GetServerSideProps } from 'next'
import { getSession } from "next-auth/react"
import { SmallUser } from '../components/small_profile';
import {FullPost} from '../components/post'

type AppProps = {
  user: SmallUser,
  user_sections_posts_flat: FullPost[],
}

export default function Home({
  user, user_sections_posts_flat
}:AppProps) {
  // console.log(user_sections_posts_flat)
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <VStack 
              h="max"
              p={"24px"} 
              spacing={"24px"}        
              pos="sticky"
              top={"64px"}
            >
                <LeftSideBar/>
                {/* <ProfileRightPanel/> */}
            </VStack>
            <Box>
                <Wrap justify="center" pt="24px" pl="24px" pr="24px">
                  {/* <HStack> */}
                  <WrapItem><Button colorScheme='teal' variant='solid' rounded={20}>My Posts</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Favorites</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Comments</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Messages</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Notifications</Button></WrapItem>
                </Wrap>
                <VStack p="24px" minH="full" spacing={"24px"}>
                    {user_sections_posts_flat.map((post) => (
                        <Post post={post} key={post.id}/>
                        )
                    )}
                </VStack>
              
            </Box>
            <VStack minH="full" p={"24px"} spacing={"24px"}>
                {/* <LeftSideBar/> */}
                <Stack divider={<StackDivider borderColor='gray.200' />}
                  bg={useColorModeValue('white', 'gray.900')}
                  borderRight="1px"
                  borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                  w={{ base: 'none', md: '320px' }}
                  rounded={'md'}
                  h="max"
                  p={6}
                  spacing={"24px"}
                >
                  <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>My Profile</Heading>
                  <SmallProfile user={user}/>
                </Stack>
                <Stack divider={<StackDivider borderColor='gray.200' />}
                  bg={useColorModeValue('white', 'gray.900')}
                  borderRight="1px"
                  borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                  w={{ base: 'none', md: '320px' }}
                  rounded={'md'}
                  h="max"
                  p={6}
                  spacing={"24px"}
                >
                  <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>My Sections</Heading>
                  <VStack minH="full" spacing={"12px"}>
                    {user.sections.map((section) => (
                        <SmallSection section={section} key={section.id} />
                        )
                    )}
                  </VStack>
                </Stack>
            </VStack>
        </Flex>
    </Box>
  );
}


// May be consider using client side rendering here instead of ssr
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const session = await getSession(context)
  const email = session?.user.email //use SWR to handle
  const res_full_user = await fetch(`${process.env.NEXTAUTH_URL}/api/get_full_user?email=${email}`)
  const res_user_sections_posts = await fetch(`${process.env.NEXTAUTH_URL}/api/get_user_sections_posts?email=${email}`)
  const user = await res_full_user.json()
  const user_sections_posts = await res_user_sections_posts.json()
  // console.log(user_sections_posts.sections)
  const user_sections_posts_flat = []
  for(let i = 0; i < user_sections_posts.sections.length; i++){
    for(let j = 0; j < user_sections_posts.sections[i].posts.length; j++){
      user_sections_posts_flat.push(user_sections_posts.sections[i].posts[j])
    }
  }
  // console.log(user_sections_posts_flat)
  // Pass data to the page via props
  return { props: { user,  user_sections_posts_flat} }
}