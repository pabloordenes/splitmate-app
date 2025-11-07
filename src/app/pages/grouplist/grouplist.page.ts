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
import {MenuController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService, UserData} from "../../services/firebase/auth.service";
import {Group} from "../../interfaces/group.model";

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.page.html',
  styleUrls: ['./grouplist.page.scss'],
})
export class GrouplistPage implements OnInit {

  grupos: Group[] = [];

  constructor(private menuController:MenuController,
              private router:Router,
              private authService:AuthService) { }

  async ngOnInit() {
    this.menuController.enable(false);
    await this.loadUserGroups();
  }

  async loadUserGroups() {
    try {
      const userData: UserData | null = await this.authService.getCurrentUserData();
      if (userData && userData.grupos) {
        this.grupos = await this.authService.getGroupDatasByIds(userData.grupos);
      }
    } catch (error) {
      console.error('Error al cargar los grupos del usuario:', error);
    }
  }

  createGroup() {
    this.router.navigate(['formgroup']);
  }

  back() {
    this.router.navigate(['home']);
  }

  openSelectedChat(grupoId: string) {
    this.router.navigate([`chat/${grupoId}`]);
  }
}
