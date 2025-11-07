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
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable, map, from } from "rxjs";
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
  doc,
  updateDoc,
  getDoc, getFirestore
} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import {UserStateService} from "./user-state.service";
import {Group} from "../../interfaces/group.model";
import {group} from "@angular/animations";

export interface UserData {
  email: string;
  nombre: string;
  apellido: string;
  id: string;
  notificationsToggle: boolean;
  darkmodeToggle: boolean;
  notificationsIds: string;
  grupos?: string[];
  messagesIds: string;
  fcmToken: string;
  receivedRequest: string[];
  sentRequest: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth,
              private firestore: Firestore,
              private userStateService: UserStateService) { }

  login(email: string, pword: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pword)
  }

  register(email: string, pword: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pword)
  }

  async getUser() {
    return this.angularFireAuth.currentUser;
  }

  async verifyEmail() {
    const user = await this.angularFireAuth.currentUser;
    if (user) {
      return user.sendEmailVerification()
        .then(() => {
          console.log("Correo de verificación enviado.");
        })
        .catch((error) => {
          console.error("Error al enviar el correo de verificación:", error);
          throw error;
        });
    } else {
      throw new Error("No hay ningún usuario autenticado.");
    }
  }

  recoveryPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log("Correo Enviado")
      })
      .catch((error) => {
        console.log("Error al enviar correo de recuperacion")
        throw error;
      })
  }

  logout() {
    return this.angularFireAuth.signOut
  }

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState
  }

  async isRegistered(email: string): Promise<boolean> {
    const userRef = collection(this.firestore, 'users');
    const q = query(userRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async getUserData(email: string): Promise<UserData | null> {
    const userRef = collection(this.firestore, 'users');
    const q = query(userRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data() as UserData;
      return userData;
    }
    return null;
  }

  async getCurrentUserData(): Promise<UserData | null> {
    const user = await this.getUser();
    console.log('Usuario actual:', user);
    if (user) {
      const email = user.email!;
      return await this.getUserData(email);
    }
    return null;
  }

  async getCUserData(): Promise<UserData | null> {
    const user = await this.angularFireAuth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        this.userStateService.setUser(userData);
        return userData;
      }
    }
    this.userStateService.setUser(null);
    return null;
  }

  async updateUserData(updatedUserData: Partial<UserData>, userDocId: string) {
    const userRef = doc(this.firestore, `users/${userDocId}`);
    await updateDoc(userRef, updatedUserData);

    const updatedUserDoc = await getDoc(userRef);
    if (updatedUserDoc.exists()) {
      const updatedUserData = updatedUserDoc.data() as UserData;
      this.userStateService.setUser(updatedUserData);
    }
  }

  async getCurrentUserDocId(): Promise<string | null> {
    const user = await this.getUser();
    if (!user) {
      return null;
    }

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    } else {
      return null;
    }
  }

  /*async getGroupDatasByIds(groupIds: string[]): Promise<Group[]> {
    const firestore = getFirestore();
    const groupCollectionRef = collection(firestore, "groups");
    const groupNames: Group[] = [];

    try {
      const q = query(groupCollectionRef, where("id", "in", groupIds));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = querySnapshot.docs[0].data() as Group;
        if (data) {
          groupNames.push(data);
        }
      });

    } catch (error) {
      console.error("Error al obtener la data de los grupos:", error);
    }
    return groupNames;
  }*/

  async getGroupDatasByIds(groupIds: string[]): Promise<Group[]> {
    const firestore = getFirestore();
    const groupCollectionRef = collection(firestore, "groups");
    const groupNames: Group[] = [];

    try {
      const q = query(groupCollectionRef, where("id", "in", groupIds));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Group; // Aquí se usa "doc" en lugar de "docs[0]"
        if (data) {
          groupNames.push(data);
        }
      });

    } catch (error) {
      console.error("Error al obtener la data de los grupos:", error);
    }
    return groupNames;
  }


  async getGroupNamesByIds(groupIds: string[]): Promise<string[]> {
    const firestore = getFirestore();
    const groupCollectionRef = collection(firestore, "groups");
    const groupNames: string[] = [];

    try {
      const q = query(groupCollectionRef, where("id", "in", groupIds));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data['nombre']) {
          groupNames.push(data['nombre']);
        }
      });

    } catch (error) {
      console.error("Error al obtener los nombres de los grupos:", error);
    }

    return groupNames;
  }

  async getGroupName(id: string): Promise<string | null> {
    const userRef = collection(this.firestore, 'groups');
    const q = query(userRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const groupData = snapshot.docs[0].data() as Group;
      return groupData.nombre;
    }
    return null;
  }

  async getGroupData(id: string): Promise<Group | null> {
    const userRef = collection(this.firestore, 'groups');
    const q = query(userRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const groupData = snapshot.docs[0].data() as Group;
      return groupData;
    }
    return null;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const userRef = collection(this.firestore, 'users');
    const q = query(userRef, where('id', '==', username));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  }
}
