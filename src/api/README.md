# API Layer Documentation

This API layer provides a clean, organized way to handle all API calls in the application using Axios. It includes automatic authentication, error handling, and loading states.

## 📁 Structure

```
src/api/
├── config.js              # Axios configuration and interceptors
├── services/
│   ├── authService.js      # Authentication APIs
│   ├── userService.js      # User-related APIs
│   ├── adminService.js     # Admin-specific APIs
│   ├── courseService.js    # Course management APIs
│   ├── trainerService.js   # Trainer management APIs
│   └── contactService.js   # Contact form APIs
├── index.js               # Main exports
└── README.md              # This file
```

## 🚀 Quick Start

### Import the API services

```javascript
// Import specific services
import { trainerService, courseService } from '../api';

// Or import all services
import api from '../api';
```

### Using with the custom hook (Recommended)

```javascript
import { trainerService } from '../api';
import useApi from '../hooks/useApi';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi(trainerService.getAllTrainers);
  
  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.map(trainer => (
        <div key={trainer.trainerId}>{trainer.trainerName}</div>
      ))}
    </div>
  );
};
```

### Direct API usage

```javascript
import { trainerService } from '../api';

const MyComponent = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await trainerService.getAllTrainers();
      setTrainers(data);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);
};
```

## 📋 Available Services

### AuthService
```javascript
import { authService } from '../api';

// Login
await authService.login({ email, password });

// Register
await authService.register({ name, email, password });

// Logout
await authService.logout();
```

### TrainerService
```javascript
import { trainerService } from '../api';

// Get all trainers
await trainerService.getAllTrainers();

// Create trainer (Admin only)
await trainerService.createTrainer({
  trainerName: "John Doe",
  description: "Expert developer",
  rating: 4.5,
  imageUrl: "https://example.com/image.jpg"
});

// Update trainer (Admin only)
await trainerService.updateTrainer(trainerId, updateData);

// Delete trainer (Admin only)
await trainerService.deleteTrainer(trainerId);
```

### CourseService
```javascript
import { courseService } from '../api';

// Get all courses
await courseService.getAllCourses();

// Get course by ID
await courseService.getCourseById(courseId);

// Create course (Admin only)
await courseService.createCourse({
  courseName: "React Basics",
  description: "Learn React from scratch",
  duration: "8 weeks",
  price: 0,
  courseMode: "Online",
  courseTopic: "Programming",
  courseSubtopic: "React",
  trainerId: 1
});

// Update course (Admin only)
await courseService.updateCourse(courseId, updateData);

// Delete course (Admin only)
await courseService.deleteCourse(courseId);
```

### UserService
```javascript
import { userService } from '../api';

// Update profile
await userService.updateProfile({
  name: "Updated Name",
  password: "newpassword"
});

// Get user courses
await userService.getUserCourses();

// Enroll in course
await userService.enrollCourse(courseId);
```

### ContactService
```javascript
import { contactService } from '../api';

// Submit contact form
await contactService.submitContactForm({
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, I have a question..."
});
```

## 🔧 Configuration

### Base URL
The base URL is configured in `src/api/config.js`:
```javascript
const BASE_URL = 'http://localhost:8080/api';
```

### Authentication
JWT tokens are automatically added to requests via interceptors. The token is retrieved from `localStorage.getItem('token')`.

### Error Handling
The API layer includes automatic error handling:
- 401 errors automatically clear tokens and redirect to login
- Consistent error format across all services
- Network error handling

## 🎯 Best Practices

### 1. Use the useApi Hook
```javascript
// ✅ Good - Using the hook
const { data, loading, error, execute } = useApi(trainerService.getAllTrainers);

// ❌ Avoid - Manual state management
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
```

### 2. Handle Errors Gracefully
```javascript
const handleSubmit = async () => {
  try {
    await trainerService.createTrainer(formData);
    setSuccess(true);
  } catch (error) {
    setErrorMessage(error.message);
  }
};
```

### 3. Use Loading States
```javascript
<button disabled={loading}>
  {loading ? 'Creating...' : 'Create Trainer'}
</button>
```

### 4. Refresh Data After Mutations
```javascript
const handleCreate = async () => {
  await createTrainer(formData);
  fetchTrainers(); // Refresh the list
};
```

## 🔄 Migration from Fetch

### Before (using fetch)
```javascript
const response = await fetch("http://localhost:8080/api/admin/trainers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  throw new Error('Request failed');
}

const data = await response.json();
```

### After (using API layer)
```javascript
const data = await trainerService.createTrainer(payload);
```

## 🚨 Error Handling

All API services return consistent error objects:
```javascript
{
  status: 400,
  message: "Validation failed",
  data: { /* additional error data */ }
}
```

Common error scenarios:
- **401**: Authentication required (auto-redirects to login)
- **403**: Access denied
- **404**: Resource not found
- **500**: Server error
- **Network**: Connection issues

## 🔍 Debugging

Enable request/response logging by modifying the interceptors in `config.js`:
```javascript
apiClient.interceptors.request.use((config) => {
  // Log requests in development only
  if (process.env.NODE_ENV === 'development') {
    console.log('Request:', config);
  }
  return config;
});

apiClient.interceptors.response.use((response) => {
  // Log responses in development only  
  if (process.env.NODE_ENV === 'development') {
    console.log('Response:', response);
  }
  return response;
});
```