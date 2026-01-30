import { Client } from "@notionhq/client";

// export const addToNotion = async (notionToken: string, content: string) => {
//   const notion = new Client({ auth: notionToken });

//   await notion.pages.create({
//     parent: { database_id: process.env.NOTION_DB_ID! },
//     properties: {
//       Name: { title: [{ text: { content } }] },
//     },
//   });

//   return { status: "notion_entry_created" };
// };

// import { Client } from "@notionhq/client";

interface TaskInput {
  name: string;
  description?: string;
  dueDate?: string;
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
  const notion = new Client({ auth: process.env.NOTION_TOKEN!});

  const properties: any = {
    Name: { title: [{ text: { content: name } }] },
    Description: { rich_text: [{ text: { content: description } }] },
    Status: { select: { name: status } },
  };

  if (dueDate) {
    properties["Due Date"] = { date: { start: dueDate } };
  }

  if (assignedTo) {
    properties["Assigned To"] = {
      rich_text: [{ text: { content: assignedTo } }],
    };
  }

  const page = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DB_ID! },
    properties,
  });

  console.log(page, "page");

  return {
    status: "todo_created",
    // pageId: page.id,
    // url: page.url, // 👈 THIS IS THE ACCESS LINK
  };
};

  const notion = new Client({ auth: process.env.NOTION_TOKEN!});

export const getDatabaseId = async () => {
  try {
    const response = await notion.search({
      query: "Tasks",
      page_size: 10,
    });

    console.log(JSON.stringify(response, null, 2)); // see exactly what you get

    const database = response.results.find((r: any) => r.object === "database");
    if (!database) {
      console.error("Database not found. Check integration access and database name.");
      return null;
    }

    return database.id;
  } catch (err) {
    console.error("Error fetching database ID:", err);
    return null;
  }
};

