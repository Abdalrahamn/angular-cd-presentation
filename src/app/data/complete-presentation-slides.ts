import { PresentationData, SlideData } from '../models/slide.interface';

// Keep only OnPush from original slides (most comprehensive)
import { part3OnPushSlides } from '../slides/part3-onpush/part3-slides';

// JustAngular enhanced content (more detailed and technical)
import { justAngularEnhancedSlides } from '../slides/part1-default-strategy/justangular-enhanced-slides';
import { angularJSDigestSlides } from '../slides/part0-angularjs/angularjs-digest-slides';
import { justAngularDirtyMarkingSlides } from '../slides/part2-zone-js/justangular-dirty-marking-slides';
import { justAngularSignalsSlides } from '../slides/part4-signals/justangular-signals-slides';
import { justAngularZonelessSlides } from '../slides/part5-zoneless/justangular-zoneless-slides';

// Intro slide
const introSlide: SlideData = {
  id: 'presentation-intro',
  title: 'The Evolution of Change Detection',
  subtitle: 'From AngularJS to Angular 20: A Complete Journey',
  content: [
    {
      type: 'text',
      content:
        'Welcome to a comprehensive exploration of how change detection has evolved in the Angular ecosystem. This presentation covers the complete journey from AngularJS digest cycles to the cutting-edge zoneless change detection in Angular 20.',
    },
    {
      type: 'highlight',
      content: "🎯 What You'll Learn Today",
    },
    {
      type: 'bullet',
      content: 'Complete Change Detection Evolution:',
      subItems: [
        '🏛️ AngularJS (2010-2016) - Digest cycle foundation',
        '⚡ Angular 2+ (2016) - Zone.js revolution',
        '🔄 OnPush Strategy (2016-present) - Performance optimization',
        '📡 Signals (Angular 16-17, 2023-2024) - Reactive primitives',
        '🚀 Zoneless (Angular 18,19,20+, 2024-present) - The future is here!',
      ],
    },
    {
      type: 'bullet',
      content: 'What Makes This Presentation Special:',
      subItems: [
        '🔴 Live interactive demos for each concept',
        '📊 Visual diagrams showing internal mechanisms',
        '⚡ Performance comparisons and benchmarks',
        '💡 Best practices and migration strategies',
        '🎮 Hands-on examples you can try yourself',
      ],
    },
    {
      type: 'highlight',
      content: "🎉 Ready to master Angular change detection? Let's dive in!",
    },
  ],
};

export const completeChangeDetectionPresentation: PresentationData = {
  title: 'The Evolution of Change Detection: From AngularJS to Angular 20',
  theme: 'angular',
  slides: [
    // Intro slide
    introSlide,

    // Part 0: AngularJS Historical Context (2010-2016)
    ...angularJSDigestSlides,

    // Part 1: Angular 2+ Introduction and Synchronous/Asynchronous Change Detection
    ...justAngularEnhancedSlides,

    // Part 2: Zone.js and Dirty Marking (JustAngular detailed content)
    ...justAngularDirtyMarkingSlides,

    // Part 3: OnPush Strategy (Original comprehensive content)
    ...part3OnPushSlides,

    // Part 4: Signals (Angular 16-20 detailed content + latest APIs)
    ...justAngularSignalsSlides,

    // Part 5: Zoneless Future (Angular 20+ detailed content)
    ...justAngularZonelessSlides,
  ],
};
