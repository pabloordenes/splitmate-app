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
import {Router} from "@angular/router";
import {Firestore, collection, addDoc, doc, getDoc, setDoc} from "@angular/fire/firestore";
import { AuthService } from "../../services/firebase/auth.service";
import {get} from "@angular/fire/database";
import {user} from "@angular/fire/auth";
import {AlertController, MenuController} from "@ionic/angular";
import {UserService} from "../../services/firebase/user-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.page.html',
  styleUrls: ['./createprofile.page.scss'],
})
export class CreateprofilePage implements OnInit {

  createProfileForm: FormGroup;

  constructor(private router:Router,
              private firestore: Firestore,
              private authService: AuthService,
              private menu:MenuController,
              private userService:UserService,
              private alert:AlertController,
              private formBuilder:FormBuilder
  ) {
    this.createProfileForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      id: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]]
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  async verify() {
    const nombre = this.createProfileForm.get('nombre')?.value;
    const apellido = this.createProfileForm.get('apellido')?.value;
    const username = this.createProfileForm.get('id')?.value;
    const usernameRegex = /^[a-zA-Z]*$/;

    if (this.createProfileForm.valid) {
      if (!usernameRegex.test(nombre)) {
        this.showAlert('Nombre inválido', 'Ingresa un nombre válido');
        return;
      }

      if (!usernameRegex.test(apellido)) {
        this.showAlert('Apellido inválido', 'Ingresa un apellido válido');
        return;
      }

      if(usernameRegex.test(username)) {
        const isUsernameAvailable = await this.authService.isUsernameAvailable(this.createProfileForm.get('id')?.value);
        if (isUsernameAvailable) {
          this.createProfile();
        } else {
          this.showAlert('Usuario inválido', 'El nombre de usuario ya está en uso');
          console.error('El nombre de usuario ya está en uso.');
        }
      } else {
        this.showAlert('Usuario inválido', 'Ingresa un nombre de usuario válido');
      }
    } else {
      console.log("form errors")
      this.showFormErrors();
    }
  }

  async createProfile() {
    const email = (await this.authService.getUser())?.email;
    const userRef = collection(this.firestore, 'users');

    const userDocRef = doc(userRef, this.createProfileForm.get('id')?.value);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email,
        nombre: this.createProfileForm.get('nombre')?.value,
        apellido: this.createProfileForm.get('apellido')?.value,
        id: this.createProfileForm.get('id')?.value.toString().toLowerCase(),});
  }
    this.router.navigate(['home']);
  }

  back() {
    this.router.navigate(['register']);
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
    if (this.createProfileForm.get('nombre')?.errors?.['required']) {
      this.showAlert('Nombre inválido', 'El nombre es requerido');
    } else if (this.createProfileForm.get('nombre')?.errors?.['minlength']) {
      this.showAlert('Nombre inválido', 'El mínimo de caracteres es 3');
    } else if (this.createProfileForm.get('nombre')?.errors?.['pattern']) {
      this.showAlert('Nombre inválido', 'Ingresa un nombre válido');
    }

    if (this.createProfileForm.get('apellido')?.errors?.['required']) {
      this.showAlert('Apellido inválido', 'El apellido es requerido');
    } else if (this.createProfileForm.get('apellido')?.errors?.['minlength']) {
      this.showAlert('Apellido inválido', 'El mínimo de caracteres es 3');
    } else if (this.createProfileForm.get('apellido')?.errors?.['pattern']) {
      this.showAlert('Apellido inválido', 'Ingresa un apellido válido');
    }

    if (this.createProfileForm.get('id')?.errors?.['required']) {
      this.showAlert('Usuario inválido', 'El usuario es requerido');
    } else if (this.createProfileForm.get('id')?.errors?.['minlength']) {
      this.showAlert('Usuario inválido', 'El mínimo de caracteres es 3');
    } else if (this.createProfileForm.get('id')?.errors?.['pattern']) {
      this.showAlert('Usuario inválido', 'Ingresa un usuario válido');
    }
  }
}
