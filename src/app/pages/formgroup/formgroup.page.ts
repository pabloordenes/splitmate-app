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
import { Firestore, collection, addDoc } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserService} from "../../services/firebase/user-service.service";
import {Group} from "../../interfaces/group.model";
import {AuthService, UserData} from "../../services/firebase/auth.service";
import {AlertController} from "@ionic/angular";

interface NavigationState {
  selectedUserIds: string[];
}

@Component({
  selector: 'app-formgroup',
  templateUrl: './formgroup.page.html',
  styleUrls: ['./formgroup.page.scss'],
})
export class FormgroupPage implements OnInit {
  formGroup: FormGroup;
  selectedUserIds: string[] = []

  constructor(
    private router: Router,
    private firestore: Firestore,
    private formBuilder: FormBuilder,
    private userService:UserService,
    private authService:AuthService,
    private alert:AlertController
  ) {
    console.log("Creando instancia de FormgroupPage")
    this.formGroup = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: '',
      meta: [null, [Validators.required, Validators.min(5000)]]
    });
  }

  ngOnInit() {
    this.userService.selectedUserIds$.subscribe(ids => {
      this.selectedUserIds = ids;
      console.log('Usuarios seleccionados:', this.selectedUserIds);
    });
  }

  async verify() {
    const regex = /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/;
    const nombre = this.formGroup.get('nombre');

    if (this.formGroup.valid) {
      if (!regex.test(nombre?.value)) {
        this.showAlert('Nombre inválido', 'Ingrese un nombre válido');
        return;
      } else if (this.formGroup.valid) {
        this.createGroup();
      }
    } else {
      this.showFormErrors();
    }
  }

  async createGroup() {
    try {
      const userData: UserData | null = await this.authService.getCurrentUserData();
      const gruposRef = collection(this.firestore, 'groups');
      const grupoData: Group = {
        id: this.userService.generateRandomId(),
        ...this.formGroup.value,
        miembros: this.selectedUserIds,
        admin: userData?.id,
      };
      await addDoc(gruposRef, grupoData);
      console.log('Grupo creado con éxito');

      for (const userId of this.selectedUserIds) {
        this.userService.addGroupToUser(userId, grupoData.id);
      }

      if (userData?.id) {
        this.userService.addGroupToUser(userData.id, grupoData.id);
      }

      this.router.navigate(['grouplist']);
    } catch (error) {
      console.error('Error al crear el grupo: ', error);
    }
  }

  back() {
    this.router.navigate(['grouplist']);
  }

  routAddMember() {
    console.log("Redirigiendo a addmember")
    this.router.navigate(['addmember']);
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
    const nombreControl = this.formGroup.get('nombre');
    const metaControl = this.formGroup.get('meta');

    if (nombreControl?.errors?.['required']) {
      this.showAlert('Nombre inválido', 'El nombre es requerido');
    } else if (nombreControl?.errors?.['minlength']) {
      this.showAlert('Nombre inválido', 'El nombre debe tener un mínimo de 3 caracteres');
    }

    if (metaControl?.errors?.['required']) {
      this.showAlert('Meta inválida', 'La meta es requerida');
    } else if (metaControl?.errors?.['min']) {
      this.showAlert('Meta inválida', 'El valor mínimo de la meta es 5000');
    }
  }
}
