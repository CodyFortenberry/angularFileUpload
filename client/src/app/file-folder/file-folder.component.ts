import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FileFolder } from '../shared/models/fileFolder.model';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-file-folder',
  templateUrl: './file-folder.component.html',
  styleUrls: ['./file-folder.component.scss']
})
export class FileFolderComponent {

  constructor(public uploadService: UploadService, public auth: AuthService) { }

  openFolder(id) {
    this.uploadService.setCurrentDirectory(this.uploadService.getCurrentDirectory() + "/" + id);
  }

  downloadFile(id) {
    console.log("here");
    let file = this.uploadService.getFileFoldersById(id);
    this.uploadService.downloadFile(file.userId,file.id,file.name,file.ext);
  }

  shareFileFolder(id) {

  }

  deleteFileFolder(id) {
    this.uploadService.deleteFileFolder(id);
  }


  get fileFolders() {
    let user = this.auth.getCurrentUser();
    let currentDirectory = this.uploadService.getCurrentDirectory();
    let parentId = null;
    if (currentDirectory !== "") {
      let directoryArray = currentDirectory.split("/");
      parentId = directoryArray[directoryArray.length - 1];
    }
    let fileFolders: FileFolder[] = this.uploadService.getFileListForUser(user.id,parentId);
    return fileFolders;
  }

  get directory() {
    return this.uploadService.getCurrentDirectory().split(",");
  }

}
