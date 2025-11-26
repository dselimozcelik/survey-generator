# Survey Builder Application

A modern, professional survey creation and management tool with cloud database and authentication - 2025 ready! ✨

## 🌟 Key Features

### Core Functionality
- 🔐 **Secure Authentication**: Email/password login with Supabase Auth
- ☁️ **Cloud Database**: All surveys stored securely in Supabase
- 👥 **Multi-User Support**: Each user only sees their own surveys
- 📱 **Mobile App Publishing**: Publish surveys to mobile apps with one click
- 📊 **8 Question Types**: Comprehensive survey design capabilities
- 🏷️ **Tag Management**: Organize surveys with tags and filtering
- 📁 **Question Groups**: Organize related questions together
- 👁️ **Preview Mode**: See exactly how your survey looks
- 🔍 **Search & Filter**: Find surveys quickly by title, description, or tags

### Design & UX
- 🎨 **Modern UI**: Glassmorphism, gradients, and smooth animations
- ✨ **Tailwind CSS v4**: Sleek and responsive design
- 🌊 **Animated Background**: Live gradient blob animations
- 🎯 **Hover Effects**: Interactive and engaging user experience
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile

## 📝 Question Types

1. **Single Choice** (Radio buttons) - User selects one option
2. **Multiple Select** (Checkboxes) - User selects multiple options
3. **Dropdown** - Select from a dropdown list
4. **Open-ended** - Free text response
5. **Rating Scale** - Star ratings with customizable range
6. **Linear Scale** - Numeric scale with labels
7. **Date** - Date picker
8. **Time** - Time picker

## 🛠️ Technologies

- **React 19**: Modern UI components
- **Vite**: Fast development and build
- **Tailwind CSS v4**: Utility-first styling
- **Zustand**: Simple state management
- **Supabase**: Authentication and database
- **PostgreSQL**: Robust data storage with Row Level Security

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)

### Installation

1. **Clone the repository**
   ```bash
   cd survey-generator
   npm install
   ```

2. **Set up Supabase**
   
   Follow the complete setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   
   Quick version:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql`
   - Create a `.env` file with your credentials:
     ```env
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Create user accounts**
   
   In Supabase Dashboard > Authentication > Users:
   - Click "Add user"
   - Enter email and password
   - Enable "Auto Confirm User"
   - Share credentials with your clients

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage

### For Survey Creators

1. **Login**: Use your email and password to access the app
2. **Create Survey**: Click "Create New Survey" and fill in details
3. **Add Tags**: Organize surveys with tags for easy filtering
4. **Add Questions**: Choose from 8 question types
5. **Create Groups**: Organize related questions into groups
6. **Preview**: See exactly how your survey looks
7. **Publish**: Click "Send to Mobile App" to publish for mobile access
8. **Manage**: Edit, delete, or unpublish surveys anytime

### For Mobile App Integration

Query published surveys from your mobile app:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get all published surveys
const { data } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false })
```

See [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) for more details.

## 📁 Project Structure

```
survey-generator/
├── .env                          # Supabase credentials (create this!)
├── .env.example                  # Template for environment variables
├── supabase-schema.sql          # Database schema
├── SUPABASE_SETUP.md            # Complete setup instructions
├── SUPABASE_INTEGRATION.md      # Integration details
├── REFACTORING_SUMMARY.md       # Feature documentation
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   ├── store/
│   │   ├── authStore.js         # Authentication state
│   │   └── surveyStore.js       # Survey state
│   ├── components/
│   │   ├── LoginForm.jsx        # Login screen
│   │   ├── SurveyList.jsx       # Survey list with publish buttons
│   │   ├── SurveyEditor.jsx     # Survey editing interface
│   │   ├── SurveyPreview.jsx    # Survey preview mode
│   │   ├── QuestionEditor.jsx   # Question creation/editing
│   │   └── CreateSurveyModal.jsx # New survey modal
│   ├── App.jsx                  # Main app with auth routing
│   └── index.css                # Tailwind CSS and animations
└── package.json
```

## 🔒 Security

- **Row Level Security**: Users can only access their own surveys
- **Environment Variables**: Credentials stored securely in `.env`
- **Session-based Auth**: Automatic session management and refresh
- **No Self-Registration**: Admin creates all user accounts
- **Data Isolation**: Complete separation between user accounts

## 🎯 Key Workflows

### Creating a Survey

1. Click "Create New Survey"
2. Enter title and description
3. Add tags for organization
4. Click "Create Survey"
5. Add questions using the "Add Question" button
6. Choose question type and configure options
7. Organize questions into groups (optional)
8. Preview your survey
9. Click "Send to Mobile App" to publish

### Managing Surveys

- **Search**: Use the search bar to find surveys by title or description
- **Filter by Tag**: Click any tag to filter surveys
- **Edit**: Click the "Edit" button on any survey card
- **Preview**: Click "Preview" to see the survey design
- **Publish**: Click "Send to Mobile App" to make available
- **Delete**: Click the trash icon to remove a survey

### User Management

As the app owner, you manage users in Supabase:

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" or "Invite user"
3. Enter email and password
4. Enable "Auto Confirm User"
5. Click "Create user"
6. Share credentials with your client

## 📚 Documentation

- **Setup Guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete setup instructions
- **Integration Details**: [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Technical details
- **Feature List**: [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - All features explained

## 🐛 Troubleshooting

### Can't Login
- Verify user exists in Supabase Dashboard > Authentication
- Check "Auto Confirm User" was enabled
- Verify email and password are correct

### Surveys Not Loading
- Check `.env` file has correct credentials
- Verify database schema was created
- Check browser console for errors
- Ensure you're logged in

### Environment Variable Errors
- Make sure `.env` file exists in project root
- Variable names must be: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating/editing `.env`

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for more troubleshooting tips.

## 🚀 Future Enhancements

Potential improvements (not yet implemented):

- Self-service password resets
- Survey sharing between users
- Version history and change tracking
- Offline mode
- Real-time collaboration
- Survey templates library
- Response collection (currently design-only)
- Advanced analytics

## 📄 License

MIT

## 🙏 Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Supabase](https://supabase.com/)

---

**Note**: This is a survey **design** tool, not a survey response collection tool. It's designed for creating and publishing surveys that will be displayed in a separate mobile application.
