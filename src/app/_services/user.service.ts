import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import {roleData} from '../_models/roleData';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

// interface ResponseInterface {
//   meta: object;
//   data: User;
// }



@Injectable({ providedIn: 'root' })
export class UserService {


    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(role: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${role}`);
    }

    addRole(role: roleData): Observable<User> {
      const postData ={
        id: 67,
        username: 'dummy', 
        password: 'dummy', 
        firstName: 'dummy', 
        lastName: 'dummy', 
        role: 'dummy',
        token: '6466464hdhdf',
        roleData: role

      }
        return this.http.post<User>(`${environment.apiUrl}/users`, postData).pipe(
          map((res  => res)
        ))
        //   tap((newRole: User) => 
        //   console.log(`added role w/ role=${newRole.role}`)),
        // //   catchError(this.handleError<User>('addRole'))
        // );
      }

      deleteRole(role: User | number): Observable<User> {
        const id = typeof role === 'number' ? role : role.id;
        
    
        return this.http.delete<User>(`${environment.apiUrl}/users/${role}`, this.httpOptions).pipe(
          tap(_ => console.log(`deleted role id=${role}`)),
        //   catchError(this.handleError<Hero>('deleteHero'))
        );
      }

      
           
  searchRole(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${environment.apiUrl}/users/?role=${term}`).pipe(
      tap(x => x.length ?
         console.log(`found heroes matching "${term}"`) :
         console.log(`no heroes matching "${term}"`)),
    //   catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
      
}