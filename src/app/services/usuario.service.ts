import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, Observable, catchError, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';


declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { }


  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('pablofmateo@gmail.com' , () => {
      this.ngZone.run( ()=>{
        this.router.navigateByUrl('/login');
      })

    })

  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get( `${ base_url }/login/renew` , {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( ( resp: any ) => {
        localStorage.setItem('token', resp.token );
      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData : RegisterForm ) {
    // console.log('Creando usuario')
    return this.http.post( `${ base_url }/usuarios` , formData )
                    .pipe(
                      tap( (resp: any) => {
                          localStorage.setItem('token', resp.token )
                      })
                  );

  }

  login( formData : LoginForm ) {
    // console.log('Creando usuario')
    return this.http.post( `${ base_url }/login` , formData )
               .pipe(
                  tap( (resp: any) => {
                      localStorage.setItem('token', resp.token )
                  })
               );

  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`, { token })
                    .pipe(
                      tap( ( resp:any ) =>{
                        console.log(resp);

                        localStorage.setItem('token' , resp.token )
                      })
                    )

  }
}
