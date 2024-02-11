
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { Router } from '@angular/router';


interface Genre {
  name: string;
  description: string;
}

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {
  user: any = {};
  favorites: any[] = [];
  movies: any[] = [];

  //user = JSON.parse(localStorage.getItem('user') || '');

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getFavorites();
  }

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (resp: any) => {
        this.movies = resp;
        console.log('Movies from API:', this.movies);
      },
      (error: any) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  getFavorites(): void {
    this.fetchApiData.getOneUser().subscribe(
      (resp: any) => {
        if (resp.user && resp.user.FavoriteMovies) {
          this.favorites = resp.user.FavoriteMovies;
        } else {
          this.favorites = [];
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favorites = [];
      }
    );
  }

  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.FavoriteMovies) {
      return user.FavoriteMovies.indexOf(movieID) >= 0;
    }
    return false;
  }

  addToFavorites(movieID: string): void {
    if (this.isFavoriteMovie(movieID)) {
      // Movie is already a favorite, so remove it
      this.removeFavoriteMovie(movieID);
    } else {
      // Movie is not a favorite, so add it
      this.fetchApiData.addFavoriteMovies(movieID).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        this.getFavorites();
      });
    }
  }

  removeFavoriteMovie(movieID: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieID).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }


  openGenre(genre: any): void {
    this.fetchApiData.getOneGenre(genre).subscribe(
      (genreDetails: any) => {
        this.dialog.open(GenreComponent, {
          data: { genre: genreDetails },
          width: '400px',
        });
      },
      (error: any) => {
        console.error('Error fetching director data:', error);
      }
    );
  }


  openDirector(director: any): void {
    this.fetchApiData.getOneDirector(director).subscribe(
      (directorDetails: any) => {
        this.dialog.open(DirectorComponent, {
          data: { director: directorDetails },
          width: '400px',
        });
      },
      (error: any) => {
        console.error('Error fetching director data:', error);
      }
    );
  }

  openSynopsis(Title: String, Description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Title: Title,
        Description: Description,
      },
      width: '400px',
    });
  }
}