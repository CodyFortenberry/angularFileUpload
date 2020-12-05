export class FileFolder {
    id: number;
    parentId: number;
    name: string;
    ext: string;
    path: string;
    userId: number;
    sharedUserId: number;
    isFolder: boolean;
    dateAdded: string;

    constructor(id,parentId,name,ext,path,userId,sharedUserId,isFolder,dateAdded) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.ext = ext;
        this.path = path;
        this.userId = userId
        this.sharedUserId = sharedUserId;
        this.isFolder = isFolder;
        if (dateAdded) {
            this.dateAdded = dateAdded;
        }
        else {
            let today = new Date();
            this.dateAdded = today.toLocaleDateString();
        }
    }
  }