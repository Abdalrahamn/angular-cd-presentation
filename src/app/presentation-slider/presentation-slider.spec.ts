import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PresentationSlider } from './presentation-slider';

describe('PresentationSlider', () => {
  let component: PresentationSlider;
  let fixture: ComponentFixture<PresentationSlider>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({ slideNumber: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [PresentationSlider],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.currentSlideIndex()).toBe(0);
      expect(component.isPlaying()).toBe(false);
      expect(component.isPaused()).toBe(false);
    });

    it('should have presentation data loaded', () => {
      expect(component.presentation).toBeDefined();
      expect(component.presentation.slides.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Functions', () => {
    it('should navigate to next slide when canGoNext is true', () => {
      component.currentSlideIndex.set(0);
      const initialIndex = component.currentSlideIndex();
      
      component.nextSlide();
      
      // Wait for the timeout in nextSlide
      setTimeout(() => {
        expect(component.currentSlideIndex()).toBe(initialIndex + 1);
        expect(mockRouter.navigate).toHaveBeenCalled();
      }, 350);
    });

    it('should navigate to previous slide when canGoPrevious is true', () => {
      component.currentSlideIndex.set(5);
      const initialIndex = component.currentSlideIndex();
      
      component.previousSlide();
      
      // Wait for the timeout in previousSlide
      setTimeout(() => {
        expect(component.currentSlideIndex()).toBe(initialIndex - 1);
        expect(mockRouter.navigate).toHaveBeenCalled();
      }, 350);
    });

    it('should not navigate beyond last slide', () => {
      const lastSlideIndex = component.totalSlides() - 1;
      component.currentSlideIndex.set(lastSlideIndex);
      
      expect(component.canGoNext()).toBe(false);
    });

    it('should not navigate before first slide', () => {
      component.currentSlideIndex.set(0);
      
      expect(component.canGoPrevious()).toBe(false);
    });

    it('should go to specific slide index', () => {
      const targetIndex = 3;
      
      component.goToSlide(targetIndex);
      
      setTimeout(() => {
        expect(component.currentSlideIndex()).toBe(targetIndex);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/slide', targetIndex + 1], { replaceUrl: true });
      }, 350);
    });
  });

  describe('Computed Properties', () => {
    it('should calculate progress percentage correctly', () => {
      component.currentSlideIndex.set(0);
      const expectedProgress = (1 / component.totalSlides()) * 100;
      expect(component.progressPercentage()).toBe(expectedProgress);
    });

    it('should format slide number correctly', () => {
      component.currentSlideIndex.set(2);
      expect(component.slideNumber()).toBe(`3 / ${component.totalSlides()}`);
    });

    it('should return current slide data', () => {
      component.currentSlideIndex.set(0);
      const currentSlide = component.currentSlide();
      expect(currentSlide).toBeDefined();
      expect(currentSlide.id).toBeDefined();
    });
  });

  describe('Auto-play Functionality', () => {
    it('should start auto-play', () => {
      component.startAutoPlay();
      expect(component.isPlaying()).toBe(true);
    });

    it('should pause auto-play', () => {
      component.startAutoPlay();
      component.pauseAutoPlay();
      
      expect(component.isPlaying()).toBe(false);
      expect(component.isPaused()).toBe(true);
    });

    it('should toggle auto-play state', () => {
      expect(component.isPlaying()).toBe(false);
      
      component.toggleAutoPlay();
      expect(component.isPlaying()).toBe(true);
      
      component.toggleAutoPlay();
      expect(component.isPlaying()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle right arrow key for next slide', () => {
      spyOn(component, 'nextSlide');
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.handleKeyDown(event);
      
      expect(component.nextSlide).toHaveBeenCalled();
    });

    it('should handle left arrow key for previous slide', () => {
      spyOn(component, 'previousSlide');
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.handleKeyDown(event);
      
      expect(component.previousSlide).toHaveBeenCalled();
    });

    it('should handle spacebar for next slide', () => {
      spyOn(component, 'nextSlide');
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.handleKeyDown(event);
      
      expect(component.nextSlide).toHaveBeenCalled();
    });

    it('should handle escape key for fullscreen toggle', () => {
      spyOn(component, 'toggleFullscreen');
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleKeyDown(event);
      
      expect(component.toggleFullscreen).toHaveBeenCalled();
    });

    it('should handle R key for reset', () => {
      spyOn(component, 'resetPresentation');
      
      const event = new KeyboardEvent('keydown', { key: 'R' });
      component.handleKeyDown(event);
      
      expect(component.resetPresentation).toHaveBeenCalled();
    });
  });

  describe('Memes Finale Slide', () => {
    it('should include the memes finale slide', () => {
      const memesSlide = component.presentation.slides.find(
        slide => slide.id === 'angular-memes-finale'
      );
      
      expect(memesSlide).toBeDefined();
      expect(memesSlide?.title).toBe('The End: Angular Change Detection Memes! 😂');
    });

    it('should have image content types in the memes slide', () => {
      const memesSlide = component.presentation.slides.find(
        slide => slide.id === 'angular-memes-finale'
      );
      
      const imageContents = memesSlide?.content.filter(
        content => content.type === 'image'
      );
      
      expect(imageContents).toBeDefined();
      expect(imageContents?.length).toBeGreaterThan(0);
    });

    it('should navigate to memes finale slide', () => {
      const memesSlideIndex = component.presentation.slides.findIndex(
        slide => slide.id === 'angular-memes-finale'
      );
      
      expect(memesSlideIndex).toBeGreaterThan(-1);
      
      component.goToSlide(memesSlideIndex);
      
      setTimeout(() => {
        expect(component.currentSlideIndex()).toBe(memesSlideIndex);
        const currentSlide = component.currentSlide();
        expect(currentSlide.id).toBe('angular-memes-finale');
      }, 350);
    });
  });

  describe('URL Navigation', () => {
    it('should handle route parameter changes', () => {
      mockActivatedRoute.params = of({ slideNumber: '5' });
      
      // Trigger ngOnInit again to test route subscription
      component.ngOnInit();
      
      expect(component.currentSlideIndex()).toBe(4); // 0-based index
    });

    it('should redirect to slide 1 for invalid slide numbers', () => {
      mockActivatedRoute.params = of({ slideNumber: '999' });
      
      component.ngOnInit();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/slide/1'], { replaceUrl: true });
    });
  });

  describe('Fullscreen and Reset', () => {
    it('should reset presentation to first slide', () => {
      component.currentSlideIndex.set(5);
      
      component.resetPresentation();
      
      setTimeout(() => {
        expect(component.currentSlideIndex()).toBe(0);
      }, 350);
    });

    it('should handle fullscreen toggle', () => {
      // Mock document.fullscreenElement
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        writable: true
      });
      
      spyOn(document.documentElement, 'requestFullscreen');
      
      component.toggleFullscreen();
      
      expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    });
  });
});
