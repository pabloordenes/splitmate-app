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
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService, UserData } from "../../services/firebase/auth.service";
import { Firestore, collection, addDoc } from "@angular/fire/firestore";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formGroup: FormGroup;

  constructor(private router: Router,
              private menuComponent: MenuController,
              private authService: AuthService,
              private loadingController: LoadingController,
              private alert: AlertController,
              private formBuilder: FormBuilder,
  ) {
    this.formGroup = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, this.validatePassword]]
    });
  }

  ngOnInit() {
    this.menuComponent.enable(false);
  }

  validatePassword(control: any) {
    const password = control.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return {
        invalidPassword: true
      };
    }
    return null;
  }

  async verify() {
    const email = this.formGroup.get('email');
    const passw = this.formGroup.get('pass');
    const passRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email?.value)) {
      this.showAlert('Correo inválido', 'Por favor, introduce un correo electrónico válido')
      return;
    }

    if (passw?.value.length < 8) {
      this.showAlert('Contraseña inválida', 'Mínimo 8 carácteres')
      return;
    }

    if (!passRegex.test(passw?.value)) {
      this.showAlert('Contraseña inválida', 'La contraseña no puede contener espacios blancos')
      return;
    }

    const isRegistered = await this.authService.isRegistered(email?.value);
    if (isRegistered) {
      this.showAlert('Acceso denegado', 'Usuario ya registrado');
    } else if (this.formGroup.valid) {
      this.register()
    }
  }

  async register() {
    const email = this.formGroup.get('email');
    const pass = this.formGroup.get('pass');

    const registrar = await this.authService.register(email?.value, pass?.value);

    if (registrar) {
      const loading = await this.loadingController.create({
        message: 'Registrando usuario',
        duration: 1000
      });
      await loading.present();
      setTimeout(async () => {
        await loading.dismiss();
        this.router.navigate(['createprofile']);
      }, 2000);
    }
  }

  redirectLogin() {
    this.router.navigate(['login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
