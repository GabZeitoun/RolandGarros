"use client"

import { useState } from "react"
import Link from "next/link"

const DAYS = 14
const SEATS = 5

type Booking = {
  id: string
  seat: number
  session: "day" | "night"
  user: string
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  { id: "1", seat: 1, session: "day", user: "John Doe" },
  { id: "2", seat: 2, session: "night", user: "Jane Smith" },
  // Add more mock bookings as needed
]

export default function Calendar() {
  const [startDate] = useState(new Date(2023, 4, 22)) // May 22, 2023 (Roland Garros typically starts in late May)

  const getDateString = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getBookingsForDay = (day: number, session: "day" | "night") => {
    // In a real application, this would fetch data from your API
    return mockBookings.filter(
      (booking) => new Date(booking.id).getDate() === startDate.getDate() + day && booking.session === session,
    )
  }

  return (
    <div className="grid grid-cols-7 gap-4">
      {[...Array(DAYS)].map((_, day) => {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + day)
        const dayBookings = getBookingsForDay(day, "day")
        const nightBookings = getBookingsForDay(day, "night")

        return (
          <div key={day} className="border p-2">
            <h3 className="font-bold">{getDateString(currentDate)}</h3>
            <Link href={`/day/${day}`} className="block mt-2 text-blue-600 hover:underline">
              Day Session ({SEATS - dayBookings.length} available)
            </Link>
            <Link href={`/day/${day}?session=night`} className="block mt-2 text-blue-600 hover:underline">
              Night Session ({SEATS - nightBookings.length} available)
            </Link>
          </div>
        )
      })}
    </div>
  )
}

