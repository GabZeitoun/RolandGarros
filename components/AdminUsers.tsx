"use client"

import { useState } from "react"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type Props = {
  users: User[]
}

export default function AdminUsers({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers)

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)))
      } else {
        console.error("Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="friend">Friend</option>
                  <option value="family">Family</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

