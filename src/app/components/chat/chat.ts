import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from '../../services/ChatSignalR.service';
import { AuthService } from '../../auth/auth-service';
import { ChatService } from '../../services/chat.service';
import { MessagePaginationDto } from '../../models/message-pagination-DTO';
import { GetMessageDTO } from '../../models/get-message-DTo';

interface Message {
  id: number;
  text: string;
  sender: 'Me' | 'Other';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  // INPUTS from Parent
  @Input() receiverId: string = '';
  @Input() receiverName: string = 'Chat';

  messages: Message[] = [];
  userInput: string = '';

  private messageIdCounter = -1;
  private shouldScroll: boolean = false;
  private subscriptions: Subscription = new Subscription();

  // SignalR properties
  private connectionSubscription?: Subscription;
  isConnected: boolean = false;

  constructor(
    private chatService: ChatService,
    private signalRService: ChatSignalRService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscribeToMessages();
    this.subscribeToConnectionStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receiverId'] && this.receiverId) {
      console.log(' UI: Switched chat to receiver ID:', this.receiverId);
      this.loadConversationHistory(this.receiverId);
    }
  }

  loadConversationHistory(userId: string): void {
    this.messages = []; 
    console.log(` Fetching history for user: ${userId}`);

    this.chatService.getConversation(userId).subscribe({
      next: (response: MessagePaginationDto) => {
        console.log(' History loaded:', response);

        const historyMessages: Message[] = response.messages.map((apiMsg) => ({
          id: apiMsg.id,
          text: apiMsg.content,

          sender: apiMsg.isMessageFromMe ? 'Me' : 'Other',

          timestamp: new Date(apiMsg.sentAt),
        }));

        historyMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        this.messages = historyMessages;
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error(' Error loading history:', err);
        this.addOtherUserMessage('Failed to load conversation history.');
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private subscribeToMessages(): void {
    const sub1 = this.signalRService.messageReceived.subscribe((message: GetMessageDTO) => {

      
      if (message.senderId === this.receiverId) {
        this.messages.push({
          id: message.id,
          text: message.content,
          sender: 'Other',
          timestamp: new Date(message.sentAt),
        });

        this.shouldScroll = true;
      }
    });

    const sub2 = this.signalRService.messageSent.subscribe((message: GetMessageDTO) => {
      if (message.receiverId === this.receiverId) {
        this.messages.push({
          id: message.id,
          text: message.content,
          sender: 'Me' ,
          timestamp: new Date(message.sentAt),
        });

        this.shouldScroll = true;
      }
    });

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToConnectionStatus(): void {
    const sub = this.signalRService.connectionEstablished.subscribe((isConnected: boolean) => {
      this.isConnected = isConnected;

      if (isConnected) {
        console.log(' SignalR Status: ONLINE');
      } else {
        console.warn(' SignalR Status: OFFLINE (Disconnected)');
      }
    });

    this.subscriptions.add(sub);
  }

  sendMessage(): void {
    const trimmedInput = this.userInput.trim();

    if (!trimmedInput || !this.receiverId) {
      return;
    }

    if (!this.signalRService.isConnected()) {
      console.warn('Cannot send: SignalR is not connected.');
      this.addOtherUserMessage('Not connected to server. Please wait...');
      return;
    }

    this.addMyMessage(trimmedInput);

    console.log(`📤 SignalR: Sending message to '${this.receiverId}'...`);

    this.signalRService
      .sendMessage(this.receiverId, trimmedInput)
      .then((backendResponse: any) => {
        console.log('SignalR: Message sent successfully!');
        console.log(' Backend Output/Response:', backendResponse);
      })
      .catch((err) => {
        console.error('SignalR: Failed to send message:', err);
        this.addOtherUserMessage('Failed to send message.');
      });

    this.userInput = '';
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addMyMessage(text: string): void {
    this.messages.push({
      id: this.messageIdCounter--,
      text,
      sender: 'Me' ,
      timestamp: new Date(),
    });
    this.shouldScroll = true;
  }

  private addOtherUserMessage(text: string): void {
    this.messages.push({
      id: this.messageIdCounter--,
      text,
      sender: 'Other',
      timestamp: new Date(),
    });
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }
}
