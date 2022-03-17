import React, { ReactNode } from 'react';
import {
  Box,
  useColorModeValue,
  VStack,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Section from '../components/section';
import Post from '../components/post';



export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <VStack>
        <Wrap ml={{ base: 0, md: 60 }} p="4">
          <WrapItem>
            <Section />
          </WrapItem>
          <WrapItem>
            <Section />
          </WrapItem>
        </Wrap>
        <VStack>
          <Post/>
          <Post/>
          <Post/>
        </VStack>
      </VStack>
    </Box>
  );
}