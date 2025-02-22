import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email, role } = await request.json()

  try {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        createdBy: session.user.id,
      },
    })

    // Send invitation email
    await sendInvitationEmail(email, token, role)

    return NextResponse.json({ message: "Invitation sent successfully" })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}

async function sendInvitationEmail(email: string, token: string, role: string) {
  // Implement email sending logic here
  console.log(`Sending invitation email to ${email} with token ${token} for role ${role}`)
}

