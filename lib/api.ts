/* API Get function */
export async function apiGET<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" })

  if (!res.ok) {
        throw new Error(await res.text())
    }

  return res.json()
}

/* API POST function */
export async function apiPOST<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
        throw new Error(await res.text())
    }

  return res.json()
}


/* User login */
export async function handleLogin(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json"
         },
        body: JSON.stringify({ email, password }),
    })

    return res
}


/* User logout */
export async function handleLogout(token: string) {
  const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({})
    })
    return res
}