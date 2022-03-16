import { getProviders, signIn } from "next-auth/react"
import { Butoon, Button, Flex, Heading, Input} from '@chakra-ui/react'
import Head from "next/head"

export default function SignIn({ providers }) {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6}>Sign in</Heading>
        <Input placeholder="abc@example.com" variant="filled" mb={3} type="email" />
        <Input placeholder="********" variant="filled" mb={6} type="password" />
        <Button colorScheme="teal" mb={3}>Sign in</Button>
        {Object.values(providers).map((provider) => (
          <Button colorScheme="teal" mb={3} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        ))}
      </Flex>
      
    </Flex>
    // 
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/