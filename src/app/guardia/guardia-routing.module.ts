import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardiaPage } from './guardia.page';

const routes: Routes = [
  {
    path: '',
    component: GuardiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardiaPageRoutingModule {}
