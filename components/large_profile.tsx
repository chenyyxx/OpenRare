import React, { useEffect, useState, useRef } from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  HStack,
  Image,
  VStack,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { SmallUser } from "./small_profile";
import { SimpleGrid } from "@chakra-ui/react";

export default function LargeProfile({ user }: { user: SmallUser }) {
  const parentRef = useRef(null);
  const [leftColWidth, setLeftColWidth] = useState(0);

  // This function calculates width of the leftCol
  const getLeftColWidth = () => {
    let geClientWidth = (el: HTMLElement) => {
      return el.clientWidth;
    };
    if (parentRef.current) {
      const newWidth = geClientWidth(parentRef.current);
      setLeftColWidth(newWidth);
    }
  };
  // Get 'width' after the initial render
  useEffect(() => {
    getLeftColWidth();
  }, []);

  // Update 'width' when the window resizes
  useEffect(() => {
    window.addEventListener("resize", getLeftColWidth);
  }, []);

  return (
    <Center>
      <VStack
        w={"full"}
        maxW={['800px','800px','800px','800px','1200px']}
        bg={useColorModeValue("white", "gray.800")}
        rounded={"md"}
      >
        <SimpleGrid columns={[1, 1, 1, 1 ,2]}>
          <VStack>
            <VStack
              p="24px"
              spacing="24px"
              // top="140px"
              // left={(leftColWidth / 2 - 102).toString() + "px"}
            >
              {/* <Flex justify={'center'} mt={-32}> */}
              <Avatar
                boxSize={"204px"}
                src={`${user?.image}`}
                css={{
                  border: "2px solid white",
                }}
              />
            </VStack>

            <Box w="full" px={6} pb={6}>
              <Stack direction={"row"} justify={"center"} spacing={6}>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>
                    {user.posts ? user.posts.length : 0}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Posts
                  </Text>
                </Stack>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>
                    {user.followedBy ? user.followedBy.length : 0}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Followers
                  </Text>
                </Stack>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>
                    {user.following ? user.following.length : 0}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Following
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </VStack>
          <Stack
            spacing={4}
            align={"start"}
            h="full"
            pl={["24px", "24px", "24px", "24px" , "0px"]}
            pr="64px"
            py="36px"
          >
            <HStack w='full' justify={'space-between'}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                {user.name}
              </Heading>
              <Button  colorScheme="teal" variant="solid" rounded={"md"}>
                Edit Profile
              </Button>
            </HStack>
            <Text>{user.description}</Text>
          </Stack>
        </SimpleGrid>
      </VStack>
    </Center>
  );
}
