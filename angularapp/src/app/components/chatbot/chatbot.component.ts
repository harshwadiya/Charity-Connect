import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotService } from '../../services/chatbot.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  source?: 'local' | 'ai';
  route?: string;
  routeLabel?: string;
  suggestions?: string[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatBody') chatBody!: ElementRef;

  isOpen = false;
  userInput = '';
  isTyping = false;
  aiAvailable = false;

  messages: ChatMessage[] = [];

  // Role detection
  userRole: string = '';
  isLoggedIn = false;

  constructor(
    private chatService: ChatbotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.checkAiStatus();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  detectUserRole(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || localStorage.getItem('userRole');

    this.isLoggedIn = !!token;
    this.userRole = role || '';
  }

  checkAiStatus(): void {
    this.chatService.checkStatus().subscribe({
      next: (res) => this.aiAvailable = res.aiAvailable,
      error: () => this.aiAvailable = false
    });
  }

  getInitialSuggestions(): string[] {
    if (!this.isLoggedIn) {
      return ['Login', 'Register', 'What is CharityConnect?', 'Contact support'];
    }

    if (this.userRole === 'Admin') {
      return ['View charities', 'Add charity', 'View donations', 'View feedback'];
    }

    return ['View charities', 'My donations', 'Give feedback', 'Logout help'];
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.detectUserRole();
      this.resetChat();
      this.checkAiStatus();
    } else {
      this.messages = [];
      this.userInput = '';
      this.isTyping = false;
    }
  }

  resetChat(): void {
    const greeting = this.isLoggedIn
      ? `Hi 👋 I am CharityBot. How can I help you today?`
      : `Hi 👋 Welcome to CharityConnect! Please login or register to donate.`;

    this.messages = [
      {
        text: greeting,
        sender: 'bot',
        source: 'local',
        suggestions: this.getInitialSuggestions()
      }
    ];
  }

  sendSuggestion(suggestion: string): void {
    this.userInput = suggestion;
    this.sendMessage();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isOpen = false;
    this.messages = [];
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ text: text, sender: 'user' });
    this.userInput = '';

    const localReply = this.getLocalReply(text.toLowerCase());

    if (localReply) {
      this.isTyping = true;
      setTimeout(() => {
        this.messages.push({
          text: localReply.text,
          sender: 'bot',
          source: 'local',
          route: localReply.route,
          routeLabel: localReply.routeLabel,
          suggestions: localReply.suggestions
        });
        this.isTyping = false;
      }, 500);
      return;
    }

    if (this.aiAvailable) {
      this.isTyping = true;

      this.chatService.askBot(text).subscribe({
        next: (res) => {
          this.isTyping = false;

          if (res.aiAvailable && res.reply) {
            this.messages.push({
              text: res.reply,
              sender: 'bot',
              source: 'ai',
              suggestions: this.getInitialSuggestions()
            });
          } else {
            this.aiAvailable = false;
            this.pushFallback();
          }
        },
        error: () => {
          this.isTyping = false;
          this.aiAvailable = false;
          this.pushFallback();
        }
      });
    } else {
      setTimeout(() => this.pushFallback(), 500);
    }
  }

  pushFallback(): void {
    this.messages.push({
      text: "I'm in offline mode. Try one of these:",
      sender: 'bot',
      source: 'local',
      suggestions: this.getInitialSuggestions()
    });
  }

  scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch {}
  }

  getLocalReply(msg: string): {
    text: string,
    route?: string,
    routeLabel?: string,
    suggestions?: string[]
  } | null {

    const isAdmin = this.userRole === 'Admin';
    const isUser = this.userRole === 'User';

    // ============================
    // GREETINGS
    // ============================
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return {
        text: 'Hello! Welcome to CharityConnect 😊 What would you like to do?',
        suggestions: this.getInitialSuggestions()
      };
    }

    // ============================
    // AUTH (Public)
    // ============================
    if (!this.isLoggedIn && (msg.includes('login') || msg.includes('log in') || msg.includes('sign in'))) {
      return {
        text: 'Sign in to access your CharityConnect account.',
        route: '/login',
        routeLabel: 'Login Now',
        suggestions: ['Register', 'Forgot password?']
      };
    }

    if (msg.includes('register') || msg.includes('sign up') || msg.includes('signup') || msg.includes('create account')) {
      return {
        text: 'Create a new CharityConnect account to start donating.',
        route: '/register',
        routeLabel: 'Register',
        suggestions: ['Login', 'What is CharityConnect?']
      };
    }

    if (msg.includes('logout') || msg.includes('log out') || msg.includes('sign out')) {
      return {
        text: 'You can logout from the navigation bar at the top.',
        suggestions: this.getInitialSuggestions()
      };
    }

    // ============================
    // ADMIN ROUTES
    // ============================
    if (isAdmin) {

      if (msg.includes('dashboard')) {
        return {
          text: 'Open your admin dashboard to manage everything.',
          route: '/admin/dashboard',
          routeLabel: 'Admin Dashboard',
          suggestions: ['View charities', 'View donations', 'View feedback']
        };
      }

      if (msg.includes('add charity') || msg.includes('create charity') || msg.includes('new charity')) {
        return {
          text: 'Add a new charity to the platform.',
          route: '/admin/charities/create',
          routeLabel: 'Add Charity',
          suggestions: ['View charities', 'View donations']
        };
      }

      if (msg.includes('edit charity') || msg.includes('update charity')) {
        return {
          text: 'You can edit any charity from the charities list.',
          route: '/admin/charities',
          routeLabel: 'Manage Charities',
          suggestions: ['Add charity', 'View donations']
        };
      }

      if (msg.includes('charity') || msg.includes('charities') || msg.includes('view charities')) {
        return {
          text: 'Manage all charities on the platform.',
          route: '/admin/charities',
          routeLabel: 'Manage Charities',
          suggestions: ['Add charity', 'View donations', 'View feedback']
        };
      }

      if (msg.includes('donation') || msg.includes('view donations')) {
        return {
          text: 'View all donations made on the platform.',
          route: '/admin/donations',
          routeLabel: 'View All Donations',
          suggestions: ['Manage charities', 'View feedback']
        };
      }

      if (msg.includes('feedback') || msg.includes('review') || msg.includes('reviews')) {
        return {
          text: 'View all user feedback and reviews.',
          route: '/admin/feedback',
          routeLabel: 'View Feedback',
          suggestions: ['Manage charities', 'View donations']
        };
      }
    }

    // ============================
    // USER ROUTES
    // ============================
    if (isUser) {

      if (msg.includes('dashboard')) {
        return {
          text: 'Head over to your dashboard.',
          route: '/user/dashboard',
          routeLabel: 'My Dashboard',
          suggestions: ['My donations', 'Give feedback']
        };
      }

      if (msg.includes('donate') || msg.includes('donation') && !msg.includes('my') && !msg.includes('history')) {
        return {
          text: 'Awesome! Browse charities and pick a cause to support 💛',
          route: '/user/charities',
          routeLabel: 'Browse Charities',
          suggestions: ['My donations', 'Give feedback']
        };
      }

      if (msg.includes('my donation') || msg.includes('donation history') || msg.includes('history')) {
        return {
          text: 'View all your past contributions here.',
          route: '/user/mydonations',
          routeLabel: 'My Donations',
          suggestions: ['Browse charities', 'Give feedback']
        };
      }

      if (msg.includes('charity') || msg.includes('charities') || msg.includes('view charities') || msg.includes('browse')) {
        return {
          text: 'Explore all active charities and donate to any cause 💛',
          route: '/user/charities',
          routeLabel: 'Browse Charities',
          suggestions: ['My donations', 'Give feedback']
        };
      }

      if (msg.includes('add feedback') || msg.includes('give feedback') || msg.includes('write feedback') || msg.includes('review')) {
        return {
          text: 'Share your experience with us!',
          route: '/user/feedback/add',
          routeLabel: 'Give Feedback',
          suggestions: ['View feedback', 'Browse charities']
        };
      }

      if (msg.includes('feedback')) {
        return {
          text: 'View all feedback from users.',
          route: '/user/feedback',
          routeLabel: 'View Feedback',
          suggestions: ['Give feedback', 'Browse charities']
        };
      }
    }

    // ============================
    // GENERIC (works for anyone)
    // ============================
    if (msg.includes('donate') || msg.includes('donation')) {
      if (!this.isLoggedIn) {
        return {
          text: 'Please login first to make a donation.',
          route: '/login',
          routeLabel: 'Login to Donate',
          suggestions: ['Register', 'What is CharityConnect?']
        };
      }
    }

    if (msg.includes('contact') || msg.includes('help') || msg.includes('support') || msg.includes('email')) {
      return {
        text: '📧 Reach us at support@charityconnect.com — we usually respond within 24 hours.',
        suggestions: this.getInitialSuggestions()
      };
    }

    if (msg.includes('forgot') || msg.includes('reset password')) {
      return {
        text: 'You can reset your password from the login page.',
        route: '/login',
        routeLabel: 'Go to Login',
        suggestions: ['Register', 'Contact support']
      };
    }

    if (msg.includes('what is') || msg.includes('about') || msg.includes('mission')) {
      return {
        text: '💛 CharityConnect is a platform that connects generous donors with meaningful charities. Admins manage causes, users donate and share feedback.',
        suggestions: this.getInitialSuggestions()
      };
    }

    if (msg.includes('how does it work') || msg.includes('how it works')) {
      return {
        text: 'Simple! Register → Browse charities → Donate securely → Track your impact 💛',
        route: this.isLoggedIn ? '/user/charities' : '/register',
        routeLabel: this.isLoggedIn ? 'Browse Charities' : 'Get Started',
        suggestions: this.getInitialSuggestions()
      };
    }

    if (msg.includes('thank')) {
      return {
        text: 'You are most welcome! 💛',
        suggestions: this.getInitialSuggestions()
      };
    }

    if (msg.includes('bye') || msg.includes('goodbye')) {
      return { text: 'Goodbye! Have a wonderful day 🌟' };
    }

    if (msg.includes('who are you') || msg.includes('your name')) {
      return {
        text: 'I am CharityBot 🤖 — your assistant for CharityConnect.',
        suggestions: this.getInitialSuggestions()
      };
    }

    return null;
  }
}