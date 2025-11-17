# Barangay Request Management System

A full-stack web application for managing barangay requests and services using React (frontend) and Node.js/Express (backend) with MongoDB database.

## Project Structure

```
barangay/
├── src/                    # React frontend source code
├── backend/               # Node.js/Express backend API
├── public/                # Frontend public assets
├── build/                 # Production build (generated)
├── MONGODB_SETUP.md       # MongoDB and backend setup guide
└── README.md             # This file
```

## Quick Start

### Frontend Only (Using LocalStorage)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will use localStorage by default. No backend needed for basic testing.

### Full Stack (With MongoDB Backend)

**Backend Setup:**
```bash
cd backend
npm install
# Create .env file with MongoDB connection
cp .env.example .env
npm start
```

**Frontend Setup:**
```bash
# Create .env file with API URL
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm install
npm start
```

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB and backend configuration.

## Features

- **User Authentication**: Register and login with email/password
- **Request Management**: Create, view, and manage requests
- **Role-Based Access**: Resident, Staff, and Admin roles
- **Request Status Tracking**: Track request progress with status updates
- **Notifications**: Real-time notifications for request updates
- **Handler Assignment**: Assign staff to handle requests
- **Activity Logs**: Complete audit trail of request activities

## Technology Stack

### Frontend
- React 18
- React Router for navigation
- Custom UI components
- Local storage for offline support
- JWT token authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- CORS support

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/barangay
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

## Available Scripts

### Frontend

- `npm start` - Run development server on port 3000
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend

- `npm start` - Start the API server
- `npm run dev` - Start with auto-reload (requires `--watch` flag in Node.js)

## API Endpoints

All endpoints require JWT authentication (Bearer token in Authorization header).

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Requests
- `GET /requests` - Get all requests
- `GET /requests/:id` - Get specific request
- `POST /requests` - Create new request
- `PUT /requests/:id/status` - Update request status
- `PUT /requests/:id/assign` - Assign handler to request
- `POST /requests/:id/logs` - Add log entry

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read

## Database

The application uses MongoDB with the following collections:

### Users
- Email (unique)
- Password (hashed)
- Name (first and last)
- Role (resident, staff, admin)

### Requests
- Title and description
- Type and priority
- Status (submitted, in-progress, resolved, rejected)
- User ID (creator)
- Handler ID (assigned staff)
- Activity logs

### Notifications
- Message
- Read status
- Timestamp
- User ID (null for global notifications)

## Development

### Setup Development Environment

1. Clone the repository
2. Follow "Full Stack" setup above
3. Backend runs on http://localhost:5000
4. Frontend runs on http://localhost:3000

### Useful Commands

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm start

# Check backend health
curl http://localhost:5000/health

# View MongoDB data
mongosh
use barangay
db.users.find()
```

## Deployment

### Frontend
- Built files are in the `build/` directory
- Deploy to Netlify, Vercel, GitHub Pages, etc.
- Set `REACT_APP_API_URL` to your production backend URL

### Backend
- Deploy Node.js server to Heroku, AWS, Azure, etc.
- Set environment variables on the hosting platform
- Use MongoDB Atlas for cloud database

See the respective README files in `backend/` and root directory for more details.

## Troubleshooting

### App uses localStorage instead of API
- Check if `REACT_APP_API_URL` is set in frontend `.env`
- Restart the development server after changing `.env`
- Check browser console for API errors

### Cannot connect to MongoDB
- Ensure MongoDB is running locally or MongoDB Atlas is accessible
- Verify `MONGODB_URI` in backend `.env`
- Check network access if using MongoDB Atlas

### JWT authentication errors
- Verify `JWT_SECRET` is the same in backend `.env`
- Ensure token is being sent in Authorization header
- Clear localStorage and login again

## Learn More

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
