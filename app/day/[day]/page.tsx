import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import BookingForm from "@/components/BookingForm"

export default async function DayPage({
  params,
  searchParams,
}: { params: { day: string }; searchParams: { session?: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to view and book seats.</p>
      </div>
    )
  }

  const day = Number.parseInt(params.day)
  const bookingSession = searchParams.session || "day"

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Booking for Day {day + 1}</h1>
      <h2 className="text-xl mb-4">{bookingSession.charAt(0).toUpperCase() + bookingSession.slice(1)} Session</h2>
      <BookingForm day={day} session={bookingSession as "day" | "night"} />
    </div>
  )
}

