import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',

})
export class ChatService {

  constructor(private httpClient:HttpClient) { }

  registerUser(user:User){
    return this.httpClient.post("/api/chat/register-user",user,{responseType:'text'})
  }
}
