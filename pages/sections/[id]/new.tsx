import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Flex,
  HStack,
  Stack,
  useToast,
} from "@chakra-ui/react";

import RichTextEditor from "../../../components/RichText";

import { useState } from "react";

import Nav from "../../../components/nav";
import LeftSideBar from "../../../components/left_side_bar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function EditPost() {
  const [content, setCotent] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const toast = useToast();

  const handleNewPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (title.trim() === "") {
      toast({
        title: "Title Cannot be Empty",
        status: "warning",
        isClosable: true,
      });
    } else {
      // create a new post locally
      const newPost = {
        title: title,
        content: content,
        sectionId: Number(id),
        user: session?.user,
      };
      // api request
      await fetch("/api/create_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post: newPost }),
      });
      router.push(`/sections/${id}`);
    }
  };
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Nav />
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
        <Box minH="full" p={"24px"}>
          <LeftSideBar />
        </Box>
        <Box w="full" p="24px" minH="full">
          <Box bg="white" rounded={"md"}>
            <FormControl p="24px">
              <Stack spacing={"12px"}>
                <FormLabel htmlFor="title">Create Your Post</FormLabel>
                <Input
                  id="title"
                  type="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
                <Box rounded={"md"}>
                  <RichTextEditor
                    controls={[
                      ["bold", "italic", "underline", "link"],
                      ["unorderedList", "h1", "h2", "h3"],
                      ["sup", "sub"],
                      ["alignLeft", "alignCenter", "alignRight"],
                    ]}
                    styles={{
                      root: {
                        borderColor: "#E2E8F0",
                        borderRadius: "0.375rem",
                        minHeight: "200px",
                      },
                      toolbar: { borderColor: "#E2E8F0" },
                    }}
                    value={content}
                    onChange={setCotent}
                  />
                </Box>
                <HStack justify={"end"}>
                  <Box>
                    <Button
                      w={"full"}
                      mt={2}
                      color={"white"}
                      rounded={"md"}
                      colorScheme={"teal"}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      style={{ textDecoration: "none" }}
                      _focus={{ boxShadow: "none" }}
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.preventDefault();
                        router.back();
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      onClick={handleNewPost}
                      w={"full"}
                      mt={2}
                      color={"white"}
                      rounded={"md"}
                      colorScheme={"teal"}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      style={{ textDecoration: "none" }}
                      _focus={{ boxShadow: "none" }}
                    >
                      Create
                    </Button>
                  </Box>
                </HStack>
              </Stack>
            </FormControl>
            {/* </form> */}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
