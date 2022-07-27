import {
    Heading,
    Spacer,
    Box,
    Center,
    Avatar,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    HStack,
    StackDivider,
    Link,
    VStack,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";

export type FullSection = Prisma.SectionGetPayload<{
    include: {
        users: true;
        posts: {
            include: {
                user: true;
                section: true;
                votes: { include: { user: true } };
                _count: true;
            };
        };
        _count: true;
    };
}>;

export default function Section({ section }: { section: FullSection }) {
    const { data: session } = useSession();
    const onFollowClick = async () => {
        console.log(1);

        if (session) {
            const data = {
                email: session?.user.email,
                sectionId: section.id,
            };
            await fetch(`${process.env.NEXTAUTH_URL}/api/follow_section`, {
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
        <Flex w={"full"} justify="space-between">
            <HStack align={"center"} mb={1} spacing={8}>
                <Avatar size={"md"} name={section.name} objectFit={"cover"} />
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                    {section.name}
                </Heading>
            </HStack>
            <HStack spacing={8}>
                <Stack
                    direction={"row"}
                    justify={"center"}
                    spacing={6}
                    divider={<StackDivider borderColor="gray.200" />}
                >
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
                            as={Link}
                            href={"/sections/" + section.id.toString()}
                            style={{ textDecoration: "none" }}
                            _focus={{ boxShadow: "none" }}
                        >
                            Enter
                        </Button>
                    </Box>
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
                            Follow
                        </Button>
                    </Box>
                </HStack>
            </HStack>
        </Flex>
    );
}
