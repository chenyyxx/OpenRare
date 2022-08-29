import React from "react";
import { Box, Flex, VStack, StackDivider, Spinner } from "@chakra-ui/react";
import Nav from "../../components/nav";
import Section from "../../components/section";
import LeftSideBar from "../../components/left_side_bar";
import { FullSection } from "../../components/section";
import useSWR from "swr";
import { fetchData } from "../../utils/utils";
import { useSections } from "../create_post";

export default function SectionHome() {
  const {sections, isLoading, isError} = useSections();

  if (isError) return <div>Failed to load</div>;
  return (
    <Box minH="100vh" bg={"gray.100"}>
      <Nav />
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
        <Box h="max" p={"24px"} pos="sticky" top={"64px"}>
          <LeftSideBar />
        </Box>
        <VStack
          p="24px"
          mt="24px"
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
          bg={"white"}
          rounded={"md"}
        >
          {!isLoading && sections ? (
            sections.map((section) => (
              <Section section={section} key={section.id} />
            ))
          ) : (
            <div>
              <Spinner />
              <span>Loading...</span>
            </div>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}
