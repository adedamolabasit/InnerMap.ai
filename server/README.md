# InnerMap Backend

This service handles dream intake, agent processing, background jobs, and tool execution.

Dreams are saved instantly so users never wait for AI responses.

All heavy work runs in workers.

---

## Main Responsibilities

- Store dreams
- Queue jobs
- Run agents
- Generate reflections
- Decide actions
- Trigger tools (Todoist)
- Track observability

---

## Architecture

- Express API  
- MongoDB  
- BullMQ workers  
- OpenAI agents  
- Todoist API  
- Opik tracing  

---

## Agents

InnerMap uses multiple agents:

- Intake Agent – extracts emotions, symbols, agency  
- Reflection Agent – finds themes and insights  
- Action Agent – decides next best step  
- Tool Agent – executes Todoist hooks  

Each agent does one job.

All outputs are strict JSON.

---

## Running Locally

```bash
npm install
```

- This run the server and worker concurrently
```bash
npm run start:all
```
Create .env:
copy .env.example to create .env

## Request Flow

- UDream submitted

- Dream saved

- Job queued

- Worker runs agents

- Action created

- Todoist task

- Dream updated with results

## Opik readme
[Link to opik readme.md on github](https://github.com/adedamolabasit/InnerMap.ai/tree/main/server/src/agents/opik)
