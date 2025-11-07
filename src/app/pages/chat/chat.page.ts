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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Mensaje } from "../../services/message.service";
import { AuthService } from "../../services/firebase/auth.service";
import { Firestore, collection, query, where, getDocs } from "@angular/fire/firestore";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  grupo: string = 'Chat del grupo';
  grupoId: string | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  currentUserId: string = '';
  currentUserName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    this.grupoId = this.route.snapshot.paramMap.get('id');
    if (!this.grupoId) {
      console.error('No se especificó el ID del grupo.');
      return;
    }

    const currentUser = await this.authService.getCurrentUserData();
    if (!currentUser) {
      console.error('No se pudo obtener la información del usuario.');
      return;
    }

    this.currentUserId = currentUser.id;
    this.currentUserName = `${currentUser.nombre || 'Anon'} ${currentUser.apellido || ''}`.trim();

    await this.loadGroupInfo();
    await this.loadMessages();
  }

  async loadGroupInfo() {
    const grupo = await this.authService.getGroupName(this.grupoId!);
    if (grupo) {
      this.grupo = grupo;
    } else {
      console.error('Error al cargar el nombre del grupo.');
    }
  }

  async loadMessages() {
    try {
      const mensajesRef = collection(this.firestore, 'mensajes');
      const mensajesQuery = query(mensajesRef, where('groupId', '==', this.grupoId));
      const snapshot = await getDocs(mensajesQuery);

      this.mensajes = snapshot.docs.map(doc => {
        const data = doc.data() as Mensaje;
        let fecha: Date;

        if (data.fecha instanceof Date) {
          fecha = data.fecha;
        } else if (
          data.fecha &&
          typeof data.fecha === 'object' &&
          'seconds' in data.fecha &&
          'nanoseconds' in data.fecha
        ) {
          const timestamp = data.fecha as { seconds: number; nanoseconds: number };
          fecha = new Date(timestamp.seconds * 1000);
        } else {
          fecha = new Date();
        }
        return {
          id: doc.id,
          userId: data.userId,
          texto: data.texto,
          autor: data.autor,
          fecha: fecha,
          groupId: data.groupId,
        };
      }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      console.log('Mensajes cargados:', this.mensajes); // Verificar mensajes cargados
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  }


  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      id: this.generateId(),
      userId: this.currentUserId,
      texto: this.nuevoMensaje,
      autor: this.currentUserName,
      fecha: new Date(),
      groupId: this.grupoId || '',
    };

    try {
      await this.messageService.createMessage(mensaje);
      this.nuevoMensaje = '';
      await this.loadMessages(); // Recargar mensajes después de enviar
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  back() {
    this.router.navigate(['grouplist']);
  }

  generateId() {
    return `${this.grupoId}-${Date.now()}`;
  }
}

// Copyright (c) [2025] [Pablo Ordenes U.]
