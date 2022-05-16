import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioDemorasPage } from './servicio-demoras.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioDemorasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioDemorasPageRoutingModule {}
