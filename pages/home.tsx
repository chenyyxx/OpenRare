import React from "react";
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
  Spinner,
} from "@chakra-ui/react";
import SmallProfile from "../components/small_profile";
import Nav from "../components/nav";
import Post from "../components/post";
import LeftSideBar from "../components/left_side_bar";
import { Button } from "@chakra-ui/react";
import SmallSection from "../components/small_section";
import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { SmallUser } from "../components/small_profile";
import { FullPost } from "../components/post";
import useSWR from "swr";
import { fetchData, fetchFlatUserSectionPost } from "../utils/utils";
import Sidebar from "../components/sidebar";

export default function Home() {
  const { data: session, status } = useSession();

  const email = session?.user.email;
  const { data: user, error: userError } = useSWR<SmallUser>(
    `/api/get_full_user?email=${email}`,
    fetchData
  );
  const { data: user_sections_posts_flat, error } = useSWR<FullPost[]>(
    `/api/get_user_sections_posts?email=${email}`,
    fetchFlatUserSectionPost
  );
  if (status === "unauthenticated") {
    signIn();
  }
  return (
    <Box minH="100vh" bg={"gray.100"}>
      <Nav />
      <Sidebar>
        {status === "authenticated" && (
          <Flex justify="center" pt={"78px"}>
            <Box>
              <Wrap justify="left" pt="24px" pl="24px" pr="24px">
                {/* <HStack> */}
                <WrapItem>
                  <Button colorScheme="teal" variant="solid" rounded={20}>
                    My Posts
                  </Button>
                </WrapItem>
                {/* <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Favorites</Button></WrapItem> */}
                {/* <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button></WrapItem> */}
                {/* <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Comments
                  </Button>
                </WrapItem> */}
                {/* <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Messages</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Notifications</Button></WrapItem> */}
              </Wrap>
              <VStack p="24px" minH="full" spacing={"24px"}>
                {user_sections_posts_flat && user_sections_posts_flat.length !== 0 ? (
                  user_sections_posts_flat.map((post) => (
                    <Post post={post} key={post.id} />
                  ))
                ) : (
                  <Box
                    w={"full"}
                    minW="500px"
                    maxW="800px"
                    bg={useColorModeValue("white", "gray.900")}
                    borderColor="gray.200"
                    borderWidth="1px"
                    rounded={"md"}
                    p={6}
                    overflow={"hidden"}
                  >
                    You have no posts
                  </Box>
                )}
              </VStack>
            </Box>
            <VStack
              minH="full"
              p={"24px"}
              spacing={"24px"}
              display={["none", "none", "none", "none", "flex"]}
            >
              {/* <LeftSideBar/> */}
              <Stack
                divider={<StackDivider borderColor="gray.200" />}
                bg={"white"}
                borderRight="1px"
                borderRightColor={"gray.200"}
                w={{ base: "none", md: "320px" }}
                rounded={"md"}
                h="max"
                p={6}
                spacing={"24px"}
              >
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  My Profile
                </Heading>
                {user && <SmallProfile user={user} />}
              </Stack>
              <Stack
                divider={<StackDivider borderColor="gray.200" />}
                bg={"white"}
                borderRight="1px"
                borderRightColor={"gray.200"}
                w={{ base: "none", md: "320px" }}
                rounded={"md"}
                h="max"
                p={6}
                spacing={"24px"}
              >
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  My Sections
                </Heading>
                <VStack minH="full" spacing={"12px"}>
                  {user &&
                    user.sections.map((section) => (
                      <SmallSection section={section} key={section.id} />
                    ))}
                </VStack>
              </Stack>
            </VStack>
          </Flex>
        )}
      </Sidebar>
    </Box>
  );
}
