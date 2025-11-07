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
import {AuthService, UserData} from "../../services/firebase/auth.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  grupos: string[] = [];

  constructor(private router:Router,
              private authService: AuthService,) { }

  async ngOnInit() {
    await this.loadUserGroups();
  }

  async loadUserGroups() {
    try {
      const userData: UserData | null = await this.authService.getCurrentUserData();
      if (userData && userData.grupos) {
        this.grupos = await this.authService.getGroupNamesByIds(userData.grupos);
      }
    } catch (error) {
      console.error('Error al cargar los grupos del usuario:', error);
    }
  }

  back() {
    this.router.navigate(['home'])
  }

  donate() {
    this.router.navigate(['home'])
  }

  settingsView() {
    this.router.navigate(['settings'])
  }

  homeView() {
    this.router.navigate(['home'])
  }

  logout() {
    this.router.navigate(['register'])
  }

}
