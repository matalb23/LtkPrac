import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'mensaje',
    loadChildren: () => import('./mensaje/mensaje.module').then( m => m.MensajePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'firma',
    loadChildren: () => import('./firma/firma.module').then( m => m.FirmaPageModule)
  },
  {path:'', redirectTo:'login',pathMatch:'full'},
  {
    path: 'guardia',
    loadChildren: () => import('./guardia/guardia.module').then( m => m.GuardiaPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
  },
  {
    path: 'servicio-maniobras',
    loadChildren: () => import('./servicio-maniobras/servicio-maniobras.module').then( m => m.ServicioManiobrasPageModule)
  },
  {
    path: 'servicio-demoras',
    loadChildren: () => import('./servicio-demoras/servicio-demoras.module').then( m => m.ServicioDemorasPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
