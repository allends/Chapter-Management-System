import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
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
      session.id = user.id
      session.role = user.role
      
      return session
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      // sign in logic
      return true
    },

  },
  events: {
    async createUser({ user }: any ) {
      // TODO: make the first and last name fields populated
    },
  }
}

export default NextAuth(authOptions)