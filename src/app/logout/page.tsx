"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { callInternalLogout } from "@/services/auth/logout"

export default function LogoutPage() {
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/sign-in"

  useEffect(() => {
    const logout = async () => {
      await callInternalLogout()
      await signOut({ callbackUrl })
    }

    logout()
  }, [callbackUrl])

  return null
}
