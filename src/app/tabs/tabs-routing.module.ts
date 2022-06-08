import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'servicio',
        loadChildren: () => import('../servicio/servicio.module').then(m => m.ServicioPageModule)
      },
      {
        path: 'historico',
        loadChildren: () => import('../historico/historico.module').then(m => m.HistoricoPageModule)
      },
      {
        path: 'guardia',
        loadChildren: () => import('../guardia/guardia.module').then(m => m.GuardiaPageModule)
      },
      // {
      //   path: 'tab3',
      //   loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      // },
      {
        path: 'mensaje',
        loadChildren: () => import('../mensaje/mensaje.module').then( m => m.MensajePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/servicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
