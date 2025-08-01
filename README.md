# 🚀 BranchOut

**Discover your next favorite GitHub repository through personalized recommendations**

BranchOut is a modern web application that helps developers discover GitHub repositories tailored to their skill level, programming languages, and interests. Using an intuitive Tinder-style swipe interface, users can quickly browse through curated repository recommendations and save the ones they love.

![BranchOut Logo](branchout-ui/src/assets/logo/fullLogo.png)

## Features

### Personalized Discovery
- **Smart Recommendations**: AI-powered repository suggestions based on your preferences
- **Skill-Level Matching**: Repositories matched to your experience level (1st-4th year)
- **Language-Specific**: Filter by your preferred programming languages
- **Topic-Based**: Discover repos in specific domains (Web Dev, AI, Cybersecurity, etc.)

### Interactive Experience
- **Swipe Interface**: Tinder-style cards for quick repository browsing
- **Keyboard Shortcuts**: Use arrow keys or A/D for navigation
- **Detailed Views**: Click cards for comprehensive repository information
- **Real-time Feedback**: Instant updates based on your preferences

### User Management
- **Dual Authentication**: Local accounts or OAuth (Google, GitHub, etc.)
- **Profile Management**: Track your preferences and saved repositories
- **Admin Dashboard**: Administrative tools for user and repository management
- **Onboarding**: Guided tour for new users

### Repository Management
- **Save Favorites**: Keep track of repositories you're interested in
- **Detailed Information**: View stars, languages, topics, and descriptions
- **Direct Links**: Quick access to GitHub repositories
- **Organized Collections**: Easy access to your saved repositories

## Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Material-UI (MUI)** - Component library for consistent design
- **React Router** - Client-side routing
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database
- **WebSocket** - Real-time chat functionality
- **JWT** - Secure authentication tokens

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **Git** - Version control

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/branchout.git
   cd branchout
   ```

2. **Install frontend dependencies**
   ```bash
   cd branchout-ui
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in both frontend and backend directories:
   
   **Frontend (.env)**
   ```env
   VITE_DATABASE_URL=http://localhost:3000/api
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   ```
   
   **Backend (.env)**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/branchout
   JWT_SECRET=your_jwt_secret_here
   CLERK_SECRET_KEY=your_clerk_secret_here
   PORT=3000
   ```

5. **Database Setup**
   ```bash
   # Create database
   createdb branchout
   
   # Run migrations (if you have them)
   npm run migrate
   ```

6. **Start the application**
   
   **Backend:**
   ```bash
   cd branchout-api
   npm start

   # Open new terminal
   cd branchout-api

   bash run.sh (If you use MacOS)

   ```
   
   
   **Frontend:**
   ```bash
   cd branchout-ui
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173` to start using BranchOut!

## Usage

### Getting Started
1. **Sign Up**: Create an account using email or OAuth providers
2. **Set Preferences**: Configure your skill level, languages, and interests
3. **Discover**: Start swiping through personalized repository recommendations
4. **Save Favorites**: Swipe right or click the save button on repositories you like
5. **Explore**: Visit your saved repositories and explore new projects

### Navigation
- **Discovery**: Main feed with repository recommendations
- **Preferences**: Update your skill level and interests
- **Saved Repos**: View all your saved repositories
- **Profile**: Manage your account and view statistics
- **About**: Learn more about BranchOut

### Keyboard Shortcuts
- `←` or `A`: Pass on current repository
- `→` or `D`: Save current repository
- `Space`: Open repository details
- `Esc`: Close modals or exit onboarding

## Project Structure

```
branchout/
├── branchout-ui/                 # Frontend React application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Auth/            # Authentication components
│   │   │   ├── RepoCard/        # Repository card component
│   │   │   ├── SideBar/         # Navigation sidebar
│   │   │   ├── Onboarding/      # User onboarding system
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   │   ├── DiscoveryPage/   # Main discovery interface
│   │   │   ├── PreferencesPage/ # User preferences
│   │   │   ├── ProfilePage/     # User profile
│   │   │   └── ...
│   │   ├── assets/              # Images, logos, etc.
│   │   └── App.jsx              # Main application component
├── backend/                      # Backend API server
│   ├── routes/                  # API route handlers
│   ├── models/                  # Database models
│   ├── middleware/              # Express middleware
│   └── server.js                # Main server file
└── README.md                    # This file
```

## Configuration

### Authentication
BranchOut supports two authentication methods:

1. **Local Authentication**: Traditional email/password with JWT tokens
2. **OAuth**: Integration with Clerk for Google, GitHub, and other providers

### Database Schema
Key entities include:
- **Users**: User accounts and preferences
- **Repositories**: GitHub repository information
- **Swipes**: User interactions with repositories
- **Preferences**: User skill levels, languages, and topics

### Environment Variables
Refer to the installation section for required environment variables.

## Contributing

We welcome contributions to BranchOut! Here's how you can help:

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Follow existing code conventions
- Use meaningful variable and function names
- Write clear commit messages
- Add comments for complex logic

### Areas for Contribution
- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance optimizations
- Test coverage

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/clerkSync` - Sync Clerk user data

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/recommendations/:userId` - Get personalized recommendations

### Repository Endpoints
- `POST /api/repo/swipe` - Record user swipe interaction
- `GET /api/repo/:id` - Get repository details

## Troubleshooting

### Common Issues

**Installation Problems**
- Ensure Node.js version is 16 or higher
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Database Connection**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb branchout`

**Authentication Issues**
- Verify Clerk keys are correctly set
- Check JWT secret is configured
- Ensure environment variables are loaded

**Build Errors**
- Update dependencies: `npm update`
- Check for TypeScript errors if using TS
- Verify all imports are correct

## Performance

BranchOut is optimized for performance with:
- **Code Splitting**: Lazy loading of routes and components
- **Efficient Rendering**: React hooks and memoization
- **Optimized Assets**: Compressed images and minified code
- **Caching**: Strategic use of browser and server-side caching

## Security

Security measures include:
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data kept in environment variables

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

BranchOut is developed and maintained by passionate developers who believe in making code discovery accessible and enjoyable.

## Acknowledgments

- GitHub API for repository data
- Clerk for authentication services
- Material-UI for the component library
- All contributors who have helped improve BranchOut

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/branchout/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy coding! 🚀** 

Made with love by the BranchOut team