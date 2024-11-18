import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',

})
export class ChatService {

  private chatConnection?:HubConnection;
  myName:string = '';
  onlineUsers:string[] = [];
  constructor(private httpClient:HttpClient) { }

  registerUser(user:User){
    return this.httpClient.post("/api/chat/register-user",user,{responseType:'text'})
  }
  createChatConnection(){
    debugger;
    this.chatConnection = new HubConnectionBuilder().configureLogging(LogLevel.Debug)
    .withUrl(`https://localhost:32771/hubs/chat`,{
      skipNegotiation:true,
      
      transport: HttpTransportType.WebSockets
    }).withAutomaticReconnect().build();
    this.chatConnection.start().catch(error => console.log(error));
    this.chatConnection.on('UserConnected',()=>{
      console.log('the server has called here');
      this.addUserConnectionId();
    });
    this.chatConnection.on('OnlineUsers',(onlineUsers)=>{
    this.onlineUsers = [...onlineUsers];
    });

  }
  stopChatConnection(){
    this.chatConnection?.stop().catch(error => console.log(error));
  }
  async addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.myName).catch(
      error => console.log(error)
    );
  }
}
