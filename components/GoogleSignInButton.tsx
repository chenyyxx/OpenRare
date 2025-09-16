import { Button, HStack, Image, Text } from '@chakra-ui/react'
import { ReactElement } from 'react'

interface GoogleSignInButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  variant?: 'default' | 'dark'
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </g>
  </svg>
)

export default function GoogleSignInButton({ 
  onClick, 
  disabled = false, 
  isLoading = false,
  variant = 'default'
}: GoogleSignInButtonProps): ReactElement {
  const isDark = variant === 'dark'
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      width="full"
      size="lg"
      bg={isDark ? '#1f1f1f' : 'white'}
      color={isDark ? 'white' : '#3c4043'}
      border="2px solid"
      borderColor={isDark ? '#5f6368' : 'gray.300'}
      rounded="full"
      fontWeight="500"
      fontSize="md"
      _hover={{
        bg: isDark ? '#2d2d2d' : '#f8f9fa',
        borderColor: isDark ? '#5f6368' : 'gray.400',
        transform: "translateY(-1px)",
        shadow: "md"
      }}
      _active={{
        bg: isDark ? '#1f1f1f' : '#ecf3fe',
        borderColor: isDark ? '#5f6368' : '#4285f4',
        transform: "translateY(0)",
      }}
      _focus={{
        borderColor: '#4285f4',
        boxShadow: '0 0 0 1px #4285f4',
      }}
      _disabled={{
        opacity: 0.38,
        cursor: 'not-allowed',
      }}
      transition="all 0.2s ease"
    >
      <HStack spacing={3} justify="center" align="center">
        <GoogleIcon />
        <Text fontSize="md" fontWeight="500">Sign in with Google</Text>
      </HStack>
    </Button>
  )
}