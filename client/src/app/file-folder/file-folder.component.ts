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
    console.log(id);
    console.log(this.uploadService.getCurrentDirectory());
    this.uploadService.setCurrentDirectory(this.uploadService.getCurrentDirectory() + "," + id);
    console.log(this.uploadService.getCurrentDirectory());
  }

  viewFile(id) {
    
  }

  shareFileFolder(id) {

  }

  deleteFileFolder(id) {

  }


  get fileFolders() {
    let user = this.auth.getCurrentUser();
    let currentDirectory = null;
    let fileFolders: FileFolder[] = this.uploadService.getFileListForUser(user.id,currentDirectory);
    return fileFolders;
  }

  get directory() {
    return this.uploadService.getCurrentDirectory().split(",");
  }

}
