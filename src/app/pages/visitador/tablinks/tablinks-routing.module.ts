import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablinksPage } from './tablinks.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'tablinks',
    component: TablinksPage,
    children:[ 
    {
      path: 'profile',
      loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule),
      // canActivate: [AuthGuard],
      // pathMatch: "full",
      // data:{
      //   role: 'VISITADOR'
      // }
    },
    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
      // canActivate: [AuthGuard],
      // data:{
      //   role: 'VISITADOR'
      // }
    },
    {
      path: 'settings',
      loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule),
      canActivate: [AuthGuard],
      data:{
        role: 'VISITADOR'
      }
    },
    {
      path: '',
      redirectTo: 'tablinks/dashboard',
      pathMatch: 'full'
    }
    ]
  },
  {
    path: '',
    redirectTo: 'tablinks/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablinksPageRoutingModule {}
