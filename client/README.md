# InnerMap Frontend

This is the frontend for **InnerMap** — a simple web app where users write or record dreams and receive emotional insights and gentle actions.

The UI focuses on speed and clarity:

- No login needed to start  
- Users can type or record dreams  
- Dreams are submitted instantly  
- Results appear once background agents finish  
- Actions can be sent to Todoist  

The goal is to make reflection feel light and safe.

---

## Features

- Dream input (text + voice)
- Instant submission
- Live status while agents run
- Symbols, emotions, themes, reflection
- Action suggestions
- Todoist integration
- User feedback loop

---

## Tech Stack

- Next.js  
- TypeScript  
- Tailwind  
- React Query  

---

## Running Locally

```bash
npm install
npm run dev
```

## Flow

- User submits dream

- Backend returns immediately

- Agents run in background

- UI polls for updates

- Results appear when ready

- User can reflect or take action
