import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../db";
import {
  hasGoogleAccountLinked,
  isGoogleAccountAlreadyLinked,
  generateAccountLinkingErrorUrl,
} from "../../../utils/auth-helpers";
import { verifyPassword } from "../../../utils/password";

export const authOptions: AuthOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    // Email/Password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password using our secure password utility
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Credentials authentication error:", error);
          return null;
        }
      },
    }),
    //   FacebookProvider({
    //     clientId: process.env.FACEBOOK_CLIENT_ID,
    //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    //   }),
  ],
  // TODO: implement this later
  // need api from sendgrid
  // need a company email address
  // need a
  // Passwordless / email sign in
  // EmailProvider({
  //   server: process.env.MAIL_SERVER,
  //   from: 'NextAuth.js <no-reply@example.com>'
  // }),
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // TODO: Redirect to a page to complete information (change profile photo, background image, description, first name, last name)
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow credentials authentication (email/password)
      if (account?.provider === "credentials") {
        return true;
      }

      // Handle account linking for Google authentication
      if (account?.provider === "google" && user?.email) {
        try {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this Google account is already linked
            if (
              isGoogleAccountAlreadyLinked(
                existingUser,
                account.providerAccountId
              )
            ) {
              // Account already linked, allow sign in
              return true;
            }

            // Check if user already has a Google account linked (different Google account)
            if (hasGoogleAccountLinked(existingUser)) {
              // User already has a different Google account linked
              // For security, don't automatically link - require manual linking
              return generateAccountLinkingErrorUrl(
                "A different Google account is already linked to this email"
              );
            }

            // Link this Google account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            // Update the user object to use the existing user's ID
            user.id = existingUser.id;
            return true;
          }

          // No existing user found, proceed with normal account creation
          return true;
        } catch (error) {
          console.error("Error during Google account linking:", error);
          return false;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth account_id and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken;
      if (token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  events: {
    // async signIn(message) {
    //   /* on successful sign in */
    // },
    //   async signOut(message) { /* on signout */ },
    async createUser(message) {
      const bgImgSrc =
        "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c";
      await prisma.user.update({
        where: {
          email: message.user.email as string,
        },
        data: {
          backGroundImage: bgImgSrc,
        },
      });
    },
    //   async updateUser(message) { /* user updated - e.g. their email was verified */ },
    async linkAccount(message) {
      // Log successful account linking for audit purposes
      console.log(
        `Account linked: ${message.account.provider} account ${message.account.providerAccountId} linked to user ${message.user.id}`
      );
    },
    //   async session(message) { /* session is active */ },
    //   async error(message) { /* error in authentication flow */ }
  },
};

export default NextAuth(authOptions);
