import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(private router: Router, private auth: AuthService) { }

  logout() {
    this.auth.logout();
    this.router.navigate(["login"]);
  }

  get currentUser() {
    return this.auth.getCurrentUser();
  }

}
