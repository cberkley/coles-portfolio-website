import { useEffect, useState } from 'react'

type AuthMe = {
  clientPrincipal: {
    userId: string
    userRoles: string[]
    identityProvider: string
    userDetails: string
  } | null
}

/**
 * Returns whether the current user is the site admin.
 *
 * Local dev: true whenever VITE_CLIENT_PRINCIPAL_ID is set (simulates being logged in).
 * Production: fetches /.auth/me (Azure Static Web Apps) and compares the userId
 *             against VITE_ADMIN_PRINCIPAL_ID.
 */
export function userIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Local dev shortcut — any non-empty VITE_CLIENT_PRINCIPAL_ID counts as admin
    if (import.meta.env.DEV) {
      const localId = import.meta.env.VITE_CLIENT_PRINCIPAL_ID as string | undefined
      setIsAdmin(Boolean(localId))
      setIsLoading(false)
      return
    }

    // Production: check Azure Static Web Apps identity endpoint
    const adminId = import.meta.env.VITE_ADMIN_PRINCIPAL_ID as string | undefined
    if (!adminId) {
      setIsLoading(false)
      return
    }

    fetch('/.auth/me')
      .then((res) => res.json() as Promise<AuthMe>)
      .then(({ clientPrincipal }) => {
        setIsAdmin(clientPrincipal?.userId === adminId)
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setIsLoading(false))
  }, [])

  return { isAdmin, isLoading }
}
