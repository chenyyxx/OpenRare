import {
  Heading,
  Avatar,
  Box,
  Text,
  Stack,
  Button,
  HStack,
  StackDivider,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";

export type FullRareDisease = Prisma.DiseaseGetPayload<{
  include: {
    users: true;
    posts: {
      include: {
        user: true;
        disease: true;
        votes: { include: { user: true } };
        _count: true;
      };
    };
    _count: true;
  };
}>;

export default function RareDisease({ disease }: { disease: FullRareDisease }) {
  const { data: session } = useSession();
  const onFollowClick = async () => {
    //TODO: refactor this to the top level
    if (session) {
      const data = {
        email: session?.user.email,
        diseaseId: disease.id,
      };
      await fetch(`/api/follow_disease`, {
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
    <Stack
      w={"full"}
      direction={["column", "column", "column", "row"]}
      justify="space-between"
    >
      <HStack align={"center"} mb={1} spacing={8}>
        <Avatar size={"md"} name={disease.name} objectFit={"cover"} />
        <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
          {disease.name}
        </Heading>
      </HStack>
      <HStack spacing={8} justify="space-between">
        <Stack
          direction={"row"}
          justify={"center"}
          spacing={6}
          divider={<StackDivider borderColor="gray.300" />}
        >
          <HStack spacing={2} align={"center"}>
            <Text fontSize={"sm"} color={"gray.500"}>
              Posts
            </Text>
            <Text fontWeight={600}>{disease.posts.length}</Text>
          </HStack>
          <HStack spacing={2} align={"center"}>
            <Text fontSize={"sm"} color={"gray.500"}>
              Followers
            </Text>
            <Text fontWeight={600}>{disease.users.length}</Text>
          </HStack>
        </Stack>
        <HStack justify={"center"}>
          <Box>
            <Button
              w={"full"}
              color={"white"}
              rounded={"md"}
              colorScheme={"teal"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={onFollowClick}
            >
              Follow Rare Disease
            </Button>
          </Box>
        </HStack>
      </HStack>
    </Stack>
  );
}