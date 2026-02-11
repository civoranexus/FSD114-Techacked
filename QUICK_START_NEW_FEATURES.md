# 🚀 Quick Start Guide - New Features

## 1. Dark Mode Toggle

**Location:** Navbar (top right, next to notifications)

**How to use:**
- Click the Moon icon to enable dark mode
- Click the Sun icon to switch back to light mode
- Theme preference is saved automatically

**For developers:**
```tsx
import { useTheme } from '@/context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

---

## 2. Profile Page

**Route:** `/profile`

**Features:**
- Edit name, email, phone, bio
- Upload avatar (UI ready, backend integration needed)
- Role-specific fields:
  - Students: Class field
  - Teachers: Subjects field

**API Endpoint:**
```
PUT /api/users/profile
Headers: { Authorization: Bearer <token> }
Body: { name, email, phone, bio, class, subjects }
```

---

## 3. Payment & Enrollment

**Route:** `/payment` or `/payment?courseId=123`

**Flow:**
1. User clicks "Enroll" on course
2. Redirected to payment page
3. Fills payment form
4. System calls enrollment API
5. Redirected to enrolled courses

**API Endpoint:**
```
POST /api/enrollments/enroll
Headers: { Authorization: Bearer <token> }
Body: { courseId: "123" }
```

---

## 4. Real-Time Notifications

**Hook:** `useNotifications()`

**Features:**
- Auto-polls every 5 seconds
- Shows unread count in Navbar bell icon
- Click bell to view all notifications

**Usage:**
```tsx
import { useNotifications } from '@/hooks/useNotifications';

const MyComponent = () => {
  const { notifications, unreadCount, isLoading } = useNotifications();
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n._id}>{n.title}</div>
      ))}
    </div>
  );
};
```

---

## 5. Enhanced Progress Page

**Route:** `/progress`

**Features:**
- Overall stats cards (Total Courses, Completed, Pending)
- Bar chart showing all courses
- Individual course progress with pie charts
- Topic-by-topic breakdown
- Dark mode support

**Blue Theme:**
- Primary: `#2563EB`
- Light: `#E8F0FE`
- Pending: `#A5B4FC`

---

## 6. Course Enrollment Button

**Component:** `CourseCard`

**New Optional Prop:**
```tsx
<CourseCard 
  course={course}
  onEnroll={(course) => {
    // Handle enrollment
    navigate(`/payment?courseId=${course.id}`);
  }}
/>
```

If `onEnroll` is not provided, card works exactly as before.

---

## 🎨 Dark Mode Classes Reference

Use these classes for dark mode styling:

```tsx
// Backgrounds
className="dark:bg-[#0F172A]"  // Main background
className="dark:bg-[#1E293B]"  // Card background

// Text
className="dark:text-white"     // Primary text
className="dark:text-gray-400"  // Muted text
className="dark:text-gray-200"  // Secondary text

// Borders
className="dark:border-gray-700"

// Example Card
<Card className="dark:bg-[#1E293B] dark:border-gray-700">
  <CardTitle className="dark:text-white">Title</CardTitle>
  <p className="dark:text-gray-400">Description</p>
</Card>
```

---

## 🔧 Backend Requirements

### Required API Endpoints:

1. **Update Profile**
   ```
   PUT /api/users/profile
   Body: { name, email, phone, bio, avatar, class, subjects }
   ```

2. **Enroll in Course**
   ```
   POST /api/enrollments/enroll
   Body: { courseId }
   ```

3. **Get Notifications**
   ```
   GET /api/notify/user/:userId
   Response: [{ _id, title, message, createdAt, read }]
   ```

---

## 📱 Mobile Responsive

All new features are mobile-responsive:
- Profile form stacks on mobile
- Payment page uses grid layout
- Progress charts resize automatically
- Dark mode works on all screen sizes

---

## 🎯 Next Steps

1. Test dark mode toggle
2. Visit `/profile` to edit your profile
3. Try enrolling in a course via `/payment`
4. Check notifications in Navbar
5. View progress at `/progress`

All existing features continue to work normally! 🎉
