import React, { useEffect, useState, useRef } from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  HStack,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { SmallUser } from "./small_profile";

export default function LargeProfile({user}: {user: SmallUser}) {
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
      <Box
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        pos="relative"
        overflow={"hidden"}
      >
        <Image
          h={"240px"}
          w={"full"}
          src={
            `${user?.backGroundImage}`
          }
          objectFit={"cover"}
          alt="profile_image"
        />
        <HStack>
          <Box w={"40%"} ref={parentRef}>
            <Flex
              pos="absolute"
              top="140px"
              left={(leftColWidth / 2 - 102).toString() + "px"}
            >
              {/* <Flex justify={'center'} mt={-32}> */}
              <Avatar
                boxSize={"204px"}
                src={
                  `${user?.image}`
                }
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>

            <Box pt={24} px={6} pb={6}>
              <Stack direction={"row"} justify={"center"} spacing={6}>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>{user.posts ? user.posts.length : 0}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Posts
                  </Text>
                </Stack>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>{user.followedBy ? user.followedBy.length : 0}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Followers
                  </Text>
                </Stack>
                <Stack w={"15%"} spacing={0} align={"center"}>
                  <Text fontWeight={600}>{user.following ? user.following.length : 0}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Following
                  </Text>
                </Stack>
              </Stack>

              <Button
                colorScheme="teal"
                variant="solid"
                rounded={"md"}
                pos="absolute"
                top="264px"
                right="64px"
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
          <Box w={"60%"}>
            <Stack spacing={4} align={"start"} h="full" pr="64px" py="36px">
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                 {user.name}
              </Heading>
              <Text>
                {user.description}
              </Text>
            </Stack>
          </Box>
        </HStack>
      </Box>
    </Center>
  );
}
