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
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService, UserData } from './firebase/auth.service';

export interface Notification {
  id: string;
  userId: string;
  name: string;
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsCollection = collection(this.firestore, 'notifications');
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore, private authService: AuthService) {
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

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    const q = query(this.notificationsCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Notification);
  }

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario actual.');
    }

    const newNotification: Notification = {
      id: this.generateUniqueId(),
      userId,
      name: notification.name || 'Notificación',
      message: notification.message || '',
      type: notification.type || 'info',
      timestamp: new Date(),
      read: false,
    };

    const notificationDocRef = doc(this.notificationsCollection, newNotification.id);
    await setDoc(notificationDocRef, newNotification);

    await this.addNotificationToUser(newNotification.id);
    return newNotification;
  }

  private async addNotificationToUser(notificationId: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario actual.');
    }

    const userDocRef = doc(this.usersCollection, userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data() as UserData;
      const notificationIds = userData.notificationsIds ? userData.notificationsIds.split(',') : [];
      notificationIds.push(notificationId);

      await updateDoc(userDocRef, {
        notificationsIds: notificationIds.join(','),
      });
    }
  }

  private generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substring(2) + '-' + Date.now();
  }

  private async getFcmTokenForUser(userId: string): Promise<string | null> {
    // Obtén el token de FCM del usuario desde la base de datos
    const userDocRef = doc(this.usersCollection, userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data() as UserData;
      return userData.fcmToken || null; // Asegúrate de tener el campo `fcmToken` en la base de datos
    }
    return null;
  }
}
