import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor( private usaurioService: UsuarioService,
             private router: Router
            ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

  //  console.log('Paso por el Can Activate del Guard');
    return this.usaurioService.validarToken()
               .pipe(
                tap( estaAutenticado => {
                  if (!estaAutenticado ){
                    this.router.navigateByUrl('/login');
                  }
                })
               );
  }

}
