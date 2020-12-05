import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  constructor(public dialog: MatDialog, public uploadService: UploadService) { }

  public openUploadDialog(itemType) {
    let dialogRef = this.dialog.open(DialogComponent, { width: '350px', height: '250px',data: {itemType: itemType}});
  }
}
