# Quick Start Checklist

Follow these steps to get your Survey Builder up and running with Supabase.

## ✅ Setup Checklist

### 1. Supabase Project Setup

- [ ] Go to [supabase.com](https://supabase.com) and create an account
- [ ] Create a new project
- [ ] Wait for project to be provisioned (2-3 minutes)
- [ ] Go to Project Settings > API
- [ ] Copy your **Project URL**
- [ ] Copy your **anon/public key**

### 2. Database Setup

- [ ] Open Supabase Dashboard
- [ ] Click **SQL Editor** in the sidebar
- [ ] Click **New query**
- [ ] Copy the entire contents of `supabase-schema.sql`
- [ ] Paste into the SQL Editor
- [ ] Click **Run** (or press Ctrl+Enter)
- [ ] Verify success message appears

### 3. Environment Configuration

- [ ] In your project root, create a file named `.env`
- [ ] Add these two lines (replace with your actual values):
  ```
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
  ```
- [ ] Save the file
- [ ] **Important**: Never commit this file to git!

### 4. Create User Accounts

For each client who needs access:

- [ ] Open Supabase Dashboard
- [ ] Click **Authentication** in sidebar
- [ ] Click **Users** tab
- [ ] Click **Add user**
- [ ] Choose **Create new user**
- [ ] Enter their email address
- [ ] Generate a strong password
- [ ] **Toggle ON** "Auto Confirm User"
- [ ] Click **Create user**
- [ ] Share email and password with the client securely

### 5. Install and Run

- [ ] Run `npm install` (if you haven't already)
- [ ] Run `npm run dev`
- [ ] Open browser to `http://localhost:5173`
- [ ] Try logging in with a user account you created
- [ ] Create a test survey
- [ ] Verify it saves to the database

### 6. Test Core Features

- [ ] Login with a user account
- [ ] Create a new survey
- [ ] Add some questions
- [ ] Add tags to the survey
- [ ] Preview the survey
- [ ] Click "Send to Mobile App" to publish
- [ ] Verify "Published" badge appears
- [ ] Logout
- [ ] Login with a different user account
- [ ] Verify you don't see the first user's surveys
- [ ] Create another survey with the second user

### 7. Production Deployment (Optional)

- [ ] Run `npm run build`
- [ ] Deploy the `dist` folder to your hosting service
- [ ] Add environment variables to your hosting platform
- [ ] Test login and functionality on production URL

## 🎯 Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile App Integration

To query surveys from your mobile app:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Get all published surveys
const { data: surveys } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false })

// Get specific survey by ID
const { data: survey } = await supabase
  .from('surveys')
  .select('*')
  .eq('id', surveyId)
  .eq('published', true)
  .single()
```

## ❗ Common Issues

### "Missing Supabase environment variables"
→ Make sure `.env` file exists and has correct variable names

### "Invalid API key"
→ Check you copied the **anon** key, not the service_role key

### Can't see surveys after creating them
→ Check browser console for errors
→ Verify database schema was created correctly

### Can't login
→ Verify user exists in Supabase Dashboard > Authentication
→ Make sure "Auto Confirm User" was enabled

## 📚 More Information

- **Complete Setup Guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Technical Details**: [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)
- **Feature Documentation**: [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)
- **Main README**: [README.md](./README.md)

## ✨ You're Done!

Once all checkboxes are complete, your Survey Builder is ready to use!

Your users can now:
- Login securely
- Create and manage surveys
- Publish surveys to mobile apps
- Organize surveys with tags
- Work independently without seeing each other's data

---

Need help? Check the documentation files or the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)

