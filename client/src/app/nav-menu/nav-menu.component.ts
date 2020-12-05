import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../upload/dialog/dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(private router: Router, private auth: AuthService, public dialog: MatDialog) { }

  logout() {
    this.auth.logout();
    this.router.navigate(["login"]);
  }

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  public openUploadDialog(itemType) {
    let dialogRef = this.dialog.open(DialogComponent, { width: '350px', height: '250px',data: {itemType: itemType}});
  }

}
