"use client"

import type React from "react"

import { useState } from "react"

type Invitation = {
  id: string
  email: string
  role: string
  createdAt: Date
  expiresAt: Date
}

type Props = {
  invitations: Invitation[]
}

export default function AdminInvitations({ invitations: initialInvitations }: Props) {
  const [invitations, setInvitations] = useState(initialInvitations)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("friend")

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      })

      if (response.ok) {
        const newInvitation = await response.json()
        setInvitations([newInvitation, ...invitations])
        setEmail("")
        setRole("friend")
      } else {
        console.error("Failed to send invitation")
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Invitations</h2>
      <form onSubmit={handleInvite} className="mb-4 space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="border rounded px-2 py-1 w-full"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded px-2 py-1 w-full">
          <option value="friend">Friend</option>
          <option value="family">Family</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Send Invitation
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Expires At</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => (
            <tr key={invitation.id}>
              <td className="py-2 px-4 border-b">{invitation.email}</td>
              <td className="py-2 px-4 border-b">{invitation.role}</td>
              <td className="py-2 px-4 border-b">{new Date(invitation.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(invitation.expiresAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

