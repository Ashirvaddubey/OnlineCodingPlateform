# CodeTest Platform - Full-Stack Coding Assessment System

A comprehensive web-based coding test platform that supports Java and C++ code execution, auto-grading with visible and hidden test cases, question skipping, themed code editor, and demo accounts for public testing.

## 🚀 Features

### Authentication & User Management
- **JWT-based authentication** for secure user sessions
- **Demo accounts** for public testing (demo1@example.com / demo123, demo2@example.com / demo123, etc.)
- **Session management** with automatic token validation

### Test Interface
- **15 DSA Questions** covering arrays, sorting, linked lists, stacks, queues, trees, heaps, and string processing
- **Monaco Code Editor** with syntax highlighting and IntelliSense
- **Language Selection** - Java and C++ support
- **Dark/Light Theme Toggle** for comfortable coding
- **Real-time Code Execution** against sample test cases
- **Question Navigation** with progress tracking
- **Skip Question** functionality
- **Timer** with automatic submission when time expires

### Code Execution & Grading
- **Secure Code Compilation** and execution (mock implementation - ready for Judge0 API integration)
- **Dual Test Case System**:
  - 2 visible test cases per question (shown during "Run Code")
  - 4 hidden test cases per question (used during "Submit")
- **Auto-grading** with detailed scoring
- **Real-time Results** with execution time tracking
- **Error Handling** for compilation and runtime errors

### User Experience
- **Responsive Design** - works on desktop, tablet, and mobile
- **Progress Tracking** with completion percentages
- **Performance Analytics** with detailed results breakdown
- **Leaderboard** functionality
- **Results Export** capability

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **Monaco Editor** for code editing
- **Lucide React** for icons
- **next-themes** for theme management

### Backend
- **Next.js API Routes** for serverless functions
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Mock Database** (ready for MongoDB integration)

### Code Execution
- **Mock Execution Engine** (ready for Judge0 API or Docker integration)
- **Secure Code Validation**
- **Test Case Management**
- **Grading System**

## 📋 Question Categories

1. **Arrays & Basic Operations**
   - Sales Report Analysis
   - Array Rotation
   - Student Ranking (Selection Sort)

2. **String Processing**
   - Username Validator
   - Word Frequency Counter
   - Minimum Window Substring

3. **Advanced String Algorithms**
   - Longest Repeating Character Replacement

4. **Linked Lists**
   - Playlist Manager (Singly Linked List)
   - Train Coach Arrangement (Doubly Linked List)
   - Reverse Linked List

5. **Stack & Queue**
   - Undo Feature (Stack Implementation)
   - Circular Queue for Parking

6. **Trees**
   - Employee Hierarchy (Binary Tree)

7. **Heaps**
   - Find K Smallest Elements
   - Priority-Based Job Scheduling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd coding-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   # Create .env.local file
   JWT_SECRET=your-secret-key-change-in-production
   JUDGE0_API_KEY=your-judge0-api-key-optional
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Accounts
Use these credentials to test the platform:
- **demo1@example.com** / demo123
- **demo2@example.com** / demo123  
- **demo3@example.com** / demo123
- **demo4@example.com** / demo123

## 🏗 Architecture

### File Structure
\`\`\`
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── questions/      # Question management
│   │   ├── code/           # Code execution endpoints
│   │   └── results/        # Results and analytics
│   ├── dashboard/          # User dashboard
│   ├── test/              # Test interface
│   ├── results/           # Results page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── code-editor.tsx    # Monaco editor wrapper
│   ├── error-boundary.tsx # Error handling
│   └── loading-spinner.tsx
├── lib/
│   ├── auth.ts            # Authentication logic
│   ├── questions.ts       # Question data and management
│   ├── code-executor.ts   # Code execution engine
│   ├── grading-system.ts  # Grading and scoring
│   └── database.ts        # Database operations
└── README.md
\`\`\`

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

#### Questions
- `GET /api/questions` - Get all questions (visible test cases only)
- `GET /api/questions/[id]` - Get specific question

#### Code Execution
- `POST /api/code/run` - Run code against visible test cases
- `POST /api/code/submit` - Submit code for full grading

#### Analytics
- `GET /api/progress` - Get user progress
- `GET /api/results` - Get detailed results
- `GET /api/leaderboard` - Get leaderboard data

## 🔧 Configuration

### Database Setup (Production)
The platform is configured to work with MongoDB:
\`\`\`javascript
// Connection string: mongodb://localhost:27017/MeritshotData/Users
\`\`\`

### Judge0 API Integration (Production)
For secure code execution in production:
1. Sign up for Judge0 API
2. Add your API key to environment variables
3. Update the `CodeExecutor` class to use Judge0

### Docker Setup (Alternative)
For custom code execution environment:
1. Set up Docker containers for Java and C++
2. Implement sandboxing and security measures
3. Update execution logic in `code-executor.ts`

## 🚀 Deployment

### Vercel Deployment
1. **Connect to Vercel**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Set Environment Variables**
   - `JWT_SECRET`
   - `JUDGE0_API_KEY` (optional)

3. **Deploy**
   The platform is ready for deployment with demo accounts accessible immediately.

### Environment Variables
\`\`\`bash
# Required
JWT_SECRET=your-jwt-secret-key

# Optional (for production code execution)
JUDGE0_API_KEY=your-judge0-api-key
DATABASE_URL=mongodb:....
\`\`\`

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Code Validation** to prevent malicious code execution
- **Input Sanitization** for all user inputs
- **Rate Limiting** ready for implementation
- **Secure Test Case Management** (hidden test cases never exposed to frontend)
- **Error Boundary** for graceful error handling

## 🎯 Future Enhancements

- **Real Database Integration** (MongoDB/PostgreSQL)
- **Judge0 API Integration** for secure code execution
- **Advanced Analytics** and performance insights
- **Multiple Programming Languages** (Python, JavaScript, etc.)
- **Contest Mode** with time-based competitions
- **Code Plagiarism Detection**
- **Advanced User Management** with roles and permissions
- **Email Notifications** for results and updates

## 📝 License

This project is ready for production use and deployment to Vercel with full demo account functionality.


**Ready for deployment to Vercel with full demo account access!**
