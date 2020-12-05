import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FileFolder } from '../shared/models/fileFolder.model';
import { DialogComponent } from '../upload/dialog/dialog.component';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-file-folder',
  templateUrl: './file-folder.component.html',
  styleUrls: ['./file-folder.component.scss']
})
export class FileFolderComponent implements OnInit {

  constructor(private uploadService: UploadService, private auth: AuthService, private route: ActivatedRoute, public dialog: MatDialog) { }

  private isSharing: boolean = false;
  private isSharedWithUser: boolean = false;
  public fileFolders: FileFolder[] = [];
  public subscription;

  openFolder(id) {
    this.uploadService.setCurrentDirectory(this.uploadService.getCurrentDirectory() + "/" + id);
  }

  public openShareDialog(id) {
    let dialogRef = this.dialog.open(DialogComponent, { width: '350px', height: '250px',data: {shareFileId: id, itemType: 'share'}});
  }

  downloadFile(id) {
    let file = this.uploadService.getFileFoldersById(id);
    this.uploadService.downloadFile(file.userId,file.id,file.name,file.ext);
  }

  ngOnInit() {
    this.subscription = this.uploadService.fileFolderUpdates().subscribe(msg => {
      this.setFileFolders();
    });
    this.uploadService.setCurrentDirectory("");
    this.setFileFolders();
    this.route.queryParams.subscribe(params => {
      if (params && params.isSharing) {
        this.isSharing = true;
      }
      else {
        this.isSharing = false;
      }

      if (params && params.isSharedWithUser) {
        this.isSharedWithUser = true;
      }
      else {
        this.isSharedWithUser = false;
      }
      this.setFileFolders();
    })
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteFileFolder(id) {
    this.uploadService.deleteFileFolder(id);
  }



  setFileFolders() {
    let user = this.auth.getCurrentUser();
    let currentDirectory = this.uploadService.getCurrentDirectory();
    let parentId = null;
    if (currentDirectory !== "") {
      let directoryArray = currentDirectory.split("/");
      parentId = directoryArray[directoryArray.length - 1];
    }
    this.fileFolders = this.uploadService.getFileListForUser(user.id,parentId,this.isSharing,this.isSharedWithUser);
  }

  get directory() {
    return this.uploadService.getCurrentDirectory().split(",");
  }

}
