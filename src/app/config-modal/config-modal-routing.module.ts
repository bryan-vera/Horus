import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigModalPage } from './config-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigModalPageRoutingModule {}
