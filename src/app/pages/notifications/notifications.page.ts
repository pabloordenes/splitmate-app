import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from "../../services/notifications.service";
import { AuthService, UserData } from "../../services/firebase/auth.service";
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];
  currentUserId: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUserData();
    this.currentUserId = currentUser?.id || null;
    if (this.currentUserId) {
      await this.loadUserNotifications();
    }
  }

  async loadUserNotifications() {
    try {
      if (!this.currentUserId) {
        console.error('No se pudo obtener el ID del usuario actual.');
        return;
      }

      const notRef = collection(this.firestore, 'notifications');
      const userNotificationsQuery = query(notRef, where('userId', '==', this.currentUserId));
      const querySnapshot = await getDocs(userNotificationsQuery);

      this.notifications = querySnapshot.docs.map(doc => {
        const data = doc.data() as Notification;
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          message: data.message,
          type: data.type,
          timestamp: data.timestamp,
          read: data.read,
        };
      });
    } catch (error) {
      console.error('Error al cargar las notificaciones del usuario:', error);
    }
  }

  addNotification() { // Para testear que funcione el mostrar notificaciones
    this.notificationService.createNotification({
      name: 'parguela',
      message: 'message',
      type: 'info',
    });
  }
}
