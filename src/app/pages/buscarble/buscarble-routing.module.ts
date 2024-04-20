import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarblePage } from './buscarble.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarblePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarblePageRoutingModule {}
