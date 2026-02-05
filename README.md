# InnerMap – Agentic Dream Reflection Platform

InnerMap is an AI-powered app that helps users reflect on dreams and turn emotional insight into small real-world actions.

It uses multiple agents (intake, reflection, action) plus tool integrations (Todoist) to create an adaptive personal growth loop.

Users can submit dreams by text or voice, receive symbolic insights, and get gentle tasks that evolve based on feedback.

---

## Project Structure
/client → Next.js client
/server → Express + Agent workers
/server/src/services/opik → Observability & tracing


---

## Documentation

Start here depending on what you want to explore:

### 🖥 Frontend

User interface, dream submission, results display.

👉 [Frontend README](https://github.com/adedamolabasit/InnerMap.ai/blob/main/client/README.md)

---

### ⚙ Backend

Multi-agent pipeline, queues, Todoist integration, MongoDB.

👉 [Backend README](https://github.com/adedamolabasit/InnerMap.ai/blob/main/server/README.md)

---

### 🔍 Observability (Opik)

Agent tracing, dream lifecycle monitoring, evaluation support.

👉 [Opik README](https://github.com/adedamolabasit/InnerMap.ai/tree/main/server/src/agents/opik)

---

## Agent Flow (High Level)

1. User submits dream
2. Dream saved immediately (no waiting)
3. Background workers run:

- Intake Agent → extracts emotions, symbols, agency  
- Reflection Agent → gentle insights  
- Action Agent → decides next step  
- Tool Agent → creates Todoist tasks  

4. User sees results
5. User gives feedback
6. System adapts next actions

Loop repeats.

---

## Core Idea

Dreams are symbolic and subjective.

InnerMap does NOT predict the future or act as therapy.

It helps users:

- Notice emotional patterns
- Build agency
- Take small safe actions
- Stay consistent with personal growth

---

## Live Demo

Frontend: https://inner-map-ai.vercel.app/  
Backend API: https://innermapai-production.up.railway.app 

---

Built for Commit To Change: AI Agents Hackathon.

