import { Component, OnInit } from '@angular/core';
import { FileFolder } from '../shared/models/fileFolder.model';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor(public uploadService: UploadService) { }

  ngOnInit() {
  }

  get breadcrumbs() {
    let returnArray = [];
    let directoryPath = "";
    let directoryArray = this.uploadService.getCurrentDirectory().split("/");
    for (var i=0; i< directoryArray.length; i++) {
      let id = directoryArray[i];
      let name = "My Files"
      if (id !== "") {
        let fileFolder = this.uploadService.getFileFoldersById(parseInt(id));
        name = fileFolder.name;
        directoryPath += "/" + id;
      }
      returnArray.push({
        name: name,
        isFirst: i === 0,
        directory: directoryPath
      })
    }
    return returnArray;
  }

  public updateDirectory(directory) {
    this.uploadService.setCurrentDirectory(directory);
  }

}
