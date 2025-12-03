# Voluntry API Endpoints

## Base URL
All endpoints are prefixed with the base URL (e.g., `http://localhost:4000`)

---

## Authentication

### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

**Response:** `201`
```json
{
  "token": "JWT access token",
  "refreshToken": "JWT refresh token",
  "user": { "id", "name", "email", "role", "profile" }
}
```

**Notes:** Validates email uniqueness, hashes password, returns tokens.

---

### POST `/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200`
```json
{
  "token": "JWT access token",
  "refreshToken": "JWT refresh token",
  "user": { "id", "name", "email", "role", "profile" }
}
```

**Error:** `401` on invalid credentials.

---

### POST `/auth/refresh`
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Response:** `200`
```json
{
  "token": "new JWT access token",
  "refreshToken": "new JWT refresh token"
}
```

---

### POST `/auth/logout`
Logout user (revokes refresh token).

**Auth:** Required

**Response:** `200`
```json
{
  "message": "Logged out successfully"
}
```

---

## Users / Profile

### GET `/users/me`
Get current user profile.

**Auth:** Required

**Response:** `200`
```json
{
  "user": {
    "id", "name", "email", "role", "profile", "stats",
    "createdAt", "updatedAt"
  }
}
```

---

### PUT `/users/me`
Update current user profile (partial update).

**Auth:** Required

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "phone": "string",
  "bio": "string",
  "location": "string",
  "skills": ["string"],
  "availability": "string",
  "avatarUrl": "string",
  "socials": [{"provider": "string", "handle": "string"}]
}
```

**Response:** `200`
```json
{
  "user": { "id", "name", "email", "role", "profile", "stats" }
}
```

---

### DELETE `/users/me`
Delete current user account.

**Auth:** Required

**Response:** `200`
```json
{
  "message": "User and all associated data deleted successfully"
}
```

**Notes:** Deletes user, chat messages, activities, and attendance records.

---

### GET `/users/:id`
Get public view of user profile.

**Auth:** Required

**Response:** `200`
```json
{
  "userPublic": {
    "id", "name",
    "profile": { "bio", "location", "skills", "avatarUrl", "socials" },
    "stats": { "hoursContributed", "eventsCompleted", "impactPoints" }
  }
}
```

**Notes:** No sensitive fields (email, password, etc.).

---

### GET `/users`
Admin endpoint to list users with pagination.

**Auth:** Required (Admin only)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response:** `200`
```json
{
  "users": [...],
  "meta": { "page", "limit", "total", "pages" }
}
```

---

## Volunteer Activities

### POST `/activities`
Create a new volunteer activity.

**Auth:** Required

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string",
  "date": "ISO date string (required)",
  "location": "string",
  "slots": "number (default: 0)",
  "tags": ["string"]
}
```

**Response:** `201`
```json
{
  "activity": { ... }
}
```

---

### GET `/activities`
Public listing of activities with filtering and pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `tag` - Filter by tag
- `search` - Search in title/description
- `from` - Filter by date from (ISO date)
- `to` - Filter by date to (ISO date)
- `sort` - Sort order (default: "-createdAt")

**Response:** `200`
```json
{
  "activities": [...],
  "meta": { "page", "limit", "total", "pages" }
}
```

**Notes:** Only shows activities with state "open" or "closed".

---

### GET `/activities/:id`
Get activity details.

**Response:** `200`
```json
{
  "activity": {
    "id", "title", "description", "date", "location", "slots", "tags",
    "state", "status", "owner", "participants", "mediaUrls", ...
  }
}
```

---

### PUT `/activities/:id`
Update activity.

