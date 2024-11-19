import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/Message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  @Input() messages:Message[] = [];
  /**
   *
   */
  constructor() {

    
  }
  ngOnInit(): void {

  }

}
