# Campus Voice – Anonymous Student Grievance & Feedback Portal

Campus Voice is a secure, anonymous platform designed for college students to raise complaints and provide feedback without revealing their identity publicly. Built with modern web technologies, this system enables transparent communication between students and management while preserving anonymity and accountability.

## Project Overview

Campus Voice addresses the common challenge faced by students who hesitate to voice legitimate concerns due to fear of identification or retaliation. The platform allows students to post complaints anonymously to the public feed while maintaining a private record of their submissions. Management can review and respond to all complaints without accessing student identities, ensuring fair and unbiased resolution.

The system also supports periodic feedback collection, such as teacher evaluations and facility surveys, providing management with actionable insights for institutional improvement.

## Technology Stack

**Frontend:**
- React 18 with Vite
- React Router v6 for navigation
- Axios for API communication
- React Toastify for notifications
- Custom CSS for styling

**Backend:**
- Node.js with Express.js
- MongoDB Atlas (Cloud Database)
- JWT for session management
- Mongoose ODM for data modeling

**Development Tools:**
- ESLint for code quality
- Nodemon for auto-reload during development
- PowerShell scripts for quick startup

## Key Features

### Student Portal
- User registration with roll number, name, department, year, section, and password
- Login using roll number and password
- Post complaints anonymously (identity hidden from all users)
- Browse complaint feed with public visibility
- Upvote or downvote complaints
- Comment on existing complaints
- View personal complaint history with full details
- Track complaint status (Pending, In Progress, Resolved)
- View management responses
- Participate in feedback polls with 1-5 star ratings

### Management Portal
- Secure login with institutional email
- View all submitted complaints (without student identity)
- Update complaint status
- Provide official responses to complaints
- Delete inappropriate or spam content
- Create feedback polls and surveys
- View poll results and analytics
- Monitor rating distributions

### Security & Privacy
- Anonymous complaint submission
- Identity masking at database level
- JWT-based authentication
- Session management with automatic token validation
- Role-based access control

## Project Structure

```
CMS/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema for students and management
│   │   ├── Complaint.js         # Complaint schema with interactions
│   │   └── FeedbackPoll.js      # Feedback poll schema
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── complaints.js        # Complaint CRUD operations
│   │   └── feedback.js          # Feedback poll endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server configuration
│   └── package.json             # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance with interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation component
    │   │   └── Navbar.css       # Navigation styles
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication state management
    │   ├── pages/
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Register.jsx     # Registration page
    │   │   ├── Dashboard.jsx    # Student dashboard
    │   │   ├── ComplaintFeed.jsx # Public complaint feed
    │   │   ├── NewComplaint.jsx # Complaint submission form
    │   │   ├── MyComplaints.jsx # Personal complaint history
    │   │   ├── FeedbackPolls.jsx # Feedback poll listing
    │   │   ├── AdminComplaints.jsx # Management complaint view
    │   │   └── AdminFeedback.jsx # Management poll management
    │   ├── App.jsx              # Main application component
    │   ├── main.jsx             # React entry point
    │   └── index.css            # Global styles
    ├── index.html               # HTML template
    ├── vite.config.js           # Vite configuration
    └── package.json             # Frontend dependencies
```

## Installation and Setup

### Prerequisites

- Node.js version 16 or higher
- MongoDB Atlas account with active cluster
- npm or yarn package manager
- Git (for version control)

### Environment Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
```

**MongoDB Atlas Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Backend Installation

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

The backend API will run on `http://localhost:5000`

**Default Management Account:**
On first server startup, a management account is automatically created:
- Email: `management@rcee.ac.in`
- Password: `1234`

### Frontend Installation

1. Open a new terminal and navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

The frontend application will run on `http://localhost:3000`

### Quick Start (Alternative)

Run the provided PowerShell script to install both frontend and backend dependencies:
```powershell
.\quick-start.ps1
```

Then start both services in separate terminals:
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new student account | No |
| POST | `/api/auth/login` | Login for students and management | No |

