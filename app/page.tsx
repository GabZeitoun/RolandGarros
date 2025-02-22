import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Calendar from "@/components/Calendar"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Roland Garros Booking</h1>
        <p>Please sign in to view and book seats.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Roland Garros Booking Calendar</h1>
      <Calendar />
    </div>
  )
}

