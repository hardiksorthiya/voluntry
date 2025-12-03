# How to Make a User Admin

## Problem
By default, all users are created with role "user". To login as admin, you need to change a user's role to "admin" first.

## Solution 1: Using Setup Route (Easiest)

### Step 1: Login as Regular User
1. Register or login with your account
2. Get your user ID from the login response or profile

### Step 2: Make Yourself Admin
Use the setup route to make yourself admin:

**Using API Documentation (`/docs`):**
1. Go to `http://localhost:4000/docs`
2. Find the setup route: `PUT /api/setup/make-admin/:id`
3. Enter your user ID
4. Send request

**Using curl:**
```bash
# First, login to get token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Copy the token from response, then:
curl -X PUT http://localhost:4000/api/setup/make-admin/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Using Postman/Thunder Client:**
1. Login first to get token
2. PUT `http://localhost:4000/api/setup/make-admin/YOUR_USER_ID`
3. Add header: `Authorization: Bearer YOUR_TOKEN`
4. Send request

### Step 3: Login Again
After making yourself admin:
1. Logout and login again
2. You'll now have admin access!

---

## Solution 2: Using MongoDB Directly

### Step 1: Find Your User
1. Open MongoDB Compass or use mongo shell
2. Connect to your database
3. Go to `users` collection
4. Find your user document

### Step 2: Update Role
Update the `role` field to `"admin"`:

**MongoDB Compass:**
- Click on your user document
- Edit the `role` field
- Change from `"user"` to `"admin"`
- Save

**MongoDB Shell:**
```javascript
use voluntry
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 3: Login Again
Logout and login - you're now admin!

---

## Solution 3: Using Admin Route (If You Already Have Admin)

If you already have an admin account, you can use the admin route:

**PUT `/api/admin/users/:id/role`**
```json
{
  "role": "admin"
}
```

**Note:** This requires admin authentication, so you need to be logged in as admin first.

---

## Quick Test

After making yourself admin:

1. **Logout** from the app
2. **Login again** with the same credentials
3. Check your profile - role should be "admin"
4. You should now see "Create" button in Activities screen
5. You can create activities

---

## Security Note

The `/api/setup/make-admin` route allows:
- Making yourself admin (if you're logged in)
- Making first user admin (if no admins exist)

**For production:** Consider removing or securing this route after initial setup.

---

## Verify Admin Status

Check if you're admin:
1. Login and check `/api/users/me` response
2. Look for `"role": "admin"` in the response
3. Or check in MongoDB directly

---

**Easiest method: Use the setup route from `/docs` page!** 🚀

