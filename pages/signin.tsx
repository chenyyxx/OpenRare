import { getProviders, signIn } from "next-auth/react"
import { Button, Flex, Heading, Input, Divider} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

interface Provider {
  id: string,
  name: string,
  type: string,
  signinUrl: string,
  callbackUrl: string
}

interface Providers extends Array<Provider>{}

export default function SignIn({providers}:{providers: Providers} ) {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6}>Sign in</Heading>
        <Input placeholder="abc@example.com" variant="filled" mb={3} type="email" />
        <Input placeholder="********" variant="filled" mb={6} type="password" />
        <Button colorScheme="teal" mb={3}>Sign in</Button>
        <Divider colorScheme="white" mb={3}/>

        {/* Facebook */}
        {/* <Button w={'full'} colorScheme={'facebook'} leftIcon={<FaFacebook />}>
          <Center>
            <Text>Continue with Facebook</Text>
          </Center>
        </Button> */}

        {/* Google */}
        {/* <Button w={'full'} variant={'outline'} leftIcon={<FcGoogle />}>
          <Center>
            <Text>Sign in with Google</Text>
          </Center>
        </Button> */}
        {Object.values(providers).map(provider => (
          <Button key={provider.name} colorScheme="teal" mb={3} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        ))}
      </Flex>
      
    </Flex>
    // 
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