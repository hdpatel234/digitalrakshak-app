"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LogoutPage() {
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/sign-in"

  useEffect(() => {
    signOut({ callbackUrl })
  }, [callbackUrl])

  return null
}
