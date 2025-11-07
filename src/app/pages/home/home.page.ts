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

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {AuthService, UserData} from "../../services/firebase/auth.service";
import {UserStateService} from "../../services/firebase/user-state.service";
import {notifications} from "ionicons/icons";
import {NotificationService} from "../../services/notifications.service";
import {Notification} from "../../interfaces/notification.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {

  currentDate: string;
  title: string;
  goal: number;
  nombre: string = '';

  constructor(private menuController:MenuController,
              private router:Router,
              private authService:AuthService,
              private userStateService:UserStateService,
              private notificationService:NotificationService) {
    this.currentDate = this.getCurrentDate();
    this.title = this.getGroupTitle();
    this.goal = this.getGroupGoal();
    this.getName().then(name => this.nombre = name);
  }

  ngOnInit() {

    this.menuController.enable(false);
    this.userStateService.user$.subscribe(userData => {
      if (userData) {
        this.nombre = userData.nombre;
      }
    });
    this.authService.getCurrentUserData().then(userData => {
      if (userData) {
        this.userStateService.setUser(userData);
      }
    });
  }

  getCurrentDate(): string{

    const date = new Date();
    const hour = date.getHours(); // Obtener la hora actual

    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  getGroupTitle(): string {
    return 'Viaje familiar';
  }
  getGroupGoal(): number {
    return 1000000;
  }

  async getName(): Promise<string> {
    const userData: UserData | null = await this.authService.getCurrentUserData();
    if (userData) {
      return `${userData.nombre}`/*${userData.lastName}*/;
    } else {
      return 'Invitado';
    }
  }

  groupsView() {
    this.router.navigate(['grouplist'])
  }

  historyView() {
    this.router.navigate(['history'])
  }

  profileView() {
    this.router.navigate(['editprofile'])
  }

  formView() {
    this.router.navigate(['form'])
  }

  reportsView() {
    this.router.navigate(['reports'])
  }

  walletView() {
    this.router.navigate(['wallet'])
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

  notificationsView() {
    this.router.navigate(['notifications']);
  }

  protected readonly notifications = notifications;
}
