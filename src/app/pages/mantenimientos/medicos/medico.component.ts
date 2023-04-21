import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs';



@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

public medicoForm: FormGroup;
public hospitales: Hospital[] = [];

public medicoSeleccionado: Medico;
public hospitalSeleccionado: Hospital;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe( ({ id }) => {
      this.cargarMedico( id );
     // console.log('ID' ,id);
    });

   // this.medicoService.obtenerMedicoPorId()

    this.medicoForm = this.fb.group({
        nombre: ['', Validators.required],
        hospital: [ '' , Validators.required],
    })
    this.cargarHospitales();
    this.medicoForm.get('hospital').valueChanges
        .subscribe( hospitalId => {
         /*  console.log(hospitalId); */

          this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
       /*    console.log(this.hospitalSeleccionado); */

        } )

  }

  cargarMedico( id:string) {

    if( id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
        .pipe(
          delay(100)
        )
        .subscribe( medico => {

          if(!medico){
            this.router.navigateByUrl(`/dashboard/medicos`);
          }
         // console.log('Medico:',medico);

         const { nombre, hospital:{_id} } = medico;
         console.log(nombre , _id );

          this.medicoSeleccionado = medico;
          this.medicoForm.setValue( { nombre , hospital: _id });
          //console.log('medico' , medico);

        });
  }

  cargarHospitales() {

    this.hospitalService.cargarHospitales()
        .subscribe( (hospitales: Hospital[] ) => {
          console.log(hospitales);
          this.hospitales = hospitales;

        } )
  }

  guardarMedico(){
   // console.log(this.medicoSeleccionado);
    //console.log(this.medicoForm.value);
    const { nombre } = this.medicoForm.value;
    if(this.medicoSeleccionado) {
      //Actualizar medico
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data)
          .subscribe( resp =>{
            console.log(resp);
            Swal.fire('Actualizado', `${ nombre } actualizado correctamente.`, 'success');
          })
    }else {
      // Crear

      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( (resp: any) => {
            console.log(resp);
            Swal.fire('Creado', `${ nombre } creado correctamente.`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id}`)
          })

    }
  }
}
