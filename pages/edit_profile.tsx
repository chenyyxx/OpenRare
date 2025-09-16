import React, { useEffect, useState, useRef } from "react";
import {
  FormControl,
  FormLabel,
  Box,
  useColorModeValue,
  Input,
  Stack,
  Flex,
  Button,
  HStack,
  useToast,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import Nav from "../components/nav";
import Sidebar from "../components/sidebar";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Move useColorModeValue to top level
  const bgColor = useColorModeValue("gray.100", "gray.900");

  const handleEditProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (name.trim() === "") {
      toast({
        title: "Name Cannot be Empty",
        status: "warning",
        isClosable: true,
      });
    } else {
      // create a new editProfile locally
      const newProfileEdits = {
        name: name,
        description: description,
        user: session?.user,
      };
      // api request
      await fetch("/api/edit_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileEdits: newProfileEdits }),
      });
      router.push(`/edit_profile`);
    }
  };

  // Handle loading state during authentication
  if (status === "loading") {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p="24px" minH="full" maxW="1200px">
            <Box bg="white" rounded={"md"}>
              <FormControl p="24px">
                <Stack spacing={"12px"}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                  <FormLabel>Profile Description</FormLabel>
                  <Textarea
                    placeholder="Enter Your Profile Description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                  />
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
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          router.back();
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        onClick={handleEditProfile}
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
                        Submit
                      </Button>
                    </Box>
                  </HStack>
                </Stack>
              </FormControl>
              {/* </form> */}
            </Box>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}
