import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormgroupPage } from './formgroup.page';

const routes: Routes = [
  {
    path: '',
    component: FormgroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormgroupPageRoutingModule {}
