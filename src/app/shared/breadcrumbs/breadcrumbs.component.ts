import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo:String = '';
  public tituloSubs$: Subscription;

  constructor( private router: Router) {

    this.tituloSubs$ = this.getArgumentosRuta()
                           .subscribe( ({titulo}) =>{
                                //console.log( data );
                            this.titulo = titulo;
                            document.title = `AdminPro -  ${ titulo } `;
                          });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
    .pipe(
      filter<any>(event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event: ActivationEnd) => event.snapshot.data ),
    )


  }

}
