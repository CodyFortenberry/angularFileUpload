import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  name: string;
  email: string;
  password: string;
  
  @Output('refresh-user') calculateEvent: EventEmitter<string> = new EventEmitter<string>();
  ​
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(["home"]);
    }
  }

  //here we would create a new user with a backend service and recieve back a jwt token
  //the jwt token would be stored and sent with requests for data.
  //do to this application having no databse we will create all users and set them as logged in in local storage
  register() : void {
    if (this.auth.doesUserExist(this.email)) {
      alert("That user already exists");
    }
    else {
      this.auth.createUser(this.name,this.email,this.password);
      this.calculateEvent.emit("true");
      this.router.navigate(["home"]);
    }
  }
}