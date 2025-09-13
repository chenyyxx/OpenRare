import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import {
  hasGoogleAccountLinked,
  isGoogleAccountAlreadyLinked,
  generateAccountLinkingErrorUrl,
} from "../../../utils/auth-helpers";
// import { redirect } from 'next/dist/server/api-utils';

export const authOptions: AuthOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
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
    async signIn({ user, account, profile, email, credentials }) {
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
      return baseUrl;
    },
    // async session({ session, user, token }) {
    //   return session
    // },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   return token
    // }
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
