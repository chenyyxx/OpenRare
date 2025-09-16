import React from 'react';
import { Box, Circle, HStack, Text, VStack, BoxProps } from '@chakra-ui/react';
import { ThemeIcon } from './ThemeIcon';
import { getThemeColor } from '../../utils/theme-constants';

// Theme color dot indicator
interface ThemeColorDotProps extends BoxProps {
  themeName: string;
  size?: number;
}

export const ThemeColorDot: React.FC<ThemeColorDotProps> = ({ 
  themeName, 
  size = 3,
  ...props 
}) => {
  const themeColor = getThemeColor(themeName);
  
  return (
    <Circle
      size={size}
      bg={themeColor}
      {...props}
    />
  );
};

// Theme header component for theme pages
interface ThemeHeaderProps {
  themeName: string;
  description?: string;
  guidelines?: string;
  postCount?: number;
}

export const ThemeHeader: React.FC<ThemeHeaderProps> = ({
  themeName,
  description,
  guidelines,
  postCount
}) => {
  const themeColor = getThemeColor(themeName);
  
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      mb={6}
      shadow="lg"
      border="1px"
      borderColor="gray.200"
    >
      <HStack spacing={4} align="start">
        <Box
          p={3}
          borderRadius="2xl"
          bg={themeColor}
          color="white"
        >
          <ThemeIcon themeName={themeName} boxSize={8} />
        </Box>
        
        <VStack align="start" spacing={2} flex={1}>
          <HStack>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              {themeName}
            </Text>
            {postCount !== undefined && (
              <Text fontSize="sm" color="gray.600">
                ({postCount} posts)
              </Text>
            )}
          </HStack>
          
          {description && (
            <Text fontSize="md" color="gray.700">
              {description}
            </Text>
          )}
          
          {guidelines && (
            <Text fontSize="sm" color="gray.600" fontStyle="italic">
              {guidelines}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

// Compact theme indicator for lists
interface ThemeIndicatorProps {
  themeName: string;
  size?: 'sm' | 'md';
  showText?: boolean;
}

export const ThemeIndicator: React.FC<ThemeIndicatorProps> = ({
  themeName,
  size = 'sm',
  showText = false
}) => {
  const themeColor = getThemeColor(themeName);
  const iconSize = size === 'sm' ? 3 : 4;
  
  return (
    <HStack spacing={2} align="center">
      <Box
        p={1}
        borderRadius="sm"
        bg={themeColor}
        color="white"
      >
        <ThemeIcon themeName={themeName} boxSize={iconSize} />
      </Box>
      {showText && (
        <Text fontSize={size === 'sm' ? 'xs' : 'sm'} color={themeColor} fontWeight="medium">
          {themeName}
        </Text>
      )}
    </HStack>
  );
};

// Theme selection button for forms
interface ThemeSelectionButtonProps {
  themeName: string;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ThemeSelectionButton: React.FC<ThemeSelectionButtonProps> = ({
  themeName,
  description,
  isSelected = false,
  onClick
}) => {
  const themeColor = getThemeColor(themeName);
  
  return (
    <Box
      p={4}
      border="2px"
      borderColor={isSelected ? themeColor : "gray.200"}
      borderRadius="md"
      cursor="pointer"
      transition="all 0.2s"
      bg={isSelected ? `${themeColor}10` : "transparent"}
      _hover={{
        borderColor: themeColor,
        bg: `${themeColor}05`
      }}
      onClick={onClick}
    >
      <HStack spacing={3} align="center">
        <Box
          p={2}
          borderRadius="md"
          bg={isSelected ? themeColor : "gray.100"}
          color={isSelected ? "white" : "gray.600"}
          transition="all 0.2s"
        >
          <ThemeIcon themeName={themeName} boxSize={5} />
        </Box>
        
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="medium" color={isSelected ? themeColor : "gray.700"}>
            {themeName}
          </Text>
          {description && (
            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

const ThemeVisuals = {
  ThemeColorDot,
  ThemeHeader,
  ThemeIndicator,
  ThemeSelectionButton
};

export default ThemeVisuals;