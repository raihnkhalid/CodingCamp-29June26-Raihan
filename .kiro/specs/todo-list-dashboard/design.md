# Design Document: To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript. The architecture follows a modular component-based approach where each feature (greeting, timer, tasks, links) is implemented as an independent module with clear responsibilities. All modules interact with a central Local Storage manager for data persistence, and a theme manager for visual appearance.

The application is entirely client-side with no backend dependencies. State is maintained in JavaScript objects and synchronized to Local Storage on every change. The UI updates reactively in response to state changes, following a unidirectional data flow pattern.

### Key Design Principles

1. **Separation of Concerns**: Business logic (data validation, state management) is separated from presentation logic (DOM manipulation, event handling)
2. **Single Responsibility**: Each module handles one feature area with minimal coupling to other modules
3. **Local-First**: All data persists in browser Local Storage with immediate saves on every change
4. **Progressive Enhancement**: Core functionality works without JavaScript preferences (defaults)

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         index.html                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Dashboard UI                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │  │
│  │  │ Greeting │  │  Timer   │  │  Tasks   │  │ Links │ │  │
│  │  │  Module  │  │  Module  │  │  Module  │  │ Module│ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────┘ │  │
│  │       │              │              │            │     │  │
│  │       └──────────────┴──────────────┴────────────┘     │  │
│  │                           │                             │  │
│  │                    ┌──────▼──────┐                     │  │
│  │                    │   Storage   │                     │  │
│  │                    │   Manager   │                     │  │
│  │                    └──────┬──────┘                     │  │
│  │                           │                             │  │
│  │                    ┌──────▼──────┐                     │  │
│  │                    │Local Storage│                     │  │
│  │                    └─────────────┘                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Theme Manager (CSS Classes)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Component Structure

The application is organized into five main modules:

#### 1. Greeting Module
- **Responsibility**: Display current time, date, and time-based personalized greeting
- **State**: Current time, user name (from storage)
- **Updates**: Every second via `setInterval`
- **Dependencies**: Storage Manager for user name retrieval

#### 2. Timer Module
- **Responsibility**: Countdown timer for focus sessions
- **State**: Current duration, remaining time, running status, custom duration preference
- **Updates**: Every second when running via `setInterval`
- **Dependencies**: Storage Manager for duration preference, Notification API for completion alert

#### 3. Tasks Module
- **Responsibility**: CRUD operations on task list, sorting, completion toggling
- **State**: Array of task objects, current sort preference
- **Updates**: On user interaction (add, edit, delete, toggle, sort)
- **Dependencies**: Storage Manager for task persistence

#### 4. Links Module
- **Responsibility**: CRUD operations on quick links collection
- **State**: Array of link objects
- **Updates**: On user interaction (add, delete)
- **Dependencies**: Storage Manager for link persistence

#### 5. Storage Manager
- **Responsibility**: Centralized interface to Local Storage API with serialization/deserialization
- **Operations**: get, set, remove for each data type
- **Data Types**: userName, timerDuration, tasks, links, theme, sortPreference

#### 6. Theme Manager
- **Responsibility**: Apply and persist theme preferences
- **State**: Current theme (light/dark)
- **Updates**: On theme toggle
- **Dependencies**: Storage Manager for theme persistence

### Data Flow

1. **Initialization Flow**:
   - Page loads → Storage Manager reads from Local Storage
   - Each module initializes with stored data or defaults
   - UI renders initial state
   - User name popup displays if no name stored

2. **User Interaction Flow**:
   - User action (button click, form submit) → Event handler
   - Event handler updates module state
   - Module state sync to Storage Manager → Local Storage
   - UI re-renders to reflect new state

3. **Time Update Flow**:
   - `setInterval` triggers every second
   - Greeting Module: Update time display, check if greeting should change
   - Timer Module: Decrement remaining time if running, check if complete

### Error Handling Strategy

- **Local Storage Unavailable**: Display error message, disable all features requiring persistence
- **Local Storage Full**: Display error message, attempt to free space by removing oldest data
- **Invalid URL Format**: Display inline validation error, prevent link creation
- **Empty Input**: Display inline validation error, prevent task/link creation
- **Invalid Timer Duration**: Clamp to valid range (1-60), display warning message

## Components and Interfaces

### Core Modules

#### StorageManager

