# Nudge Feature API Documentation

## Overview
The Nudge feature is a notification/prompt system that allows administrators to create, manage, and schedule nudges for users. A Nudge is a contextual message with visual elements designed to engage users at specific times.

## Object Data Model

### Nudge Object Structure

```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "image_url": "string (optional)",
  "scheduled_at": "Date (required)",
  "description": "string (required)",
  "icon_url": "string (optional)",
  "invitation_text": "string (optional)",
  "created_at": "Date",
  "updated_at": "Date",
  "created_by": "ObjectId (User reference)",
  "status": "string (active|inactive|scheduled|completed)"
}
```

### Field Specifications

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `title` | string | ✅ Yes | The main heading of the nudge | Min 3 chars, Max 100 chars |
| `image_url` | string | ❌ No | URL to the hero image | Valid URL format, Max 500 chars |
| `scheduled_at` | Date | ✅ Yes | When the nudge should be displayed | Must be future date |
| `description` | string | ✅ Yes | Main content/body of the nudge | Min 10 chars, Max 1000 chars |
| `icon_url` | string | ❌ No | URL to small icon | Valid URL format, Max 500 chars |
| `invitation_text` | string | ❌ No | Call-to-action text | Max 50 chars |
| `status` | string | ✅ Yes | Current state of the nudge | Enum: active, inactive, scheduled, completed |

## API Endpoints

### Base URL
```
/api/v3/app
```

---

### 1. Create Nudge

**Endpoint:** `POST /nudges`

**Description:** Create a new nudge notification.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Feature Alert! 🚀",
  "image_url": "https://example.com/images/feature-banner.jpg",
  "scheduled_at": "2024-01-15T10:00:00Z",
  "description": "We've just launched an amazing new feature that will revolutionize how you use our platform. Check it out now and let us know what you think!",
  "icon_url": "https://example.com/icons/rocket.svg",
  "invitation_text": "Try it now",
  "status": "scheduled"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Nudge created successfully",
  "data": {
    "_id": "6577f8a9c3d2e4b8f9a1b2c3",
    "title": "New Feature Alert! 🚀",
    "image_url": "https://example.com/images/feature-banner.jpg",
    "scheduled_at": "2024-01-15T10:00:00.000Z",
    "description": "We've just launched an amazing new feature...",
    "icon_url": "https://example.com/icons/rocket.svg",
    "invitation_text": "Try it now",
    "status": "scheduled",
    "created_at": "2024-01-10T15:30:00.000Z",
    "updated_at": "2024-01-10T15:30:00.000Z",
    "created_by": "6577f8a9c3d2e4b8f9a1b2c4"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

---

### 2. Get Nudges (Paginated)

**Endpoint:** `GET /nudges`

**Description:** Retrieve a paginated list of nudges with optional filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 10 | Number of items per page (max: 50) |
| `status` | string | - | Filter by status |
| `from_date` | string | - | Filter by scheduled_at >= date (ISO format) |
| `to_date` | string | - | Filter by scheduled_at <= date (ISO format) |

**Example Request:**
```
GET /api/v3/app/nudges?page=2&limit=5&status=scheduled
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "nudges": [
      {
        "_id": "6577f8a9c3d2e4b8f9a1b2c3",
        "title": "New Feature Alert! 🚀",
        "image_url": "https://example.com/images/feature-banner.jpg",
        "scheduled_at": "2024-01-15T10:00:00.000Z",
        "description": "We've just launched an amazing new feature...",
        "icon_url": "https://example.com/icons/rocket.svg",
        "invitation_text": "Try it now",
        "status": "scheduled",
        "created_at": "2024-01-10T15:30:00.000Z",
        "updated_at": "2024-01-10T15:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 2,
      "totalPages": 3,
      "totalCount": 12,
      "hasNext": true,
      "hasPrev": true
    }
  }
}
```

---

### 3. Get Nudge by ID

**Endpoint:** `GET /nudges/:id`

**Description:** Retrieve a single nudge by its ID.

**Path Parameters:**
- `id`: MongoDB ObjectId of the nudge

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6577f8a9c3d2e4b8f9a1b2c3",
    "title": "New Feature Alert! 🚀",
    "image_url": "https://example.com/images/feature-banner.jpg",
    "scheduled_at": "2024-01-15T10:00:00.000Z",
    "description": "We've just launched an amazing new feature...",
    "icon_url": "https://example.com/icons/rocket.svg",
    "invitation_text": "Try it now",
    "status": "scheduled",
    "created_at": "2024-01-10T15:30:00.000Z",
    "updated_at": "2024-01-10T15:30:00.000Z",
    "created_by": "6577f8a9c3d2e4b8f9a1b2c4"
  }
}
```

**Error Responses:**
- `404 Not Found`: Nudge not found

---

### 4. Update Nudge

**Endpoint:** `PUT /nudges/:id`

**Description:** Update an existing nudge. All fields are optional.

**Path Parameters:**
- `id`: MongoDB ObjectId of the nudge

**Request Body:**
```json
{
  "title": "Updated Feature Alert! 🎯",
  "scheduled_at": "2024-01-20T14:00:00Z",
  "description": "We've updated our amazing feature with even more improvements...",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Nudge updated successfully",
  "data": {
    "_id": "6577f8a9c3d2e4b8f9a1b2c3",
    "title": "Updated Feature Alert! 🎯",
    "image_url": "https://example.com/images/feature-banner.jpg",
    "scheduled_at": "2024-01-20T14:00:00.000Z",
    "description": "We've updated our amazing feature...",
    "icon_url": "https://example.com/icons/rocket.svg",
    "invitation_text": "Try it now",
    "status": "active",
    "created_at": "2024-01-10T15:30:00.000Z",
    "updated_at": "2024-01-12T10:15:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `404 Not Found`: Nudge not found

---

### 5. Delete Nudge

**Endpoint:** `DELETE /nudges/:id`

**Description:** Delete a nudge from the system.

**Path Parameters:**
- `id`: MongoDB ObjectId of the nudge

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Nudge deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Nudge not found

---

## Status Management

The `status` field follows this workflow:

```
scheduled → active → completed
     ↓
   inactive
```

- **scheduled**: Nudge is created but not yet active
- **active**: Nudge is currently being displayed to users
- **completed**: Nudge has served its purpose and is no longer displayed
- **inactive**: Nudge has been manually deactivated

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "Detailed error information (development only)"
}
```

## Rate Limiting

API endpoints are rate-limited to:
- `100 requests per minute` for authenticated users
- `20 requests per minute` for unauthenticated users

## Authentication

All endpoints except health checks require Bearer token authentication:

```
Authorization: Bearer <your_jwt_token>
```

## Examples

### Creating a Welcome Nudge

```bash
curl -X POST "http://localhost:3000/api/v3/app/nudges" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "title": "Welcome to Our Platform! 👋",
    "description": "We\'re excited to have you here. Take a quick tour to discover all the amazing features.",
    "scheduled_at": "2024-01-15T09:00:00Z",
    "invitation_text": "Start Tour",
    "status": "scheduled"
  }'
```

### Getting Active Nudges

```bash
curl -X GET "http://localhost:3000/api/v3/app/nudges?status=active&limit=10&page=1" \
  -H "Authorization: Bearer your_token_here"
```

---
