"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

const SEATS = 5

type Props = {
  day: number
  session: "day" | "night"
}

export default function BookingForm({ day, session }: Props) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [isVIP, setIsVIP] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSeat === null) return

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day,
          seat: selectedSeat,
          bookingSession: session,
          isVIP,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.waitlistEntry) {
          setMessage("All seats are booked. You've been added to the waitlist.")
        } else {
          setMessage("Booking confirmed!")
          setTimeout(() => router.push("/"), 2000) // Redirect after 2 seconds
        }
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select a seat:</h3>
        <div className="flex space-x-2">
          {[...Array(SEATS)].map((_, seat) => (
            <button
              key={seat}
              type="button"
              onClick={() => setSelectedSeat(seat)}
              className={`w-12 h-12 rounded ${selectedSeat === seat ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {seat + 1}
            </button>
          ))}
        </div>
      </div>
      {session === "day" && (
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isVIP}
              onChange={(e) => setIsVIP(e.target.checked)}
              className="form-checkbox"
            />
            <span>Add VIP lunch option</span>
          </label>
        </div>
      )}
      <button
        type="submit"
        disabled={selectedSeat === null || isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? "Processing..." : "Book Seat"}
      </button>
      {message && <p className="text-sm font-semibold">{message}</p>}
    </form>
  )
}

