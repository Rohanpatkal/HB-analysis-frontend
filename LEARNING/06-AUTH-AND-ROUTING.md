# Authentication & Routing

## How Auth Works (No Backend Sessions)

This app uses **localStorage-based auth** — no cookies, no sessions.

When you log in:
1. Frontend calls `POST /api/user/login`
2. Backend returns `{ userId, token }`
3. Frontend stores both in `localStorage`:
   - `hb_userId` → the user's MongoDB ID
   - `hb_token` → JWT token

On every page load:
1. `UserProvider` mounts
2. `useEffect` reads `localStorage`
3. Sets `userId` and `token` in state
4. Sets `ready = true`

---

## The Auth Guard Pattern

```js
// In dashboard/page.js
function Dashboard() {
  const { userId, ready } = useUser();
  const router = useRouter();

  // 1. Wait for localStorage read
  if (!ready) return <LoadingScreen message="Starting up…" />;

  // 2. Not logged in → redirect to login
  if (!userId) {
    router.replace("/login");
    return null;
  }

  // 3. Logged in → render dashboard
  return <DashboardProvider>...</DashboardProvider>;
}
```

**Why `router.replace` instead of `router.push`?**
`replace` doesn't add to browser history — so the back button won't
take you back to the dashboard after signing out.

---

## Login → Dashboard Flow

```
User submits login form (LoginForm.jsx)
  ↓
loginUser({ email, password }) called
  ↓
POST /api/user/login
  ↓
{ userId, token } returned
  ↓
login(userId, token) called on UserContext
  ↓
localStorage.setItem("hb_userId", userId)
localStorage.setItem("hb_token", token)
  ↓
router.push("/dashboard")
  ↓
Dashboard loads, reads userId from context
  ↓
DashboardProvider fetches all analytics data
```

---

## Sign Out Flow

```
User clicks "Sign Out" (TopNav.jsx)
  ↓
handleSignOut() called
  ↓
logout() called on UserContext
  ↓
localStorage.removeItem("hb_userId")
localStorage.removeItem("hb_token")
  ↓
userId = null in state
  ↓
router.push("/login")
  ↓
Login page shown
```

---

## Route Protection Summary

| Route | Protection | What happens if not logged in |
|---|---|---|
| `/` | None (public landing) | Page renders normally |
| `/login` | None (public) | Page renders normally |
| `/dashboard` | Auth guard in page.js | Redirect to `/login` |

---

## Why There's No Middleware

Next.js supports `middleware.js` for server-side route protection.
This app doesn't use it because:
1. Auth is stored in `localStorage` (browser-only, not readable server-side)
2. The client-side guard in `dashboard/page.js` is sufficient
3. The dashboard has no sensitive server-rendered data to protect

If JWT token was stored in a cookie instead, middleware would be
the better approach.

---

## Token Usage

The JWT token is stored but currently **not sent in API requests**.
Looking at `lib/api.js`:

```js
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    // ← No Authorization header here
    ...options,
  });
```

The backend identifies users via the `userId` in the URL path
(`/stats/:userId/...`) rather than the JWT token in headers.
The token is kept for future use or if the backend adds token validation.
