import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  //public imgUrl: string | undefined = '' ;
  public usuario: Usuario | undefined;

  constructor( private usuarioService: UsuarioService) {
     // this.imgUrl = usuarioService.usuario?.imagenUrl;
     this.usuario = usuarioService.usuario;
   }


  logout(){
    this.usuarioService.logout();
  }

}
