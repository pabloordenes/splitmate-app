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

import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {doc, DocumentData, Firestore, getDoc, updateDoc} from "@angular/fire/firestore";
import {DocumentSnapshot} from "@angular/fire/compat/firestore";
import {UserData} from "./auth.service";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore:Firestore) {
  }
  private selectedUserIdsSubject = new BehaviorSubject<string[]>([]);
  selectedUserIds$ = this.selectedUserIdsSubject.asObservable();

  setSelectedUserIds(ids: string[]) {
    this.selectedUserIdsSubject.next(ids);
  }

  getSelectedUserIds(): string[] {
    return this.selectedUserIdsSubject.getValue();
  }

  async addGroupToUser(userId: string, groupId: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);

    try {
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserData;
        const updatedGroups = [...(userData.grupos ?? []), groupId];
        await updateDoc(userDocRef, { grupos: updatedGroups });
      }
    } catch (error) {
      console.error('Error al actualizar el usuario con el nuevo grupo:', error);
    }
  }

  generateUniqueId(): string {
    return uuidv4();
  }

  generateRandomId(): string {
    return 'id-' + this.generateUniqueId()
  }
}
