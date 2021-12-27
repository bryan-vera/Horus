import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard] // Check if we should show the introduction or forward to inside
  },  
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'gps',
    loadChildren: () => import('./gps/gps.module').then( m => m.GpsPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'config-modal',
    loadChildren: () => import('./config-modal/config-modal.module').then( m => m.ConfigModalPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'inicio-visitador',
    loadChildren: () => import('./pages/inicio-visitador/inicio-visitador.module').then( m => m.InicioVisitadorPageModule),
    canActivate: [AuthGuard],
    data:{
      role: 'VISITADOR'
    }
  },
  {
    path: 'tablinks',
    loadChildren: () => import('./pages/visitador/tablinks/tablinks.module').then( m => m.TablinksPageModule),
    // canActivate: [AuthGuard],
    // data:{
    //   role: 'VISITADOR'
    // }
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
