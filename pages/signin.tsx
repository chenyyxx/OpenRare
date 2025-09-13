import { getProviders, signIn } from "next-auth/react"
import { Button, Flex, Heading, Input, Divider, Text, Link, Alert, AlertIcon, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

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
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6} minWidth="400px">
        <Heading mb={6} textAlign="center">Sign in</Heading>
        
        {error && (
          <Alert status="error" mb={4} rounded="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleEmailPasswordSignIn}>
          <FormControl isInvalid={!!emailError} mb={3}>
            <FormLabel htmlFor="email">Email</FormLabel>
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

          <FormControl isInvalid={!!passwordError} mb={6}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input 
              id="password"
              placeholder="********" 
              variant="filled" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          </FormControl>

          <Button 
            type="submit"
            colorScheme="teal" 
            mb={3} 
            width="full"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign in
          </Button>
        </form>

        <Text textAlign="center" mb={3} fontSize="sm">
          Don&apos;t have an account?{' '}
          <NextLink href="/register">
            <Text as="span" color="teal.500" fontWeight="medium" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Create Account
            </Text>
          </NextLink>
        </Text>

        {oauthProviders.length > 0 && (
          <>
            <Divider mb={3}/>
            <Text textAlign="center" mb={3} fontSize="sm" color="gray.600">
              Or continue with
            </Text>
            {oauthProviders.map(provider => (
              <Button 
                key={provider.name} 
                variant="outline"
                mb={3} 
                width="full"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault()
                  signIn(provider.id, { callbackUrl: '/' })
                }}
                disabled={isLoading}
              >
                Sign in with {provider.name}
              </Button>
            ))}
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