import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateprofilePage } from './createprofile.page';

const routes: Routes = [
  {
    path: '',
    component: CreateprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateprofilePageRoutingModule {}
