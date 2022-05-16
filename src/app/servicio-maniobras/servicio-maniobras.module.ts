import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioManiobrasPageRoutingModule } from './servicio-maniobras-routing.module';

import { ServicioManiobrasPage } from './servicio-maniobras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ServicioManiobrasPageRoutingModule
  ],
  declarations: [ServicioManiobrasPage]
})
export class ServicioManiobrasPageModule {}
