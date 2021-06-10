import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor ( private authService: AuthService,
                private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      /*
      if (this.authService.auth.id) {
        return true;
      }
      console.log('Bloqueado por el authGuard - can activate');
      return false;
      */
      return this.authService.verificaAutenticacion()
            .pipe(
              tap (estaAutenticado => {
                if (!estaAutenticado) {
                  this.router.navigate(['./auth/login'])
                }
              })
            );
  }


  //Canload solo sirve para prevenir que el usuario cargue el modulo sin haberse logado, pero si ya lo tenia cargado lo puede seguir viendo
  //ver boton ingresar sin login
  //es necesario si se usa lazy load, si no , es suficiente con el canActivate
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean  {
      
      /*
      if (this.authService.auth.id) {
        return true;
      }
      console.log('Bloqueado por el authGuard - can load');
      return false;
      */
      return this.authService.verificaAutenticacion()
      .pipe(
        tap (estaAutenticado => {
          if (!estaAutenticado) {
            this.router.navigate(['./auth/login'])
          }
        })
      );
  }
}
