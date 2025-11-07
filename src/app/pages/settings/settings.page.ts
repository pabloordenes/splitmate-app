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
import {collection, doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {AuthService, UserData} from "../../services/firebase/auth.service";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  notificationsToggle: boolean = false;
  darkmodeToggle: boolean = false;

  constructor(private router:Router,
              private firestore:Firestore,
              private authService:AuthService) { }

  async ngOnInit() {
    try {
      const userDocId = await this.authService.getCurrentUserDocId();
      if (userDocId) {
        const userDocRef = doc(this.firestore, 'users', userDocId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          this.notificationsToggle = userData.notificationsToggle ?? false;
          this.darkmodeToggle = userData.darkmodeToggle ?? false;
        } else {
          console.warn('No user document found');
        }
      } else {
        throw new Error('No se pudo obtener el ID del documento del usuario.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Error al cargar los ajustes del usuario');
    }
  }

  back() {
    this.router.navigate(['home']);
  }

  async onToggleChange(event: any, toggleType: 'notifications' | 'darkmode') {
    try {
      const userDocId = await this.authService.getCurrentUserDocId();
      if (userDocId) {
        if (toggleType === 'notifications') {
          this.notificationsToggle = event.detail.checked;
          const updatedNotifications: Partial<UserData> = {
            notificationsToggle: this.notificationsToggle,
          };
          await this.authService.updateUserData(updatedNotifications, userDocId);
          console.log('Notifications updated:', updatedNotifications);
        } else if (toggleType === 'darkmode') {
          this.darkmodeToggle = event.detail.checked;
          const updatedDarkmode: Partial<UserData> = {
            darkmodeToggle: this.darkmodeToggle
          };
          await this.authService.updateUserData(updatedDarkmode, userDocId);
          console.log('Dark mode updated:', updatedDarkmode);
        }
      } else {
        throw new Error('No se pudo obtener el ID del documento del usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  }
  settingsView() {
    this.router.navigate(['settings'])
  }

  homeView() {
    this.router.navigate(['home'])
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['register'])
  }
}
