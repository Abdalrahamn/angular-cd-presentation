import { SlideData } from '../../models/slide.interface';

export const justAngularDirtyMarkingSlides: SlideData[] = [
  {
    id: 'component-dirty-marking',
    title: 'Component Dirty Marking',
    subtitle: 'How Angular Knows What Changed',
    content: [
      {
        type: 'text',
        content:
          'Angular has a sophisticated system for marking components as "dirty" when it knows something inside the component has changed.',
      },
      {
        type: 'highlight',
        content:
          'Dirty marking helps Angular optimize change detection by focusing on components that actually changed.',
      },
      {
        type: 'bullet',
        content: 'Things that mark components as dirty:',
        subItems: [
          'Events (click, mouseover, keyup, etc.)',
          'Changed inputs (@Input properties - immutable)',
          'Output emissions (@Output events)',
          'A value is consumed by an async pipe',
          'A state change of a @defer block',
          'A direct call to ChangeDetectorRef.markForCheck()',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Component Dirty Marking Examples',
      code: `// 1. Events automatically mark components dirty
@Component({
  template: \`
    <button (click)="handleClick()">Click Me</button>
    <p>{{ counter }}</p>
  \`
})
export class EventComponent {
  counter = 0;
  
  handleClick() {
    this.counter++; // Component automatically marked dirty
  }
}

// 2. Input changes mark components dirty (OnPush)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>User: {{ user.name }}</p>\`
})
export class OnPushComponent {
  @Input() user!: User;
  
  // Only triggers if user reference changes
  // user = { ...user, name: 'New Name' }; Works
  // user.name = 'New Name'; Won't trigger
}

// 3. Async pipe marks components dirty
@Component({
  template: \`<p>Data: {{ data$ | async }}</p>\`
})
export class AsyncComponent {
  data$ = this.service.getData(); // Automatically marks dirty on emission
}

// 4. Manual marking
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  
  updateData() {
    // Do something that doesn't automatically mark dirty
    this.cdr.markForCheck(); // Manual dirty marking
  }
}`,
      explanation:
        'Angular uses multiple strategies to detect when components need to be checked.',
    },
  },
  {
    id: 'event-dirty-marking',
    title: 'Event-Based Dirty Marking',
    subtitle: 'How Click Events Mark Components Dirty',
    content: [
      {
        type: 'text',
        content:
          'Every time we click a button with a listener in the template, Angular wraps the callback function with a special function.',
      },
      {
        type: 'bullet',
        content: 'The complete flow from user click to DOM update:',
        subItems: [
          '1. User clicks button → Browser fires native click event',
          '2. Angular calls wrapListenerIn_markDirtyAndPreventDefault()',
          '3. This wrapper calls your changeName() method',
          '4. After your method completes, markViewDirty() is called',
          '5. markViewDirty() traverses up the component tree',
          '6. NgZone detects microtask completion',
          '7. Angular runs tick() method',
          '8. Change detection checks all dirty components',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Angular Internal Event Wrapper',
      code: `// What Angular does internally when you write (click)="changeName()"
function wrapListener(): EventListener {
  return function wrapListenerIn_markDirtyAndPreventDefault(e: any) {
    // 1. Prevent default if needed
    if (shouldPreventDefault) {
      e.preventDefault();
    }
    
    // 2. Call your actual method
    const result = changeName(); // Your component method
    
    // 3. Mark the component as dirty
    markViewDirty(startView); // Mark component dirty
    
    // 4. Return result
    return result;
  };
}

// The markViewDirty function (simplified)
export function markViewDirty(lView: LView): LView | null {
  // Set the dirty flag on the current view
  lView[FLAGS] |= LViewFlags.Dirty;
  
  // Get parent view reference
  const parent = getLViewParent(lView);
  
  // Stop if we reach an unattached root view
  if (isRootView(lView) && !parent) {
    return lView;
  }
  
  // Move to parent view
  lView = parent!;
  
  // Continue marking parents dirty
  return markViewDirty(lView);
}

// Your component code (what you write)
@Component({
  template: \`
    <button (click)="changeName()">Change name</button>
    <p>{{ name }}</p>
  \`
})
export class AppComponent {
  name = 'Mohamed';

  changeName() {
    this.name = 'Ali'; // This gets wrapped automatically
  }
}`,
      explanation:
        'Angular automatically wraps event listeners to mark components as dirty when events fire. The function name even tells us what it does: wrapListenerIn_markDirtyAndPreventDefault!',
    },
  },
  {
    id: 'input-dirty-marking',
    title: 'Input Change Dirty Marking',
    subtitle: 'How @Input Changes Mark Components Dirty',
    content: [
      {
        type: 'text',
        content:
          'While running change detection, Angular checks if input values of components have changed using strict equality (===). If changed, it marks the component as dirty.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Input Change Detection',
      code: `setInput(name: string, value: unknown): void {
  // Do not set the input if it is the same as the last value
  if (Object.is(this.previousInputValues.get(name), value)) {
    return;
  }
  // code removed for brevity
  setInputsForProperty(lView[TVIEW], lView, dataValue, name, value);
  markViewDirty(childComponentLView); // mark the component as dirty
}`,
      explanation:
        'Angular uses Object.is() (strict equality) to check if inputs changed. Only when they actually change does it mark the component dirty.',
    },
  },
  {
    id: 'output-dirty-marking',
    title: 'Output Emission Dirty Marking',
    subtitle: 'How @Output Events Mark Components Dirty',
    content: [
      {
        type: 'text',
        content:
          'To listen to output emissions in Angular, we register an event in the template. The callback function gets wrapped just like regular events, so when the output is emitted, the component is marked as dirty.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Output Event Example',
      code: `// Child component
@Component({
  template: '<button (click)="onClick()">Click me</button>'
})
export class ChildComponent {
  @Output() buttonClick = new EventEmitter<void>();
  
  onClick() {
    this.buttonClick.emit(); // This will mark parent as dirty
  }
}

// Parent component template
<app-child (buttonClick)="handleClick()"></app-child>`,
      explanation:
        "When the child emits an event, the parent's event handler is wrapped and marks the parent component as dirty.",
    },
  },
  {
    id: 'markviewdirty-function',
    title: 'The markViewDirty Function',
    subtitle: 'Marking Current View and All Ancestors Dirty',
    content: [
      {
        type: 'text',
        content:
          "Let's examine what the markViewDirty function actually does when a component needs to be marked as dirty.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'markViewDirty Implementation',
      code: `/**
 * Marks current view and all ancestors dirty.
 */
export function markViewDirty(lView: LView): LView|null {
  while (lView) {
    lView[FLAGS] |= LViewFlags.Dirty;
    const parent = getLViewParent(lView);
    // Stop traversing if we reach a component that is detached from CD tree
    if (isRootView(lView) && !viewAttachedToChangeDetector(lView)) {
      break;
    }
    lView = parent;
  }
  return lView;
}`,
      explanation:
        'This function marks the current component AND all its ancestors as dirty, ensuring change detection will check the entire path from root to the changed component.',
    },
    diagram: {
      type: 'dirty-marking-flow',
      title: 'Component Dirty Marking Process',
      animated: false,
    },
  },
  {
    id: 'traditional-change-detection-flow',
    title: 'Traditional Change Detection Flow',
    subtitle: 'How Zone.js Triggers Full Tree Checking',
    content: [
      {
        type: 'text',
        content:
          'In traditional Angular change detection, Zone.js triggers a full component tree check every time any asynchronous operation completes.',
      },
      {
        type: 'bullet',
        content: 'The traditional flow:',
        subItems: [
          '1. User interaction or async operation completes',
          '2. Zone.js detects the completion',
          '3. Angular runs change detection on ENTIRE tree',
          '4. Every component is checked, regardless of whether it changed',
          '5. DOM is updated where needed',
        ],
      },
      {
        type: 'highlight',
        content: '⚠️ This can be inefficient for large applications with many components',
      },
    ],
    diagram: {
      type: 'component-tree',
      title: 'Traditional Change Detection - Full Tree Check',
      animated: false,
    },
  },
];
