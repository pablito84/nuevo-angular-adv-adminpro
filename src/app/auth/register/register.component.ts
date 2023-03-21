import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Pablo', [ Validators.required, Validators.minLength(3) ] ] ,
    email: ['test100@gmail.com', [ Validators.required , Validators.email ]],
    password: ['123456', Validators.required ],
    password2: ['123456', Validators.required ],
    terminos: [ true , Validators.required ],
  }, {
    validators: this.passwordsIguales( 'password' , 'password2')
  } );
//as AbstractControlOptions
  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log( this.registerForm.value );
    console.log( this.registerForm );

    if( this.registerForm.invalid ) {
      return
    //  console.log('Posteando formulario.');
    }
    /* else {
      console.log('Formulario no es correcto...');

    } */
    /// Si el formulario es valido realizar la creacion(el posteo)
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
        /// Navegar al DashBoard
        this.router.navigateByUrl('/');
        console.log('Usuario Creado!!.');
        console.log( resp );
      }, (err) => {
        // Si sucede un error.
       Swal.fire('Error', err.error.msg , 'error');
      }) ;
  }

  campoNoValido( campo: string ): boolean {
    if( this.registerForm.get(campo)?.invalid && this.formSubmitted ) {
        return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    } else{
      return false;
    }
  }
  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted ;
  }

  passwordsIguales( pass1Name: string, pass2Name: string) {

    return (formGroup: FormGroup) => {

      const pass1Control=formGroup.get(pass1Name);
      const pass2Control=formGroup.get(pass2Name);

      if ( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors( null )
      } else {
        pass2Control?.setErrors( {noEsIgual: true } )

      }

    }

  }

}
