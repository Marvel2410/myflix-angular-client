import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';


interface Genre {
  name: string,
  description: string
}

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  user = JSON.parse(localStorage.getItem('user') || '');

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllMovies();
    //this.getFavorites();
  }

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log("this.movies:", this.movies);
      return this.movies;
    });
  }
  /*getFavorites(): void {
    this.fetchApiData.getOneUser().subscribe(
      (resp: any) => {
        if (resp.user && resp.user.favorite_movies) {
          this.favorites = resp.user.favorite_movies;
        } else {
          this.favorites = []; // Set an empty array if data is not available
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favorites = []; // Set an empty array on error as well
      }
    );
  }*/

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favorite_movies.indexOf(movieId) >= 0;
  }

  addToFavorites(id: string): void {
    if (this.isFavoriteMovie(id)) {
      // Movie is already a favorite, so remove it
      this.removeFavoriteMovie(id);
    } else {
      // Movie is not a favorite, so add it
      this.fetchApiData.addfavoriteMovies(id).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        //this.getFavorites();
      });
    }
  }
  removeFavoriteMovie(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }
  openGenre(genres: Genre[]): void {
    this.dialog.open(GenreComponent, {
      data: {
        name: 'Genres',
        description: genres.map(genre => genre.name).join(', '),
      },
      width: '400px',
    });
  }
  openDirector(name: string, bio: string, birth_year: string, death_year: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        name: name,
        bio: bio,
        birth_year: birth_year,
        death_year: death_year,
      },
      width: '400px',
    });
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
