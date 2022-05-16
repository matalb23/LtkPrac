import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardiaPageRoutingModule } from './guardia-routing.module';

import { GuardiaPage } from './guardia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardiaPageRoutingModule
  ],
  declarations: [GuardiaPage]
})
export class GuardiaPageModule {}
