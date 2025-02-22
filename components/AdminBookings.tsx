"use client"

import { useState } from "react"

type Booking = {
  id: string
  day: number
  seat: number
  session: string
  isVIP: boolean
  status: string
  user: {
    name: string
    email: string
  }
}

type Props = {
  bookings: Booking[]
}

export default function AdminBookings({ bookings: initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings)

  const handleCancelBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" } : booking)))
      } else {
        console.error("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Day</th>
            <th className="py-2 px-4 border-b">Seat</th>
            <th className="py-2 px-4 border-b">Session</th>
            <th className="py-2 px-4 border-b">VIP</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="py-2 px-4 border-b">{booking.day}</td>
              <td className="py-2 px-4 border-b">{booking.seat}</td>
              <td className="py-2 px-4 border-b">{booking.session}</td>
              <td className="py-2 px-4 border-b">{booking.isVIP ? "Yes" : "No"}</td>
              <td className="py-2 px-4 border-b">{booking.status}</td>
              <td className="py-2 px-4 border-b">{booking.user.name}</td>
              <td className="py-2 px-4 border-b">
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

