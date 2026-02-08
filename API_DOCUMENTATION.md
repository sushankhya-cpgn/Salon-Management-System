# Salon Management System - API Documentation

## Overview

The Salon Management System API provides endpoints for managing user authentication, appointments, and available service slots.

**Base URL**: `http://localhost:3000/api`

**Swagger UI**: `http://localhost:3000/api-docs`

---

## Authentication

Most endpoints require JWT Bearer token authentication. After login, include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

**Access Token Expiration**: 1 hour  
**Refresh Token Expiration**: 9 days

---

## Endpoints

### Authentication (No Auth Required)

#### 1. Register User
- **Endpoint**: `POST /users/register`
- **Description**: Create a new user account and send verification email
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- **Error Responses**:
  - 400: User already exists
  - 500: Internal server error

---

#### 2. Verify Email
- **Endpoint**: `GET /users/verify-email`
- **Description**: Verify user email using token from email link
- **Query Parameters**:
  - `token` (required): Email verification token
- **Success Response** (200): Email verified
- **Error Responses**:
  - 400: Invalid or expired token
  - 500: Internal server error

---

#### 3. Login
- **Endpoint**: `POST /users/login`
- **Description**: Authenticate user and receive tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Login Successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - 400: User not found or invalid password
  - 403: Email not verified
  - 500: Internal server error

---

#### 4. Refresh Token
- **Endpoint**: `POST /users/refresh-token`
- **Description**: Generate new access token using refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Token refreshed",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - 401: Refresh token missing
  - 403: Invalid refresh token
  - 500: Internal server error

---

#### 5. Logout
- **Endpoint**: `POST /users/logout`
- **Description**: Invalidate all user sessions
- **Auth Required**: Yes (Bearer Token)
- **Success Response** (200): User logged out successfully
- **Error Responses**:
  - 401: Unauthorized
  - 500: Internal server error

---

### Appointments (Auth Required)

#### 6. Get All Appointments
- **Endpoint**: `GET /appointment`
- **Description**: Retrieve all appointments in the system
- **Auth Required**: Yes
- **Success Response** (200):
  ```json
  [
    {
      "id": 1,
      "customerName": "John Doe",
      "email": "john@example.com",
      "startTime": "2026-02-08T10:00:00Z",
      "endTime": "2026-02-08T10:30:00Z",
      "serviceId": 1
    }
  ]
  ```
- **Error Responses**:
  - 404: No appointments found
  - 500: Server error

---

#### 7. Create Appointment
- **Endpoint**: `POST /appointment`
- **Description**: Create a new appointment with conflict checking
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "customerName": "John Doe",
    "email": "john@example.com",
    "date": "2026-02-08",
    "startTime": "10:00",
    "serviceId": 1
  }
  ```
- **Success Response** (201):
  ```json
  {
    "message": "Appointment created succesfully",
    "appointment": {
      "id": 1,
      "customerName": "John Doe",
      "email": "john@example.com",
      "startTime": "2026-02-08T10:00:00Z",
      "endTime": "2026-02-08T10:30:00Z",
      "serviceId": 1
    }
  }
  ```
- **Error Responses**:
  - 400: Missing required fields or invalid service
  - 409: Slot already booked
  - 500: Server error

---

#### 8. Update Appointment
- **Endpoint**: `PATCH /appointment/{appointmentId}`
- **Description**: Update appointment details with conflict checking
- **Auth Required**: Yes
- **Path Parameters**:
  - `appointmentId` (required): Appointment ID
- **Request Body** (all fields optional):
  ```json
  {
    "customerName": "Jane Doe",
    "email": "jane@example.com",
    "date": "2026-02-09",
    "startTime": "11:00",
    "serviceId": 2
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Appointment Updated",
    "updatedAppointment": { ... }
  }
  ```
- **Error Responses**:
  - 400: Missing appointment ID or invalid service
  - 404: Appointment not found
  - 409: Slot already booked
  - 500: Server error

---

#### 9. Delete Appointment
- **Endpoint**: `DELETE /appointment`
- **Description**: Delete an appointment
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "appointmentId": 1
  }
  ```
