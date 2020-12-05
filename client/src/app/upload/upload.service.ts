import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { FileFolder } from '../shared/models/fileFolder.model';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';

const baseUrl = 'http://localhost:3000/';

@Injectable()
export class UploadService {
  constructor(private http: HttpClient) { }
  private updateMessage = new Subject<string>();

  public setCurrentDirectory(directory) {
    localStorage.setItem('currentDirectory',directory);
    this.sendUpdateEvent();
  }

  public fileFolderUpdates(): Observable<string> {
    return this.updateMessage.asObservable();
  }

  public sendUpdateEvent() {
    this.updateMessage.next("update");
  }

  public getCurrentDirectory() {
    let currentDirectory = localStorage.getItem("currentDirectory");
    if (currentDirectory) {
      return currentDirectory;
    }
    return "";
  }

  public shareFileFolder(fileId,userId) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    for (var i=0; i< fileFolders.length; i++) {
      if (fileFolders[i].id === fileId) {
        fileFolders[i].sharedUserId = userId;
      }
    }
    localStorage.setItem("fileFolders",JSON.stringify(fileFolders));
    this.sendUpdateEvent();
  }

  getFileFoldersById(id) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    for (var i=0; i< fileFolders.length; i++) {
      if (fileFolders[i].id === id) {
        return fileFolders[i];
      }
    }
    return null;
  }

  public deleteFileFolder(id) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    let index = -1;
    for (var i=0; i< fileFolders.length; i++) {
      if (fileFolders[i].id === id) {
        index = i;
      }
    }
    if (index != -1) {
      fileFolders.splice(index,1);
    }
    localStorage.setItem("fileFolders",JSON.stringify(fileFolders));
    this.sendUpdateEvent();
  }

  public addFile(file,name,path,userId,isFolder) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    let fileFolderId = this.getLargestId(fileFolders) + 1;
    let fileExt = null;
    if (file) {
      fileExt = this.getFileExt(file.name);
    }
    let parentId = null;
    if (path !== "") {
      let pathArray = path.split("/");
      parentId = parseInt(pathArray[pathArray.length - 1]);
    }
    let sharedUserId = null;
    let fileFolder = new FileFolder(fileFolderId,parentId,name,fileExt,path,userId,sharedUserId,isFolder);
    fileFolders.push(fileFolder);

    localStorage.setItem("fileFolders",JSON.stringify(fileFolders));
    localStorage.setItem("isLoggedIn","true");
    return fileFolder;
  }

  getLargestId(fileFolders) {
    let largestId = 0;
    for (var i=0; i< fileFolders.length; i++) {
      if (fileFolders[i].id > largestId) {
        largestId = fileFolders[i].id;
      }
    }
    return largestId;
  }

  getFileListForUser(userId,parentId,isSharing,isSharedWithUser) {
    let fileFoldersString = localStorage.getItem('fileFolders');
    let fileFolders: FileFolder[] = this.jsonToFileFolders(fileFoldersString);
    var filteredFileFolders = fileFolders.filter(function(event){
      if (isSharing) {
        return event.userId == userId && event.parentId == parentId && event.sharedUserId !== null;
      }
      if (isSharedWithUser) {
        return event.sharedUserId == userId && event.parentId == parentId;
      }
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
      const req = new HttpRequest('POST', baseUrl + "upload", formData, {});
      this.http.request(req);
    }
    files.forEach(file => {
      let fileFolder: FileFolder = this.addFile(file,name,path,userId,isFolder);
      formData.append('id', '' + fileFolder.id);
      formData.append('file', file, file.name);
      const req = new HttpRequest('POST', baseUrl + "upload", formData, {
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
    
    this.sendUpdateEvent();
    // return the map of progress.observables
    return status;
  }

  public downloadFile(userId,fileId,name,ext) {
    const url = baseUrl + "download/" + fileId + "?userId=" + userId+ "&name=" + name + "&ext=" + ext;
    window.location.href=url;
  }



}
