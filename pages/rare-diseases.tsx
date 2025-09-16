import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Spinner,
  Badge,
  Card,
  CardBody,
  CardHeader,
  useToast,
  SimpleGrid,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FiHeart, FiX, FiExternalLink, FiUser, FiCalendar, FiBook } from "react-icons/fi";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";
import { useSession } from "next-auth/react";
import Sidebar from "../components/sidebar";
import { useDiseases } from "./create_post";
import { FullDisease } from "./create_post";
import { getThemeColor } from "../utils/theme-constants";

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

export default function RareDiseasesPage() {
  const [selectedDisease, setSelectedDisease] = useState<FullDisease | null>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { data: session } = useSession();
  const toast = useToast();

  const { diseases, isLoading, isError } = useDiseases();

  // Load user interests when session and diseases are available
  useEffect(() => {
    if (session?.user?.email && diseases) {
      // Find diseases that the user is following
      const userFollowedDiseases = diseases
        .filter(disease => disease.users.some((user: any) => user.email === session.user.email))
        .map(disease => disease.id.toString());
      setUserInterests(userFollowedDiseases);
    }
  }, [session, diseases]);

  const handleSelect = (item: Item) => {
    const disease = diseases?.find(d => d.name === item.label);
    if (disease) {
      setSelectedDisease(disease);
    }
  };

  const handleToggleInterest = async (diseaseId: string, isCurrentlyInterested: boolean) => {
    if (!session?.user?.email) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to manage your interests",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const endpoint = isCurrentlyInterested ? '/api/unfollow_disease' : '/api/follow_disease';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          diseaseId: diseaseId,
        }),
      });

      if (response.ok) {
        if (isCurrentlyInterested) {
          setUserInterests(prev => prev.filter(id => id !== diseaseId));
          toast({
            title: "Interest removed",
            description: "Removed from your rare disease interests",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          setUserInterests(prev => [...prev, diseaseId]);
          toast({
            title: "Interest added",
            description: "Added to your rare disease interests",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to update interest');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your interest. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isError) return <div>Failed to load rare diseases</div>;

  return (
    <Box minH="100vh" bg={"gray.50"}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p={{ base: "16px", md: "24px" }} minH="full" maxW="1200px">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box 
                bg="white" 
                rounded={"lg"} 
                p={{ base: 4, md: 6 }} 
                shadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <Heading size="lg" color="gray.700" mb={2}>
                  Rare Diseases
                </Heading>
                <Text color="gray.600">
                  Learn about rare diseases and manage your interests
                </Text>
              </Box>

              {/* Search Section */}
              <Card shadow="md" border="1px" borderColor="gray.200">
                <CardHeader>
                  <Heading size="md">Search Rare Diseases</Heading>
                </CardHeader>
                <CardBody>
                  {!isLoading && diseases ? (
                    <FormControl>
                      <FormLabel>Find a rare disease</FormLabel>
                      <Box position="relative">
                        <AutoComplete
                          openOnFocus
                          onSelectOption={(e) => {
                            handleSelect(e.item);
                            setSearchValue(e.item.label);
                          }}
                        >
                          <AutoCompleteInput
                            variant="filled"
                            placeholder="Enter characters to start searching"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                          <AutoCompleteList>
                            {diseases.map((disease) => (
                              <AutoCompleteItem
                                key={`option-${disease.id}`}
                                value={disease.name}
                                textTransform="capitalize"
                              >
                                {disease.name}
                              </AutoCompleteItem>
                            ))}
                          </AutoCompleteList>
                        </AutoComplete>
                        {searchValue && (
                          <IconButton
                            aria-label="Clear search"
                            icon={<FiX />}
                            size="sm"
                            variant="ghost"
                            position="absolute"
                            right="8px"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={2}
                            onClick={() => {
                              setSearchValue("");
                              setSelectedDisease(null);
                            }}
                          />
                        )}
                      </Box>
                      <FormHelperText>
                        Search for rare diseases to learn more and add to your interests.
                        &quot;General&quot; and &quot;Other&quot; options are always available.
                      </FormHelperText>
                    </FormControl>
                  ) : (
                    <HStack>
                      <Spinner size="sm" />
                      <Text>Loading rare diseases...</Text>
                    </HStack>
                  )}
                </CardBody>
              </Card>

              {/* Selected Disease Information */}
              {selectedDisease && (
                <Card shadow="md" border="1px" borderColor="gray.200">
                  <CardHeader>
                    <VStack spacing={3} align="stretch">
                      {/* Desktop: Title and Button in same row, Mobile: Stacked */}
                      <Flex 
                        direction={{ base: "column", md: "row" }} 
                        justify={{ base: "flex-start", md: "space-between" }} 
                        align={{ base: "flex-start", md: "flex-start" }}
                        gap={3}
                      >
                        <VStack align="start" spacing={1} flex={1}>
                          <Heading size={{ base: "sm", md: "md" }} lineHeight="shorter">
                            {selectedDisease.name}
                          </Heading>
                          <HStack wrap="wrap">
                            <Badge colorScheme="blue">
                              {selectedDisease.posts.length} posts
                            </Badge>
                            <Badge colorScheme="green">
                              {selectedDisease.users.length} followers
                            </Badge>
                          </HStack>
                        </VStack>
                        <Button
                          leftIcon={
                            userInterests.includes(selectedDisease.id.toString()) ? 
                              <FiX /> : <FiHeart />
                          }
                          colorScheme={
                            userInterests.includes(selectedDisease.id.toString()) ? 
                              "red" : "blue"
                          }
                          variant={
                            userInterests.includes(selectedDisease.id.toString()) ? 
                              "outline" : "solid"
                          }
                          size={{ base: "sm", md: "md" }}
                          flexShrink={0}
                          onClick={() => 
                            handleToggleInterest(
                              selectedDisease.id.toString(),
                              userInterests.includes(selectedDisease.id.toString())
                            )
                          }
                        >
                          {userInterests.includes(selectedDisease.id.toString()) ? 
                            "Unfollow" : "Follow"
                          }
                        </Button>
                      </Flex>
                    </VStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      {selectedDisease.description && (
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Description</Text>
                          <Text color="gray.600">{selectedDisease.description}</Text>
                        </Box>
                      )}

                      {selectedDisease.definition && 
                       selectedDisease.name.toLowerCase() !== "general" && 
                       selectedDisease.name.toLowerCase() !== "other" && (
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Learn More</Text>
                          <Button
                            as="a"
                            href={selectedDisease.definition}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            rightIcon={<FiExternalLink />}
                          >
                            View Official Information
                          </Button>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            Opens in a new tab
                          </Text>
                        </Box>
                      )}
                      
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Community Activity</Text>
                        <Text color="gray.600">
                          This rare disease has {selectedDisease.posts.length} community posts 
                          and {selectedDisease.users.length} people following it.
                        </Text>
                      </Box>

                      <Box>
                        <Text fontWeight="semibold" mb={2}>Find Related Content</Text>
                        <Text color="gray.600" mb={3}>
                          To see posts related to {selectedDisease.name}, visit the theme pages 
                          and use the rare disease filter to find specific content.
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                          {[
                            { name: "Personal Stories", href: "/themes/personal-stories" },
                            { name: "Help & Support", href: "/themes/help-support" },
                            { name: "Events", href: "/themes/events" },
                            { name: "Research & Information", href: "/themes/research-information" }
                          ].map((theme) => {
                            const themeColor = getThemeColor(theme.name);
                            const IconComponent = getThemeIcon(theme.name);
                            return (
                              <Box
                                key={theme.name}
                                as="a"
                                href={theme.href}
                                p={4}
                                border="2px"
                                borderColor={themeColor}
                                borderRadius="md"
                                cursor="pointer"
                                bg={`${themeColor}10`}
                                _hover={{
                                  borderColor: themeColor,
                                  bg: `${themeColor}20`,
                                  transform: "translateY(-1px)",
                                  shadow: "md",
                                }}
                                textDecoration="none"
                                _focus={{ boxShadow: "none" }}
                                transition="all 0.2s"
                              >
                                <HStack spacing={3} justify="center">
                                  <Icon
                                    as={IconComponent}
                                    color={themeColor}
                                    boxSize={5}
                                  />
                                  <Text
                                    fontWeight="semibold"
                                    color="gray.700"
                                    fontSize="sm"
                                  >
                                    {theme.name}
                                  </Text>
                                </HStack>
                              </Box>
                            );
                          })}
                        </SimpleGrid>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* User's Interests */}
              {session && userInterests.length > 0 && (
                <Card shadow="md" border="1px" borderColor="gray.200">
                  <CardHeader>
                    <Heading size="md">Your Rare Disease Interests</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                      {userInterests.map((diseaseId) => {
                        const disease = diseases?.find(d => d.id.toString() === diseaseId);
                        if (!disease) return null;
                        
                        return (
                          <Box
                            key={diseaseId}
                            position="relative"
                            p={4}
                            bg="white"
                            border="2px"
                            borderColor="blue.200"
                            rounded="lg"
                            _hover={{
                              borderColor: "blue.400",
                              shadow: "md",
                            }}
                          >
                            <Text fontWeight="medium" fontSize="sm" noOfLines={2} pr={8}>
                              {disease.name}
                            </Text>
                            <IconButton
                              aria-label="Remove interest"
                              icon={<FiX />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              position="absolute"
                              top="8px"
                              right="8px"
                              _hover={{
                                bg: "red.100",
                              }}
                              onClick={() => handleToggleInterest(diseaseId, true)}
                            />
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}