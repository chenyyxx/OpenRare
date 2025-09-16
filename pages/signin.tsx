import { getProviders, signIn } from "next-auth/react"
import { Button, Flex, Heading, Input, Divider, Text, Alert, AlertIcon, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { MODERN_PALETTE, TYPOGRAPHY } from '../utils/theme-constants'

interface Provider {
  id: string,
  name: string,
  type: string,
  signinUrl: string,
  callbackUrl: string
}

interface Providers extends Array<Provider>{}

export default function SignIn({providers}:{providers: Providers} ) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailPasswordSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')

    // Client-side validation
    if (!email) {
      setEmailError('Email is required')
      return
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    if (!password) {
      setPasswordError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        callbackUrl: '/',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        // Successful sign in, redirect to root
        router.replace('/')
      }
    } catch (err) {
      setError('An error occurred during sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter out credentials provider from OAuth providers
  const oauthProviders = Object.values(providers).filter(provider => provider.id !== 'credentials')

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" bg={MODERN_PALETTE.neutral[100]} px={{ base: 4, md: 0 }}>
      <Flex 
        direction="column" 
        background="white" 
        p={{ base: 6, md: 12 }} 
        rounded="2xl" 
        w={{ base: "full", md: "450px" }}
        maxW="450px"
        shadow="2xl" 
        border="1px" 
        borderColor={MODERN_PALETTE.neutral[200]}
      >
        <Heading 
          mb={8} 
          textAlign="center" 
          fontSize={TYPOGRAPHY.fontSize['3xl']}
          color={MODERN_PALETTE.neutral[800]}
          fontWeight="bold"
        >
          Sign in
        </Heading>
        
        {error && (
          <Alert status="error" mb={6} rounded="xl" bg={MODERN_PALETTE.accent.error} color="white">
            <AlertIcon color="white" />
            <Text fontSize={TYPOGRAPHY.fontSize.md} fontWeight="medium">{error}</Text>
          </Alert>
        )}

        <form onSubmit={handleEmailPasswordSignIn}>
          <FormControl isInvalid={!!emailError} mb={5}>
            <FormLabel 
              htmlFor="email" 
              fontSize={TYPOGRAPHY.fontSize.lg}
              fontWeight="semibold"
              color={MODERN_PALETTE.neutral[700]}
            >
              Email
            </FormLabel>
            <Input 
              id="email"
              placeholder="abc@example.com" 
              variant="filled" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              size="lg"
              fontSize={TYPOGRAPHY.fontSize.md}
              bg={MODERN_PALETTE.neutral[50]}
              border="2px"
              borderColor={emailError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.neutral[200]}
              rounded="xl"
              _hover={{
                borderColor: emailError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.primary[400]
              }}
              _focus={{
                borderColor: emailError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.primary[500],
                bg: "white"
              }}
            />
            <FormErrorMessage fontSize={TYPOGRAPHY.fontSize.sm} fontWeight="medium">
              {emailError}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!passwordError} mb={8}>
            <FormLabel 
              htmlFor="password"
              fontSize={TYPOGRAPHY.fontSize.lg}
              fontWeight="semibold"
              color={MODERN_PALETTE.neutral[700]}
            >
              Password
            </FormLabel>
            <Input 
              id="password"
              placeholder="********" 
              variant="filled" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              size="lg"
              fontSize={TYPOGRAPHY.fontSize.md}
              bg={MODERN_PALETTE.neutral[50]}
              border="2px"
              borderColor={passwordError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.neutral[200]}
              rounded="xl"
              _hover={{
                borderColor: passwordError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.primary[400]
              }}
              _focus={{
                borderColor: passwordError ? MODERN_PALETTE.accent.error : MODERN_PALETTE.primary[500],
                bg: "white"
              }}
            />
            <FormErrorMessage fontSize={TYPOGRAPHY.fontSize.sm} fontWeight="medium">
              {passwordError}
            </FormErrorMessage>
          </FormControl>

          <Button 
            type="submit"
            colorScheme="teal"
            mb={5} 
            width="full"
            size="lg"
            fontWeight="500"
            rounded="full"
            isLoading={isLoading}
            loadingText="Signing in..."
            _hover={{
              transform: "translateY(-1px)",
              shadow: "md"
            }}
          >
            Sign in
          </Button>
        </form>

        <Text textAlign="center" mb={5} fontSize={TYPOGRAPHY.fontSize.md} color={MODERN_PALETTE.neutral[600]}>
          Don&apos;t have an account?{' '}
          <NextLink href="/register">
            <Text 
              as="span" 
              color="blue.500" 
              fontWeight="semibold" 
              cursor="pointer" 
              _hover={{ 
                textDecoration: 'underline',
                color: MODERN_PALETTE.primary[600]
              }}
            >
              Create Account
            </Text>
          </NextLink>
        </Text>

        {oauthProviders.length > 0 && (
          <>
            <Divider mb={5} borderColor={MODERN_PALETTE.neutral[300]}/>
            <Text 
              textAlign="center" 
              mb={5} 
              fontSize={TYPOGRAPHY.fontSize.md} 
              color={MODERN_PALETTE.neutral[600]}
              fontWeight="medium"
            >
              Or continue with
            </Text>
            {oauthProviders.map(provider => {
              if (provider.id === 'google') {
                return (
                  <GoogleSignInButton
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    disabled={isLoading}
                    isLoading={false}
                  />
                )
              }
              
              // For other OAuth providers, use the default button
              return (
                <Button 
                  key={provider.name} 
                  variant="outline"
                  mb={3} 
                  width="full"
                  size="lg"
                  rounded="full"
                  fontWeight="500"
                  fontSize="md"
                  border="2px"
                  borderColor="gray.300"
                  _hover={{
                    borderColor: "gray.400",
                    transform: "translateY(-1px)",
                    shadow: "md"
                  }}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault()
                    signIn(provider.id, { callbackUrl: '/' })
                  }}
                  disabled={isLoading}
                >
                  Sign in with {provider.name}
                </Button>
              )
            })}
          </>
        )}
      </Flex>
    </Flex>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

// export async function getServerSideProps(context) {
//   const providers = await getProviders()
//   return {
//     props: { providers },
//   }
// }