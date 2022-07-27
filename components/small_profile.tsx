import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    Divider,
    StackDivider,
    Link,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

export type SmallUser = Prisma.UserGetPayload<{
    include: {
        sections: {
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
        };
        posts: {
            include: {
                user: true;
                section: true;
                votes: { include: { user: true } };
                _count: true;
            };
        };
    };
}>;

export default function SmallProfile({ user }: { user: SmallUser }) {
    return (
        <Center>
            <Box
                w={"full"}
                bg={useColorModeValue("white", "gray.800")}
                rounded={"md"}
                overflow={"hidden"}
                border="1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <Image
                    h={"180px"}
                    w={"full"}
                    src={user.image as string | undefined}
                    objectFit={"cover"}
                    alt="small_profile"
                />

                <Box p={6}>
                    <Stack spacing={0} align={"center"} mb={5}>
                        <Heading
                            fontSize={"2xl"}
                            fontWeight={500}
                            fontFamily={"body"}
                        >
                            {user.name}
                        </Heading>
                    </Stack>

                    <Divider borderColor="gray.200" mb={5} />

                    <Stack direction={"row"} justify={"center"} spacing={6}>
                        <Stack direction={"row"} spacing={4} align={"center"}>
                            <Text fontWeight={600}>{user.sections.length}</Text>
                            <Divider
                                orientation="vertical"
                                borderColor="gray.200"
                            />
                            <Text fontSize={"sm"} color={"gray.500"}>
                                Followed Sections
                            </Text>
                        </Stack>
                        <Button
                            mt={8}
                            rounded={"md"}
                            colorScheme={"teal"}
                            as={Link}
                            href={"/profile"}
                            style={{ textDecoration: "none" }}
                            _focus={{ boxShadow: "none" }}
                        >
                            Profile
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Center>
    );
}
