import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder</div>;
  }
  const bigIntFolderId = BigInt(parsedFolderId)

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(bigIntFolderId),
    QUERIES.getFiles(bigIntFolderId),
    QUERIES.getAllParentsForFolder(bigIntFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} currentFolderId={bigIntFolderId}/>;
}
