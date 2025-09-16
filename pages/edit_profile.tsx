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
  VStack,
  Heading,
  Text,
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
    <Box minH="100vh" bg="gray.50" fontFamily='"Inter", "Roboto", "Segoe UI", system-ui, sans-serif'>
      <Sidebar>
        <Flex justify="center" pt="78px">
          <Box w="full" p={{ base: "16px", md: "24px" }} minH="full" maxW="800px">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box 
                bg="white" 
                rounded="2xl" 
                p={{ base: 6, md: 8 }} 
                shadow="lg"
                border="1px"
                borderColor="gray.200"
              >
                <Heading 
                  fontSize="3xl" 
                  color="gray.800" 
                  mb={3}
                  fontWeight="bold"
                >
                  Profile Settings
                </Heading>
                <Text 
                  fontSize="md"
                  color="gray.600" 
                  fontWeight="400"
                >
                  Update your profile information and preferences
                </Text>
              </Box>

              {/* Form */}
              <Box 
                bg="white" 
                rounded="2xl" 
                p={{ base: 6, md: 8 }} 
                shadow="lg"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="500" mb={2}>
                      Display Name
                    </FormLabel>
                    <Input
                      placeholder="Enter your display name"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                      }
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.300"
                      rounded="2xl"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ 
                        borderColor: "teal.500", 
                        bg: "white",
                        boxShadow: "0 0 0 1px #319795"
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="500" mb={2}>
                      Bio
                    </FormLabel>
                    <Textarea
                      placeholder="Tell others about yourself..."
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setDescription(e.target.value)
                      }
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.300"
                      rounded="2xl"
                      rows={4}
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{ 
                        borderColor: "teal.500", 
                        bg: "white",
                        boxShadow: "0 0 0 1px #319795"
                      }}
                    />
                  </FormControl>

                  <HStack justify="flex-end" spacing={3} pt={4}>
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      rounded="full"
                      fontWeight="500"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        router.back();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="teal"
                      rounded="full"
                      fontWeight="500"
                      onClick={handleEditProfile}
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      }}
                    >
                      Save Changes
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}
