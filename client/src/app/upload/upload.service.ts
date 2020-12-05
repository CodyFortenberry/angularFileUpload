import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { FileFolder } from '../shared/models/fileFolder.model';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';

const url = 'http://localhost:3000/upload';

@Injectable()
export class UploadService {
  constructor(private http: HttpClient) { }

  public setCurrentDirectory(directory) {
    localStorage.setItem('currentDirectory',directory);
  }

  public getCurrentDirectory() {
    let currentDirectory = localStorage.getItem("currentDirectory");
    if (currentDirectory) {
      return currentDirectory;
    }
    return "";
  }

  getFileFoldersById(id) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    if (id && fileFolders.length > id) {
        return fileFolders[id];
    }
    return null;
  }

  public addFile(file,name,path,userId,isFolder) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    let fileFolderId = fileFolders.length;
    let fileExt = null;
    if (file) {
      fileExt = this.getFileExt(file.name);
    }
    let parentId = null;
    let sharedUserId = null;
    let fileFolder = new FileFolder(fileFolderId,parentId,name,fileExt,path,userId,sharedUserId,isFolder);
    fileFolders.push(fileFolder);

    localStorage.setItem("fileFolders",JSON.stringify(fileFolders));
    localStorage.setItem("isLoggedIn","true");
    return fileFolder;
  }

  getFileListForUser(userId,parentId) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    var filteredFileFolders = fileFolders.filter(function(event){
      return event.userId == userId && event.parentId == parentId;
    });
    return filteredFileFolders;
  }

  getFileExt(fileName) {
    if (fileName.indexOf(".") !== -1) {
      return fileName.split(".")[1];
    }
    return null;
  }

  jsonToFileFolders(json) {
    let fileFolders: FileFolder[] = [];
    if (json) {
        let jsonArr = JSON.parse(json);
        for (var i=0; i<jsonArr.length; i++) {
            let fileFolder: FileFolder = new FileFolder(
              jsonArr[i].id,
              jsonArr[i].parentId,
              jsonArr[i].name,
              jsonArr[i].ext,
              jsonArr[i].path,
              jsonArr[i].userId,
              jsonArr[i].sharedUserId,
              jsonArr[i].isFolder
            );
            fileFolders.push(fileFolder);
        }
    }
    return fileFolders;
}

  public upload(
    files: Set<File>,
    name: string,
    isFolder: boolean,
    path: string,
    userId: number
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};
    const formData: FormData = new FormData();
      formData.append('path', path);
      formData.append('isFolder', '' + isFolder);
      formData.append('userId', '' + userId);


    if (isFolder) {
      let fileFolder: FileFolder = this.addFile(null,name,path,userId,isFolder);
      formData.append('id', '' + fileFolder.id);
      const req = new HttpRequest('POST', url, formData, {});
      this.http.request(req);
    }
    files.forEach(file => {
      let fileFolder: FileFolder = this.addFile(null,name,path,userId,isFolder);
      formData.append('id', '' + fileFolder.id);
      formData.append('file', file, file.name);
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    

    // return the map of progress.observables
    return status;
  }

  public getFile(userId,directory) {

  }



}
