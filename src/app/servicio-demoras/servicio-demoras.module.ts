import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioDemorasPageRoutingModule } from './servicio-demoras-routing.module';


import { ServicioDemorasPage } from './servicio-demoras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ServicioDemorasPageRoutingModule,

  ],
  declarations: [ServicioDemorasPage]
})
export class ServicioDemorasPageModule {}
