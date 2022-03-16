import React, { ReactNode } from 'react';
import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import Nav from "../components/nav";




export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        hello
      </Box>
    </Box>
  );
}