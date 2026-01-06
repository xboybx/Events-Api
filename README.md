# Event Management API

A robust Node.js/Express API for managing events with file upload capabilities and comprehensive error handling. Built with native MongoDB driver for optimal performance.

## 🛠 Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository
cd event-management-api

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/event_management

# Server port
PORT=3000

# Environment (development or production)
NODE_ENV=development
```

**Environment Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api/v3/app
```

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/events?id=:event_id` | Fetch single event by ID |
| `GET` | `/events?type=latest&limit=5&page=1` | Fetch paginated events |
| `POST` | `/events` | Create new event with image |
| `PUT` | `/events/:id` | Update existing event |
| `DELETE` | `/events/:id` | Delete event |

### 1. Get Event by ID

Retrieve a single event using its MongoDB ObjectId.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v3/app/events?id=6577f8a9c3d2e4b8f9a1b2c3"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6577f8a9c3d2e4b8f9a1b2c3",
    "name": "Tech Conference 2024",
    "tagline": "The Future of Technology",
    "schedule": "2024-03-15T09:00:00.000Z",
    "description": "Join us for the biggest tech conference of the year...",
    "moderator": "John Doe",
    "category": "Technology",
    "sub_category": "Software Development",
    "rigor_rank": 8,
    "image": "/uploads/event-1704456789123-123456789.jpg",
    "created_at": "2024-01-10T10:00:00.000Z",
    "updated_at": "2024-01-10T10:00:00.000Z"
  }
}
```

### 2. Get Latest Events (Paginated)

Retrieve events sorted by recency with pagination support.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v3/app/events?type=latest&limit=5&page=1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "_id": "6577f8a9c3d2e4b8f9a1b2c3",
        "name": "Tech Conference 2024",
        "tagline": "The Future of Technology",
        "schedule": "2024-03-15T09:00:00.000Z",
        "description": "Join us for the biggest tech conference...",
        "moderator": "John Doe",
        "category": "Technology",
        "sub_category": "Software Development",
        "rigor_rank": 8,
        "image": "/uploads/event-1704456789123-123456789.jpg",
        "created_at": "2024-01-10T10:00:00.000Z",
        "updated_at": "2024-01-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 12,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Query Parameters:**
- `type` (required): Must be "latest"
- `limit` (optional): Items per page (default: 5, max: 50)
- `page` (optional): Page number (default: 1)

### 3. Create Event

Create a new event with an optional image upload.

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v3/app/events" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Tech Conference 2024" \
  -F "tagline=The Future of Technology" \
  -F "schedule=2024-03-15T09:00:00Z" \
  -F "description=Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations." \
  -F "moderator=John Doe" \
  -F "category=Technology" \
  -F "sub_category=Software Development" \
  -F "rigor_rank=8" \
  -F "files[image]=@/path/to/image.jpg"
```

**Required Fields:**
- `name`: Event name (string, min 1 char)
- `tagline`: Short description (string, min 1 char)
- `schedule`: Event date/time (ISO 8601 format)
- `description`: Detailed description (string, min 1 char)
- `moderator`: Event moderator (string, min 1 char)
- `category`: Main category (string, min 1 char)
- `sub_category`: Sub category (string, min 1 char)
- `rigor_rank`: Difficulty/Importance rank (integer, 1-10)

**Optional Fields:**
- `files[image]`: Image file (jpeg, jpg, png, gif, webp, svg, max 5MB)

### 4. Update Event

Update an existing event. All fields are optional.

**Request:**
```bash
curl -X PUT "http://localhost:3000/api/v3/app/events/6577f8a9c3d2e4b8f9a1b2c3" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Updated Tech Conference 2024" \
  -F "rigor_rank=9" \
  -F "files[image]=@/path/to/new-image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "6577f8a9c3d2e4b8f9a1b2c3",
    "name": "Updated Tech Conference 2024",
    "tagline": "The Future of Technology",
    "schedule": "2024-03-15T09:00:00.000Z",
    "description": "Join us for the biggest tech conference...",
    "moderator": "John Doe",
    "category": "Technology",
    "sub_category": "Software Development",
    "rigor_rank": 9,
    "image": "/uploads/event-1704457890123-987654321.jpg",
    "created_at": "2024-01-10T10:00:00.000Z",
    "updated_at": "2024-01-12T15:30:00.000Z"
  }
}
```

### 5. Delete Event

Delete an event from the system.

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/v3/app/events/6577f8a9c3d2e4b8f9a1b2c3"
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

##  Testing with Postman

### Setting up Postman

1. **Import the following cURL commands into Postman:**
   - Use the cURL examples provided above
   - Import as "Raw text" in Postman

2. **Testing File Uploads:**
   - Set request method to `POST` or `PUT`
   - In Body tab, select `form-data`
   - Add text fields as key-value pairs
   - For image, set key as `files[image]` and type as `File`
   - Select your image file

3. **Testing GET Requests:**
   - For single event: Use query parameter `id`
   - For paginated events: Use query parameters `type=latest`, `limit`, `page`

### Test Scenarios

1. **Create Event (Success):**
   - Provide all required fields
   - Upload a valid image file
   - Expected: 201 Created

2. **Create Event (Validation Error):**
   - Missing required fields
   - Expected: 400 Bad Request

3. **Get Event (Not Found):**
   - Use invalid ObjectId format
   - Expected: 400 Bad Request
   - Use valid ObjectId that doesn't exist
   - Expected: 404 Not Found

4. **Upload Invalid File:**
   - Try uploading a PDF file
   - Expected: 400 Bad Request

5. **Large File Upload:**
   - Try uploading a file > 5MB
   - Expected: 400 Bad Request

##  Project Structure

```
event-management-api/
├── controllers/
│   └── eventController.js    # Event business logic
├── routes/
│   └── eventRoutes.js        # API route definitions
├── config/
│   ├── db.js                 # MongoDB connection
│   └── multer.js             # File upload configuration
├── uploads/                  # Uploaded images directory
├── index.js                  # Main application file
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── README.md                 # This file
└── NUDGE_API_DOCS.md         # Nudge feature documentation
```

## 🔧 Configuration Details

### Database Connection (`config/db.js`)

- **Singleton Pattern**: Single connection reused across requests
- **Native MongoDB Driver**: No ORM/ODM overhead
- **ObjectId Validation**: Built-in ObjectId validation
- **Error Handling**: Comprehensive connection error handling

### File Upload (`config/multer.js`)

- **Storage**: Disk storage with unique filenames
- **File Filtering**: Images only (jpeg, jpg, png, gif, webp, svg)
- **Size Limit**: 5MB maximum file size
- **Security**: File type validation on both extension and mimetype

##  Error Handling

### 404 - Not Found
- Invalid routes
- Missing resources (event not found)
- Invalid ObjectId format

### 400 - Bad Request
- Missing required fields
- Invalid file types
- File size exceeded
- Invalid pagination parameters
- Invalid date formats

### 500 - Internal Server Error
- Database connection errors
- File system errors
- Unexpected server errors

**Error Response Format:**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "Detailed error (development only)"
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed:**
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Ensure database exists

2. **File Upload Not Working:**
   - Check `uploads/` directory exists
   - Verify file size (< 5MB)
   - Ensure valid file type

3. **Port Already in Use:**
   - Change `PORT` in `.env`
   - Kill process using the port

4. **Module Not Found:**
   - Run `npm install`
   - Check Node.js version (>= 14.0.0)

### Debug Mode

Enable detailed error messages:
```env
NODE_ENV=development
```

##  Performance Considerations

- **Pagination**: Always use pagination for large datasets
- **File Size**: 5MB limit prevents server overload
- **Connection Pooling**: MongoDB connection reused
- **Indexing**: Consider adding indexes on frequently queried fields

##  Security Best Practices

- **Input Validation**: All inputs validated before processing
- **File Upload**: Strict file type and size validation
- **Error Messages**: Detailed errors only in development
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data in `.env`

##  Production Deployment

1. **Environment Setup:**
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/event_management
   ```

2. **Process Management:**
   ```bash
   npm install -g pm2
   pm2 start index.js --name "event-api"
   ```

3. **Reverse Proxy (Nginx):**
   ```nginx
   location /api/ {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

##  Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Event Management API is running",
  "timestamp": "2024-01-10T15:30:00.000Z",

}
```


