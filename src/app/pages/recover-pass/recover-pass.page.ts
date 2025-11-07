/*
 * --------------------------------------------------------------------------------
 * Proyecto: Splitmate (App de Ahorros Compartidos)
 * Autor: Pablo Ordenes U. (pabloordenesu@gmail.com)
 * Fecha de Creación: 2024
 *
 * Este código es propiedad intelectual de Pablo Ordenes U.
 * Queda prohibida la reproducción, distribución o uso no autorizado
 * de este código sin el permiso explícito del autor.
 *
 * (Licencia MIT: ver archivo LICENSE para más detalles)
 * --------------------------------------------------------------------------------
 */

import { Component, OnInit } from '@angular/core';
import {AlertController, MenuController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "../../services/firebase/auth.service";

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.page.html',
  styleUrls: ['./recover-pass.page.scss'],
})
export class RecoverPassPage implements OnInit {

  email: string = "";

  constructor(
    private menuComponent:MenuController,
    private router:Router,
    private alert:AlertController,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.menuComponent.enable(false);
  }

  async verify() {
    const isRegistered = await this.authService.isRegistered(this.email);
    if (!isRegistered) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Correo no registrado',
        buttons: ['Ok']
      });
    } else {
      this.sendMail()
    }
  }

  async sendMail() {
    const alert = await this.alert.create({
      header: 'Email enviado',
      message: 'Revise su correo',
      buttons: ['Continuar']
    });
    await alert.present();
    await this.authService.recoveryPassword(this.email)
    setTimeout(()=> {
      this.router.navigate(['login']);
    }, 2000);
  }

  back() {
    this.router.navigate(['login']);
  }

}
