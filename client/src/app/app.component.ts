import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  constructor(private auth: AuthService) {}

  ngOnInit() {
  }
​
  get isLoggedIn() {
    return  this.auth.isLoggedIn();
  }
}
