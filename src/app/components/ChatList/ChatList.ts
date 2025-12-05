import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UISidebarChatItem } from '../../models/UI-sidebar-chat-item';
import { ChatService } from '../../services/chat.service';
import { ChatSidebarListResponse } from '../../models/Chat-sidebar-response';
import { ChatSignalRService } from '../../services/ChatSignalR.service'; // Import SignalR Service
import { GetMessageDTO } from '../../models/get-message-DTo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ChatList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ChatList.html',
  styleUrls: ['./ChatList.css'],
})
export class ChatList {
  @Output() chatSelected = new EventEmitter<UISidebarChatItem>();

  chats: UISidebarChatItem[] = [];
  private signalRSub?: Subscription;

  constructor(private chatService: ChatService , private signalRService: ChatSignalRService ) {}

  ngOnInit(): void {
    this.loadChatList();
   this.subscribeToRealtimeMessages();
  }
    ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
  }
    loadChatList(): void {
    console.log('⏳ ChatList: Fetching sidebar data...');

    this.chatService.getChatSidebar().subscribe({
      next: (response: ChatSidebarListResponse) => {
        console.log('📩 ChatList: Raw Response received:', response);

        if (response.isSuccess) {
          console.log(' ChatList: Backend indicates success.');

          
          this.chats = response.chatBarList.map((item) => ({
            ...item, 
            
              lastMessgeContet: item.isLastMessageFromMe 
          ? `You: ${item.lastMessgeContet}` 
          : item.lastMessgeContet,

            isActive: false, 
            
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.otherUserName)}&background=random&color=fff`,
            
            lastMessageDate: item.lastMessageDate ? new Date(item.lastMessageDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
          }));

          console.log(' ChatList: UI List initialized:', this.chats);
        } else {
          console.warn(' ChatList: Backend returned failure:', response.message);
        }
      },
      error: (err) => {
        console.error('ChatList: HTTP Error fetching sidebar:', err);
      }
    });
  }
  private subscribeToRealtimeMessages(): void {
    this.signalRSub = this.signalRService.messageReceived.subscribe(
      (message: GetMessageDTO) => {
        console.log(' List received update for:', message.senderId);

        const existingChatIndex = this.chats.findIndex(
          (c) => c.otherUserID === message.senderId
        );

        if (existingChatIndex !== -1) {
          
          const chat = this.chats[existingChatIndex];
          
          chat.lastMessgeContet = message.content;
          
          chat.lastMessageDate = new Date(message.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          if (!chat.isActive) {
            chat.unreadCount++;
          }

          this.chats.splice(existingChatIndex, 1);
          this.chats.unshift(chat);

        } 
        
        else {
          console.log('New user messaged! Reloading list to get Name/Avatar...');

          this.loadChatList();
        }
      }
    );
  }
  
selectChat(selectedChat: UISidebarChatItem): void {
    
  
    if (selectedChat.unreadCount > 0) {
      console.log(` Marking conversation with ${selectedChat.otherUserName} as read...`);
      
      this.chatService.markConversationAsRead(selectedChat.otherUserID).subscribe({
        next: () => {
          console.log(' Server confirmed: Conversation marked as read');
        },
        error: (err) => {
          console.error(' Failed to mark as read:', err);
        }
      });

      selectedChat.unreadCount = 0; 
    }

   
    this.chats.forEach((chat) => (chat.isActive = false));
    selectedChat.isActive = true;
    
    console.log(` ChatList: User selected: ${selectedChat.otherUserName}`);
    this.chatSelected.emit(selectedChat);
  }
}
