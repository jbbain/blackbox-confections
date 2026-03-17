import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AdminAuthCtx = createContext(null)

/*
  Simple admin authentication state.
  Stores login state in localStorage.

  NOTE:
  This is a lightweight client-side login gate.
  For production security you would implement
  backend authentication (JWT/session).
*/

export function AdminAuthProvider({ children }) {

  const [isAuthed, setIsAuthed] = useState(
    () => localStorage.getItem("bb_admin_authed") === "true"
  )

  useEffect(() => {
    localStorage.setItem("bb_admin_authed", isAuthed ? "true" : "false")
  }, [isAuthed])

  const login = (password) => {

    const expected = import.meta.env.VITE_ADMIN_PASSWORD || "blackbox"

    if ((password || "").trim() === expected) {
      setIsAuthed(true)
      return true
    }

    return false
  }

  const logout = () => {
    setIsAuthed(false)
  }

  const value = useMemo(() => ({
    isAuthed,
    login,
    logout
  }), [isAuthed])

  return (
    <AdminAuthCtx.Provider value={value}>
      {children}
    </AdminAuthCtx.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthCtx)