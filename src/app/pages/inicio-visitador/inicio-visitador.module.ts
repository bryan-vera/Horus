import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioVisitadorPageRoutingModule } from './inicio-visitador-routing.module';

import { InicioVisitadorPage } from './inicio-visitador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioVisitadorPageRoutingModule
  ],
  declarations: [InicioVisitadorPage]
})
export class InicioVisitadorPageModule {}
