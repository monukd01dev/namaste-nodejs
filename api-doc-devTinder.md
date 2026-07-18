# 🚀 DevTinder API Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

**Authentication:** JSON Web Tokens (JWT) stored in HTTP-only Cookies. Endpoints marked with 🔒 require a valid session cookie.

**Response Format:** Standardized JSON.

---

### 1. API Health Check

Used to monitor system health and server status (Typically utilized by Load Balancers and DevOps tools).

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| **GET** | `/health` | ❌ | Returns server uptime, environment variables, and current timestamp. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Server is up and running!",
  "data": {
    "uptime": "120 minutes",
    "timestamp": "2026-07-17T18:38:56.000Z",
    "environment": "development"
  },
  "error": null
}

```

---

### 2. Auth Routes

Used for user registration, authentication, and session management.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| **POST** | `/auth/signup` | ❌ | Registers a new user and saves their encrypted credentials to the database. |
| **POST** | `/auth/login` | ❌ | Authenticates the user and sets a secure JWT token in HTTP-only cookies. |
| **POST** | `/auth/logout` | 🔒 | Clears the JWT session cookie to log the user out. |

**Example: `POST /auth/login` Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

```

---

### 3. Profile Routes

Used to retrieve and manage the authenticated user's personal profile data.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| **GET** | `/profile/view` | 🔒 | Fetches the current logged-in user's complete profile data. |
| **PATCH** | `/profile/edit` | 🔒 | Updates specific user fields (e.g., about, skills, photoUrl). |
| **DELETE** | `/profile/delete` | 🔒 | Permanently deletes the user's account from the database. |

**Example: `PATCH /profile/edit` Request Body:**

```json
{
  "about": "Full-stack developer building cool things.",
  "skills": ["Node.js", "React", "MongoDB"]
}

```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "_id": "64b5f8e7...",
    "firstName": "John",
    "lastName": "Doe",
    "about": "Full-stack developer building cool things.",
    "skills": ["Node.js", "React", "MongoDB"]
  },
  "error": null
}

```

---

### 4. User Routes

Used for interacting with other platform users (The foundation of the connection/swiping engine).

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| **GET** | `/user/feed` | 🔒 | Fetches a paginated list of user profiles for the main feed (excludes the currently logged-in user). |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Feed fetched successfully.",
  "data": [
    {
      "_id": "64b5f8e8...",
      "firstName": "Jane",
      "age": 24,
      "gender": "female",
      "photoUrl": "https://example.com/photo.jpg",
      "about": "Coffee addict & coder.",
      "skills": ["Java", "Spring Boot"]
    }
  ],
  "error": null
}

```

---

### 🚨 Global Error Responses

The server utilizes a global error handler. If a request fails (e.g., Validation Errors, Duplicate Database Entries, Invalid Tokens), the API consistently returns this standardized error structure:

**Client Error (400 Bad Request):**

```json
{
  "success": false,
  "message": "An account with that email already exists.",
  "error": null 
}

```

**Authentication Error (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Invalid Token. Please Login Again.",
  "error": null
}

```