### Complaint Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/complaints` | Create new complaint | Yes (Student) |
| GET | `/api/complaints` | Get all complaints (anonymous) | Yes |
| GET | `/api/complaints/my` | Get user's own complaints | Yes (Student) |
| PUT | `/api/complaints/:id/status` | Update complaint status | Yes (Management) |
| DELETE | `/api/complaints/:id` | Delete complaint | Yes (Management) |
| POST | `/api/complaints/:id/agree` | Upvote complaint | Yes |
| POST | `/api/complaints/:id/disagree` | Downvote complaint | Yes |
| POST | `/api/complaints/:id/comment` | Add comment to complaint | Yes |

### Feedback Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/feedback` | Create feedback poll | Yes (Management) |
| GET | `/api/feedback` | Get all active polls | Yes |
| GET | `/api/feedback/:id` | Get specific poll details | Yes |
| POST | `/api/feedback/:id/rate` | Submit rating for poll | Yes (Student) |
| PUT | `/api/feedback/:id/toggle` | Activate/deactivate poll | Yes (Management) |
| DELETE | `/api/feedback/:id` | Delete poll | Yes (Management) |

## Database Schema

### Users Collection
```
{
  rollNumber: String (unique),
  name: String,
  department: String,
  year: Number,
  section: String,
  password: String,
  role: String (student/management),
  email: String (for management only)
}
```

### Complaints Collection
```
{
  title: String,
  description: String,
  category: String (Hostel/Mess/Transport/Academics/Others),
  studentId: ObjectId (hidden in public view),
  status: String (Pending/In Progress/Resolved),
  adminResponse: String,
  agrees: [ObjectId],
  disagrees: [ObjectId],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

### Feedback Polls Collection
```
{
  title: String,
  description: String,
  category: String,
  ratings: [{
    user: ObjectId,
    rating: Number (1-5),
    comment: String,
    createdAt: Date
  }],
  createdBy: ObjectId,
  isActive: Boolean,
  createdAt: Date
}
```

## Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy

### Backend Deployment (Render/Railway)

1. Push code to GitHub repository
2. Create new web service on Render
3. Configure environment variables (MONGODB_URI, JWT_SECRET, PORT)
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

**Important:** Update the API base URL in `frontend/src/api/axios.js` to point to your deployed backend.

## Limitations and Known Issues

1. **Password Storage:** Passwords are stored in plain text as per initial requirements. For production, implement bcrypt hashing.
2. **No Email Verification:** Student registration does not verify institutional email addresses.
3. **Limited File Upload:** Complaints do not support image or file attachments.
4. **Basic Search:** No advanced search or filtering options in complaint feed.
5. **No Real-time Updates:** Users must refresh to see new complaints or status changes.
6. **Session Management:** JWT tokens stored in localStorage are vulnerable to XSS attacks.

## Future Enhancements

- Implement bcrypt for password encryption
- Add email verification for student registration
- Support file and image uploads for complaints
- Implement real-time notifications using WebSockets
- Advanced search with filters (date range, category, status)
- Analytics dashboard for management
- Mobile application using React Native
- Multi-language support
- Export complaint reports as PDF
- Integration with institutional ERP systems

## Troubleshooting

**Backend fails to start:**
- Verify MongoDB connection string is correct
- Check if port 5000 is available
- Ensure all environment variables are set
- Check for missing dependencies

**Frontend fails to start:**
- Verify port 3000 is not in use
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in code

**Cannot login:**
- Verify backend server is running
- Check network tab in browser developer tools
- Ensure credentials match database records
- Verify JWT token is being generated

**Database connection errors:**
- Check internet connectivity
- Verify MongoDB Atlas cluster is active
- Whitelist your IP address in MongoDB Atlas
- Check connection string format

## Contributing

This project was developed as a learning initiative. Contributions are welcome for bug fixes, feature enhancements, and documentation improvements.

## License

This project is developed for educational purposes and is available under the MIT License.

---

**Developed by:** Maganti Praveen Sai  
**GitHub:** [github.com/praveensai](https://github.com/praveensai)  
**LinkedIn:** [linkedin.com/in/praveensai](https://linkedin.com/in/praveensai)

**Default Management Credentials:**  
Email: management@rcee.ac.in  
Password: 1234
