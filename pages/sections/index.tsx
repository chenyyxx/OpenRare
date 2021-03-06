import React from "react";
import {
    Box,
    useColorModeValue,
    Wrap,
    WrapItem,
    Flex,
    VStack,
    StackDivider,
} from "@chakra-ui/react";
import Nav from "../../components/nav";
import Section from "../../components/section";
import test_sections from "../../test_sections.json";
import LeftSideBar from "../../components/left_side_bar";
import { GetServerSideProps, GetStaticPaths } from "next";
import { FullSection } from "../../components/section";

export default function SectionHome({ sections }: { sections: FullSection[] }) {
    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <Nav />
            <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
                <Box h="max" p={"24px"} pos="sticky" top={"64px"}>
                    <LeftSideBar />
                </Box>
                <VStack
                    p="24px"
                    mt='24px'
                    divider={<StackDivider borderColor="gray.200" />}
                    spacing={4}
                    align="stretch"
                    bg={useColorModeValue("white", "gray.800")}
                    rounded={'md'}
                >
                    {sections.map((section) => (
                        <Section section={section} key={section.id} />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get_all_sections`);
    const sections = await res.json();
    return { props: { sections } };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//     // ...
// }
