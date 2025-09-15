import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  Alert,
  AlertIcon,
  Progress,
  Box,
  List,
  ListItem,
  ListIcon,
  VStack,
  HStack,
  Divider
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { getProviders, signIn } from "next-auth/react"
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { validatePassword } from '../utils/password-client'
import type { PasswordValidationResult } from '../types/password'
import GoogleSignInButton from '../components/GoogleSignInButton'



interface Provider {
  id: string,
  name: string,
  type: string,
  signinUrl: string,
  callbackUrl: string
}

interface Providers extends Array<Provider>{}

export default function Register({providers}: {providers: Providers}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null)

  const router = useRouter()

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Real-time password validation
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password)
      setPasswordValidation(validation)
    } else {
      setPasswordValidation(null)
    }
  }, [password])

  // Password strength color mapping
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'red'
      case 'medium': return 'yellow'
      case 'strong': return 'green'
      default: return 'gray'
    }
  }

  // Password strength percentage
  const getStrengthPercentage = (strength: string) => {
    switch (strength) {
      case 'weak': return 33
      case 'medium': return 66
      case 'strong': return 100
      default: return 0
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')


    // Client-side validation
    let hasErrors = false

    if (!email) {
      setEmailError('Email is required')
      hasErrors = true
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      hasErrors = true
    }

    if (!password) {
      setPasswordError('Password is required')
      hasErrors = true
    } else if (passwordValidation && !passwordValidation.isValid) {
      setPasswordError('Password does not meet requirements')
      hasErrors = true
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password')
      hasErrors = true
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          name: name.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // Redirect to sign-in page after successful registration
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      } else {
        {
          setError(data.message || 'Registration failed. Please try again.')
        }
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" p={4}>
      <Flex direction="column" background="gray.100" p={8} rounded={6} minWidth="450px" maxWidth="500px">
        <Heading mb={6} textAlign="center">Create Account</Heading>
        
        {error && (
          <Alert status="error" mb={4} rounded="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {success && (
          <Alert status="success" mb={4} rounded="md">
            <AlertIcon />
            {success}
          </Alert>
        )}



        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="name">Name (Optional)</FormLabel>
            <Input 
              id="name"
              placeholder="Your full name" 
              variant="filled" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </FormControl>

          <FormControl isInvalid={!!emailError} mb={4}>
            <FormLabel htmlFor="email">Email *</FormLabel>
            <Input 
              id="email"
              placeholder="abc@example.com" 
              variant="filled" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <FormErrorMessage>{emailError}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!passwordError} mb={4}>
            <FormLabel htmlFor="password">Password *</FormLabel>
            <Input 
              id="password"
              placeholder="Create a strong password" 
              variant="filled" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
            
            {/* Password Strength Indicator */}
            {passwordValidation && (
              <Box mt={2}>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" color="gray.600">Password Strength:</Text>
                  <Text fontSize="sm" fontWeight="medium" color={`${getStrengthColor(passwordValidation.strength)}.500`}>
                    {passwordValidation.strength.charAt(0).toUpperCase() + passwordValidation.strength.slice(1)}
                  </Text>
                </HStack>
                <Progress 
                  value={getStrengthPercentage(passwordValidation.strength)} 
                  colorScheme={getStrengthColor(passwordValidation.strength)}
                  size="sm"
                  mb={2}
                />
                
                {/* Password Requirements */}
                <Box fontSize="sm">
                  <Text color="gray.600" mb={1}>Password Requirements:</Text>
                  <List spacing={1}>
                    <ListItem>
                      <ListIcon 
                        as={password.length >= 8 ? CheckIcon : CloseIcon} 
                        color={password.length >= 8 ? 'green.500' : 'red.500'} 
                      />
                      At least 8 characters
                    </ListItem>
                    <ListItem>
                      <ListIcon 
                        as={/[A-Z]/.test(password) ? CheckIcon : CloseIcon} 
                        color={/[A-Z]/.test(password) ? 'green.500' : 'red.500'} 
                      />
                      One uppercase letter
                    </ListItem>
                    <ListItem>
                      <ListIcon 
                        as={/[a-z]/.test(password) ? CheckIcon : CloseIcon} 
                        color={/[a-z]/.test(password) ? 'green.500' : 'red.500'} 
                      />
                      One lowercase letter
                    </ListItem>
                    <ListItem>
                      <ListIcon 
                        as={/\d/.test(password) ? CheckIcon : CloseIcon} 
                        color={/\d/.test(password) ? 'green.500' : 'red.500'} 
                      />
                      One number
                    </ListItem>
                    <ListItem>
                      <ListIcon 
                        as={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? CheckIcon : CloseIcon} 
                        color={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'green.500' : 'red.500'} 
                      />
                      One special character
                    </ListItem>
                  </List>
                </Box>
              </Box>
            )}
          </FormControl>

          <FormControl isInvalid={!!confirmPasswordError} mb={6}>
            <FormLabel htmlFor="confirmPassword">Confirm Password *</FormLabel>
            <Input 
              id="confirmPassword"
              placeholder="Confirm your password" 
              variant="filled" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
          </FormControl>

          <Button 
            type="submit"
            colorScheme="teal" 
            mb={4} 
            width="full"
            isLoading={isLoading}
            loadingText="Creating Account..."
            disabled={isLoading || (passwordValidation ? !passwordValidation.isValid : false)}
          >
            Create Account
          </Button>
        </form>

        <Text textAlign="center" fontSize="sm" color="gray.600" mb={4}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>

        <Text textAlign="center" fontSize="sm">
          Already have an account?{' '}
          <NextLink href="/signin">
            <Text as="span" color="teal.500" fontWeight="medium" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Sign In
            </Text>
          </NextLink>
        </Text>
      </Flex>
    </Flex>
  )
}