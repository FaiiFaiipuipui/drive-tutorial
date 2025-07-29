import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as folderSchema,
} from "~/server/db/schema";
import DriveContents from "./../../drive-contents";
import { eq } from "drizzle-orm";

export default async function GoogleDriveClone(props: {params: Promise<{folderId: string}>}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId)
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder</div>
  }

  console.log(params.folderId);
  const folders = await db.select().from(folderSchema).where(eq(folderSchema.parent, BigInt(parsedFolderId)))

  const files = await db.select().from(filesSchema).where(eq(filesSchema.parent, BigInt(parsedFolderId)))

  return <DriveContents files={files} folders={folders} />
}
