import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { folders, files } from "~/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";

          const folderInsert = await db.insert(folders).values(
            mockFolders.map((folder, index) => ({
              id: BigInt(index + 1),
              name: folder.name,
              parent: index !== 0 ? BigInt(1) : null,
            })),
          );

          console.log(folderInsert);

          const fileInsert = await db.insert(files).values(
            mockFiles.map((file, index) => ({
              id: BigInt(index + 1),
              name: file.name,
              size: 500,
              url: file.url,
              parent: BigInt((index % 3) + 1),
            })),
          );

          console.log(fileInsert);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
