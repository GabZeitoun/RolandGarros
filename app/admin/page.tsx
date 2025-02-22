import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import AdminBookings from "@/components/AdminBookings"
import AdminUsers from "@/components/AdminUsers"
import AdminInvitations from "@/components/AdminInvitations"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  const bookings = await prisma.booking.findMany({
    include: { user: true },
    orderBy: { day: "asc" },
  })

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  })

  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <AdminInvitations invitations={invitations} />
      <AdminBookings bookings={bookings} />
      <AdminUsers users={users} />
    </div>
  )
}

