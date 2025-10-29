import {
  Component,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  viewChild,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Slide } from '../slide/slide';
import { completeChangeDetectionPresentation } from '../data/complete-presentation-slides';
import { SlideData } from '../models/slide.interface';

@Component({
  selector: 'app-presentation-slider',
  standalone: true,
  imports: [CommonModule, Slide],
  templateUrl: './presentation-slider.html',
  styleUrl: './presentation-slider.scss',
})
export class PresentationSlider implements OnInit, AfterViewInit, OnDestroy {
  // Inject router and route
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Presentation data
  presentation = completeChangeDetectionPresentation;

  // Signal for current slide index
  currentSlideIndex = signal(0);

  // Signal for presentation state
  isPlaying = signal(false);
  isPaused = signal(false);

  // Computed properties
  currentSlide = computed(() => this.presentation.slides[this.currentSlideIndex()]);

  totalSlides = computed(() => this.presentation.slides.length);

  canGoNext = computed(() => this.currentSlideIndex() < this.totalSlides() - 1);

  canGoPrevious = computed(() => this.currentSlideIndex() > 0);

  progressPercentage = computed(() => ((this.currentSlideIndex() + 1) / this.totalSlides()) * 100);

  slideNumber = computed(() => `${this.currentSlideIndex() + 1} / ${this.totalSlides()}`);

  // View child reference to current slide
  currentSlideRef = viewChild<Slide>('currentSlideRef');

  // Keyboard event handler cleanup
  private keyboardCleanup?: () => void;

  ngOnInit() {
    console.log('PresentationSlider ngOnInit called');
    this.setupKeyboardNavigation();
    this.setupUrlNavigation();

    // More robust slide initialization
    this.initializeSlide();
  }

  ngAfterViewInit() {
    console.log('PresentationSlider ngAfterViewInit called');
    // Ensure slide is shown after view is initialized
    setTimeout(() => {
      console.log('AfterViewInit: attempting to show slide');
      if (this.currentSlideRef()) {
        console.log('AfterViewInit: slide ref available, showing slide');
        this.currentSlideRef()?.show();
      } else {
        console.log('AfterViewInit: slide ref still not available');
      }
    }, 50);
  }

  private initializeSlide() {
    // Try multiple times to ensure slide is shown
    const attempts = [100, 300, 500, 1000];

    attempts.forEach((delay, index) => {
      setTimeout(() => {
        console.log(`Attempt ${index + 1} to show slide, delay: ${delay}ms`);
        console.log('Current slide index:', this.currentSlideIndex());
        console.log('Current slide ref:', this.currentSlideRef());
        console.log('Current slide data:', this.currentSlide());

        if (this.currentSlideRef()) {
          console.log('Slide ref found, calling show()');
          this.currentSlideRef()?.show();
        } else {
          console.log('Slide ref not found yet');
        }
      }, delay);
    });
  }

  ngOnDestroy() {
    // Clean up keyboard event listeners
    if (this.keyboardCleanup) {
      this.keyboardCleanup();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Prevent default behavior for presentation keys
    const presentationKeys = [
      'ArrowRight',
      'ArrowLeft',
      ' ',
      'Escape',
      'r',
      'R',
      'f',
      'F',
      'p',
      'P',
    ];

    if (presentationKeys.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowRight':
      case ' ': // Spacebar
        this.nextSlide();
        break;
      case 'ArrowLeft':
        this.previousSlide();
        break;
      case 'Escape':
        this.toggleFullscreen();
        break;
      case 'r':
      case 'R':
        this.resetPresentation();
        break;
      case 'f':
      case 'F':
        this.toggleFullscreen();
        break;
      case 'p':
      case 'P':
        this.toggleAutoPlay();
        break;
      case 'Home':
        this.goToSlide(0);
        break;
      case 'End':
        this.goToSlide(this.totalSlides() - 1);
        break;
      case 'PageUp':
        this.previousSlide();
        break;
      case 'PageDown':
        this.nextSlide();
        break;
    }
  }

  private setupKeyboardNavigation() {
    // Additional keyboard setup if needed
    console.log('Keyboard shortcuts enabled:');
    console.log('→ or Space: Next slide');
    console.log('←: Previous slide');
    console.log('Home: First slide');
    console.log('End: Last slide');
    console.log('Page Up/Down: Navigate slides');
    console.log('F or Escape: Toggle fullscreen');
    console.log('P: Toggle auto-play');
    console.log('R: Reset presentation');
  }

  private setupSlideVisibility() {
    // Ensure slide is visible when index changes
    setTimeout(() => {
      if (this.currentSlideRef()) {
        console.log('Effect: showing slide');
        this.currentSlideRef()?.show();
      } else {
        console.log('Effect: slide ref not available yet');
      }
    }, 150);
  }

  private setupUrlNavigation() {
    // Listen to route parameter changes
    this.route.params.subscribe((params) => {
      console.log('Route params changed:', params);
      const slideNumber = parseInt(params['slideNumber'], 10);
      console.log('Parsed slide number:', slideNumber);
      if (slideNumber && slideNumber >= 1 && slideNumber <= this.totalSlides()) {
        const slideIndex = slideNumber - 1; // Convert to 0-based index
        console.log('Setting slide index to:', slideIndex);
        if (slideIndex !== this.currentSlideIndex()) {
          this.currentSlideIndex.set(slideIndex);
          this.setupSlideVisibility(); // Ensure slide is visible
          // Scroll to top after slide content is updated
          setTimeout(() => {
            this.scrollToTop();
          }, 200);
        }
      } else {
        console.log('Invalid slide number, redirecting to slide 1');
        // If invalid slide number, redirect to slide 1
        this.router.navigate(['/slide/1'], { replaceUrl: true });
      }
    });
  }

  private updateUrl(slideIndex: number) {
    const slideNumber = slideIndex + 1; // Convert to 1-based index
    this.router.navigate(['/slide', slideNumber], { replaceUrl: true });
  }

  private scrollToTop() {
    // Multiple scroll methods to ensure compatibility
    try {
      // Method 1: Smooth scroll to top of the page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      // Method 2: Also scroll the document element
      document.documentElement.scrollTop = 0;

      // Method 3: Also scroll the body element
      document.body.scrollTop = 0;

      // Method 4: Scroll any slide containers to top
      const slideContainers = document.querySelectorAll(
        '.slide-area, .current-slide, .slide-content, .presentation-container'
      );
      slideContainers.forEach((container) => {
        if (container.scrollTop > 0) {
          container.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }
      });

      // Method 5: Force scroll after a small delay to ensure DOM is updated
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  private scrollActiveThumbnailIntoView() {
    // Scroll the active thumbnail into view in the sidebar
    setTimeout(() => {
      const activeThumbnail = document.querySelector('.thumbnail-btn.active');
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  }

  nextSlide() {
    if (this.canGoNext()) {
      this.currentSlideRef()?.hide();
      setTimeout(() => {
        const newIndex = this.currentSlideIndex() + 1;
        this.currentSlideIndex.set(newIndex);
        this.updateUrl(newIndex);
        this.setupSlideVisibility(); // Ensure slide is visible
        // Scroll to top after slide content is updated
        setTimeout(() => {
          this.scrollToTop();
          this.scrollActiveThumbnailIntoView();
        }, 200);
      }, 300);
    }
  }

  previousSlide() {
    if (this.canGoPrevious()) {
      this.currentSlideRef()?.hide();
      setTimeout(() => {
        const newIndex = this.currentSlideIndex() - 1;
        this.currentSlideIndex.set(newIndex);
        this.updateUrl(newIndex);
        this.setupSlideVisibility(); // Ensure slide is visible
        // Scroll to top after slide content is updated
        setTimeout(() => {
          this.scrollToTop();
          this.scrollActiveThumbnailIntoView();
        }, 200);
      }, 300);
    }
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.totalSlides()) {
      this.currentSlideRef()?.hide();
      setTimeout(() => {
        this.currentSlideIndex.set(index);
        this.updateUrl(index);
        this.setupSlideVisibility(); // Ensure slide is visible
        // Scroll to top after slide content is updated
        setTimeout(() => {
          this.scrollToTop();
          this.scrollActiveThumbnailIntoView();
        }, 200);
      }, 300);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  resetPresentation() {
    this.goToSlide(0);
  }

  startAutoPlay() {
    this.isPlaying.set(true);
    this.autoPlayNext();
  }

  pauseAutoPlay() {
    this.isPlaying.set(false);
    this.isPaused.set(true);
  }

  toggleAutoPlay() {
    if (this.isPlaying()) {
      this.pauseAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  private autoPlayNext() {
    if (this.isPlaying() && this.canGoNext()) {
      setTimeout(() => {
        this.nextSlide();
        this.autoPlayNext();
      }, 5000); // 5 seconds per slide
    } else if (this.isPlaying()) {
      this.isPlaying.set(false); // End of presentation
    }
  }
}
