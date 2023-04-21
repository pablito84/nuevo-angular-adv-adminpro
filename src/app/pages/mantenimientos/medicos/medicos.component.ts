import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit , OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;
  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedaService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
     delay(200)
    )
    .subscribe( img => {
     console.log(img);
    this.cargarMedicos()
   })

  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
          console.log('medicos: ' , medicos);

        });
  }


  buscar( termino: string ) {
    if( termino.length === 0 ) {
       return this.cargarMedicos();
    }

    return this.busquedaService.buscar( 'medicos' , termino )
        .subscribe( resultados => {
          console.log('resultados', resultados);

          this.medicos = resultados;

        });
  }

  abrirModal(medico: Medico ){
      this.modalImagenService.abrirModal( 'medicos' , medico._id , medico.img );
  }

  borrarMedico( medico: Medico ) {

  return Swal.fire({
    title: '¿Borrar medico?',
    text: `Esta a punto de borrar a: ${ medico.nombre }`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrarlo'
  }).then((result) => {
    if (result.isConfirmed) {
      this.medicoService.borrarMedico( medico._id )
          .subscribe( resp => {
            this.cargarMedicos();
            Swal.fire(
              'Medico Borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );
          });

    }
  })
  }
}
