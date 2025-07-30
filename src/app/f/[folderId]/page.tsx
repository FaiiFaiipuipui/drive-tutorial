import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as folderSchema,
} from "~/server/db/schema";
import DriveContents from "./../../drive-contents";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: bigint) {
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

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder</div>;
  }

  console.log(params.folderId);
  const foldersPromise = db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, BigInt(parsedFolderId)));

  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, BigInt(parsedFolderId)));

  const parentPromise = getAllParents(BigInt(parsedFolderId));

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
