import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as folderSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function getAllParentsForFolder(folderId: bigint) {
  const parents = [];
  let currentId = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folderSchema)
      .where(eq(folderSchema.id, currentId));

    console.log(folder);

    if (!folder[0]) {
      throw new Error("Folder not found");
    }

    parents.unshift(folder[0]);
    currentId = folder[0].parent!;
  }
  return parents;
}

export async function getFolders(folderId: bigint) {
  return db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, BigInt(folderId)));
}

export async function getFiles(folderId: bigint) {
  return db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, BigInt(folderId)));
}