- **Success Response** (200): Appointment deleted successfully
- **Error Responses**:
  - 400: Missing appointment ID
  - 404: Appointment not found
  - 500: Server error

---

#### 10. Bulk Import Appointments
- **Endpoint**: `POST /appointment/bulk`
- **Description**: Import multiple appointments from CSV file. Conflicts are automatically skipped.
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request**:
  - `file`: CSV file with columns: `customerName`, `email`, `date`, `startTime`, `serviceId`
  
  **Example CSV**:
  ```csv
  customerName,email,date,startTime,serviceId
  John Doe,john@example.com,2026-02-08,10:00,1
  Jane Doe,jane@example.com,2026-02-08,11:00,2
  ```

- **Success Response** (200):
  ```json
  {
    "message": "File received and processing in background"
  }
  ```
- **Processing Notes**:
  - File is processed asynchronously using a job queue
  - Appointments with time conflicts are skipped with a log entry
  - Confirmation emails are sent for successfully booked appointments
  - Batch size: 1000 appointments per transaction

- **Error Responses**:
  - 400: CSV file is required
  - 500: Internal server error

---

### Slots (Auth Required)

#### 11. Get Available Slots
- **Endpoint**: `GET /slots/{serviceId}`
- **Description**: Get available appointment slots for a service on a specific date
- **Auth Required**: Yes
- **Path Parameters**:
  - `serviceId` (required): Service ID
- **Query Parameters**:
  - `date` (optional): Date in YYYY-MM-DD format (e.g., `2026-02-08`). Defaults to today if not provided.
- **Success Response** (200):
  ```json
  {
    "message": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00"
    ],
    "date": "2026-02-08",
    "serviceId": 1,
    "serviceName": "Hair Cut"
  }
  ```
- **Example Requests**:
  - Get slots for today: `GET /slots/1`
  - Get slots for specific date: `GET /slots/1?date=2026-02-10`

- **Features**:
  - Returns slots from 9:00 AM to 3:00 PM
  - Excludes lunch break (12:00 PM - 2:00 PM)
  - Slot interval based on service duration
  - Excludes already booked slots
  - Can query any date, not just today

- **Error Responses**:
  - 400: Missing service ID or invalid date format
  - 404: Service not found
  - 500: Server error

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Additional error details (if available)"
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- **Window**: 15 minutes
- **Limit**: 100 requests per IP address per window

---

## Security Features

1. **JWT Authentication**: Access tokens expire in 1 hour
2. **Refresh Tokens**: Can be used to get new access tokens (9 days expiration)
3. **Email Verification**: Users must verify email before login
4. **Password Hashing**: Passwords are hashed using bcryptjs
5. **Conflict Detection**: Appointment overlap prevention at database level
6. **CORS**: Enabled for cross-origin requests

---

## CSV Import Format

For bulk appointment imports, the CSV file must have the following structure:

```
customerName,email,date,startTime,serviceId
John Doe,john@example.com,2026-02-08,10:00,1
Jane Doe,jane@example.com,2026-02-08,11:00,2
```

**Field Descriptions**:
- `customerName`: Full name of the customer
- `email`: Customer email address
- `date`: Appointment date (YYYY-MM-DD format)
- `startTime`: Appointment start time (HH:MM format)
- `serviceId`: ID of the salon service

---

## Example Workflows

### Workflow 1: Register and Book Appointment

1. Register user: `POST /users/register`
2. Verify email: `GET /users/verify-email?token={token}`
3. Login: `POST /users/login`
4. Check available slots: `GET /slots/{serviceId}`
5. Create appointment: `POST /appointment`

### Workflow 2: Bulk Import Appointments

1. Prepare CSV file with appointment data
2. Login: `POST /users/login`
3. Upload CSV: `POST /appointment/bulk` (with Bearer token)
4. Monitor logs for conflicting appointments (automatically skipped)

### Workflow 3: Manage Existing Appointment

1. Get all appointments: `GET /appointment`
2. Update appointment: `PATCH /appointment/{appointmentId}`
3. Or delete: `DELETE /appointment`

---

## Accessing Swagger UI

After starting the server, visit: **`http://localhost:3000/api-docs`**

The interactive Swagger documentation allows you to test all endpoints directly from the browser.
