# 🚀 Quick Guide: Make Yourself Admin

## Problem
By default, all users register as "user" role. To login as admin, you need to change your role first.

## ✅ Solution: Use Setup Route

### Method 1: Using API Docs Page (Easiest!)

1. **Login first:**
   - Go to `http://localhost:4000/docs`
   - Find "Authentication" section
   - Use `POST /api/auth/login` to login
   - Copy your **token** from response

2. **Get your User ID:**
   - In docs page, find `GET /api/users/me`
   - Click "Test" button
   - Copy your **user ID** from response (look for `"id": "..."`)

3. **Make yourself admin:**
   - Scroll to "Setup - Make Admin" section
   - Enter your User ID in the input field
   - Click "Make Admin" button
   - You should see success message!

4. **Login again:**
   - Logout from app
   - Login again with same credentials
   - You're now admin! ✅

---

### Method 2: Using curl/Postman

```bash
# Step 1: Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Copy the token from response

# Step 2: Get your user ID
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Copy your user ID from response

# Step 3: Make yourself admin
curl -X PUT http://localhost:4000/api/setup/make-admin/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Method 3: Using MongoDB Directly

1. Open MongoDB Compass or mongo shell
2. Connect to your database: `voluntry`
3. Go to `users` collection
4. Find your user document
5. Edit `role` field: change `"user"` to `"admin"`
6. Save
7. Login again - you're admin!

---

## 🔍 How to Verify You're Admin

After making yourself admin:

1. **Logout and login again** (important!)
2. Check profile: `GET /api/users/me`
3. Look for: `"role": "admin"` in response
4. In mobile app: You should see "Create" button in Activities

---

## 📝 API Endpoint

**PUT `/api/setup/make-admin/:id`**

- **Auth:** Required (must be logged in)
- **Access:** 
  - Can make yourself admin
  - Can make first user admin (if no admins exist)

**Request:**
```
PUT /api/setup/make-admin/YOUR_USER_ID
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "message": "User role updated to admin successfully",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin"
  }
}
```

---

## ⚠️ Important Notes

1. **Must logout and login again** after changing role
2. **Token contains role** - old tokens won't have admin access
3. **First user** can always make themselves admin
4. **After first admin exists**, only admins can make others admin

---

## 🎯 Quick Steps Summary

1. Login → Get token
2. Get user ID from `/api/users/me`
3. Use `/api/setup/make-admin/:id` with your user ID
4. Logout and login again
5. Done! You're admin ✅

---

**Easiest: Use the `/docs` page - it's all there!** 🚀