```javascript
const StorageManager = {
  // User name
  getUserName: () => string | null,
  setUserName: (name: string) => void,
  
  // Timer preferences
  getTimerDuration: () => number | null,
  setTimerDuration: (minutes: number) => void,
  
  // Tasks
  getTasks: () => Task[] | [],
  setTasks: (tasks: Task[]) => void,
  
  // Quick links
  getLinks: () => Link[] | [],
  setLinks: (links: Link[]) => void,
  
  // Theme
  getTheme: () => 'light' | 'dark' | null,
  setTheme: (theme: 'light' | 'dark') => void,
  
  // Sort preference
  getSortPreference: () => string | null,
  setSortPreference: (preference: string) => void,
  
  // Utility
  isAvailable: () => boolean,
  clear: () => void
};
```

#### GreetingModule

```javascript
const GreetingModule = {
  init: () => void,
  updateDisplay: () => void,
  getTimePeriod: (hour: number) => 'morning' | 'afternoon' | 'evening',
  getGreeting: (period: string, userName: string) => string,
  formatTime: (date: Date) => string,
  formatDate: (date: Date) => string
};
```

#### TimerModule

```javascript
const TimerModule = {
  init: () => void,
  start: () => void,
  stop: () => void,
  reset: () => void,
  setCustomDuration: (minutes: number) => void,
  updateDisplay: () => void,
  handleComplete: () => void,
  formatTime: (seconds: number) => string,
  
  // State
  state: {
    duration: number,
    remaining: number,
    running: boolean,
    intervalId: number | null
  }
};
```

#### TasksModule

```javascript
const TasksModule = {
  init: () => void,
  addTask: (description: string) => void,
  deleteTask: (id: string) => void,
  toggleTask: (id: string) => void,
  editTask: (id: string, newDescription: string) => void,
  sortTasks: (sortType: 'creation' | 'status' | 'alphabetical') => void,
  renderTasks: () => void,
  validateDescription: (description: string) => boolean,
  
  // State
  state: {
    tasks: Task[],
    sortPreference: string
  }
};
```

#### LinksModule

```javascript
const LinksModule = {
  init: () => void,
  addLink: (url: string, label: string) => void,
  deleteLink: (id: string) => void,
  renderLinks: () => void,
  validateUrl: (url: string) => boolean,
  validateLabel: (label: string) => boolean,
  
  // State
  state: {
    links: Link[]
  }
};
```

#### ThemeManager

```javascript
const ThemeManager = {
  init: () => void,
  toggle: () => void,
  apply: (theme: 'light' | 'dark') => void,
  getCurrent: () => 'light' | 'dark'
};
```

### UI Component Interactions

#### User Name Popup
- Displays on first load if no user name stored
- Modal overlay with input field and two buttons (Submit, Guest)
- Submit: Validates non-empty input, stores name, closes modal
- Guest: Stores "Guest", closes modal

#### Greeting Display
- Shows time, date, and personalized greeting
- Updates every second
- No user interaction

#### Timer Controls
- Display: MM:SS countdown
- Three buttons: Start/Pause, Reset, Set Duration
- Set Duration: Opens input for 1-60 minute range
- Completion: Browser notification

#### Task List
- Each task: checkbox, description, edit button, delete button
- Add form: input field, submit button
- Sort dropdown: Creation order, Status, Alphabetical

#### Quick Links
- Each link: clickable button with label, delete icon
- Add form: URL input, label input, submit button

## Data Models

### Task

```javascript
{
  id: string,           // Unique identifier (timestamp-based)
  description: string,  // Task description (non-empty, trimmed)
  completed: boolean,   // Completion status
  createdAt: number     // Unix timestamp
}
```

**Validation Rules**:
- `id`: Auto-generated, format: `task_${Date.now()}_${Math.random()}`
- `description`: Non-empty after trimming whitespace, max 500 characters
- `completed`: Boolean, defaults to `false`
- `createdAt`: Auto-generated Unix timestamp

### Link

```javascript
{
  id: string,     // Unique identifier (timestamp-based)
  url: string,    // Full URL with protocol
  label: string   // Display label (non-empty, trimmed)
}
```

**Validation Rules**:
- `id`: Auto-generated, format: `link_${Date.now()}_${Math.random()}`
- `url`: Must start with `http://` or `https://`, max 2000 characters
- `label`: Non-empty after trimming whitespace, max 100 characters

### Local Storage Schema

The application stores data in Local Storage using the following keys:

```javascript
{
  "dashboard_userName": string,
  "dashboard_timerDuration": number,
  "dashboard_tasks": string,          // JSON array of Task objects
  "dashboard_links": string,          // JSON array of Link objects
  "dashboard_theme": "light" | "dark",
  "dashboard_sortPreference": string
}
```

