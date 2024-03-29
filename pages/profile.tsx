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
  SimpleGrid,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import Nav from "../components/nav";
import Post from "../components/post";
import LeftSideBar from "../components/left_side_bar";
import { Button } from "@chakra-ui/react";
import LargeProfile from "../components/large_profile";
import ProfileRightPanel from "../components/right_panel";
import { getSession, signIn, useSession } from "next-auth/react";
import { SmallUser } from "../components/small_profile";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import Sidebar from "../components/sidebar";

export default function Profile() {
  const { data: session, status } = useSession();
  const email = session?.user.email;
  const { data: user, error } = useSWR<SmallUser>(
    `/api/get_full_user?email=${email}`,
    fetchData
  );
  if (status === "unauthenticated") {
    signIn();
  }
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Sidebar>
        {status === "authenticated" && (
          <Flex justify="center" pt={"78px"}>
            <Box>
              <Box pt="24px" pl="24px" pr="24px" maxW="1200px">
                {session && user && <LargeProfile user={user} />}
              </Box>
              <Wrap justify="center" pt="24px" pl="24px" pr="24px">
                {/* <HStack> */}
                <WrapItem>
                  <Button colorScheme="teal" variant="solid" rounded={20}>
                    My Posts
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Favorites
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Upvoted
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Comments
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Messages
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button colorScheme="teal" variant="outline" rounded={20}>
                    Notifications
                  </Button>
                </WrapItem>
              </Wrap>
              <SimpleGrid p="12px" columns={[1,1,1,1,2]} spacing='12px' maxW='1200px'>
                {user &&
                  user.posts.map((post) => <Post post={post} key={post.id} />)}
              </SimpleGrid>
            </Box>
          </Flex>
        )}
      </Sidebar>
    </Box>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Fetch data from external API
//   const session = await getSession(context);
//   const email = session?.user.email; //use SWR to handle
//   // console.log(email)
//   const res = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/get_full_user?email=${email}`
//   );
//   const user = await res.json();
//   // Pass data to the page via props
//   return { props: { user } };
// };
