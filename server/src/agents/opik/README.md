# InnerMap Observability (Opik)

InnerMap uses **Opik** to track every dream lifecycle and agent decision.

This gives visibility into:

- What users submit
- How agents reason
- What actions are generated
- Whether previous actions were completed

It makes the system transparent, debuggable, and easy to evaluate.

---

## Why Opik

Dream processing happens asynchronously across multiple agents.

Opik helps us:

- Trace each dream from intake → reflection → action  
- Monitor agency scores and decisions  
- See how actions evolve over time  
- Debug failures or unexpected behavior  
- Understand user progress across sessions  

Each user has a persistent thread.

---

## What Is Tracked

For every dream, we log:

- Dream text  
- Agency score  
- Reflection themes  
- Selected action type (reflect / todo / goal)  
- Previous action completion status  

All events are grouped by user thread.

---

## Example Trace

```ts
openaiOpikThread.trace({
  name: "dream-cycle",
  threadId: userId,

  metadata: {
    dreamId,
    agency,
    previousActionCompleted,
    actionType
  },

  input: { dreamText },

  output: {
    themes,
    action
  }
});
