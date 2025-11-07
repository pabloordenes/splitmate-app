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
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import {doc, Firestore, getDoc, setDoc, updateDoc} from "@angular/fire/firestore";
import {AuthService, UserData} from "./firebase/auth.service";

export interface Mensaje {
  id: string;
  texto: string;
  autor: string;
  fecha: Date;
  userId: string;
  groupId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore:Firestore,
              private authService:AuthService,) {}

  async obtenerMensajes(grupoId: string): Promise<Mensaje[]> {
    const mensajesRef = collection(this.firestore, 'mensajes');
    const q = query(mensajesRef, where('groupId', '==', grupoId));
    const querySnapshot = await getDocs(q);

    const mensajes: Mensaje[] = [];
    querySnapshot.forEach((doc) => {
      mensajes.push({ id: doc.id, ...doc.data() } as Mensaje);
    });

    return mensajes;
  }

  async agregarMensaje(mensaje: Mensaje): Promise<void> {
    await addDoc(collection(this.firestore, 'mensajes'), mensaje);
  }

  async getCurrentUserId(): Promise<string | null> {
    const userData: UserData | null = await this.authService.getCurrentUserData();
    if (userData) {
      return userData.id;
    } else {
      console.log("No se pudo obtener el id del usuario");
      return null;
    }
  }

  async createMessage(mensaje: Partial<Mensaje>): Promise<Mensaje> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario actual.');
    }

    const newMessage: Mensaje = {
      id: mensaje.id || this.generateUniqueId(),
      userId: userId,
      texto: mensaje.texto || '',
      autor: mensaje.autor || '',
      fecha: mensaje.fecha || new Date(),
      groupId: mensaje.groupId || ''
    };

    const messageDocRef = doc(this.firestore, 'mensajes', newMessage.id);
    await setDoc(messageDocRef, newMessage);

    await this.addMessageToUser(newMessage.id);
    return newMessage;
  }

  private async addMessageToUser(messageId: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario actual.');
    }

    const userDocRef = doc(this.firestore, 'mensajes', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data() as UserData;
      const messageIds = userData.messagesIds ? userData.messagesIds.split(',') : [];
      messageIds.push(messageId);

      await updateDoc(userDocRef, {
        notificationsIds: messageIds.join(','),
      });
    }
  }

  private generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substring(2) + '-' + Date.now();
  }
}
