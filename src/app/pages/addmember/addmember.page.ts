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
import {addDoc, collection, Firestore, getDocs} from "@angular/fire/firestore";
import {UserService} from "../../services/firebase/user-service.service";
import {AuthService} from "../../services/firebase/auth.service";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  selected: boolean;
}

interface UserData {
  nombre: string;
  apellido: string;
}

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.page.html',
  styleUrls: ['./addmember.page.scss'],
})
export class AddmemberPage implements OnInit {

  users: User[] = [];
  currentUserId: string | null = null;

  constructor(private router:Router,
              private firestore:Firestore,
              private userService:UserService,
              private authService: AuthService
              ) { }

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUserData();
    this.currentUserId = currentUser?.id || null;
    await this.loadUsers();
  }


  async loadUsers() {
    try {
      const usersRef = collection(this.firestore, 'users');
      const userDocs = await getDocs(usersRef);
      this.users = userDocs.docs.map(doc => {
        const data = doc.data() as UserData;
        return {
          id: doc.id,
          nombre: data.nombre,
          apellido: data.apellido,
          selected: doc.id === this.currentUserId,
        };
      });

      this.users = this.users.filter(user => user.id !== this.currentUserId);
    } catch (error) {
      console.error('Error al cargar usuarios: ', error);
    }
  }

  toggleSelection(user: User) {
    user.selected = !user.selected;
    console.log('Usuario seleccionado:', user);
  }

  addSelectedMembers() {
    const selectedUsers = this.users.filter(user => user.selected);
    const selectedUserIds = selectedUsers.map(user => user.id);

    console.log('Selected User IDs:', selectedUserIds);

    this.userService.setSelectedUserIds(selectedUserIds);
    this.router.navigate(['formgroup']);
  }

  back() {
    this.router.navigate(['formgroup']);
  }

}
