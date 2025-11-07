import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormgroupPageRoutingModule } from './formgroup-routing.module';

import { FormgroupPage } from './formgroup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormgroupPageRoutingModule
  ],
  declarations: [FormgroupPage]
})
export class FormgroupPageModule {}
