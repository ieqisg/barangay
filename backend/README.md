# Barangay Backend API

Node.js + Express + MongoDB backend for the Barangay request management system.

## Prerequisites

- Node.js 16+
- MongoDB (local or Atlas cloud instance)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/barangay
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/barangay?retryWrites=true&w=majority
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout (clears token)

### Requests
- `GET /requests` - Get all requests (with optional `userId` query param)
- `GET /requests/:id` - Get a specific request
- `POST /requests` - Create a new request
- `PUT /requests/:id/status` - Update request status
- `PUT /requests/:id/assign` - Assign handler to request
- `POST /requests/:id/logs` - Add log entry to request

### Notifications
- `GET /notifications` - Get notifications for a user

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/barangay |
| JWT_SECRET | Secret key for JWT signing | changeme |
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |

## MongoDB Collections

### Users
```javascript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed with bcrypt),
  firstName: string,
  lastName: string,
  role: string (resident, staff, admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Requests
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  title: string,
  description: string,
  type: string (general, complaint, etc),
  priority: string (low, medium, high),
  status: string (submitted, in-progress, resolved, rejected),
  handler: ObjectId (ref to User, optional),
  createdAt: Date,
  updatedAt: Date,
  logs: [
    {
      ts: Date,
      actor: string,
      message: string
    }
  ]
}
```

### Notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId (null for global/staff notifications),
  message: string,
  read: boolean,
  ts: Date
}
```

## Development Notes

- Passwords are hashed using bcryptjs before storing in MongoDB
- JWT tokens are used for authentication (passed in Authorization header)
- The API expects and returns JSON
- All timestamps are ISO 8601 format

## Connecting the Frontend

Set the `REACT_APP_API_URL` environment variable in your React app's `.env` file to point to this backend:

```
REACT_APP_API_URL=http://localhost:5000
```

Then build and run the React app. The frontend will now use this backend API instead of localStorage.
