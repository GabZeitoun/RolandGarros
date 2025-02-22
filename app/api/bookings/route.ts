import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const MAX_SEATS = 5

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { day, seat, bookingSession, isVIP } = await request.json()

  try {
    // Check if the seat is available
    const existingBookings = await prisma.booking.count({
      where: {
        day,
        session: bookingSession,
        status: "confirmed",
      },
    })

    if (existingBookings < MAX_SEATS) {
      // Seat is available, create a booking
      const booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          day,
          seat,
          session: bookingSession,
          isVIP,
          status: "confirmed",
        },
      })

      // Send confirmation email
      await sendEmail(
        session.user.email,
        "Booking Confirmation",
        `Your booking for day ${day}, seat ${seat} has been confirmed.`,
      )

      return NextResponse.json(booking)
    } else {
      // All seats are booked, add to waitlist
      const waitlistEntry = await prisma.waitlist.create({
        data: {
          userId: session.user.id,
          day,
          session: bookingSession,
          isVIP,
        },
      })

      // Send waitlist notification email
      await sendEmail(
        session.user.email,
        "Waitlist Notification",
        `You have been added to the waitlist for day ${day}.`,
      )

      return NextResponse.json({ message: "Added to waitlist", waitlistEntry })
    }
  } catch (error) {
    console.error("Error processing booking:", error)
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 })
  }
}

async function sendEmail(to: string, subject: string, body: string) {
  // Implement email sending logic here
  console.log(`Sending email to ${to}: ${subject} - ${body}`)
}

