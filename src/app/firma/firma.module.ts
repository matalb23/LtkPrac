import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirmaPage } from './firma.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FirmaPageRoutingModule } from './firma-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FirmaPageRoutingModule
  ],
  declarations: [FirmaPage]
})
export class FirmaPageModule {}
