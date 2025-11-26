# Supabase Integration Setup Guide

This guide will help you set up Supabase authentication and database for your Survey Builder application.

## Prerequisites

- A Supabase account (free tier works fine)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Survey Builder (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials
1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. Keep this page open - you'll need these values in the next step

## Step 3: Configure Environment Variables

1. In your project root directory, create a `.env` file (or edit the existing one)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from Step 2
4. Save the file

**Important**: Never commit the `.env` file to git! It's already in `.gitignore`.

## Step 4: Create the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql` (see below)
4. Click "Run" or press `Ctrl+Enter`
5. You should see a success message

### Database Schema (supabase-schema.sql)

```sql
-- Create surveys table
create table surveys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  tags text[] default '{}',
  questions jsonb default '[]',
  question_groups jsonb default '[]',
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table surveys enable row level security;

-- Create policies for Row Level Security

-- Users can only view their own surveys
create policy "Users can view own surveys"
  on surveys for select
  using (auth.uid() = user_id);

-- Users can insert their own surveys
create policy "Users can create own surveys"
  on surveys for insert
  with check (auth.uid() = user_id);

-- Users can update their own surveys
create policy "Users can update own surveys"
  on surveys for update
  using (auth.uid() = user_id);

-- Users can delete their own surveys
create policy "Users can delete own surveys"
  on surveys for delete
  using (auth.uid() = user_id);

-- Create an index for better query performance
create index surveys_user_id_idx on surveys(user_id);
create index surveys_published_idx on surveys(published);
```

## Step 5: Create User Accounts

Since this application uses manual user management (no signup), you need to create user accounts in Supabase:

1. In your Supabase dashboard, click on **Authentication** in the left sidebar
2. Click on **Users** tab
3. Click **Add user** (or **Invite user**)
4. Choose **Create new user**
5. Fill in:
   - **Email**: client's email address
   - **Password**: generate a secure password
   - **Auto Confirm User**: Toggle this ON (so they don't need to verify email)
6. Click **Create user**
7. Share the email and password with your client

Repeat this process for each client who needs access to the application.

## Step 6: Install Dependencies and Run

1. Install the Supabase client (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

4. Log in with one of the user accounts you created

## How It Works

### Authentication

- Users log in with email and password
- Authentication state is managed by Supabase Auth
- Sessions are automatically refreshed
- Users only see their own surveys (enforced by Row Level Security)

### Database

- All surveys are stored in Supabase PostgreSQL database
- Each survey belongs to a specific user (identified by `user_id`)
- Row Level Security ensures users can only access their own data
- The `questions` and `question_groups` fields store complex data as JSONB

### Publishing Surveys

- The "Send to Mobile App" button sets `published = true` and records `published_at` timestamp
- Published surveys have a green "Published" badge
- You can unpublish surveys by clicking the button again
- The mobile app can query for published surveys via the Supabase API

## Querying Published Surveys (For Mobile App Integration)

If you're building a mobile app to display published surveys, you can query them like this:

```javascript
// Get all published surveys
const { data, error } = await supabase
  .from('surveys')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false });

// Get a specific published survey by ID
const { data, error } = await supabase
  .from('surveys')
  .select('*')
  .eq('id', surveyId)
  .eq('published', true)
  .single();
```

## Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure your `.env` file exists in the project root
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/editing `.env`

### Can't Log In

- Verify the user account exists in Supabase Dashboard > Authentication > Users
- Make sure "Auto Confirm User" was enabled when creating the account
- Check that you're using the correct email and password

### Surveys Not Showing Up

- Make sure you're logged in
- Check the browser console for errors
- Verify the database schema was created correctly
- Check that Row Level Security policies are in place

### Database Errors

- Open Supabase Dashboard > SQL Editor
- Run the schema again to ensure all tables and policies exist
- Check the "Logs" section for detailed error messages

## Security Notes

1. **Never share your `service_role` key** - only use the `anon` key in your frontend
2. Row Level Security policies ensure users can only access their own data
3. All database operations are automatically filtered by the logged-in user
4. The `anon` key is safe to use in frontend code

## Next Steps

- Create user accounts for all your clients
- Test creating, editing, and publishing surveys
- Integrate with your mobile app using the Supabase SDK
- Consider setting up email templates for password resets (optional)

## Support

For Supabase-specific questions, check out:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com/)

