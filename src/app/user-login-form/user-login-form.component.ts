// src/app/user-login-form/user-login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      //Logic for a successful user login
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close(); // Will close modal on success (To be implemented)
      this.snackBar.open('User login successful', 'OK', {
        duration: 2000
      });
    }, (result) => {
      console.log(result);
      this.snackBar.open('User login successful', 'OK', {
        duration: 2000
      });
    });
  }

}