**Auth:** Required (Owner or Admin only)

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "date": "ISO date string",
  "status": "upcoming|ongoing|completed|cancelled",
  "location": "string",
  "slots": "number",
  "tags": ["string"]
}
```

**Response:** `200`
```json
{
  "activity": { ... }
}
```

---

### DELETE `/activities/:id`
Delete activity.

**Auth:** Required (Owner or Admin only)

**Response:** `200`
```json
{
  "message": "Activity deleted successfully"
}
```

---

### POST `/activities/:id/join`
User joins activity.

**Auth:** Required

**Request Body:**
```json
{
  "participants": "number (optional, default: 1)"
}
```

**Response:** `200`
```json
{
  "message": "Successfully joined activity",
  "activity": { ... }
}
```

**Notes:** Checks slots availability, prevents duplicate joins.

---

### POST `/activities/:id/leave`
User leaves activity.

**Auth:** Required

**Response:** `200`
```json
{
  "message": "Successfully left activity",
  "activity": { ... }
}
```

---

### POST `/activities/:id/attendance`
Record attendance for activity.

**Auth:** Required (Manager or Admin only)

**Request Body:**
```json
{
  "userId": "string (required)",
  "status": "present|absent (required)"
}
```

**Response:** `200`
```json
{
  "attendanceRecord": { ... }
}
```

---

### POST `/activities/:id/state`
Change activity state.

**Auth:** Required (Manager or Admin only)

**Request Body:**
```json
{
  "state": "draft|open|closed|cancelled (required)"
}
```

**Response:** `200`
```json
{
  "activity": { ... }
}
```

---

### GET `/users/:id/activities`
Get activities for a user.

**Auth:** Required

**Query Parameters:**
- `role` - Filter by role: "participant" or "owner"

**Response:** `200`
```json
{
  "activities": [...]
}
```

---

## AI Chat & Chat History

### POST `/chat`
Send message to AI chat.

**Auth:** Required

**Request Body:**
```json
{
  "message": "string (required)"
}
```

**Response:** `200`
```json
{
  "reply": "AI response text",
  "messageId": "message ID"
}
```

**Notes:** Forwards to OpenAI, saves message & reply.

---

### GET `/chat/history`
Get user chat history with pagination.

**Auth:** Required

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response:** `200`
```json
{
  "chats": [...],
  "meta": { "page", "limit", "total", "pages" }
}
```

---

### GET `/chat/:id`
Get single chat thread.

**Auth:** Required

**Response:** `200`
```json
{
  "chatThread": [...]
}
```

---

## Statistics / Dashboard

### GET `/stats/overview`
Get overview statistics.

**Auth:** Required (Admin or Manager only)

**Response:** `200`
```json
{
  "totalUsers": "number",
  "totalActivities": "number",
  "ongoing": "number",
  "completed": "number",
  "monthlySignups": [
    { "month": "YYYY-MM", "count": "number" }
  ]
}
```

---

### GET `/stats/activity/:id`
Get activity-specific metrics.

**Auth:** Required (Admin or Manager only)

**Response:** `200`
```json
{
  "attendanceOverTime": [...],
  "participantsCount": "number",
  "totalParticipants": "number",
  "feedback": []
}
```

---

### GET `/stats/user/:id`
Get user performance statistics.

**Auth:** Required (Admin, Manager, or Owner)

**Response:** `200`
```json
{
  "participatedCount": "number",
  "ownedCount": "number",
  "hours": "number",
  "roles": ["participant", "owner"],
  "stats": { ... }
}
```

---

## Admin Endpoints

### GET `/admin/users`
Admin endpoint to manage users.

**Auth:** Required (Admin only)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` - Search in name/email
- `role` - Filter by role

**Response:** `200`
```json
{
  "users": [...],
  "meta": { "page", "limit", "total", "pages" }
}
```

---

### PUT `/admin/users/:id/role`
Change user role.

**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "role": "user|manager|admin (required)"
}
```

**Response:** `200`
```json
{
  "user": { ... }
}
```

---

### DELETE `/admin/users/:id`
Remove user.

**Auth:** Required (Admin only)

**Response:** `200`
```json
{
  "message": "User removed successfully"
}
```

---

### GET `/admin/activities`
Admin control for activities.

**Auth:** Required (Admin only)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` - Search in title/description
- `state` - Filter by state
- `status` - Filter by status

**Response:** `200`
```json
{
  "activities": [...],
  "meta": { "page", "limit", "total", "pages" }
}
```

---

## File Uploads

### POST `/upload/avatar`
Upload avatar.

**Auth:** Required

**Request Body:**
```json
{
  "url": "string (required)"
}
```

**Response:** `200`
```json
{
  "url": "avatar URL"
}
```

**Notes:** Currently accepts URL. Can be enhanced with multer for actual file uploads.

---

### POST `/activities/:id/media`
Upload activity media (images/videos).

**Auth:** Required (Owner or Admin only)

**Request Body:**
```json
{
  "mediaUrls": ["string"] (required, array of URLs)
}
```

**Response:** `201`
```json
{
  "mediaUrls": ["url1", "url2", ...]
}
```

**Notes:** Currently accepts URLs. Can be enhanced with multer for actual file uploads (MP4 allowed for videos).

---

## Health Check

### GET `/health`
Health check endpoint.

**Response:** `200`
```json
{
  "status": "ok",
  "timestamp": "ISO timestamp"
}
```

---

## API Documentation

### GET `/docs`
Interactive API documentation page.

Opens an HTML page with interactive API testing interface.

---

## Notes

- All timestamps are in ISO format
- JWT tokens expire in 1 hour (access token) and 7 days (refresh token)
- User roles: `user`, `manager`, `admin`
- Activity states: `draft`, `open`, `closed`, `cancelled`
- Activity statuses: `upcoming`, `ongoing`, `completed`, `cancelled`
- All paginated responses include `meta` object with pagination info
- File uploads currently accept URLs; multer integration can be added for actual file handling

