import { SlideData } from '../../models/slide.interface';

export const angularJSDigestSlides: SlideData[] = [
  {
    id: 'angularjs-introduction',
    title: 'AngularJS (1.x): The Foundation',
    subtitle: 'Where Change Detection Began (2010-2016)',
    content: [
      {
        type: 'text',
        content:
          "Before AngularJS, developers manually updated the DOM using jQuery or plain JavaScript.<br>AngularJS introduced <strong>automatic change detection</strong> with the <strong>digest cycle</strong>, making data updates easier and laying the foundation for modern Angular's reactive system.",
      },
      {
        type: 'highlight',
        content: '🏛️ AngularJS: The pioneer of automatic change detection in JavaScript',
      },
      {
        type: 'table',
        content: 'jQuery/JS vs AngularJS Comparison',
        tableData: {
          headers: ['Task', 'jQuery / JS', 'AngularJS'],
          rows: [
            ['Initialize value', 'Manually set text', 'Done automatically with binding'],
            ['Update value', 'You must call `.text()` or `.html()`', 'Done automatically'],
            [
              'Detect change',
              'You must write event handlers',
              'Done automatically by digest cycle',
            ],
            ['Data binding', 'One-way (manual)', 'Two-way (automatic)'],
            ['DOM updates', 'Manual and repetitive', 'Automatic and reactive'],
          ],
        },
      },
      {
        type: 'bullet',
        content: 'Key AngularJS concepts:',
        subItems: [
          'Digest cycle - systematic change detection process',
          '$watch functions - monitoring scope variables',
          'Dirty checking - comparing old vs new values',
          'Two-way data binding - automatic model-view sync',
          'Performance rule: 2000+ watchers = problems',
        ],
      },
      {
        type: 'table',
        content: 'AngularJS Core Concepts',
        tableData: {
          headers: ['Concept', 'Description', 'Key Role'],
          rows: [
            ['$scope', 'Connects controller & view', 'Holds app data'],
            ['$watch()', 'Observes variable changes', 'Detects updates'],
            ['Digest Cycle', 'Core of change detection', 'Runs checks'],
            ['Dirty Checking', 'Compares old vs new values', 'Finds differences'],
            ['Two-way Binding', 'Syncs model & view', 'Keeps UI updated'],
            ['Scope Hierarchy', 'Nested scopes', 'Enables inheritance'],
            ['Performance Limit', '2000+ watchers = slow', 'Affects speed'],
          ],
        },
      },
    ],
    codeExample: {
      language: 'javascript',
      title: 'AngularJS Digest Cycle Example',
      code: `// AngularJS Controller
function MyController($scope) {
  $scope.name = 'John';
  
  // Watch for changes
  $scope.$watch('name', function(newValue, oldValue) {
    console.log('Name changed:', newValue);
  });
  
  // Method that triggers digest cycle
  $scope.updateName = function() {
    $scope.name = 'Jane'; // Triggers digest cycle
  };
}

// What happens internally:
// 1. User interaction (click, HTTP, timer)
// 2. AngularJS starts digest cycle
// 3. Checks ALL $watch expressions
// 4. Compares old vs new values (dirty checking)
// 5. Updates DOM if changes found
// 6. Repeats until no changes (max 10 times)`,
      explanation:
        'Every user interaction triggered a digest cycle that checked ALL watchers - simple but potentially slow.',
    },
    diagram: {
      type: 'angularjs-overview',
      title: 'AngularJS Architecture',
      animated: false,
    },
  },
];
