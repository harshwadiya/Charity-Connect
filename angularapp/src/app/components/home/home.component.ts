import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Quote { text: string; author: string; }
interface Faq { question: string; answer: string; open: boolean; }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('aboutSection') aboutSection!: ElementRef;
  quotes: Quote[] = [
    { text: 'No one has ever become poor by giving.', author: 'Anne Frank' },
    { text: 'We make a living by what we get, but we make a life by what we give.', author: 'Winston Churchill' },
    { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
    { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
    { text: 'Giving is not just about making a donation. It is about making a difference.', author: 'Kathy Calvin' },
    { text: 'Alone we can do so little, together we can do so much.', author: 'Helen Keller' },
    { text: 'The meaning of life is to find your gift. Purpose is to give it away.', author: 'Pablo Picasso' },
    { text: 'Kindness is a language which the deaf can hear and the blind can see.', author: 'Mark Twain' },
    { text: 'If you can\'t feed a hundred people, then feed just one.', author: 'Mother Teresa' },
    { text: 'It is not how much we give, but how much love we put into giving.', author: 'Mother Teresa' },
    { text: 'Charity begins at home, but should not end there.', author: 'Thomas Fuller' },
    { text: 'We rise by lifting others.', author: 'Robert Ingersoll' },
    { text: 'Happiness doesn\'t result from what we get, but from what we give.', author: 'Ben Carson' },
    { text: 'The greatest gift you can give someone is your time.', author: 'Rick Warren' },
    { text: 'Do your little bit of good where you are.', author: 'Desmond Tutu' },
    { text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
    { text: 'The value of a man resides in what he gives, not in what he receives.', author: 'Albert Einstein' }
  ];

  currentQuote: Quote = this.quotes[0];
  quoteIndex: number = 0;
  fadeState: string = 'in';
  private quoteInterval: any;

  // ===== FAQ Accordion =====
  faqs: Faq[] = [
    {
      question: 'How do I make a donation?',
      answer: 'Simply register or log in as a User, browse the active charities on the Charities page, click the "Donate" button on any charity, enter your amount, and confirm. Your donation is recorded instantly and visible in "My Donations".',
      open: false
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use RSA encryption for password transport, BCrypt hashing for storage, and JWT authentication for every request. Your sensitive data is never exposed in plain text.',
      open: false
    },
    {
      question: 'Can I track where my donations go?',
      answer: 'Yes! Every donation is linked to a specific charity. You can view full charity details including the founder, description, and status directly from your "My Donations" page.',
      open: false
    },
    {
      question: 'How do I know a charity is legitimate?',
      answer: 'All charities on Charity Connect are added and verified by our administrators. Each charity displays its status (Active/Inactive), founder, and a detailed description so you can give with confidence.',
      open: false
    },
    {
      question: 'Can I leave feedback about the platform?',
      answer: 'Of course. As a registered user, head to "Post Feedback" from the menu to share your experience. You can also view and manage all your submitted feedback anytime.',
      open: false
    },
    {
      question: 'Do I need an account to donate?',
      answer: 'Yes, you need to register and log in as a User to make donations. This ensures your contributions are securely tracked, gives you access to your donation history, and lets you receive updates about the causes you support.',
      open: false
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.startQuoteRotation();
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'about') {
        setTimeout(() => this.scrollToAbout(), 200);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.quoteInterval) clearInterval(this.quoteInterval);
  }

  startQuoteRotation(): void {
    this.quoteInterval = setInterval(() => {
      this.fadeState = 'out';
      setTimeout(() => {
        this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
        this.currentQuote = this.quotes[this.quoteIndex];
        this.fadeState = 'in';
      }, 500);
    }, 6000); 
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  scrollToAbout(): void {
    if (this.aboutSection) {
      this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

