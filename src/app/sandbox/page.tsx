import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { folders_table, files_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function SandboxPage() {
  const user = await auth()
  if (!user.userId) {
    throw new Error("User not found")
  }

  const folders = await db.select().from(folders_table).where(eq(folders_table.ownerId, user.userId))

  console.log(folders);
  return (
    <div className="flex flex-col gap-4">
      <form
        action={async () => {
          "use server"
          const user = await auth()
          if (!user.userId) {
            throw new Error("User not found")
          }

          const rootFolder = await db.insert(folders_table).values({
            name: "root",
            ownerId: user.userId,
            parent: null
          }).$returningId();

          const insertableFolders = mockFolders.map((folder) => ({
            name: folder.name,
            ownerId: user.userId,
            parent: rootFolder[0]!.id
          }))
          await db.insert(folders_table).values(insertableFolders)
        }}
      >
        <button type="submit">Create File</button>
      </form>
    </div>
  );
}
