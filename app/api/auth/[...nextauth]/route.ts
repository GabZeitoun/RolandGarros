import NextAuth, { type NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      if (email?.verificationRequest) {
        const invitation = await prisma.invitation.findUnique({
          where: { email: user.email },
        })

        if (!invitation) {
          return false // Prevent sign in if there's no valid invitation
        }

        if (invitation.expiresAt < new Date()) {
          await prisma.invitation.delete({ where: { id: invitation.id } })
          return false // Prevent sign in if the invitation has expired
        }

        // Update user role based on the invitation
        await prisma.user.update({
          where: { id: user.id },
          data: { role: invitation.role },
        })

        // Delete the used invitation
        await prisma.invitation.delete({ where: { id: invitation.id } })
      }

      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

