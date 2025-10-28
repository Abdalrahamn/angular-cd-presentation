import { SlideData } from '../../models/slide.interface';

export const justAngularEnhancedSlides: SlideData[] = [
  {
    id: 'angular2-revolution',
    title: 'Angular 2: The Great Revolution (2016)',
    subtitle: 'From AngularJS Digest Cycle to Zone.js Component Tree',
    content: [
      {
        type: 'text',
        content:
          "After learning from AngularJS's limitations, Google completely rewrote Angular from the ground up. Angular 2 introduced a revolutionary new approach to change detection that solved the performance problems of the digest cycle.",
      },
      {
        type: 'highlight',
        content: '🔄 Angular 2: Complete rewrite with lessons learned from AngularJS',
      },
      {
        type: 'comparison',
        content: 'AngularJS vs Angular 2+ Change Detection',
        comparison: {
          before:
            'AngularJS (1.x):<br>• Digest cycle with dirty checking<br>• $watch functions everywhere<br>• Performance degrades with watchers<br>• Unpredictable update cycles<br>• Memory leaks with forgotten watchers',
          after:
            'Angular 2+:<br>• Zone.js monkey patching<br>• Component tree traversal<br>• Predictable performance<br>• Unidirectional data flow<br>• Automatic cleanup and optimization',
        },
      },
      {
        type: 'timeline',
        content: 'Angular Evolution Timeline:',
        subItems: [
          '2010-2016: AngularJS - Digest cycle era',
          '2016: Angular 2 - Zone.js revolution',
          '2017: Angular 4 - OnPush strategy',
          '2020: Angular 9 - Ivy renderer',
          '2022: Angular 14 - Signals preview',
          '2023: Angular 16-17 - Stable Signals',
          '2024: Angular 18-19 - Zoneless experimental',
          '2025: Angular 20 - Zoneless STABLE! 🎉',
        ],
      },
    ],
    diagram: {
      type: 'angularjs-to-angular-evolution',
      title: 'The Great Angular Revolution',
      animated: false,
    },
  },
  {
    id: 'synchronous-change-detection',
    title: 'Change Detection with Synchronous Code',
    subtitle: 'The Simple Case That Works',
    content: [
      {
        type: 'text',
        content:
          "Let's start with a simple example where everything works perfectly because it's synchronous.",
      },
      {
        type: 'code-demo',
        content: 'Simple synchronous example',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Simple Synchronous Change Detection',
      code: `@Component({
  template: \`
    <button (click)="changeName()">Change name</button>
    <p>{{ name }}</p>
  \`
})
export class AppComponent {
  name = 'John';

  changeName() {
    this.name = 'Jane';
  }
}`,
      explanation:
        'When we click the button, the changeName method is called, and because everything is wrapped by Angular, we can safely assume that after the name is changed, Angular can run some code to update the view.',
    },
  },
  {
    id: 'imaginary-angular-code',
    title: 'Imaginary Under-the-Hood Angular Code',
    subtitle: 'How Angular handles synchronous updates',
    codeExample: {
      language: 'typescript',
      title: 'Imaginary Angular Internal Process',
      code: `// ⚠️ Imaginary under the hood Angular code:
component.changeName();

// This code is run after changeName completes
// Angular will run change detection for the whole component tree
// because we may have updated some data in a service 
// that is used by other components
angular.runChangeDetection();`,
      explanation:
        'This works fine for synchronous code! Angular can reliably run change detection after the event handler completes.',
    },
    content: [
      {
        type: 'highlight',
        content: 'This works perfectly for synchronous operations!',
      },
      {
        type: 'text',
        content:
          "But most of the time when we change data, we don't do it synchronously. We usually make HTTP requests, use timers, or wait for other events before updating data. And that's where problems start.",
      },
    ],
  },
  {
    id: 'asynchronous-problems',
    title: 'Change Detection with Asynchronous Code',
    subtitle: 'Where Things Break Down',
    content: [
      {
        type: 'text',
        content:
          "Now let's see what happens when we introduce asynchronous operations like setTimeout.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Asynchronous Change Detection Problem',
      code: `@Component({
  template: \`
    <button (click)="changeName()">Change name</button>
    <p>{{ name }}</p>
  \`
})
export class AppComponent {
  name = 'John';

  changeName() {
    setTimeout(() => {
      this.name = 'Jane';
    }, 1000);
  }
}`,
      explanation:
        'When we click the button, changeName is called and setTimeout is scheduled. But the callback runs AFTER Angular has already run change detection!',
    },
    diagram: {
      type: 'async-problem-demo',
      title: 'Asynchronous Code Execution Timeline',
      animated: false,
    },
  },
  {
    id: 'async-problem-explanation',
    title: 'Why Asynchronous Code Breaks Change Detection',
    subtitle: 'The Call Stack Problem',
    codeExample: {
      language: 'typescript',
      title: 'The Timing Problem',
      code: `// ⚠️ Imaginary under the hood Angular code:
component.changeName(); // uses setTimeout inside

// This code runs immediately after changeName method is called
angular.runChangeDetection(); // But name hasn't changed yet!

// Later, after 1 second:
// setTimeout callback executes and changes the name
// But Angular doesn't know about it!`,
      explanation:
        "Because of the call stack, the setTimeout callback runs AFTER angular.runChangeDetection(). So Angular ran change detection but the name wasn't changed yet. The view won't update - broken application! 💥",
    },
    content: [
      {
        type: 'highlight',
        content: "💥 This would result in a broken application where the UI doesn't update!",
      },
      {
        type: 'text',
        content: 'Fortunately, Angular has a solution: Zone.js',
      },
    ],
  },
  {
    id: 'zonejs-rescue',
    title: 'Zone.js to the Rescue',
    subtitle: 'Monkey Patching Browser APIs',
    content: [
      {
        type: 'text',
        content:
          "Zone.js has been around since the early days of Angular 2.0. It's a library that monkey patches browser APIs and enables us to hook into the lifecycle of browser events.",
      },
      {
        type: 'highlight',
        content: 'Zone.js monkey patches browser APIs to hook into asynchronous operations',
      },
      {
        type: 'text',
        content:
          'What does monkey patching mean? It means we can run our code before and after browser events like setTimeout, Promise.then, event listeners, etc.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'How Zone.js Works',
      code: `// Normal setTimeout
setTimeout(() => {
  console.log('Hello world');
}, 1000);

// With Zone.js, we can hook into this:
const zone = Zone.current.fork({
  onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
    console.log('Before setTimeout');
    delegate.invokeTask(target, task, applyThis, applyArgs);
    console.log('After setTimeout');
  }
});

zone.run(() => {
  setTimeout(() => {
    console.log('Hello world');
  }, 1000);
});

// Output:
// Before setTimeout
// Hello world  
// After setTimeout`,
      explanation:
        'Zone.js creates a zone that can intercept and wrap asynchronous operations, allowing Angular to know when they complete.',
    },
  },
  {
    id: 'zonejs-angular-integration',
    title: 'Zone.js + Angular Integration',
    subtitle: 'NgZone and Automatic Change Detection',
    content: [
      {
        type: 'text',
        content:
          'Angular loads zone.js by default in every application and creates a zone called NgZone. NgZone includes an Observable called onMicrotaskEmpty that emits when there are no more microtasks in the queue.',
      },
      {
        type: 'highlight',
        content: 'NgZone.onMicrotaskEmpty tells Angular when all async operations are complete',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'NgZone Change Detection Scheduling',
      code: `// ng_zone_scheduling.ts NgZoneChangeDetectionScheduler
this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
  next: () => this.zone.run(() => this.applicationRef.tick())
});`,
      explanation:
        "Angular subscribes to onMicrotaskEmpty and calls applicationRef.tick() when all async operations complete. The tick() method is Angular's change detection runner.",
    },
  },
  {
    id: 'applicationref-tick',
    title: 'ApplicationRef.tick() - The Change Detection Runner',
    subtitle: 'How Angular Checks All Components',
    codeExample: {
      language: 'typescript',
      title: 'ApplicationRef.tick() Implementation',
      code: `tick(): void {
  // code removed for brevity
  for (let view of this._views) {
    // runs the change detection for a single component
    view.detectChanges(); 
  }
}`,
      explanation:
        'The tick method iterates over all root views (usually just AppComponent) and runs detectChanges() synchronously for each one.',
    },
    content: [
      {
        type: 'text',
        content:
          'Now Angular knows that all asynchronous code has finished running and can safely run change detection for the entire component tree.',
      },
      {
        type: 'highlight',
        content:
          '✅ Problem solved! Asynchronous operations now trigger change detection automatically.',
      },
    ],
    diagram: {
      type: 'zone-flow',
      title: 'Zone.js Change Detection Flow',
      animated: false,
    },
  },
];