**Key Naming Convention**: All keys prefixed with `dashboard_` to avoid conflicts with other applications.

**Serialization Format**: Arrays (tasks, links) stored as JSON strings using `JSON.stringify` and parsed with `JSON.parse`.

**Data Limits**: Local Storage typically allows 5-10MB per origin. Current data model well within limits:
- User name: ~50 bytes
- Timer duration: ~10 bytes
- Tasks: ~100 bytes per task × 100 tasks = ~10KB
- Links: ~150 bytes per link × 50 links = ~7.5KB
- Total: ~20KB typical usage

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time Format Consistency

*For any* valid Date object, the formatTime() function SHALL produce a string in 12-hour format with AM/PM designation (pattern: H:MM AM/PM or HH:MM AM/PM)

**Validates: Requirements 1.1**

### Property 2: Date Format Completeness

*For any* valid Date object, the formatDate() function SHALL produce a string containing day of week, month name, and day number

**Validates: Requirements 1.2**

### Property 3: Greeting Message Correctness

*For any* hour of the day (0-23), the getGreeting() function SHALL return a message containing "Good morning" for hours 5-11, "Good afternoon" for hours 12-17, or "Good evening" for hours 18-4

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 4: User Name Round-Trip Preservation

*For any* valid user name string, storing via setUserName() then retrieving via getUserName() SHALL return the exact same string (round-trip property)

**Validates: Requirements 3.5**

### Property 5: Timer State Transition - Start

*For any* timer state where running is false, calling start() SHALL set running to true

**Validates: Requirements 4.2**

### Property 6: Timer State Transition - Stop

*For any* timer state where running is true, calling stop() SHALL set running to false

**Validates: Requirements 4.3**

### Property 7: Timer Reset Idempotence

*For any* timer state with any remaining time value, calling reset() SHALL set remaining time equal to the configured duration

**Validates: Requirements 4.4**

### Property 8: Timer Display Format Consistency

*For any* non-negative integer representing seconds (0-3600), the formatTime() function SHALL produce a string in MM:SS format (pattern: MM:SS where MM is 00-60 and SS is 00-59)

**Validates: Requirements 4.6**

### Property 9: Timer Duration Validation

*For any* numeric value, setCustomDuration() SHALL accept values in the range 1-60 (inclusive) and reject all other values

**Validates: Requirements 5.1, 5.4**

### Property 10: Timer Duration Round-Trip Preservation

*For any* valid timer duration value (1-60 minutes), storing via setTimerDuration() then retrieving via getTimerDuration() SHALL return the exact same numeric value (round-trip property)

**Validates: Requirements 5.5**

### Property 11: Task Creation Correctness

*For any* non-empty, trimmed string as description, calling addTask() SHALL create a new Task object with that description, completed set to false, and a valid id and createdAt timestamp

**Validates: Requirements 6.1**

### Property 12: Task Rendering Completeness

*For any* array of Task objects, calling renderTasks() SHALL produce DOM elements for every task in the array

**Validates: Requirements 6.2**

### Property 13: Task Toggle Idempotence

*For any* Task object, calling toggleTask() twice on the same task SHALL restore the completion status to its original value (idempotence property)

**Validates: Requirements 6.3**

### Property 14: Task Deletion Correctness

*For any* task list containing a specific task, calling deleteTask() with that task's id SHALL result in a task list that does not contain that task and has length reduced by exactly 1

**Validates: Requirements 6.4**

### Property 15: Task Edit Preservation

*For any* Task object and any new non-empty description, calling editTask() SHALL update the task's description while preserving the task's id, completed status, and createdAt timestamp

**Validates: Requirements 6.5**

### Property 16: Empty Task Rejection

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), calling addTask() SHALL reject the input and not create a new task

**Validates: Requirements 6.8**

### Property 17: Task List Round-Trip Preservation

*For any* array of Task objects, storing via setTasks() then retrieving via getTasks() SHALL produce an array deeply equal to the original (round-trip property preserving order, descriptions, completion status, ids, and timestamps)

**Validates: Requirements 6.9, 7.3, 7.4**

### Property 18: Link Creation Correctness

