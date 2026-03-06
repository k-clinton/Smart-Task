# SmartTask

A modern, feature-rich task management application built with React, TypeScript, and Supabase. SmartTask helps you organize your tasks with priorities, start dates, due dates, and a beautiful dark mode interface.

![SmartTask](https://img.shields.io/badge/version-0.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-2.39.7-3ecf8e)

## ✨ Features

- 🔐 **User Authentication** - Secure sign-up and sign-in with Supabase Auth
- ✅ **Task Management** - Create, complete, and track your tasks
- 📅 **Date Scheduling** - Set start dates and due dates with time selection
- 🎯 **Priority Levels** - Organize tasks by low, medium, or high priority
- 🌓 **Dark Mode** - Beautiful dark theme with automatic system preference detection
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS and Lucide icons
- 🔄 **Real-time Updates** - Automatic synchronization with Supabase backend

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd smarttask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Apply the Supabase migrations located in `supabase/migrations/`:
   - `20250319115421_quick_morning.sql` - Creates the tasks table and RLS policies
   - `20250319133244_precious_frost.sql` - Adds start_date and priority columns

   You can apply these using the Supabase CLI or through the Supabase dashboard SQL editor.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **date-fns** - Modern date utility library
- **react-datepicker** - Flexible date/time picker

### Backend
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
smarttask/
├── src/
│   ├── components/
│   │   ├── Auth.tsx           # Authentication component
│   │   ├── TaskInput.tsx      # Task creation form
│   │   └── TaskList.tsx       # Task list display
│   ├── lib/
│   │   └── supabase.ts        # Supabase client configuration
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite type definitions
├── supabase/
│   └── migrations/            # Database migrations
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.ts             # Vite configuration
└── .env                       # Environment variables (not in repo)
```

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🗄️ Database Schema

### Tasks Table

| Column      | Type         | Description                           |
|-------------|--------------|---------------------------------------|
| id          | uuid         | Primary key (auto-generated)          |
| title       | text         | Task title                            |
| completed   | boolean      | Task completion status (default: false)|
| start_date  | timestamptz  | When the task should start (nullable) |
| due_date    | timestamptz  | Task deadline (nullable)              |
| priority    | text         | Priority level: 'low', 'medium', 'high'|
| created_at  | timestamptz  | Creation timestamp                    |
| user_id     | uuid         | Foreign key to auth.users             |

### Security
- Row Level Security (RLS) is enabled
- Users can only access their own tasks
- Policies enforce authentication for all operations

## 🎨 Features in Detail

### Task Creation
- Simple text input for quick task entry
- Optional start date and due date with time selection
- Three priority levels with color coding
- Instant sync to Supabase

### Task Display
- Clear visual indication of completed tasks
- Priority badges with color coding
- Date information showing creation, start, and due dates
- Hover effects for better interactivity

### Authentication
- Email/password authentication
- Secure session management
- Automatic auth state synchronization
- Sign-out functionality

### Dark Mode
- Automatic detection of system preference
- Manual toggle option
- Persistent user preference in localStorage
- Smooth transitions between themes

## 🔒 Security

- User authentication required for all operations
- Row Level Security (RLS) policies protect user data
- Environment variables for sensitive credentials
- Secure password handling through Supabase Auth

## 🚧 Future Enhancements

Some ideas for extending SmartTask:
- Task editing and deletion
- Task categories/tags
- Task search and filtering
- Recurring tasks
- Task notes/descriptions
- Collaboration features
- Mobile app versions
- Email reminders
- Task statistics and analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Made with ❤️ using React and Supabase**
