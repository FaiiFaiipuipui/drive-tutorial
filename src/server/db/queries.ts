import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as folderSchema,
  type DB_FileType,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const QUERIES = {
  getAllParentsForFolder: async function (folderId: bigint) {
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
  },

  getFolders: async function (folderId: bigint) {
    return db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.parent, BigInt(folderId)));
  },

  getFiles: async function (folderId: bigint) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, BigInt(folderId)));
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: { name: string; size: number; url: string; parent: bigint };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({...input.file, parent: BigInt(1)});
  },
};
