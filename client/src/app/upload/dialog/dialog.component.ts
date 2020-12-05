import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { FileFolder } from 'src/app/shared/models/fileFolder.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @ViewChild('file', { static: false }) file;

  
  public files: Set<File> = new Set();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>, 
    public uploadService: UploadService,
    public auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  name: string;
  email: string;
  currentFileFolder: FileFolder;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  ngOnInit() { 
    if (this.isFolder) {
      this.primaryButtonText = "Create";
    }
    if (this.isShare) {
      this.primaryButtonText = "Share"
      if (this.data.shareFileId !== null) {
        this.currentFileFolder = this.uploadService.getFileFoldersById(this.data.shareFileId);
      }
    }
  }
  

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  get isFolder() {
    return this.data.itemType === 'folder';
  }

  get isFile() {
    return this.data.itemType === 'file';
  }

  get isShare() {
    return this.data.itemType === 'share';
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  share() {
    let user = this.auth.getUserByEmail(this.email);
    this.uploadService.shareFileFolder(this.data.shareFileId,user.id);
    this.dialogRef.close();
  }

  closeDialog() {
    if (this.isShare) {
      return this.share()
    }
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map

    let path = this.uploadService.getCurrentDirectory();
    let user = this.auth.getCurrentUser();

    this.progress = this.uploadService.upload(this.files,this.name,this.isFolder,path,user.id);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
