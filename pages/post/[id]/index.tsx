import React from 'react';
import { GetServerSideProps } from 'next'
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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import Nav from "../../../components/nav";
import Post from '../../../components/post';
import LeftSideBar from '../../../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import LargeProfile from '../../../components/large_profile';
import ProfileRightPanel from '../../../components/right_panel';
import LargeSection from '../../../components/large_section';
import sectionsArray from '../../../test_sections';
import { useRouter } from 'next/router'
import PostDetail from '../../../components/post_detail';
import SmallProfile from '../../../components/small_profile';
import Comment from '../../../components/comment';

export default function SectionDetail({post,}: {post: Post}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <VStack minH="full" p={"24px"} spacing={"24px"}>
                <LeftSideBar/>
                {/* <ProfileRightPanel/> */}
            </VStack>
            <VStack w="full" pt="24px" pl="24px" pr="24px" >
                <PostDetail post={post}/>
                {/* <Comment comment={post.comments[0]}/> */}
                {post.comments.map((comment) => (
                        <Comment comment={comment} key={comment.id}/>
                ))}
            </VStack>
            <VStack  minH="full" p={"24px"} spacing={"24px"}>
                <SmallProfile user={post.user}/>
            </VStack>
        </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
    const res = await fetch(`http://localhost:3000/api/get_post/${context.query.id}`)
    const post = await res.json()
    return { props: {post}}
}

