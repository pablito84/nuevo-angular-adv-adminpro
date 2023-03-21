import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { response } from 'express';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef<any>;

  public formSubmitted = false;


  public loginForm:FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required , Validators.email ]],
    password: ['', Validators.required ],
    remember: [ false ]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }

  ngAfterViewInit(): void {
      this.googleInit();
  }

googleInit() {
  google.accounts.id.initialize({
    client_id: '839638188236-cr4jq9ol9n1nuim9se58ol24mdofe50v.apps.googleusercontent.com',
    callback: (response:any) => this.handleCredentialResponse(response)
  });
  google.accounts.id.renderButton(

 /*    document.getElementById("buttonDiv"), */
    this.googleBtn.nativeElement,
    { theme: "outline", size: "large" }  // customization attributes
  );
}

  handleCredentialResponse( response: any ){
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential )
        .subscribe( resp =>{
          console.log({ login: resp });
          /// Navegar al DashBoard
          this.ngZone.run( () =>{
            this.router.navigateByUrl('/');
          })
        })
  }

  login(){
    this.usuarioService.login( this.loginForm.value )
        .subscribe( resp =>{
          console.log(resp)
          if ( this.loginForm.get('remember')?.value ) {
              localStorage.setItem('email' , this.loginForm.get('email')?.value );
          } else {
            localStorage.removeItem('email');
          }
           /// Navegar al DashBoard
            this.ngZone.run( () =>{
              this.router.navigateByUrl('/');
            })

        }, (err) => {
          // si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        });

      console.log( this.loginForm.value );



 /*    this.router.navigateByUrl('/'); */

  }

}
