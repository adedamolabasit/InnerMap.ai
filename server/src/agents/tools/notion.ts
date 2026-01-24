import { Client } from "@notionhq/client";

export const addToNotion = async (notionToken: string, content: string) => {
  const notion = new Client({ auth: notionToken });

  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DB_ID! },
    properties: {
      Name: { title: [{ text: { content } }] },
    },
  });

  return { status: "notion_entry_created" };
};
