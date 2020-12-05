export class FileFolder {
    id: number;
    parentId: number;
    name: string;
    ext: string;
    path: string;
    userId: number;
    sharedUserId: number;
    isFolder: boolean;

    constructor(id,parentId,name,ext,path,userId,sharedUserId,isFolder) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.ext = ext;
        this.path = path;
        this.userId = userId
        this.sharedUserId = sharedUserId;
        this.isFolder = isFolder;
    }
  }