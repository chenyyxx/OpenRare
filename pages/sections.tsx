import React from 'react';
import {
  Box,
  useColorModeValue,
  Wrap, WrapItem, Flex
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Section from '../components/section';
import test_sections from '../test_sections.json'
import LeftSideBar from '../components/left_side_bar';


export default function Sections() {
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <Nav/>
            <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
                <Box minH="full" p={"24px"} >
                    <LeftSideBar/>
                </Box>
                <Box>
                    <Wrap 
                        p="24px"
                        minH="full"
                        spacing="24px"
                    >
                        {test_sections.map((section) => (
                            <WrapItem key={section.id}>
                                <Section section={section} key={section.id} />
                            </WrapItem>
                            )
                        )}
                    </Wrap>
                </Box>
                
            </Flex>
        </Box>
    );
}

// export async function getStaticProps() {
//   // Fetch data from external API
//   const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {mode: "cors"})
//   const posts = await res.json()
//   // Pass data to the page via props
//   return { props: { sections } }
// }