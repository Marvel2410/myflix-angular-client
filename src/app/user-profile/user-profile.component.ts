import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  user: any = {};
  favoriteMovies: any[] = [];
  favorites: any[] = [];
  movies: any[] = [];
  token: any = localStorage.getItem('token');

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.fetchApiData.getOneUser().subscribe((response) => {
      this.user = response;
      if (this.user && this.user.FavoriteMovies) {
        this.fetchFavoriteMovies();
      }
      this.getFavorites();
    });
  }

  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.favoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie.Title));
    });
  }

  getFavorites(): void {
    this.favorites = this.user.FavoriteMovies || [];
  }

  isFavoriteMovie(movieTitle: string): boolean {
    return this.favorites.indexOf(movieTitle) !== -1;
  }

  addToFavorites(movieTitle: string): void {
    if (this.isFavoriteMovie(movieTitle)) {
      this.removeFavoriteMovie(movieTitle);
    } else {
      this.fetchApiData.addFavoriteMovies(movieTitle).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
        this.loadUser(); // Reload user data and favorite movies
      });
    }
  }

  removeFavoriteMovie(movieTitle: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieTitle).subscribe(() => {
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      this.loadUser(); // Reload user data and favorite movies
    });
  }

  updateUser(): void {
    // Check if all required fields are filled
    if (!this.userData.Username && !this.userData.Email && !this.userData.Birthday && !this.userData.Password) {
      this.snackBar.open('Please fill in at least one field to update', 'OK', { duration: 3000 });
      return;
    }

    // Call the editUser method only if there are changes in the userData
    if (this.userData.Username !== this.user.Username ||
      this.userData.Email !== this.user.Email ||
      this.userData.Birthday !== this.user.Birthday ||
      (this.userData.Password && this.userData.Password !== this.user.Password)) {

      // Call the editUser method if at least one field is filled
      this.fetchApiData.editUser(this.userData).subscribe(
        (data) => {
          this.loadUser(); // Reload user data after successful update
          this.snackBar.open('Your profile has been updated', 'OK', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Failed to update profile. Please try again.', 'OK', { duration: 3000 });
        }
      );
    }
  }


  deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', { duration: 3000 });
      });
      this.fetchApiData.deleteOneUser().subscribe((result) => {
        console.log(result);
      });
    }
  }

  public back(): void {
    this.router.navigate(['movies']);
  }
}
