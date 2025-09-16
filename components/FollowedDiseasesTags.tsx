import React from "react";
import {
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Text,
  Button,
  HStack,
  useColorModeValue,
  Skeleton,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export interface FollowedDisease {
  id: number;
  name: string;
  _count: {
    posts: number;
    users: number;
  };
}

interface FollowedDiseasesTagsProps {
  diseases: FollowedDisease[];
  onDiseaseClick: (diseaseId: number | null) => void;
  selectedDisease: number | null;
  isLoading?: boolean;
}

export default function FollowedDiseasesTags({
  diseases,
  onDiseaseClick,
  selectedDisease,
  isLoading = false,
}: FollowedDiseasesTagsProps) {
  // All hooks must be called at the top level, before any early returns
  const tagBg = useColorModeValue("gray.100", "gray.700");
  const selectedTagBg = useColorModeValue("teal.500", "teal.200");
  const selectedTagColor = useColorModeValue("white", "gray.800");
  const tagColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("teal.500", "teal.200");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Box>
        <HStack spacing={2} mb={3} align="center">
          <Skeleton height="20px" width="150px" />
          <Skeleton height="20px" width="100px" />
        </HStack>
        <Wrap spacing={2}>
          {[1, 2, 3].map((i) => (
            <WrapItem key={i}>
              <Skeleton height="32px" width="80px" borderRadius="md" />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    );
  }

  if (!diseases || diseases.length === 0) {
    return (
      <Box
        p={4}
        bg={emptyStateBg}
        borderRadius="md"
        textAlign="center"
      >
        <Text color={textColor} mb={3}>
          You&apos;re not following any rare diseases yet.
        </Text>
        <NextLink href="/rare-diseases" passHref>
          <Button
            as="a"
            size="sm"
            colorScheme="teal"
            fontWeight="500"
            rounded="full"
            rightIcon={<ExternalLinkIcon />}
            _hover={{
              transform: "translateY(-1px)",
              shadow: "sm"
            }}
          >
            Explore Rare Diseases
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box>
      <HStack spacing={2} mb={3} align="center" flexWrap="wrap">
        <Text fontSize="sm" color={textColor} fontWeight="medium">
          Your followed diseases:
        </Text>
        <NextLink href="/rare-diseases" passHref>
          <Link
            fontSize="sm"
            color={linkColor}
            fontWeight="medium"
            _hover={{ textDecoration: "underline" }}
          >
            Manage interests
          </Link>
        </NextLink>
      </HStack>

      <Wrap spacing={2}>
        {/* "All" tag to clear disease filter */}
        <WrapItem>
          <Tag
            size="md"
            variant="solid"
            bg={selectedDisease === null ? selectedTagBg : tagBg}
            color={selectedDisease === null ? selectedTagColor : tagColor}
            cursor="pointer"
            _hover={{
              bg: selectedDisease === null ? selectedTagBg : hoverBg,
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            onClick={() => onDiseaseClick(null)}
            transition="all 0.2s ease-in-out"
            borderRadius="full"
          >
            <TagLabel fontWeight="medium">All</TagLabel>
          </Tag>
        </WrapItem>

        {diseases.map((disease) => {
          const isSelected = selectedDisease === disease.id;
          
          return (
            <WrapItem key={disease.id}>
              <Tag
                size="md"
                variant="solid"
                bg={isSelected ? selectedTagBg : tagBg}
                color={isSelected ? selectedTagColor : tagColor}
                cursor="pointer"
                _hover={{
                  bg: isSelected ? selectedTagBg : hoverBg,
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                onClick={() => onDiseaseClick(disease.id)}
                transition="all 0.2s ease-in-out"
                borderRadius="full"
              >
                <TagLabel fontWeight="medium">
                  {disease.name}
                </TagLabel>
                {isSelected && (
                  <TagCloseButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDiseaseClick(null);
                    }}
                  />
                )}
              </Tag>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
}