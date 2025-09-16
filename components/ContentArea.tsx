import React from "react";
import {
  Box,
  Fade,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { TabType } from "./TabNavigation";

interface ContentAreaProps {
  activeTab: TabType;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export default function ContentArea({
  activeTab,
  isLoading,
  error,
  onRetry,
  children,
}: ContentAreaProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Loading state
  if (isLoading) {
    return (
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={8}
        minH="400px"
      >
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
        </Center>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={8}
        minH="400px"
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="300px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Something went wrong!
          </AlertTitle>
          <AlertDescription maxWidth="sm" mb={4}>
            {error}
          </AlertDescription>
          {onRetry && (
            <Button colorScheme="teal" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </Alert>
      </Box>
    );
  }

  // Content with smooth transition
  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={6}
      minH="400px"
      position="relative"
      overflow="hidden"
    >
      <Fade 
        in={!isLoading} 
        transition={{ 
          enter: { duration: 0.3, delay: 0.1 },
          exit: { duration: 0.2 }
        }}
      >
        <Box
          key={activeTab} // Force re-render on tab change for smooth transitions
          transition="opacity 0.3s ease-in-out"
        >
          {children}
        </Box>
      </Fade>
    </Box>
  );
}