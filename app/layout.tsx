import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Roland Garros Booking",
  description: "Book your seats for Roland Garros",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-green-700 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Roland Garros Booking
            </Link>
            <div>
              {session ? (
                <>
                  <span className="mr-4">Welcome, {session.user?.name}</span>
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="mr-4 text-yellow-300 hover:underline">
                      Admin
                    </Link>
                  )}
                  <Link href="/api/auth/signout" className="bg-white text-green-700 px-4 py-2 rounded">
                    Sign out
                  </Link>
                </>
              ) : (
                <Link href="/api/auth/signin" className="bg-white text-green-700 px-4 py-2 rounded">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'