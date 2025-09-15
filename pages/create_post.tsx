import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  useToast,
  Text,
  VStack,
  Badge,
  Icon,
  FormErrorMessage,
  Divider,
  Heading,
} from "@chakra-ui/react";
import RichTextEditor from "../components/RichText";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Select from "react-select";
import { fetchData } from "../utils/utils";
import { useSession } from "next-auth/react";
import Sidebar from "../components/sidebar";
import { Prisma } from "@prisma/client";
import { FiUser, FiHeart, FiCalendar, FiBook } from "react-icons/fi";
import { getThemeColor } from "../utils/theme-constants";

// Define types for the new schema
export type FullTheme = Prisma.ThemeGetPayload<{
  include: {
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

export type FullDisease = Prisma.DiseaseGetPayload<{
  include: {
    users: true;
    posts: true;
  };
}>;

// Define the option type
interface Option {
  value: string;
  label: string;
}

// Custom hooks for fetching data
export function useThemes() {
  const { data, error } = useSWR<FullTheme[], Error>(
    `/api/get_all_themes`,
    fetchData
  );
  return {
    themes: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDiseases() {
  const { data, error } = useSWR<FullDisease[], Error>(
    `/api/get_all_diseases`,
    fetchData
  );
  return {
    diseases: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export type SelectOption = {
  value: string;
  label: string;
};

export function buildDiseaseSelectOptions(
  diseases: FullDisease[]
): SelectOption[] {
  if (!diseases) return [];

  // Always ensure "Other" and "General" appear first
  const otherOption = diseases.find((d) => d.name.toLowerCase() === "other");
  const generalOption = diseases.find(
    (d) => d.name.toLowerCase() === "general"
  );
  const otherDiseases = diseases.filter(
    (d) =>
      d.name.toLowerCase() !== "other" && d.name.toLowerCase() !== "general"
  );

  const options: SelectOption[] = [];

  if (generalOption) {
    options.push({
      value: String(generalOption.id),
      label: generalOption.name,
    });
  }
  if (otherOption) {
    options.push({ value: String(otherOption.id), label: otherOption.name });
  }

  // Add remaining diseases
  otherDiseases.forEach((d) => {
    options.push({ value: String(d.id), label: d.name });
  });

  return options;
}

// Theme icon mapping
const getThemeIcon = (themeName: string) => {
  switch (themeName.toLowerCase()) {
    case "personal stories":
      return FiUser;
    case "help & support":
      return FiHeart;
    case "events":
      return FiCalendar;
    case "research & information":
      return FiBook;
    default:
      return FiUser;
  }
};

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [diseaseOptions, setDiseaseOptions] = useState([] as SelectOption[]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation states
  const [titleError, setTitleError] = useState("");
  const [themeError, setThemeError] = useState("");
  const [diseaseError, setDiseaseError] = useState("");
  const [contentError, setContentError] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();

  const {
    themes,
    isLoading: themesLoading,
    isError: themesError,
  } = useThemes();
  const {
    diseases,
    isLoading: diseasesLoading,
    isError: diseasesError,
  } = useDiseases();

  useEffect(() => {
    if (!diseasesLoading && diseases) {
      setDiseaseOptions(buildDiseaseSelectOptions(diseases));
    }
  }, [diseases, diseasesLoading]);

  // Validation functions
  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!selectedThemeId) {
      setThemeError("Please select a theme");
      isValid = false;
    } else {
      setThemeError("");
    }

    if (!selectedDiseaseId) {
      setDiseaseError("Please select a rare disease");
      isValid = false;
    } else {
      setDiseaseError("");
    }

    if (!content.trim()) {
      setContentError("Content is required");
      isValid = false;
    } else {
      setContentError("");
    }

    return isValid;
  };

  const handleNewPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        themeId: selectedThemeId,
        diseaseId: Number(selectedDiseaseId),
        user: session?.user,
      };

      const response = await fetch("/api/create_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post: newPost }),
      });

      if (response.ok) {
        toast({
          title: "Post created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to create post",
          description: errorData.error || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Network error. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (themesError || diseasesError) return <div>Failed to load</div>;

  return (
    <Box minH="100vh" bg={"gray.50"}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p="24px" minH="full" maxW="800px">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box bg="white" rounded={"lg"} p={6} shadow="sm">
                <Heading size="lg" color="gray.700" mb={2}>
                  Create Your Post
                </Heading>
                <Text color="gray.600">
                  Share your story, ask for help, or contribute to the community
                </Text>
              </Box>

              {/* Main Form */}
              <Box bg="white" rounded={"lg"} shadow="sm">
                <VStack spacing={6} p={6} align="stretch">
                  {/* Theme Selection Section */}
                  <Box>
                    <FormLabel
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={3}
                    >
                      Select Theme
                    </FormLabel>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      Choose the category that best fits your post
                    </Text>

                    {themesLoading ? (
                      <Text>Loading themes...</Text>
                    ) : (
                      <VStack spacing={3} align="stretch">
                        {themes?.map((theme) => {
                          const IconComponent = getThemeIcon(theme.name);
                          const themeColor = getThemeColor(theme.name);
                          const isSelected = selectedThemeId === theme.id;

                          return (
                            <Box
                              key={theme.id}
                              p={4}
                              border="2px"
                              borderColor={
                                isSelected ? themeColor : "gray.200"
                              }
                              borderRadius="md"
                              cursor="pointer"
                              bg={isSelected ? `${themeColor}10` : "white"}
                              _hover={{
                                borderColor: themeColor,
                                bg: `${themeColor}05`,
                              }}
                              onClick={() => {
                                setSelectedThemeId(theme.id);
                                setThemeError("");
                              }}
                            >
                              <HStack spacing={3}>
                                <Icon
                                  as={IconComponent}
                                  color={themeColor}
                                  boxSize={5}
                                />
                                <VStack align="start" spacing={1} flex={1}>
                                  <HStack>
                                    <Text
                                      fontWeight="semibold"
                                      color="gray.700"
                                    >
                                      {theme.name}
                                    </Text>
                                    <Badge colorScheme="gray" size="sm">
                                      {theme._count.posts} posts
                                    </Badge>
                                  </HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    {theme.description}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          );
                        })}
                      </VStack>
                    )}
                    {themeError && (
                      <Text color="red.500" fontSize="sm" mt={2}>
                        {themeError}
                      </Text>
                    )}
                  </Box>

                  <Divider />

                  {/* Disease Selection Section */}
                  <FormControl isInvalid={!!diseaseError}>
                    <FormLabel
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      Select Rare Disease
                    </FormLabel>
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      Choose the rare disease your post relates to
                    </Text>
                    <Select
                      placeholder="Search and select a rare disease..."
                      isSearchable
                      isClearable
                      isLoading={diseasesLoading}
                      onChange={(e: Option | null) => {
                        setSelectedDiseaseId(e == null ? "" : e.value);
                        setDiseaseError("");
                      }}
                      options={diseaseOptions}
                      styles={{
                        control: (base: any) => ({
                          ...base,
                          minHeight: "44px",
                          borderColor: diseaseError ? "#E53E3E" : "#E2E8F0",
                          "&:hover": {
                            borderColor: diseaseError ? "#E53E3E" : "#CBD5E0",
                          },
                        }),
                      }}
                    />
                    <FormErrorMessage>{diseaseError}</FormErrorMessage>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      &quot;General&quot; and &quot;Other&quot; options are
                      always available regardless of search
                    </Text>
                  </FormControl>

                  <Divider />

                  {/* Title Section */}
                  <FormControl isInvalid={!!titleError}>
                    <FormLabel
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      Post Title
                    </FormLabel>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter a clear, descriptive title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value);
                        setTitleError("");
                      }}
                      size="lg"
                      bg="gray.50"
                      border="1px"
                      borderColor={titleError ? "red.300" : "gray.200"}
                      _hover={{
                        borderColor: titleError ? "red.400" : "gray.300",
                      }}
                      _focus={{
                        borderColor: titleError ? "red.500" : "blue.500",
                        bg: "white",
                      }}
                    />
                    <FormErrorMessage>{titleError}</FormErrorMessage>
                  </FormControl>

                  {/* Content Section */}
                  <FormControl isInvalid={!!contentError}>
                    <FormLabel
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      Post Content
                    </FormLabel>
                    <Box
                      rounded={"md"}
                      border="1px"
                      borderColor={contentError ? "red.300" : "gray.200"}
                    >
                      <RichTextEditor
                        controls={[
                          ["bold", "italic", "underline", "link"],
                          ["unorderedList", "h1", "h2", "h3"],
                          ["sup", "sub"],
                          ["alignLeft", "alignCenter", "alignRight"],
                        ]}
                        styles={{
                          root: {
                            borderColor: contentError ? "#FC8181" : "#E2E8F0",
                            borderRadius: "0.375rem",
                            minHeight: "300px",
                          },
                          toolbar: {
                            borderColor: contentError ? "#FC8181" : "#E2E8F0",
                            zIndex: 0,
                            backgroundColor: "#F7FAFC",
                          },
                        }}
                        value={content}
                        onChange={(value) => {
                          setContent(value);
                          setContentError("");
                        }}
                        placeholder="Share your thoughts, experiences, or questions..."
                      />
                    </Box>
                    <FormErrorMessage>{contentError}</FormErrorMessage>
                  </FormControl>

                  {/* Action Buttons */}
                  <HStack justify={"end"} pt={4}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        router.back();
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNewPost}
                      size="lg"
                      colorScheme={"blue"}
                      isLoading={isSubmitting}
                      loadingText="Creating..."
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "lg",
                      }}
                    >
                      Create Post
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
