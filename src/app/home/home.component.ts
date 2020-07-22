import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Role } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = false;
  user: User;
  usersFromApi: any;
  allUsers: User;
  isUserAdmin: boolean;


  constructor(
    private userService: UserService,
        private authenticationService: AuthenticationService
  ) { 
    this.user = this.authenticationService.userValue;
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(user => {
            this.loading = false;
            this.usersFromApi = user;
            // console.log(this.usersFromApi)
        });

        this.checkUserAdmin();
        // this.user = new User(this.);
    }
  
    checkUserAdmin() {
      if(this.user && this.user.role === Role.Admin) {
        return this.isUserAdmin =  true;
      }
      else 
      return this.isUserAdmin = false;
    }

    searchRole(term: string) {

    }

}



