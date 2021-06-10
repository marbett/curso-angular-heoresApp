import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Auth } from '../interfaces/auth.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  constructor(private http: HttpClient) { }

  get auth (): Auth {
    return {...this._auth!};
  }

  verificaAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('idUsuario')) {
      return of (false);
      
    }
    //return of (true);
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
            .pipe(
              map (auth => {
                this._auth = auth;
                console.log('map', auth);
                return true;
              })
            );
  }


  login () {
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
            .pipe(
              tap( auth => this._auth = auth),
              tap( auth => localStorage.setItem('idUsuario', auth.id))
            );
  }

  logout () {
    this._auth = undefined;
  }
}
