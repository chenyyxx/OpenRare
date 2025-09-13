import { Flex, Heading, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function Register() {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6} textAlign="center">
        <Heading mb={6}>Registration</Heading>
        <Text mb={4}>Registration page coming soon!</Text>
        <NextLink href="/signin" passHref>
          <Link color="teal.500" fontWeight="medium">
            Back to Sign In
          </Link>
        </NextLink>
      </Flex>
    </Flex>
  )
}