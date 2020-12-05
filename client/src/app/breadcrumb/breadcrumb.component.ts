import { Component, OnInit } from '@angular/core';
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

  get directory() {
    return this.uploadService.getCurrentDirectory().split(",");
  }

}
