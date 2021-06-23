import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioPage } from './servicio.page';

const routes: Routes = [
  {
    path: '',
    component:ServicioPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioPageRoutingModule {}
