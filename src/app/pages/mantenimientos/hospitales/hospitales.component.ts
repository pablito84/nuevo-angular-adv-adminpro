import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription, delay } from 'rxjs';

import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
   this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
     delay(200)
    )
    .subscribe( img => {
     console.log(img);
    this.cargarHospitales()
   })
  }

  buscar( termino: string ) {
    if( termino.length === 0 ) {
       return this.cargarHospitales();
    }

    return this.busquedaService.buscar( 'hospitales' , termino )
        .subscribe( resultados => {
          this.hospitales = resultados;

        });

  }

cargarHospitales(){
  this.cargando = true;
  this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
         console.log(hospitales);

      })
}

guardarCambios( hospital: Hospital){
  this.hospitalService.actualizarHospital( hospital._id , hospital.nombre )
      .subscribe( resp => {
        Swal.fire( 'Actualizado' , hospital.nombre , 'success');
      });
  //console.log('Hospital: ',hospital);

}

eliminarHospital( hospital: Hospital){
  this.hospitalService.borrarHospital( hospital._id)
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire( 'Borrado' , hospital.nombre , 'success');
      });
  //console.log('Hospital: ',hospital);

}

async abrirSweetAlert() {
  const { value = '' } = await Swal.fire<string>({
    title: 'Crear Hospital',
    text: 'Ingrese el nombre del nuevo hospital',
    input: 'text',
    inputLabel: 'URL address',
    inputPlaceholder: 'Nombre del Hospital',
    showCancelButton: true,

  })
// console.log(value);
  if( value.trim().length > 0) {
    this.hospitalService.crearHospital( value )
        .subscribe( (resp: any ) => {
          this.hospitales.push( resp.hospital )
        })
  }

}

abrirModal( hospital: Hospital ) {
//console.log(usuario);
this.modalImagenService.abrirModal( 'hospitales' , hospital._id , hospital.img );

  }
}

