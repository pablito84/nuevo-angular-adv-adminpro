import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styles: [
  ]
})
export class AccountSettingComponent implements OnInit {

//  public linkTheme = document.querySelector('#theme');


  constructor( private settingServices: SettingService) { }

  ngOnInit(): void {
    this.settingServices.checkCurrentTheme();
  }

  changeTheme( theme: string){
    this.settingServices.changeTheme( theme );

     /*  console.log(linkTheme); */
  /*   console.log(url); */

  }


}
