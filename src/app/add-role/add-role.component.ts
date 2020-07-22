import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  loading = false;
  users: User[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  name: string;
  homeAccess: false;
  userRole: false;
  hasHomeAcess: false;
  hasTripsAcess: false;
  hasPastTripsAcess: false;
  hasCreateTripsAccess: false;
  hasAlertAcess: false;
  hasAlertManagementAcess: false;
  hasSensorsAccess: false;
  hasAddSensorsAccess: false;
  hasRoutesAcess: false;
  hasSAddRoutesAccess: false;
  hasUsersAccess: false;
  hasAddUserAccess: false;
  hasDashboardAccess: false;
  hasReportAccess: false;
  hasRoleSettingsAccess: false;
  currentRole: 'None';

  constructor(private userService: UserService,
              private _formBuilder: FormBuilder,
              private router: Router ) { }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      // secondCtrl: ['', Validators.required],
      hasHomeAcess: [false, Validators.required],
      hasTripsAcess: [false, Validators.required],
      hasPastTripsAcess: [false, Validators.required],
      hasCreateTripsAccess: [false, Validators.required],
      hasAlertAcess: [false, Validators.required],
      hasAlertManagementAcess: [false, Validators.required],
      hasSensorsAccess: [false, Validators.required],
      hasAddSensorsAccess: [false, Validators.required],
      hasRoutesAcess: [false, Validators.required],
      hasSAddRoutesAccess: [false, Validators.required],
      hasUsersAccess: [false, Validators.required],
      hasAddUserAccess: [false, Validators.required],
      hasDashboardAccess: [false, Validators.required],
      hasReportAccess: [false, Validators.required],
      hasRoleSettingsAccess: [false, Validators.required],
    });
 
    this.currentRole = this.firstFormGroup.value.firstCtlr;
    // console.log(this.secondFormGroup.patchValue({homeAccess: 'homeAccess' }));
  }


  // submit() {
  //   console.log(this.secondFormGroup.patchValue({homeAccess: 'homeAccess' }));
  // }
  addRole() {
    const postData = {
    userRole: this.firstFormGroup.value.firstCtrl,
    hasHomeAcess: this.secondFormGroup.value.homeAccess,
    hasTripsAcess: this.secondFormGroup.value.hasTripsAcess,
    hasPastTripsAcess: this.secondFormGroup.value.hasPastTripsAcess,
    hasCreateTripsAccess: this.secondFormGroup.value.hasCreateTripsAccess,
    hasAlertAcess: this.secondFormGroup.value.hasAlertAcess,
    hasAlertManagementAcess: this.secondFormGroup.value.hasAlertManagementAcess,
    hasSensorsAccess: this.secondFormGroup.value.hasSensorsAccess,
    hasAddSensorsAccess: this.secondFormGroup.value.hasAddSensorsAccess,
    hasRoutesAcess: this.secondFormGroup.value.hasRoutesAcess,
    hasSAddRoutesAccess: this.secondFormGroup.value.hasSAddRoutesAccess,
    hasUsersAccess: this.secondFormGroup.value.hasUsersAccess,
    hasAddUserAccess: this.secondFormGroup.value.hasAddUserAccess,
    hasDashboardAccess: this.secondFormGroup.value.hasDashboardAccess,
    hasReportAccess: this.secondFormGroup.value.hasReportAccess,
    hasRoleSettingsAccess: this.secondFormGroup.value.hasRoleSettingsAccess,
    }
  

    this.userService.addRole(postData).subscribe(res=> {
      if(res){
        this.router.navigate(['/']);
      }
    })
  }
  
getRole() {
  this.currentRole = this.firstFormGroup.value.firstCtlr;
}

}

  
