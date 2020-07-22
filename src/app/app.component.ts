import { Component } from '@angular/core';
import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'role-based-system-assignment-antartica-global';

  user: User;
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
}

get isAdmin() {
  return this.user && this.user.role === Role.Admin;
}

logout() {
  this.authenticationService.logout();
}

}