*For any* valid URL string (starting with http:// or https://) and non-empty label string, calling addLink() SHALL create a new Link object with that URL, label, and a valid id

**Validates: Requirements 8.1**

### Property 19: Link Rendering Completeness

*For any* array of Link objects, calling renderLinks() SHALL produce clickable button DOM elements for every link in the array

**Validates: Requirements 8.2**

### Property 20: Link Deletion Correctness

*For any* link list containing a specific link, calling deleteLink() with that link's id SHALL result in a link list that does not contain that link and has length reduced by exactly 1

**Validates: Requirements 8.4**

### Property 21: URL Validation Correctness

*For any* string, validateUrl() SHALL return true if and only if the string starts with "http://" or "https://"

**Validates: Requirements 8.7**

### Property 22: Empty Link Field Rejection

*For any* string composed entirely of whitespace characters for URL or label, calling addLink() SHALL reject the input and not create a new link

**Validates: Requirements 8.8**

### Property 23: Link Collection Round-Trip Preservation

*For any* array of Link objects, storing via setLinks() then retrieving via getLinks() SHALL produce an array deeply equal to the original (round-trip property preserving order, URLs, labels, and ids)

**Validates: Requirements 8.9**

### Property 24: Theme Toggle Idempotence

*For any* theme state ('light' or 'dark'), calling toggle() twice SHALL return the theme to its original state (idempotence property)

**Validates: Requirements 9.2**

### Property 25: Theme Storage Correctness

*For any* valid theme value ('light' or 'dark'), storing via setTheme() then retrieving via getTheme() SHALL return the exact same theme value

**Validates: Requirements 9.3**

### Property 26: Task Sorting Correctness

*For any* array of Task objects, applying sortTasks() with any sort type SHALL produce an array where elements are ordered according to the specified sort criterion (alphabetical by description, by createdAt timestamp, or by completion status)

**Validates: Requirements 10.3**

### Property 27: Status Sort Partitioning

*For any* array of Task objects with mixed completion statuses, applying sortTasks('status') SHALL produce an array where all incomplete tasks (completed = false) appear before all completed tasks (completed = true)

**Validates: Requirements 10.5**


## Error Handling

### Local Storage Errors

**Error: Local Storage Unavailable**
- **Detection**: Check `window.localStorage` availability and `StorageManager.isAvailable()` returns false
- **User Message**: "This application requires browser storage to function. Please enable cookies and local storage in your browser settings."
- **Behavior**: Display prominent error message, disable all features requiring persistence (tasks, links, preferences)
- **Recovery**: User enables storage and refreshes page

**Error: Local Storage Full (QuotaExceededError)**
- **Detection**: Catch `QuotaExceededError` exception during `localStorage.setItem()`
- **User Message**: "Storage is full. Please delete some tasks or links to free up space."
- **Behavior**: Display inline error message near the action that failed, preserve existing data
- **Recovery**: User deletes items, then retries action
- **Mitigation**: Implement data limits (max 100 tasks, max 50 links) to prevent approaching quota

**Error: JSON Parse Failure**
- **Detection**: Catch `SyntaxError` during `JSON.parse()` in StorageManager
- **User Message**: "Unable to load saved data. Data may be corrupted."
- **Behavior**: Log error to console, return empty default values (empty arrays, null preferences)
- **Recovery**: User continues with empty state, or manually clears storage via browser dev tools
- **Prevention**: Always use `JSON.stringify()` for writes to ensure valid JSON

### Input Validation Errors

**Error: Empty Task Description**
- **Detection**: Description string is empty or contains only whitespace after `trim()`
- **User Message**: "Task description cannot be empty"
- **Behavior**: Display inline validation message below input field, prevent task creation, keep focus on input
- **Recovery**: User enters valid text
- **Validation**: Check `description.trim().length === 0`

**Error: Invalid URL Format**
- **Detection**: URL doesn't start with `http://` or `https://`
- **User Message**: "URL must start with http:// or https://"
- **Behavior**: Display inline validation message below URL input field, prevent link creation
- **Recovery**: User corrects URL format
- **Validation**: Check `/^https?:\/\/.+/.test(url)`

**Error: Empty Quick Link Fields**
- **Detection**: URL or label is empty or contains only whitespace after `trim()`
- **User Message**: "URL and label are required"
- **Behavior**: Display inline validation message below empty field, prevent link creation
- **Recovery**: User fills both fields
- **Validation**: Check both `url.trim().length > 0 && label.trim().length > 0`

**Error: Invalid Timer Duration**
- **Detection**: Duration value is not a positive integer or is outside range 1-60
- **User Message**: "Duration must be between 1 and 60 minutes"
- **Behavior**: Display inline validation message, clamp value to valid range (if numeric) or reject (if non-numeric)
- **Recovery**: User enters valid duration
- **Validation**: Check `Number.isInteger(duration) && duration >= 1 && duration <= 60`

### Notification Errors

**Error: Notification Permission Denied**
- **Detection**: `Notification.permission === 'denied'` when timer completes
- **User Message**: No modal notification; fall back to visual alert in the dashboard
- **Behavior**: Display prominent visual completion message in timer area (green background, large text)
- **Recovery**: User sees visual alert; can optionally enable notifications in browser settings
- **Prevention**: Request notification permission on first timer use

**Error: Notification API Unavailable**
- **Detection**: `typeof Notification === 'undefined'`
- **User Message**: None (graceful degradation)
- **Behavior**: Use visual completion alert only (same as permission denied)
- **Recovery**: N/A - feature degrades gracefully

### Display Errors

**Error: Invalid Date Object**
- **Detection**: `isNaN(date.getTime())` in formatTime() or formatDate()
- **User Message**: Display "Invalid Date" in greeting area
- **Behavior**: Continue other dashboard functionality, log error to console
- **Recovery**: Next clock update (1 second) will likely resolve with valid Date
- **Prevention**: Always construct Date with `new Date()` without arguments for current time

### General Error Strategy

**Principle: Fail Gracefully**
- Never crash the entire application due to a single component error
- Isolate errors to the affected feature/module
- Provide clear, actionable error messages to users
- Log technical details to console for debugging
- Preserve user data whenever possible

**Error Boundary Pattern**:
```javascript
try {
  // Risky operation
} catch (error) {
  console.error('Module error:', error);
  displayUserMessage('Operation failed. Please try again.');
  // Restore valid state
}
```

## Testing Strategy

### Overview

The To-Do List Life Dashboard will use a **dual testing approach** combining traditional unit tests for specific examples and edge cases with property-based tests for universal correctness properties. This comprehensive strategy ensures both concrete behavior verification and broad input coverage.

### Property-Based Testing

**Library**: [fast-check](https://github.com/dubzzz/fast-check) for JavaScript
- Industry-standard property-based testing library for JavaScript/TypeScript
- Excellent generator ecosystem for primitives and complex types
- Shrinking support for minimal counterexamples

**Configuration**:
- Minimum **100 iterations per property test** (default fast-check configuration)
- Random seed logged for reproducibility
- Each property test references its design document property via comment tag

**Tag Format**:
```javascript
// Feature: todo-list-dashboard, Property 1: Time Format Consistency
test('formatTime produces 12-hour format with AM/PM', () => {
  fc.assert(fc.property(fc.date(), (date) => {
    const result = formatTime(date);
    expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
  }), { numRuns: 100 });
});
```

**Property Test Coverage** (27 properties total):

1. **Formatting Properties (3)**: Time format, date format, timer display format
2. **Greeting Logic (1)**: Time-based greeting correctness across all hours
3. **Storage Round-Trip Properties (5)**: User name, timer duration, task list, link collection, theme
4. **Validation Properties (3)**: Timer duration range, URL format, empty input rejection
5. **State Transition Properties (3)**: Timer start, stop, reset
6. **CRUD Operations (6)**: Task/link creation, deletion, editing
7. **Idempotence Properties (2)**: Task toggle, theme toggle
8. **Rendering Properties (2)**: Task rendering completeness, link rendering completeness
9. **Sorting Properties (2)**: General sort correctness, status sort partitioning

**Generator Strategy**:
- **Dates**: `fc.date()` for time/date formatting tests
- **Hours**: `fc.integer(0, 23)` for greeting logic tests
- **User names**: `fc.string({ minLength: 1, maxLength: 50 })` for user name tests
- **Task descriptions**: `fc.string({ minLength: 1, maxLength: 500 })` for valid tasks
- **Whitespace strings**: `fc.stringOf(fc.constantFrom(' ', '\t', '\n'))` for empty validation
- **URLs**: `fc.webUrl()` and custom generators for http/https validation
- **Durations**: `fc.integer(1, 60)` for valid durations, `fc.integer()` for validation tests
- **Task arrays**: `fc.array(taskGenerator, { maxLength: 100 })` for list operations
- **Link arrays**: `fc.array(linkGenerator, { maxLength: 50 })` for link operations
- **Themes**: `fc.constantFrom('light', 'dark')` for theme tests

### Unit Testing

**Library**: [Vitest](https://vitest.dev/) - Fast, modern test runner with excellent DX
- Jest-compatible API
- Native ES modules support
- Fast execution with intelligent watch mode

**Unit Test Coverage**:

**Example-Based Tests** (specific scenarios):
- Timer initialization with 25-minute default
- Timer completion notification display
- Guest user default when no name stored
- Theme default to light when no preference stored
- localStorage unavailable error message display
- Sort control UI options availability
- User name popup display on first load

**Integration Tests** (component interaction):
- Dashboard initialization loading all stored data from localStorage
- Task operations triggering immediate localStorage updates
- Timer countdown updating display every second (with fake timers)
- Theme change applying CSS classes within 100ms
- Browser session persistence (save, clear memory, reload, verify restore)

**Edge Cases**:
- Empty localStorage (all defaults apply)
- localStorage with corrupted JSON (graceful fallback to defaults)
- Timer at 1 second triggering completion
- Maximum task/link counts (100 tasks, 50 links)
- Task list with all completed or all incomplete (sorting behavior)

**Mock Strategy**:
- **localStorage**: Mock for unit tests, real for integration tests
- **Date**: Inject fixed Date for time-dependent tests
- **setInterval/setTimeout**: Use Vitest fake timers for timing tests
- **Notification API**: Mock for permission and display tests
- **window.open**: Spy to verify link opening behavior

### Test Organization

**File Structure**:
```
tests/
├── unit/
│   ├── greeting.test.js       # Greeting module unit tests
│   ├── timer.test.js          # Timer module unit tests
│   ├── tasks.test.js          # Tasks module unit tests
│   ├── links.test.js          # Links module unit tests
│   ├── storage.test.js        # Storage manager unit tests
│   └── theme.test.js          # Theme manager unit tests
├── property/
│   ├── formatting.prop.test.js    # Properties 1, 2, 8
│   ├── greeting.prop.test.js      # Property 3
│   ├── storage.prop.test.js       # Properties 4, 10, 17, 23, 25
│   ├── validation.prop.test.js    # Properties 9, 16, 21, 22
│   ├── timer.prop.test.js         # Properties 5, 6, 7
│   ├── tasks.prop.test.js         # Properties 11-15, 26, 27
│   └── links.prop.test.js         # Properties 18-20
└── integration/
    ├── initialization.test.js     # Full dashboard init
    ├── persistence.test.js        # Cross-session persistence
    └── performance.test.js        # Load time, interaction timing
```

**Test Naming Convention**:
- Unit tests: `describe('[Module] - [Feature]', () => { test('[specific behavior]') })`
- Property tests: `describe('Property N: [Property Name]', () => { test('[property statement]') })`
- Integration tests: `describe('Integration: [Scenario]', () => { test('[expected outcome]') })`

### Coverage Goals

**Line Coverage**: Minimum 85% overall
- 90%+ for business logic (formatting, validation, state management)
- 70%+ for UI rendering code (DOM manipulation)
- 100% for StorageManager (critical for data integrity)

**Property Coverage**: 100% of identified correctness properties must have corresponding property tests

**Requirements Coverage**: Every acceptance criterion must be verified by at least one test (unit, property, or integration)

### Continuous Testing

**Development Workflow**:
1. Write property test for correctness property
2. Write unit tests for specific examples and edge cases
3. Implement feature
4. Run tests in watch mode during development
5. Run full suite before committing

**CI/CD Integration**:
- Run full test suite on every commit
- Run property tests with increased iterations (1000) nightly for deeper exploration
- Track coverage metrics and fail if below thresholds
- Generate coverage reports and property test statistics

### Manual Testing

**Browser Compatibility Testing**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)

**Accessibility Testing**:
- Keyboard navigation verification
- Screen reader compatibility (VoiceOver, NVDA)
- Color contrast verification (WCAG AA)

**Visual Testing**:
- Light/dark theme appearance
- Responsive layout verification
- UI element spacing and alignment

**Performance Testing**:
- Initial load time measurement (target: <1 second)
- Interaction responsiveness (target: <100ms feedback)
- Timer update smoothness observation

### Test Maintenance

**Review Cycle**:
- Review property test failures for genuine bugs vs. incorrect properties
- Update tests when requirements change
- Refactor tests for clarity and maintainability
- Remove redundant tests identified through coverage analysis

**Documentation**:
- Keep property tests tagged with design document references
- Document custom generators in property test files
- Maintain test README with setup instructions and conventions
