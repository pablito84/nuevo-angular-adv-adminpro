import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval , take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {


/*     this.retornaObservable().pipe(
      retry()
    ).subscribe(
       valor => console.log('Subs:', valor ),
       error => console.warn('Error:' , error),
       () => console.info('Obs terminado')
    ); */
      this.intervalSubs =this.retornaIntervalo()
        .subscribe(
          (valor) => console.log(valor)
        )
   }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

   retornaIntervalo(): Observable<number> {
    return interval(500)
            .pipe(
             map( valor => valor + 1),
             filter( valor => ( valor % 2 === 0) ? true: false ),
            /*  take(10), */
          );
   }


   retornaObservable(): Observable<number> {
    let i = -1;

   return new Observable<number>( observer =>{

      const intervalo = setInterval( () =>{
        i++;
        observer.next(i);

        if( i === 4 ){
          clearInterval(intervalo);
          observer.complete();
        }
   //   console.log('tick');

        if ( i === 2 ){
          observer.error('i llego al valor de 2');
        }

      }, 1000 )
    });

  /*   return obs$; */

   }
}
