import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useColorModeValue,
  Spacer,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { ThemeIcon } from './ThemeIcon';
import { getThemeColor } from '../../utils/theme-constants';
import { useRouter } from 'next/router';

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    description: string;
    guidelines?: string;
    postCount?: number;
  };
  recentPosts?: Array<{
    id: string;
    title: string;
    author?: string;
    disease?: string;
  }>;
  onClick?: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  recentPosts = [],
  onClick 
}) => {
  const router = useRouter();
  // Use local theme color constants
  const themeColor = getThemeColor(theme.name);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const guidelinesColor = useColorModeValue('gray.500', 'gray.400');

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation to theme page
      router.push(`/themes/${theme.id}`);
    }
  };

  return (
    <Box
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        borderColor: themeColor,
        transform: 'translateY(-2px)',
        shadow: 'lg'
      }}
      onClick={handleClick}
      minHeight="400px"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" spacing={4} flex={1}>
        {/* Header with icon and title */}
        <HStack spacing={3} align="center">
          <Box
            p={3}
            borderRadius="lg"
            bg={themeColor}
            color="white"
          >
            <ThemeIcon themeName={theme.name} boxSize={6} />
          </Box>
          <VStack align="start" spacing={1} flex={1}>
            <Heading size="md" color={themeColor}>
              {theme.name}
            </Heading>
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {theme.description}
            </Text>
          </VStack>
        </HStack>

        {/* Guidelines */}
        {theme.guidelines && (
          <Box>
            <Text fontSize="xs" color={guidelinesColor} lineHeight="1.4">
              {theme.guidelines}
            </Text>
          </Box>
        )}

        <Divider />

        {/* Post count */}
        <HStack>
          <Badge colorScheme="gray" variant="subtle">
            {theme.postCount || 0} posts
          </Badge>
          <Spacer />
        </HStack>

        {/* Recent posts preview */}
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={3} color={textColor}>
            Recent activity:
          </Text>
          <VStack align="stretch" spacing={2}>
            {recentPosts.length > 0 ? (
              recentPosts.slice(0, 3).map((post) => (
                <Box
                  key={post.id}
                  p={2}
                  borderRadius="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderLeft="3px"
                  borderLeftColor={themeColor}
                >
                  <Text
                    fontSize="xs"
                    color={textColor}
                    noOfLines={2}
                    fontWeight="medium"
                  >
                    {post.title}
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Text fontSize="xs" color={guidelinesColor}>
                      by {post.author || 'Anonymous'}
                    </Text>
                    {post.disease && (
                      <>
                        <Text fontSize="xs" color={guidelinesColor}>•</Text>
                        <Text fontSize="xs" color={guidelinesColor}>
                          {post.disease}
                        </Text>
                      </>
                    )}
                  </HStack>
                </Box>
              ))
            ) : (
              <Box
                p={3}
                borderRadius="md"
                bg={useColorModeValue('gray.50', 'gray.700')}
                textAlign="center"
              >
                <Text fontSize="xs" color={textColor} fontStyle="italic">
                  No posts yet - be the first to share!
                </Text>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Action button */}
        <Button
          size="md"
          bg={themeColor}
          color="white"
          _hover={{
            bg: themeColor,
            opacity: 0.9,
            transform: 'translateY(-1px)',
          }}
          _active={{
            transform: 'translateY(0)',
          }}
        >
          Explore {theme.name}
        </Button>
      </VStack>
    </Box>
  );
};

export default ThemeCard;