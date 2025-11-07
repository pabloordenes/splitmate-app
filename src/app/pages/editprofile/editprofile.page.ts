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
import { Router } from "@angular/router";
import { AuthService, UserData } from "../../services/firebase/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {

  profileForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alert:AlertController
  ) {
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUserData().then((userData) => {
      if (userData) {
        this.profileForm.patchValue({
          nombre: userData.nombre,
          apellido: userData.apellido
        });
      }
    });
  }

  async verify() {
    const nombre = this.profileForm.get('nombre')?.value;
    const apellido = this.profileForm.get('apellido')?.value;
    const usernameRegex = /^[a-zA-Z]*$/;

    if (this.profileForm.valid) {
      if (!usernameRegex.test(nombre)) {
        this.showAlert('Nombre inválido', 'Ingresa un nombre válido');
        return;
      }

      if (!usernameRegex.test(apellido)) {
        this.showAlert('Apellido inválido', 'Ingresa un apellido válido');
        return;
      } else {
        this.updateProfile();
      }
    } else {
      this.showFormErrors();
    }
  }

  back() {
    this.router.navigate(['home']);
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      const updatedUserData: Partial<UserData> = {
        nombre: this.profileForm.get('nombre')?.value,
        apellido: this.profileForm.get('apellido')?.value
      };

      try {
        const userDocId = await this.authService.getCurrentUserDocId();
        if (userDocId) {
          await this.authService.updateUserData(updatedUserData, userDocId);
          this.router.navigate(['home']);
          console.log(updatedUserData);
        } else {
          throw new Error('No se pudo obtener el ID del documento del usuario.');
        }
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  showFormErrors() {
    const nombreControl = this.profileForm.get('nombre');
    const apellidoControl = this.profileForm.get('apellido');

    if (nombreControl?.errors?.['required']) {
      this.showAlert('Nombre inválido', 'El nombre es requerido');
    } else if (nombreControl?.errors?.['minlength']) {
      this.showAlert('Nombre inválido', 'El nombre debe tener un mínimo de 3 caracteres');
    } else if (nombreControl?.errors?.['pattern']) {
      this.showAlert('Nombre inválido', 'Ingrese un nombre válido');
    }

    if (apellidoControl?.errors?.['required']) {
      this.showAlert('Apellido inválido', 'El apellido es requerido');
    } else if (apellidoControl?.errors?.['minlength']) {
      this.showAlert('Apellido inválido', 'El apellido debe tener un mínimo de 3 caracteres');
    } else if (apellidoControl?.errors?.['pattern']) {
      this.showAlert('Apellido inválido', 'Ingrese un apellido válido');
    }
  }
}
