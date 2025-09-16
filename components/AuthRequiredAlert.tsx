import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  useColorModeValue,
  Box,
  CloseButton,
  Slide,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";

interface AuthRequiredAlertProps {
  action: string; // e.g., "comment", "create a post", "reply"
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthRequiredAlert({ action, isOpen, onClose }: AuthRequiredAlertProps) {
  const alertBg = useColorModeValue("orange.50", "orange.900");
  const alertColor = useColorModeValue("orange.800", "orange.200");
  const borderColor = useColorModeValue("orange.200", "orange.700");

  return (
    <Slide direction="bottom" in={isOpen} style={{ zIndex: 1000 }}>
      <Box
        position="fixed"
        bottom={{ base: "4", md: "6" }}
        left={{ base: "4", md: "50%" }}
        right={{ base: "4", md: "auto" }}
        transform={{ base: "none", md: "translateX(-50%)" }}
        w={{ base: "auto", md: "500px" }}
        maxW={{ base: "none", md: "500px" }}
      >
        <Alert
          status="warning"
          variant="subtle"
          bg={alertBg}
          color={alertColor}
          border="1px"
          borderColor={borderColor}
          rounded="2xl"
          p={4}
          boxShadow="xl"
          position="relative"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm" mb={1}>
              Sign in required!
            </AlertTitle>
            <AlertDescription fontSize="sm">
              You need to be signed in to {action}.
            </AlertDescription>
          </Box>
          <HStack spacing={2} ml={4}>
            <Button
              size="sm"
              colorScheme="orange"
              variant="solid"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          </HStack>
          <CloseButton
            position="absolute"
            right="2"
            top="2"
            size="sm"
            onClick={onClose}
          />
        </Alert>
      </Box>
    </Slide>
  );
}