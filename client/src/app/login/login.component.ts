import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {Router} from '@angular/router';
import {MatDialog} from '@angular/material'
import { AuthService } from '../auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  email: string;
  password: string;
  @Output('refresh-user') calculateEvent: EventEmitter<string> = new EventEmitter<string>();
  ​
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(["home"]);
    }
  }

 
​
  //here we would authenicate with a backend service and recieve back a jwt token
  //the jwt token would be stored and sent with requests for data.
  //do to this application having no databse we will authenicate all users and set them as logged in in local storage
  login() : void {
    let user: User = this.auth.getUser(this.email,this.password);
    if (user) {
      localStorage.setItem("currentUser",JSON.stringify(user));
      localStorage.setItem("isLoggedIn","true");
      this.calculateEvent.emit("true");
      this.router.navigate(["home"]);
    }
    else {
      alert("Invalid credentials");
    }
  }
}