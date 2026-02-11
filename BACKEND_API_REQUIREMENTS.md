# 🔌 Backend API Requirements

## Overview
This document outlines the API endpoints required for the new features to work properly.

---

## 1. Profile Update API

### Endpoint
```
PUT /api/users/profile
```

### Headers
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-000-0000",
  "bio": "Passionate learner and educator",
  "avatar": "https://example.com/avatar.jpg",
  "class": "Class 10",        // For students only
  "subjects": "Math, Physics"  // For teachers only
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-000-0000",
    "bio": "Passionate learner and educator",
    "avatar": "https://example.com/avatar.jpg",
    "role": "student",
    "class": "Class 10"
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "message": "Failed to update profile",
  "error": "Email already exists"
}
```

### Implementation Notes
- Validate email format
- Check for duplicate emails
- Only update fields that are provided
- Role-specific fields (class, subjects) are optional
- Return updated user object

---

## 2. Course Enrollment API

### Endpoint
```
POST /api/enrollments/enroll
```

### Headers
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "courseId": "course123"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "enrollment": {
    "id": "enrollment123",
    "userId": "user123",
    "courseId": "course123",
    "enrolledAt": "2026-02-07T10:30:00Z",
    "progress": 0,
    "status": "active"
  }
}
```

### Response (Error - Already Enrolled)
```json
{
  "success": false,
  "message": "Already enrolled in this course",
  "error": "ALREADY_ENROLLED"
}
```

### Response (Error - Course Not Found)
```json
{
  "success": false,
  "message": "Course not found",
  "error": "COURSE_NOT_FOUND"
}
```

### Implementation Notes
- Check if user is already enrolled
- Verify course exists
- Create enrollment record
- Initialize progress to 0
- Send confirmation email (optional)
- Trigger notification (optional)

---

## 3. Notifications API

### Endpoint
```
GET /api/notify/user/:userId
```

### Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response (Success)
```json
[
  {
    "_id": "notif123",
    "userId": "user123",
    "title": "New Assignment Posted",
    "message": "Your teacher has posted a new assignment for Mathematics",
    "type": "assignment",
    "read": false,
    "createdAt": "2026-02-07T10:30:00Z"
  },
  {
    "_id": "notif124",
    "userId": "user123",
    "title": "Course Completed",
    "message": "Congratulations! You've completed React Basics",
    "type": "achievement",
    "read": true,
    "createdAt": "2026-02-06T15:20:00Z"
  }
]
```

### Response (Empty)
```json
[]
```

### Implementation Notes
- Return notifications sorted by createdAt (newest first)
- Include read/unread status
- Frontend polls every 5 seconds
- Consider pagination for large datasets
- Types: assignment, achievement, announcement, reminder

---

## 4. Mark Notification as Read (Optional)

### Endpoint
```
PATCH /api/notify/:notificationId/read
```

### Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Implementation Notes
- Update read status to true
- Return success confirmation
- Frontend can call this when user views notification

---

## 5. Get User Profile (Existing - Verify)

### Endpoint
```
GET /api/auth/profile
```

### Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response (Success)
```json
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+1 555-000-0000",
    "bio": "Passionate learner",
    "class": "Class 10"
  }
}
```

### Implementation Notes
- Used for auto-login on app load
- Should return complete user profile
- Include role-specific fields

---

## 6. Get Course Details (Existing - Verify)

### Endpoint
```
GET /api/courses/:courseId
```

### Response Should Include
```json
{
  "id": "course123",
  "title": "React Basics",
  "description": "Learn React from scratch",
  "instructor": "Jane Smith",
  "price": 49.99,
  "thumbnail": "https://example.com/thumb.jpg",
  "category": "Web Development",
  "duration": "10 hours",
  "studentsEnrolled": 1234,
  "rating": 4.8,
  "level": "Beginner",
  "lessonsCount": 25,
  "isEnrolled": false  // Important for frontend
}
```

### Implementation Notes
- Include `isEnrolled` flag for current user
- Used to show/hide enroll button
- Price should be a number (not string)

---

## 7. Get Enrolled Courses (Existing - Verify)

### Endpoint
```
GET /api/enrollments/user/:userId
```

### Response Should Include Progress
```json
[
  {
    "id": "course123",
    "title": "React Basics",
    "instructor": "Jane Smith",
    "thumbnail": "https://example.com/thumb.jpg",
    "progress": 45,  // Percentage
    "isEnrolled": true
  }
]
```

### Implementation Notes
- Include progress percentage
- Used for progress tracking
- Should return only active enrollments

---

## 🔐 Authentication

All endpoints require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Validation
- Verify token signature
- Check expiration
- Extract user ID
- Validate user exists

---

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., already enrolled)
- `500` - Internal Server Error

---

## 📊 Database Schema Suggestions

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: student, teacher, admin),
  avatar: String (URL),
  phone: String,
  bio: String,
  class: String,      // For students
  subjects: String,   // For teachers
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  courseId: ObjectId (ref: Courses),
  progress: Number (0-100),
  status: String (enum: active, completed, dropped),
  enrolledAt: Date,
  completedAt: Date,
  lastAccessedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  message: String,
  type: String (enum: assignment, achievement, announcement, reminder),
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## 🧪 Testing Endpoints

### Using cURL

**Update Profile:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Enroll in Course:**
```bash
curl -X POST http://localhost:5000/api/enrollments/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"course123"}'
```

**Get Notifications:**
```bash
curl -X GET http://localhost:5000/api/notify/user/user123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Implementation Priority

### High Priority (Required for Core Features)
1. ✅ `POST /api/enrollments/enroll` - Payment flow
2. ✅ `GET /api/notify/user/:userId` - Notifications

### Medium Priority (Enhanced UX)
3. ✅ `PUT /api/users/profile` - Profile editing
4. ⚠️ `PATCH /api/notify/:id/read` - Mark as read

### Low Priority (Nice to Have)
5. ⚠️ Notification creation endpoints
6. ⚠️ Bulk notification operations

---

## 🔄 Frontend Integration

### API Base URL
Set in `.env`:
```
VITE_API_BASE=http://localhost:5000
```

### Usage in Frontend
```typescript
const response = await fetch(
  `${import.meta.env.VITE_API_BASE}/api/users/profile`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(profileData),
  }
);
```

---

## ✅ Checklist for Backend Team

- [ ] Implement `PUT /api/users/profile`
- [ ] Implement `POST /api/enrollments/enroll`
- [ ] Verify `GET /api/notify/user/:userId` exists
- [ ] Add `isEnrolled` flag to course details
- [ ] Add `progress` field to enrolled courses
- [ ] Test all endpoints with Postman
- [ ] Add proper error handling
- [ ] Implement rate limiting (optional)
- [ ] Add request validation
- [ ] Update API documentation

---

## 🎉 Summary

**Required Endpoints:** 3 new + 3 existing
**Authentication:** JWT Bearer token
**Response Format:** JSON
**Error Handling:** Standard error responses

All endpoints follow RESTful conventions and return consistent JSON responses.
