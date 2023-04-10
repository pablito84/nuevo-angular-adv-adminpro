import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, Observable, catchError, of, delay } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { cargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { response } from 'express';



declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { }


get token():string {
    return localStorage.getItem('token') || '';
}

get uid() :string{
  return this.usuario.uid || '';
}

get headers(){
  return {
    headers: {
      'x-token': this.token
    }
  }
}

  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('pablofmateo@gmail.com' , () => {
      this.ngZone.run( ()=>{
        this.router.navigateByUrl('/login');
      })
    })

  }

  validarToken(): Observable<boolean> {
  //  const token = localStorage.getItem('token') || '';
    return this.http.get( `${ base_url }/login/renew` , {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( ( resp: any ) => {
        console.log(resp);
        const {
                email,
                google,
                img = '',
                nombre,
                role,
                uid,
        } = resp.usuario;
        this.usuario = new Usuario( nombre , email , '' , img , google , role , uid );

      /*   this.usuario.imprimirUsuario(); */

        localStorage.setItem('token', resp.token );
        return true;
      }),
      catchError( error => {
        console.log(error);
        return of(false)
      })
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

  actualizarPerfil( data: { email: string , nombre: string , role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    };

  return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data , {
      headers: {
        'x-token': this.token
      }
    });
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

  cargarUsuarios( desde: number = 0) {

    //http://localhost:3005/api/usuarios?desde=5
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<cargarUsuario>( url , this.headers )
            .pipe(
             // delay(5000),
              map( resp => {
                console.log('RESP', resp);
                const usuarios = resp.usuarios.map(
                  user => new Usuario( user.nombre , user.email , '' , user.img , user.google, user.role , user.uid )
                );

                return {
                  total: resp.total,
                  usuarios
                };
              })
            )
  }

eliminarUsuario(usuario: Usuario ){
  //console.log('eliminando');
  //usuarios/63fe8ea64cd575d06dcd6577
  const url = `${ base_url }/usuarios/${ usuario.uid}`;
  return this.http.delete( url , this.headers );

}

guardarUsuario( usuario : Usuario ){

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario , this.headers );

    }


}
