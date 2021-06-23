import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioPage } from './servicio.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import {  ServicioPageRoutingModule } from './servicio-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ServicioPageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ServicioPage]
})
export class ServicioPageModule {}
