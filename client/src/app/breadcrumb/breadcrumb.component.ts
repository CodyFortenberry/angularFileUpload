import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileFolder } from '../shared/models/fileFolder.model';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public subscription;
  public breadcrumbs = [];
  private isSharing: boolean = false;
  private isSharedWithUser: boolean = false;

  constructor(public uploadService: UploadService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.setBreadcrumbs();
    this.subscription = this.uploadService.fileFolderUpdates().subscribe(msg => {
      this.setBreadcrumbs();
    });
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
      this.setBreadcrumbs();
    })
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setBreadcrumbs() {
    let breadcrumbs = [];
    let directoryPath = "";
    let directoryArray = this.uploadService.getCurrentDirectory().split("/");
    for (var i=0; i< directoryArray.length; i++) {
      let id = directoryArray[i];
      let name = "My Files";
      if (this.isSharing) {
        name = "Files I'm Sharing";
      }
      if (this.isSharedWithUser) {
        name = "Files Shared With Me";
      }
      if (id !== "") {
        let fileFolder = this.uploadService.getFileFoldersById(parseInt(id));
        name = fileFolder.name;
        directoryPath += "/" + id;
      }
      breadcrumbs.push({
        name: name,
        isFirst: i === 0,
        directory: directoryPath
      })
    }
    this.breadcrumbs = breadcrumbs;
  }

  public updateDirectory(directory) {
    this.uploadService.setCurrentDirectory(directory);
  }

}
