import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private linkTheme = document.querySelector('#theme');

  constructor() {
/*     console.log('Setting Services init'); */
    const url = localStorage.getItem('theme') || './assets/css/colors/megna.css';
    this.linkTheme?.setAttribute('href', url);
  }

  changeTheme( theme: string){

    const url = `./assets/css/colors/${ theme }.css`;
    this.linkTheme?.setAttribute( 'href', url );
    localStorage.setItem( 'theme', url );
    this.checkCurrentTheme();

     /*  console.log(linkTheme); */
  /*   console.log(url); */

  }

  checkCurrentTheme(){
    /* console.log(links); */
      const links = document.querySelectorAll('.selector');
      links.forEach( elem =>{
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeurl = `./assets/css/colors/${ btnTheme }.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if( btnThemeurl === currentTheme ){
          elem.classList.add('working');
      }
    });

  }
}
