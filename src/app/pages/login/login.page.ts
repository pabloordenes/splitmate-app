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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private alert: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  async login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const pass = this.loginForm.get('password')?.value;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!emailRegex.test(email)) {
        this.showAlert('Correo inválido', 'Por favor, introduce un correo electrónico válido');
        return;
      }

      const isRegistered = await this.authService.isRegistered(email);
      if (!isRegistered) {
        this.showAlert('Correo no registrado', 'Este correo electrónico no está registrado. Por favor, verifica o regístrate');
        return;
      }

      const usuarioLogeado = await this.authService.login(email, pass);

      if (usuarioLogeado) {
        const loading = await this.loadingController.create({
          message: 'Cargando credenciales',
          duration: 1000
        });

        await loading.present();

        setTimeout(async () => {
          await loading.dismiss();
          const userData: UserData | null = await this.authService.getUserData(email);
          this.router.navigate(['home']);
        }, 2000);
      } else {
        this.showAlert('Acceso denegado', 'Usuario o contraseña incorrectos');
      }
    }
  }

  redirectRecoverPass() {
    this.router.navigate(['recover-pass']);
  }

  redirectRegister() {
    this.router.navigate(['register'])
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
