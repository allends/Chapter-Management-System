import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { signIn } from "next-auth/react"
import prisma from "../../../lib/prisma"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",    
    }),
    // ...add more providers here
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET ?? "",
  callbacks: {
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.id = user.id
      
      return session
    }
  }
}

export default NextAuth(authOptions)