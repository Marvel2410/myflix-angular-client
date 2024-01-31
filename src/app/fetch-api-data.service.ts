import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movies-myflix-85528af4e39c.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies').pipe(
      catchError(this.handleError)
    );
  }


  // Making the API call to get ONE movies
  public getOneMovie(movieTitle: string): Observable<any> {
    console.log(movieTitle);
    return this.http.get(apiUrl + 'movies/' + movieTitle).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to get director information
  public getOneDirector(directorName: string): Observable<any> {
    console.log(directorName);
    return this.http.get(apiUrl + 'directors/' + directorName).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to get genre information
  public getOneGenre(genreName: string): Observable<any> {
    console.log(genreName);
    return this.http.get(apiUrl + 'genres/' + genreName).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to get user information
  public getOneUser(userName: string): Observable<any> {
    console.log(userName);
    return this.http.get(apiUrl + 'users/' + userName).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to get user's favorite movies
  public getFavorites(userName: string): Observable<any> {
    console.log('Fetching favorites for user:', userName);
    return this.http.get(apiUrl + 'users/' + userName + '/favorites').pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to add movie to favorite
  public addFavorite(userName: string, movieTitle: string): Observable<any> {
    console.log('Movie Title added:', movieTitle);
    return this.http.post(apiUrl + 'users/' + userName + '/favorites/' + movieTitle, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to edit user information
  public editUser(updatedUser: any): Observable<any> {
    console.log('User has been updated:', updatedUser);
    return this.http.put(apiUrl + 'users/' + updatedUser.Username, updatedUser).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to delete user
  public deleteUser(userName: any): Observable<any> {
    console.log('User has been deleted:', userName);
    return this.http.delete(apiUrl + 'users/' + userName).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call to delete movie from favorites
  public deleteFavorite(userName: string, movieTitle: string): Observable<any> {
    console.log('Movie Title deleted:', movieTitle);
    return this.http.delete(apiUrl + 'users/' + userName + '/favorites/' + movieTitle, {}).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}