import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  //public imgUrl: string | undefined = '' ;
  public usuario: Usuario | undefined;

  constructor( private usuarioService: UsuarioService,
               private router: Router ) {
     // this.imgUrl = usuarioService.usuario?.imagenUrl;
     this.usuario = usuarioService.usuario;
   }

  logout(){
    this.usuarioService.logout();
  }

  buscar( termino: string){
   // console.log(termino);

   if( termino.length === 0 ) {
    this.router.navigateByUrl('/dashboard');
   }
    this.router.navigateByUrl(`/dashboard/buscar/${ termino}`);

  }

}
