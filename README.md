<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Clerk-black?style=for-the-badge&logoColor=white&logo=clerk&color=6C47FF" alt="clerk" />
    <img src="https://img.shields.io/badge/-Shadcn_UI-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcnui" />
    <img src="https://img.shields.io/badge/-Zod-black?style=for-the-badge&logoColor=white&logo=zod&color=3E67B1" alt="zod" />
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  </div>

  <h3 align="center">YASAC (Yet Another Social App Clone)</h3>

   <div align="center">
     A clone to Thread Social App made with minimal features to learn Nextjs SSR Components and Page Routers.  
    </div>
</div>

## <a name="table">📋 Table of Contents</a>

1. 👋 [Introduction](#introduction)
2. 💻 [Tech Stack](#tech-stack)
3. ✨ [Features](#features)
4. 🐛 [Known Issues](#known-issues)
5. 🏁 [Quick Start](#quick-start)
6. 📢 [Shout Outs](#shout-outs)

## <a name="introduction">👋 Introduction</a>

Build a full stack Threads clone using Next.js 14+ with a redesigned look transformed from a Figma design, user interaction to community management, technical implementation, and various features, including nested deep comments, notifications, real-time-search, responsive for all types of devices and more.

## <a name="tech-stack">💻 Tech Stack</a>

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/)
- [Webhooks](https://clerk.com/docs/integrations/webhooks/overview)
- Serverless APIs
- [Uploadthing](https://uploadthing.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/)

## <a name="features">✨ Features</a>

#### ⭐ **Authentication**:
 Authentication using Clerk for email, password, and social logins (Google and Facebook) with a comprehensive profile management system.

#### ⭐ **Visually Appealing Home Page and Landing Page**:
 A visually appealing home page showcasing the latest threads and landing page for an engaging user experience.

#### ⭐ **Create Thread Page**:
A dedicated page for users to create threads, fostering community engagement.

#### ⭐ **Commenting and Nested Commenting Feature**:
A commenting feature to facilitate discussions within threads along with nested threads and commenting, providing a structured discussion.

#### ⭐ **Delete Commenting and Nested Commenting Feature**:
Users now can delete a thread or a comment and also remove all the nested comments for the user profile screen.

#### ⭐ **User / Community Search with Pagination**:
A user and community search feature with pagination for easy exploration and discovery of other users and communities.

#### ⭐ **Activity Page**:
Display notifications on the activity page when someone comments on a user's thread, enhancing user engagement.

#### ⭐ **Profile Page**:
User profile pages for showcasing information and enabling modification of profile settings.

#### ⭐ **Follow / UnFollow User**:
Follow a user to see its threads in your feed. Users can see their or others open users followers from the user profile screen.

#### ⭐ **Private Profile**:
Feature to make a profile private and remove all the profile threads from the feed of normal users.

#### ⭐ **Create and Invite to Communities**:
Allow users to create new communities and invite others using customizable template emails.

#### ⭐ **Community Member Management**:
A user-friendly interface to manage community members, allowing role changes and removals.

#### ⭐ **Admin-Specific Community Threads**:
Enable admins to create threads specifically for their community and its members.

#### ⭐ **Community Profiles**:
Display community profiles showcasing threads and members for a comprehensive overview.

#### ⭐ **Blazing-Fast Performance**:
Optimal performance and instantaneous page switching for a seamless user experience.

#### ⭐ **Server Side Rendering**:
Utilize Next.js with Server Side Rendering for enhanced performance and SEO benefits.

#### ⭐ **MongoDB with Complex Schemas**:
Handle complex schemas and multiple data populations using MongoDB.

#### ⭐ **File Uploads with UploadThing**:
File uploads using UploadThing for a seamless media sharing experience.

#### ⭐ **Real-Time Events Listening**:
Real-time events listening with webhooks to keep users updated.

#### ⭐ **Middleware, API Actions, and Authorization**:
Utilize middleware, API actions, and authorization for robust application security.

#### ⭐ **Next.js Layout Route Groups**:
New Next.js layout route groups for efficient routing.

#### ⭐ **Data Validation with Zod**:
Data integrity with data validation using Zod.

#### ⭐ **Form Management with React Hook Form**:
Efficient management of forms with React Hook Form for a streamlined user input experience.

and many more, including code architecture and reusability.

## <a name="Known Issues">🐛 Known Issues</a>
- Webhook to add members to the community is failing on vercel.
- Switching between Organization and User account mess up the profile tab.
- UI of some of the features is implemented but functionality is not there like **Repost** and **Send**.

## <a name="quick-start">🏁 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/TayyabAsghar/yasac.git
cd yasac
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
MONGODB_URL=''
CLERK_SECRET_KEY=''
UPLOADTHING_APP_ID=''
UPLOADTHING_SECRET=''
NEXT_CLERK_WEBHOOK_SECRET=''
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=''
NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL='/home'
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL='/onboarding'

```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up for the corresponding websites on [MongoDB](https://www.mongodb.com/), [Clerk](https://clerk.com/), and [Uploadthing](https://uploadthing.com/). 

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


## <a name="shout-outs">📢 Shout Outs</a>

<div>
     My sincere thanks to <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> for having detailed videos on Nextjs for motivating and helping me creating this project.
</div>