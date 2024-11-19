import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { Message } from '../models/Message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  private chatConnection?: HubConnection;
  myName: string = '';
  onlineUsers: string[] = [];
  messages: Message[] = [];
  constructor(private httpClient: HttpClient,private modalService:NgbModal) {}

  sendPrivateMessage(toUser: string, content: string) {
    const message: Message = {
      from: this.myName,
      to: toUser,
      content,
    };
    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true;
      return this.chatConnection
        ?.invoke('CreatePrivateChat', message)
        .then(() => {
          this.privateMessages = [...this.privateMessages, message];
        })
        .catch((error) => console.log(error));
    } else {
      return this.chatConnection
        ?.invoke('ReceivePrivateMessage', message)
        .then(() => {})
        .catch((error) => console.log(error));
    }
    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }
  async closePrivateChatMessage(toUser: string) {
    return this.chatConnection
      ?.invoke('RemovePrivateChat', this.myName, toUser)
      .catch((error) => console.log(error));
  }
  async sendMessage(content: string) {
    const message: Message = {
      from: this.myName,
      content,
    };
    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }

  registerUser(user: User) {
    return this.httpClient.post('/api/chat/register-user', user, {
      responseType: 'text',
    });
  }
  createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(`https://localhost:32769/hubs/chat`, {
        skipNegotiation: true,

        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
    this.chatConnection.start().catch((error) => console.log(error));
    this.chatConnection.on('UserConnected', () => {
      console.log('the server has called here');
      this.addUserConnectionId();
    });
    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
    });
    this.chatConnection.on('NewMessage', (newMessage: Message) => {
      this.messages = [...this.messages, newMessage];
    });

   this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });
    
    this.chatConnection.on('ReceivePrivateMessage', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
    });
    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });

  }
  stopChatConnection() {
    this.chatConnection?.stop().catch((error) => console.log(error));
  }
  async addUserConnectionId() {
    return this.chatConnection
      ?.invoke('AddUserConnectionId', this.myName)
      .catch((error) => console.log(error));
  }
}
