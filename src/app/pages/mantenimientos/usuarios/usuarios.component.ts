import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit , OnDestroy {

  public totalusuarios: number = 0;
  public usuarios: Usuario[]= [];
  public usuariosTemp: Usuario[]= [];

  public imgSubs: Subscription
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
     this.cargarUsuarios();
     this.imgSubs = this.modalImagenService.nuevaImagen
     .pipe(
      delay(200)
     )
     .subscribe( img => {
      console.log(img);
     this.cargarUsuarios()
    });
  }

  cargarUsuarios() {
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( ( { total , usuarios } ) => {
          this.totalusuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;


        })
  }

  cambiarPagina( valor: number ){
      this.desde += valor;

      if(this.desde < 0 ) {
        this.desde = 0;
      }else if ( this.desde > this.totalusuarios ) {
        this.desde -= valor;
      }
      this.cargarUsuarios();
  }

  buscar( termino: string ) {
    if( termino.length === 0 ) {
       return this.usuarios = this.usuariosTemp;
    }

    return this.busquedasService.buscar( 'usuarios' , termino )
        .subscribe( resultados => {
          this.usuarios = resultados;

        });

  }

  eliminarUsuario( usuario: Usuario ){
  //console.log(usuario);

  if( usuario.uid === this.usuarioService.uid ) {
     return Swal.fire('Error', 'No puede borrarse a si mismo' , 'error' );
  }

  return Swal.fire({
    title: '¿Borrar usuario?',
    text: `Esta a punto de borrar a: ${ usuario.nombre }`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrarlo'
  }).then((result) => {
    if (result.isConfirmed) {
      this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario Borrado',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            );
          });

    }
  })

  }

  cambiarRole( usuario: Usuario ) {
    //console.log(Usuario);
    this.usuarioService.guardarUsuario( usuario )
        .subscribe( resp =>{
          console.log(resp);

        })
  }


  abrirModal( usuario: Usuario ) {
    console.log(usuario);
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid , usuario.img );

  }
}
