import { Divider } from "@chakra-ui/react";
import useRef from "react";
import { useRouter } from "next/router";
import {
  Heading,
  Spacer,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Link,
  Button,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";

import { FullSection } from "./section";
import { useSession } from "next-auth/react";

export default function LargeSection({ section }: { section: FullSection }) {
  // console.log()
  // const section = section.title
  const sectionTitle = section.name;
  const sectionId = section.id;
  const { data: session } = useSession();
  const onFollowClick = async () => {
      //TODO: refactor this to the top level
      // and make sure it reset itself
      if (session) {
          const data = {
              email: session?.user.email,
              sectionId: section.id,
          };
          await fetch(`/api/follow_section`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });
      } else {
          // TODO: redirect to login
      }
  };
  return (
    <Center>
      <Box
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Image
          h={"240px"}
          w={"full"}
          src={section.picture}
          objectFit={"cover"}
          alt=".section_picture"
        />

        <Stack px={48} py={6} spacing={4}>
          <Stack spacing={0} align={"center"} mb={1}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {section.name}
            </Heading>
            {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
          </Stack>

          <Stack direction={"row"} justify={"center"} spacing={6}>
            <HStack spacing={2} align={"center"}>
              <Text fontSize={"sm"} color={"gray.500"}>
                Posts
              </Text>
              <Text fontWeight={600}>{section.posts.length}</Text>
            </HStack>
            <HStack spacing={2} align={"center"}>
              <Text fontSize={"sm"} color={"gray.500"}>
                Followers
              </Text>
              <Text fontWeight={600}>{section.users.length}</Text>
            </HStack>
          </Stack>
          <Divider />
          <Text>{section.description}</Text>
          <HStack justify={"space-around"}>
            <Box>
              <Button
                w={"full"}
                mt={2}
                color={"white"}
                rounded={"md"}
                colorScheme={"teal"}
                as={Link}
                href={`/sections/${sectionId}/new`}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                Create Post
              </Button>
            </Box>
            <Box>
              <Button
                w={"full"}
                mt={2}
                color={"white"}
                rounded={"md"}
                colorScheme={"teal"}
                onClick={onFollowClick}
              >
                Follow Section
              </Button>
            </Box>
            <Box>
              <Button
                w={"full"}
                mt={2}
                color={"white"}
                rounded={"md"}
                colorScheme={"teal"}
                as={Link}
                href={section.definition}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                View Definition
              </Button>
            </Box>
          </HStack>
        </Stack>
      </Box>
    </Center>
  );
}
