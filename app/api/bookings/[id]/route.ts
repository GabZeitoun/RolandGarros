import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  const { status } = await request.json()

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    })

    if (status === "cancelled") {
      // Check if there's anyone on the waitlist
      const waitlistEntry = await prisma.waitlist.findFirst({
        where: {
          day: updatedBooking.day,
          session: updatedBooking.session,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      if (waitlistEntry) {
        // Move the first person from the waitlist to a confirmed booking
        await prisma.booking.create({
          data: {
            userId: waitlistEntry.userId,
            day: waitlistEntry.day,
            seat: updatedBooking.seat,
            session: waitlistEntry.session,
            isVIP: waitlistEntry.isVIP,
            status: "confirmed",
          },
        })

        // Remove the entry from the waitlist
        await prisma.waitlist.delete({
          where: { id: waitlistEntry.id },
        })

        // Send notification email to the user who got moved from waitlist
        const user = await prisma.user.findUnique({
          where: { id: waitlistEntry.userId },
        })
        if (user && user.email) {
          await sendEmail(
            user.email,
            "Booking Confirmed",
            `Your waitlist entry for day ${waitlistEntry.day} has been converted to a confirmed booking.`,
          )
        }
      }
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

async function sendEmail(to: string, subject: string, body: string) {
  // Implement email sending logic here
  console.log(`Sending email to ${to}: ${subject} - ${body}`)
}

