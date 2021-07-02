import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioVisitadorPage } from './inicio-visitador.page';

const routes: Routes = [
  {
    path: '',
    component: InicioVisitadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioVisitadorPageRoutingModule {}
