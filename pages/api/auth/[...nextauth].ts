import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";
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
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true
    // },
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
    //   async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
    //   async session(message) { /* session is active */ },
    //   async error(message) { /* error in authentication flow */ }
  },
}

export default NextAuth(authOptions);
