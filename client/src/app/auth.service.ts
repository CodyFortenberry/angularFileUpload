import { User } from './shared/models/user.model';

export class AuthService {
  
    constructor() { }
  

    getUserById(id) {
        let usersString = localStorage.getItem('users');
        let users: User[] = this.jsonToUsers(usersString);
        if (id) {
            for (var i=0; i<users.length; i++) {
                if (users[i].id === id) {
                    return users[i];
                }
            }
        }
    }

    getUserByEmail(email) {
        let usersString = localStorage.getItem('users');
        let users: User[] = this.jsonToUsers(usersString);
        if (email) {
            for (var i=0; i<users.length; i++) {
                if (users[i].email === email) {
                    return users[i];
                }
            }
        }
    }

    getUser(email,password) {
        let usersString = localStorage.getItem('users');
        let users: User[] = this.jsonToUsers(usersString);
        for (var i=0; i<users.length; i++) {
            if (users[i].email === email) {
                return users[i]
            }
        }
        return null;
    }

    createUser(name,email,password) {
        if (this.doesUserExist(email)) {
            return null;
        }
        else {
            let usersString = localStorage.getItem('users');
            let users: User[] = this.jsonToUsers(usersString);
            let userId = users.length;
            let user = new User(userId,name,email);
            users.push(user);

            localStorage.setItem("users",JSON.stringify(users));
            localStorage.setItem("currentUser",JSON.stringify(user));
            localStorage.setItem("isLoggedIn","true");
            return user;
        }
    }

    getCurrentUser() {
        let userString = localStorage.getItem('currentUser');
        if (userString) {
            let userObject = JSON.parse(userString);
            let user: User = new User(userObject.id,userObject.name,userObject.email);
            return user;
        }
        return null;
    }

    jsonToUsers(json) {
        let users: User[] = [];
        if (json) {
            let jsonArr = JSON.parse(json);
            for (var i=0; i<jsonArr.length; i++) {
                let user: User = new User(jsonArr[i].id,jsonArr[i].name,jsonArr[i].email);
                users.push(user);
            }
        }
        return users;
    }

    doesUserExist(email) {
        if (email) {
            let usersString = localStorage.getItem('users');
            let users: User[] = this.jsonToUsers(usersString);
            for (let i=0; i<users.length; i++) {
                if (users[i].email === email) {
                    return true;
                }
            }
        }
        return false;
      }

      isLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
      }

      logout() {
        localStorage.setItem("isLoggedIn","false");
        localStorage.setItem("currentUser",null);
      }
  }