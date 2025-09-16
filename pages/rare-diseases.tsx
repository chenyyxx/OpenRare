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
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import AuthRequiredAlert from "../components/AuthRequiredAlert";
import { useDiseases } from "./create_post";
import { FullDisease } from "./create_post";
import { getThemeColor, getThemeBackgrounds, MODERN_PALETTE, TYPOGRAPHY } from "../utils/theme-constants";

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
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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

  // Handle URL parameters to pre-select a disease
  useEffect(() => {
    if (router.query.disease && diseases) {
      const diseaseId = router.query.disease as string;
      const disease = diseases.find(d => d.id.toString() === diseaseId);
      if (disease) {
        setSelectedDisease(disease);
        setSearchValue(disease.name);
      }
    }
  }, [router.query.disease, diseases]);

  const handleSelect = (item: Item) => {
    const disease = diseases?.find(d => d.name === item.label);
    if (disease) {
      setSelectedDisease(disease);
    }
  };

  const handleToggleInterest = async (diseaseId: string, isCurrentlyInterested: boolean) => {
    if (!session?.user?.email) {
      setShowAuthAlert(true);
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
        } else {
          setUserInterests(prev => [...prev, diseaseId]);
        }
      }
    } catch (error) {
      console.error("Error updating interest:", error);
    }
  };

  if (isError) return <div>Failed to load rare diseases</div>;

  return (
    <Box minH="100vh" bg={MODERN_PALETTE.neutral[100]}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p={{ base: "16px", md: "24px" }} minH="full" maxW="1200px">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box 
                bg="white" 
                rounded={"2xl"} 
                p={{ base: 6, md: 8 }} 
                shadow="lg"
                border="1px"
                borderColor={MODERN_PALETTE.neutral[200]}
              >
                <Heading 
                  fontSize={TYPOGRAPHY.fontSize['3xl']} 
                  color={MODERN_PALETTE.neutral[800]} 
                  mb={3}
                  fontWeight="bold"
                >
                  Rare Diseases
                </Heading>
                <Text 
                  fontSize="md"
                  color="gray.600"
                  fontWeight="400"
                >
                  Learn about rare diseases and manage your interests
                </Text>
              </Box>

              {/* Search Section */}
              <Card shadow="lg" border="1px" borderColor={MODERN_PALETTE.neutral[200]} rounded="2xl">
                <CardHeader bg={MODERN_PALETTE.neutral[50]} roundedTop="2xl" py={6}>
                  <Heading 
                    fontSize={TYPOGRAPHY.fontSize['2xl']} 
                    color={MODERN_PALETTE.neutral[800]}
                    fontWeight="bold"
                  >
                    Search Rare Diseases
                  </Heading>
                </CardHeader>
                <CardBody>
                  {!isLoading && diseases ? (
                    <FormControl>
                      <FormLabel 
                        fontSize={TYPOGRAPHY.fontSize.lg}
                        fontWeight="semibold"
                        color={MODERN_PALETTE.neutral[700]}
                      >
                        Find a rare disease
                      </FormLabel>
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
                            size="lg"
                            fontSize={TYPOGRAPHY.fontSize.md}
                            bg={MODERN_PALETTE.neutral[50]}
                            border="2px"
                            borderColor={MODERN_PALETTE.neutral[200]}
                            rounded="xl"
                            _hover={{
                              borderColor: MODERN_PALETTE.primary[400]
                            }}
                            _focus={{
                              borderColor: MODERN_PALETTE.primary[500],
                              bg: "white"
                            }}
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
                      <FormHelperText
                        fontSize={TYPOGRAPHY.fontSize.md}
                        color={MODERN_PALETTE.neutral[600]}
                        bg={MODERN_PALETTE.neutral[50]}
                        px={4}
                        py={3}
                        rounded="lg"
                        mt={3}
                      >
                        Search for rare diseases to learn more and add to your interests.
                        <Text as="span" fontWeight="semibold" color="teal.600">
                          {' "General"'}
                        </Text> and 
                        <Text as="span" fontWeight="semibold" color="teal.600">
                          {' "Other"'}
                        </Text> options are always available.
                      </FormHelperText>
                    </FormControl>
                  ) : (
                    <HStack>
                      <Spinner size="md" color={MODERN_PALETTE.primary[500]} />
                      <Text fontSize={TYPOGRAPHY.fontSize.lg} color={MODERN_PALETTE.neutral[600]}>
                        Loading rare diseases...
                      </Text>
                    </HStack>
                  )}
                </CardBody>
              </Card>

              {/* Selected Disease Information */}
              {selectedDisease && (
                <Card shadow="lg" border="1px" borderColor={MODERN_PALETTE.neutral[200]} rounded="2xl">
                  <CardHeader bg={MODERN_PALETTE.neutral[50]} roundedTop="2xl" py={6}>
                    <VStack spacing={4} align="stretch">
                      {/* Desktop: Title and Button in same row, Mobile: Stacked */}
                      <Flex 
                        direction={{ base: "column", md: "row" }} 
                        justify={{ base: "flex-start", md: "space-between" }} 
                        align={{ base: "flex-start", md: "flex-start" }}
                        gap={3}
                      >
                        <VStack align="start" spacing={2} flex={1}>
                          <Heading 
                            fontSize={TYPOGRAPHY.fontSize['2xl']} 
                            lineHeight="shorter"
                            color={MODERN_PALETTE.neutral[800]}
                            fontWeight="bold"
                          >
                            {selectedDisease.name}
                          </Heading>
                          <HStack wrap="wrap" spacing={3}>
                            <Badge 
                              bg="blue.500"
                              color="white"
                              px={3}
                              py={1}
                              rounded="full"
                              fontSize="sm"
                              fontWeight="600"
                              shadow="sm"
                            >
                              {selectedDisease.posts.length} posts
                            </Badge>
                            <Badge 
                              bg="green.500"
                              color="white"
                              px={3}
                              py={1}
                              rounded="full"
                              fontSize="sm"
                              fontWeight="600"
                              shadow="sm"
                            >
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
                              "red" : "teal"
                          }
                          variant={
                            userInterests.includes(selectedDisease.id.toString()) ? 
                              "outline" : "solid"
                          }
                          size="md"
                          fontWeight="500"
                          flexShrink={0}
                          rounded="full"
                          _hover={{
                            transform: "translateY(-1px)",
                            shadow: "md"
                          }}
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
                  <CardBody py={6}>
                    <VStack align="start" spacing={6}>
                      {selectedDisease.description && (
                        <Box>
                          <Text 
                            fontWeight="bold" 
                            mb={3}
                            fontSize={TYPOGRAPHY.fontSize.xl}
                            color={MODERN_PALETTE.neutral[800]}
                          >
                            Description
                          </Text>
                          <Text 
                            fontSize="md"
                            color={MODERN_PALETTE.neutral[700]}
                            lineHeight="relaxed"
                            bg={MODERN_PALETTE.neutral[50]}
                            p={4}
                            rounded="xl"
                          >
                            {selectedDisease.description}
                          </Text>
                        </Box>
                      )}

                      {selectedDisease.definition && 
                       selectedDisease.name.toLowerCase() !== "general" && 
                       selectedDisease.name.toLowerCase() !== "other" && (
                        <Box>
                          <Text 
                            fontWeight="bold" 
                            mb={3}
                            fontSize={TYPOGRAPHY.fontSize.xl}
                            color={MODERN_PALETTE.neutral[800]}
                          >
                            Learn More
                          </Text>
                          <Button
                            as="a"
                            href={selectedDisease.definition}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="teal"
                            variant="outline"
                            size="md"
                            fontWeight="500"
                            rounded="full"
                            rightIcon={<FiExternalLink />}
                            _hover={{
                              transform: "translateY(-1px)",
                              shadow: "md"
                            }}
                          >
                            View Official Information
                          </Button>
                          <Text 
                            fontSize={TYPOGRAPHY.fontSize.sm} 
                            color={MODERN_PALETTE.neutral[500]} 
                            mt={2}
                            bg={MODERN_PALETTE.neutral[100]}
                            px={3}
                            py={1}
                            rounded="lg"
                            display="inline-block"
                          >
                            Opens in a new tab
                          </Text>
                        </Box>
                      )}
                      
                      <Box>
                        <Text 
                          fontWeight="bold" 
                          mb={3}
                          fontSize={TYPOGRAPHY.fontSize.xl}
                          color={MODERN_PALETTE.neutral[800]}
                        >
                          Community Activity
                        </Text>
                        <Text 
                          fontSize="md"
                          color={MODERN_PALETTE.neutral[700]}
                          bg={MODERN_PALETTE.neutral[50]}
                          p={4}
                          rounded="xl"
                          lineHeight="relaxed"
                        >
                          This rare disease has{' '}
                          <Text as="span" fontWeight="bold" color="blue.500">
                            {selectedDisease.posts.length}
                          </Text>{' '}
                          community posts and{' '}
                          <Text as="span" fontWeight="bold" color="green.500">
                            {selectedDisease.users.length}
                          </Text>{' '}
                          people following it.
                        </Text>
                      </Box>

                      <Box>
                        <Text 
                          fontWeight="bold" 
                          mb={3}
                          fontSize={TYPOGRAPHY.fontSize.xl}
                          color={MODERN_PALETTE.neutral[800]}
                        >
                          Find Related Content
                        </Text>
                        <Text 
                          fontSize="md"
                          color={MODERN_PALETTE.neutral[700]}
                          mb={4}
                          bg={MODERN_PALETTE.neutral[50]}
                          p={4}
                          rounded="xl"
                          lineHeight="relaxed"
                        >
                          To see posts related to{' '}
                          <Text as="span" fontWeight="bold" color="purple.500">
                            {selectedDisease.name}
                          </Text>
                          , visit the theme pages and use the rare disease filter to find specific content.
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {[
                            { name: "Personal Stories", href: "/themes/personal-stories" },
                            { name: "Help & Support", href: "/themes/help-support" },
                            { name: "Events", href: "/themes/events" },
                            { name: "Research & Information", href: "/themes/research-information" }
                          ].map((theme) => {
                            const themeColor = getThemeColor(theme.name);
                            const themeBackgrounds = getThemeBackgrounds(theme.name);
                            const IconComponent = getThemeIcon(theme.name);
                            return (
                              <Box
                                key={theme.name}
                                as="a"
                                href={theme.href}
                                p={6}
                                border="2px"
                                borderColor={themeColor}
                                borderRadius="2xl"
                                cursor="pointer"
                                bg={themeBackgrounds.light}
                                _hover={{
                                  borderColor: themeColor,
                                  bg: themeBackgrounds.medium,
                                  transform: "translateY(-2px)",
                                  shadow: "xl",
                                }}
                                textDecoration="none"
                                _focus={{ boxShadow: "none" }}
                                transition="all 0.3s ease"
                              >
                                <HStack spacing={4} justify="center">
                                  <Box
                                    p={3}
                                    rounded="xl"
                                    bg="white"
                                    shadow="md"
                                  >
                                    <Icon
                                      as={IconComponent}
                                      color={themeColor}
                                      boxSize={6}
                                    />
                                  </Box>
                                  <Text
                                    fontWeight="bold"
                                    color={MODERN_PALETTE.neutral[800]}
                                    fontSize={TYPOGRAPHY.fontSize.md}
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
                <Card shadow="lg" border="1px" borderColor={MODERN_PALETTE.neutral[200]} rounded="2xl">
                  <CardHeader bg={MODERN_PALETTE.neutral[50]} roundedTop="2xl" py={6}>
                    <Heading 
                      fontSize={TYPOGRAPHY.fontSize['2xl']} 
                      color={MODERN_PALETTE.neutral[800]}
                      fontWeight="bold"
                    >
                      Your Rare Disease Interests
                    </Heading>
                  </CardHeader>
                  <CardBody py={6}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {userInterests.map((diseaseId) => {
                        const disease = diseases?.find(d => d.id.toString() === diseaseId);
                        if (!disease) return null;
                        
                        return (
                          <Box
                            key={diseaseId}
                            position="relative"
                            p={5}
                            bg="white"
                            border="2px"
                            borderColor={MODERN_PALETTE.primary[500]}
                            rounded="2xl"
                            shadow="md"
                            _hover={{
                              borderColor: MODERN_PALETTE.primary[500],
                              shadow: "lg",
                              transform: "translateY(-1px)"
                            }}
                            transition="all 0.2s ease"
                          >
                            <Text 
                              fontWeight="semibold" 
                              fontSize="sm" 
                              noOfLines={2} 
                              pr={8}
                              color={MODERN_PALETTE.neutral[800]}
                            >
                              {disease.name}
                            </Text>
                            <IconButton
                              aria-label="Remove interest"
                              icon={<FiX />}
                              size="sm"
                              variant="ghost"
                              position="absolute"
                              top="12px"
                              right="12px"
                              color={MODERN_PALETTE.neutral[500]}
                              _hover={{
                                bg: "red.500",
                                color: "white"
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
      
      {/* Authentication Alert */}
      {showAuthAlert && (
        <AuthRequiredAlert 
          action="follow rare diseases" 
          isOpen={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
        />
      )}
    </Box>
  );
}