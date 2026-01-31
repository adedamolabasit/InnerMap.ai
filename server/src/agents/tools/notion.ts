import axios from "axios";


const NOTION_HEADERS = {
  Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};


interface TaskInput {
  name: string;
  description?: string;
  dueDate?: string; // "2026-01-29"
  assignedTo?: string;
  status?: "Pending" | "In Progress" | "Completed";
}

export const addTodoToNotion = async ({
  name,
  description = "",
  dueDate,
  assignedTo,
  status = "Pending",
}: TaskInput) => {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: NOTION_HEADERS,
    body: JSON.stringify({
      parent: {
        database_id: process.env.NOTION_DB_ID, // MUST be a real UUID
      },
      properties: {
        Name: {
          title: [{ text: { content: name } }],
        },
        Description: {
          rich_text: [{ text: { content: description } }],
        },
        Status: {
          select: { name: status },
        },
        ...(dueDate && {
          "Due Date": {
            date: { start: dueDate },
          },
        }),
        ...(assignedTo && {
          "Assigned To": {
            rich_text: [{ text: { content: assignedTo } }],
          },
        }),
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const page = await response.json();

  return {
    status: "todo_created",
    // pageId: page.id,
    // url: page.url, // 🔥 THIS IS THE LINK YOU SHARE TO USER DASHBOARD
  };
};


export interface CreateTodoInput {
  content: string;              // Task title
  dueString?: string;            // "today", "tomorrow at 9am"
  priority?: 1 | 2 | 3 | 4;       // 1 (low) → 4 (urgent)
  projectId?: string;
  labels?: string[];
}

const TODOIST_API_URL = "https://api.todoist.com/rest/v2/tasks";



export async function createTodoistTask(
  data: CreateTodoInput
) {
  const response = await axios.post(
    TODOIST_API_URL,
    {
      content: data.content,
      due_string: data.dueString ?? "today",
      priority: data.priority ?? 1,
      project_id: data.projectId,
      labels: data.labels,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // Todoist task object
}


export async function createTodoistTaskForUser(
  data: CreateTodoInput
) {
  const response = await axios.post(
    "https://api.todoist.com/rest/v2/tasks",
    {
      content: data.content,
      due_string: data.dueString ?? "today",
      priority: data.priority ?? 1,
      project_id: data.projectId,
      labels: data.labels,
    },
    {
      headers: {
        Authorization: `Bearer fc7c6e089d4b6ae4a175f07bfde72025d883fac6`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}