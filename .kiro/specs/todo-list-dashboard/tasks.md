# Implementation Plan: To-Do List Life Dashboard

## Overview

This implementation plan converts the design into discrete coding tasks for building the To-Do List Life Dashboard. The application is a single-page web app using vanilla HTML, CSS, and JavaScript with Local Storage for persistence. Each task builds incrementally, with property-based tests validating correctness properties and unit tests covering specific examples and edge cases.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create index.html with semantic HTML structure
  - Create css/styles.css file for styling
  - Create js/app.js file for JavaScript logic
  - Link CSS and JavaScript files in HTML
  - Add meta tags for viewport and charset
  - Create empty container divs for each module (greeting, timer, tasks, links, theme toggle)
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 2. Implement Storage Manager module
  - [x] 2.1 Create StorageManager object with all interface methods
    - Implement isAvailable() to check localStorage support
    - Implement getUserName() and setUserName(name)
    - Implement getTimerDuration() and setTimerDuration(minutes)
    - Implement getTasks() and setTasks(tasks) with JSON serialization
    - Implement getLinks() and setLinks(links) with JSON serialization
    - Implement getTheme() and setTheme(theme)
    - Implement getSortPreference() and setSortPreference(preference)
    - Implement clear() utility method
    - Use "dashboard_" prefix for all localStorage keys
    - _Requirements: 3.5, 5.5, 6.6, 6.7, 6.9, 8.5, 8.6, 8.9, 9.3, 9.4_

  - [ ]* 2.2 Write property test for user name round-trip preservation
    - **Property 4: User Name Round-Trip Preservation**
    - **Validates: Requirements 3.5**
    - Generate random valid user name strings (1-50 chars)
    - Store via setUserName(), retrieve via getUserName()
    - Assert retrieved value equals original value

  - [ ]* 2.3 Write property test for timer duration round-trip preservation
    - **Property 10: Timer Duration Round-Trip Preservation**
    - **Validates: Requirements 5.5**
    - Generate random valid timer durations (1-60 minutes)
    - Store via setTimerDuration(), retrieve via getTimerDuration()
    - Assert retrieved value equals original value

  - [ ]* 2.4 Write property test for task list round-trip preservation
    - **Property 17: Task List Round-Trip Preservation**
    - **Validates: Requirements 6.9, 7.3, 7.4**
    - Generate random arrays of Task objects
    - Store via setTasks(), retrieve via getTasks()
    - Assert retrieved array is deeply equal to original (order, descriptions, statuses, IDs, timestamps)

  - [ ]* 2.5 Write property test for link collection round-trip preservation
    - **Property 23: Link Collection Round-Trip Preservation**
    - **Validates: Requirements 8.9**
    - Generate random arrays of Link objects
    - Store via setLinks(), retrieve via getLinks()
    - Assert retrieved array is deeply equal to original (order, URLs, labels, IDs)

  - [ ]* 2.6 Write property test for theme storage correctness
    - **Property 25: Theme Storage Correctness**
    - **Validates: Requirements 9.3**
    - Generate random theme values ('light', 'dark')
    - Store via setTheme(), retrieve via getTheme()
    - Assert retrieved value equals original value

  - [ ]* 2.7 Write unit tests for Storage Manager
    - Test isAvailable() returns true when localStorage exists
    - Test isAvailable() returns false when localStorage unavailable
    - Test clear() removes all dashboard_ keys
    - Test JSON parse failure returns empty defaults
    - Test QuotaExceededError handling

- [x] 3. Checkpoint - Verify Storage Manager functionality
  - Ensure all Storage Manager tests pass, ask the user if questions arise.

- [x] 4. Implement Greeting Module
  - [x] 4.1 Create GreetingModule object with time/date formatting and greeting logic
    - Implement formatTime(date) returning 12-hour format with AM/PM
    - Implement formatDate(date) returning "Day, Month DD" format
    - Implement getTimePeriod(hour) returning 'morning', 'afternoon', or 'evening'
    - Implement getGreeting(period, userName) returning personalized greeting message
    - Implement updateDisplay() to update DOM with current time, date, and greeting
    - Implement init() to start 1-second interval for updateDisplay()
    - Retrieve userName from StorageManager in init()
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.5_

  - [ ]* 4.2 Write property test for time format consistency
    - **Property 1: Time Format Consistency**
    - **Validates: Requirements 1.1**
    - Generate random Date objects
    - Call formatTime(date)
    - Assert result matches pattern /^\d{1,2}:\d{2} (AM|PM)$/

  - [ ]* 4.3 Write property test for date format completeness
    - **Property 2: Date Format Completeness**
    - **Validates: Requirements 1.2**
    - Generate random Date objects
    - Call formatDate(date)
    - Assert result contains day of week, month name, and day number

  - [ ]* 4.4 Write property test for greeting message correctness
    - **Property 3: Greeting Message Correctness**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Generate random hour values (0-23)
    - Call getGreeting() with generated hour
    - Assert result contains "Good morning" for 5-11, "Good afternoon" for 12-17, "Good evening" for 18-4

  - [ ]* 4.5 Write unit tests for Greeting Module
    - Test formatTime() with specific example times (3:05 AM, 11:42 PM)
    - Test formatDate() with specific dates (Monday, January 1)
    - Test getTimePeriod() boundary cases (4am, 5am, 11am, 12pm, 5pm, 6pm)
    - Test updateDisplay() updates DOM elements
    - Test init() starts interval and loads userName from storage
    - Test greeting displays "Guest" when no userName stored

- [x] 5. Implement Timer Module
  - [x] 5.1 Create TimerModule object with timer state and controls
    - Create state object with duration, remaining, running, intervalId properties
    - Implement formatTime(seconds) returning MM:SS format
    - Implement setCustomDuration(minutes) with validation (1-60 range)
    - Implement start() to begin countdown (setInterval every 1 second)
    - Implement stop() to pause countdown (clearInterval)
    - Implement reset() to restore remaining time to duration
    - Implement handleComplete() to display notification and visual alert
    - Implement updateDisplay() to render remaining time in DOM
    - Implement init() to load duration from StorageManager (default 25 minutes)
    - Add event listeners for start, stop, reset, and set duration buttons
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 5.2 Write property test for timer state transition - start
    - **Property 5: Timer State Transition - Start**
    - **Validates: Requirements 4.2**
    - Create timer states with running = false
    - Call start()
    - Assert running is true after start()

  - [ ]* 5.3 Write property test for timer state transition - stop
    - **Property 6: Timer State Transition - Stop**
    - **Validates: Requirements 4.3**
    - Create timer states with running = true
    - Call stop()
    - Assert running is false after stop()

  - [ ]* 5.4 Write property test for timer reset idempotence
    - **Property 7: Timer Reset Idempotence**
    - **Validates: Requirements 4.4**
    - Generate random remaining time values
    - Call reset()
    - Assert remaining equals duration

  - [ ]* 5.5 Write property test for timer display format consistency
    - **Property 8: Timer Display Format Consistency**
    - **Validates: Requirements 4.6**
    - Generate random non-negative integers (0-3600 seconds)
    - Call formatTime(seconds)
    - Assert result matches pattern /^\d{2}:\d{2}$/

  - [ ]* 5.6 Write property test for timer duration validation
    - **Property 9: Timer Duration Validation**
    - **Validates: Requirements 5.1, 5.4**
    - Generate random numeric values (including negatives, decimals, out-of-range)
    - Call setCustomDuration()
    - Assert only values 1-60 are accepted, others rejected

  - [ ]* 5.7 Write unit tests for Timer Module
    - Test timer initializes with 25-minute default when no stored duration
    - Test timer initializes with stored custom duration
    - Test start() begins countdown
    - Test stop() pauses countdown
    - Test reset() restores initial duration
    - Test handleComplete() requests notification permission and displays notification
    - Test handleComplete() shows visual alert when notifications unavailable
    - Test updateDisplay() formats time correctly
    - Test setCustomDuration() stores preference in StorageManager

- [x] 6. Checkpoint - Verify Greeting and Timer modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement Tasks Module
  - [x] 7.1 Create TasksModule object with task CRUD operations
    - Create state object with tasks array and sortPreference property
    - Implement validateDescription(description) checking non-empty after trim
    - Implement addTask(description) creating Task with id, description, completed=false, createdAt
    - Implement deleteTask(id) removing task from array
    - Implement toggleTask(id) flipping completed boolean
    - Implement editTask(id, newDescription) updating description only
    - Implement sortTasks(sortType) with 'creation', 'status', 'alphabetical' options
    - Implement renderTasks() updating DOM with task list
    - Implement init() loading tasks from StorageManager
    - Add event listeners for task form submit, checkbox clicks, edit/delete buttons, sort dropdown
    - Sync state to StorageManager after every change
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.2 Write property test for task creation correctness
    - **Property 11: Task Creation Correctness**
    - **Validates: Requirements 6.1**
    - Generate random non-empty, trimmed strings
    - Call addTask(description)
    - Assert created task has correct description, completed=false, valid id, valid createdAt

  - [ ]* 7.3 Write property test for task rendering completeness
    - **Property 12: Task Rendering Completeness**
    - **Validates: Requirements 6.2**
    - Generate random arrays of Task objects
    - Call renderTasks()
    - Assert DOM contains element for every task in array

  - [ ]* 7.4 Write property test for task toggle idempotence
    - **Property 13: Task Toggle Idempotence**
    - **Validates: Requirements 6.3**
    - Generate random Task objects
    - Call toggleTask(id) twice
    - Assert completed status equals original value

  - [ ]* 7.5 Write property test for task deletion correctness
    - **Property 14: Task Deletion Correctness**
    - **Validates: Requirements 6.4**
    - Generate task lists containing specific tasks
    - Call deleteTask(id)
    - Assert task no longer in list and length reduced by 1

  - [ ]* 7.6 Write property test for task edit preservation
    - **Property 15: Task Edit Preservation**
    - **Validates: Requirements 6.5**
    - Generate random Task objects and new descriptions
    - Call editTask(id, newDescription)
    - Assert description updated, id/completed/createdAt unchanged

  - [ ]* 7.7 Write property test for empty task rejection
    - **Property 16: Empty Task Rejection**
    - **Validates: Requirements 6.8**
    - Generate strings of whitespace characters (spaces, tabs, newlines)
    - Call addTask(whitespaceString)
    - Assert task not created

  - [ ]* 7.8 Write property test for task sorting correctness
    - **Property 26: Task Sorting Correctness**
    - **Validates: Requirements 10.3**
    - Generate random task arrays
    - Call sortTasks() with each sort type
    - Assert resulting array is correctly ordered per sort criterion

  - [ ]* 7.9 Write property test for status sort partitioning
    - **Property 27: Status Sort Partitioning**
    - **Validates: Requirements 10.5**
    - Generate task arrays with mixed completion statuses
    - Call sortTasks('status')
    - Assert all incomplete tasks appear before all completed tasks

  - [ ]* 7.10 Write unit tests for Tasks Module
    - Test addTask() with valid description creates task
    - Test addTask() with empty description shows error message
    - Test deleteTask() removes correct task
    - Test toggleTask() flips completion status
    - Test editTask() updates description
    - Test sortTasks('creation') orders by createdAt ascending
    - Test sortTasks('alphabetical') orders by description
    - Test sortTasks('status') shows incomplete before completed
    - Test init() loads tasks from storage
    - Test all operations sync to StorageManager

- [ ] 8. Implement Links Module
  - [ ] 8.1 Create LinksModule object with link CRUD operations
    - Create state object with links array
    - Implement validateUrl(url) checking starts with http:// or https://
    - Implement validateLabel(label) checking non-empty after trim
    - Implement addLink(url, label) creating Link with id, url, label
    - Implement deleteLink(id) removing link from array
    - Implement renderLinks() updating DOM with link buttons
    - Implement init() loading links from StorageManager
    - Add event listeners for link form submit and delete buttons
    - Sync state to StorageManager after every change
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [ ]* 8.2 Write property test for link creation correctness
    - **Property 18: Link Creation Correctness**
    - **Validates: Requirements 8.1**
    - Generate random valid URLs (starting with http:// or https://) and labels
    - Call addLink(url, label)
    - Assert created link has correct URL, label, valid id

  - [ ]* 8.3 Write property test for link rendering completeness
    - **Property 19: Link Rendering Completeness**
    - **Validates: Requirements 8.2**
    - Generate random arrays of Link objects
    - Call renderLinks()
    - Assert DOM contains clickable button for every link in array

  - [ ]* 8.4 Write property test for link deletion correctness
    - **Property 20: Link Deletion Correctness**
    - **Validates: Requirements 8.4**
    - Generate link lists containing specific links
    - Call deleteLink(id)
    - Assert link no longer in list and length reduced by 1

  - [ ]* 8.5 Write property test for URL validation correctness
    - **Property 21: URL Validation Correctness**
    - **Validates: Requirements 8.7**
    - Generate random strings (valid and invalid URLs)
    - Call validateUrl(string)
    - Assert returns true only for strings starting with http:// or https://

  - [ ]* 8.6 Write property test for empty link field rejection
    - **Property 22: Empty Link Field Rejection**
    - **Validates: Requirements 8.8**
    - Generate whitespace strings for URL and label
    - Call addLink(whitespaceUrl, whitespaceLabel)
    - Assert link not created

  - [ ]* 8.7 Write unit tests for Links Module
    - Test addLink() with valid URL and label creates link
    - Test addLink() with invalid URL shows error message
    - Test addLink() with empty fields shows error message
    - Test deleteLink() removes correct link
    - Test renderLinks() creates clickable buttons
    - Test clicking link button opens URL in new tab
    - Test init() loads links from storage
    - Test all operations sync to StorageManager

- [ ] 9. Checkpoint - Verify Tasks and Links modules
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Theme Manager
  - [ ] 10.1 Create ThemeManager object with theme switching logic
    - Implement init() loading theme from StorageManager (default 'light')
    - Implement apply(theme) adding/removing CSS classes on document.body
    - Implement toggle() switching between 'light' and 'dark'
    - Implement getCurrent() returning current theme
    - Add event listener for theme toggle button
    - Sync theme to StorageManager on every change
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 10.2 Write property test for theme toggle idempotence
    - **Property 24: Theme Toggle Idempotence**
    - **Validates: Requirements 9.2**
    - Generate random theme states ('light', 'dark')
    - Call toggle() twice
    - Assert theme returns to original state

  - [ ]* 10.3 Write unit tests for Theme Manager
    - Test init() applies light theme when no stored preference
    - Test init() applies stored theme preference
    - Test toggle() switches from light to dark
    - Test toggle() switches from dark to light
    - Test apply() adds correct CSS class to body
    - Test apply() removes previous theme class
    - Test all theme changes sync to StorageManager

- [ ] 11. Implement User Name Popup
  - Create modal popup HTML structure with overlay
  - Create name input field with label
  - Create Submit and Guest buttons
  - Implement popup display logic on first load (no userName in storage)
  - Implement Submit button handler storing user input as userName
  - Implement Guest button handler storing "Guest" as userName
  - Implement input validation (non-empty for Submit)
  - Close popup after name is set
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 11.1 Write unit tests for User Name Popup
  - Test popup displays when no userName in storage
  - Test popup does not display when userName exists in storage
  - Test Submit button stores entered name and closes popup
  - Test Guest button stores "Guest" and closes popup
  - Test Submit with empty input shows validation error

- [ ] 12. Implement CSS styling
  - [ ] 12.1 Create base styles and layout
    - Define CSS custom properties for colors (light/dark themes)
    - Style body with flexbox for centered dashboard container
    - Create card-style container with padding and shadow
    - Define typography (font family, sizes, weights)
    - Style form inputs and buttons with consistent appearance
    - Add responsive layout rules for mobile devices
    - _Requirements: 11.1, 11.2, 13.1, 13.5_

  - [ ] 12.2 Style Greeting Module
    - Style time display with large, bold typography
    - Style date display with medium typography
    - Style greeting message with personalized styling
    - Add spacing between time/date/greeting elements

  - [ ] 12.3 Style Timer Module
    - Style timer display with large, monospace typography
    - Style timer control buttons with clear visual hierarchy
    - Add visual feedback for running vs. stopped states
    - Style timer completion alert with prominent appearance

  - [ ] 12.4 Style Tasks Module
    - Style task list with consistent spacing
    - Style task items with flexbox layout (checkbox, description, buttons)
    - Add strikethrough styling for completed tasks
    - Style task form with inline layout
    - Style sort dropdown with clear options
    - Add hover states for interactive elements

  - [ ] 12.5 Style Links Module
    - Style link buttons with consistent appearance
    - Add hover/active states for link buttons
    - Style link form with inline layout
    - Add visual feedback for link deletion

  - [ ] 12.6 Style theme toggle and popup
    - Style theme toggle button with icon or text
    - Create modal popup overlay with centered content
    - Style popup form with clear typography and spacing
    - Add dark theme CSS custom properties and class
    - Ensure all colors meet WCAG AA contrast requirements

- [ ] 13. Wire all modules together in main initialization
  - Create DOMContentLoaded event listener
  - Check StorageManager.isAvailable() and display error if unavailable
  - Initialize StorageManager
  - Initialize ThemeManager
  - Initialize GreetingModule
  - Initialize TimerModule
  - Initialize TasksModule
  - Initialize LinksModule
  - Show User Name Popup if no userName stored
  - _Requirements: 11.3, 13.4_

- [ ]* 13.1 Write integration tests for dashboard initialization
  - Test full dashboard initialization loads all stored data
  - Test task operations trigger immediate localStorage updates
  - Test timer countdown updates display every second (with fake timers)
  - Test theme change applies CSS classes within 100ms
  - Test browser session persistence (save, clear memory, reload, verify restore)

- [ ] 14. Add error handling and validation
  - Implement localStorage unavailable error message display
  - Implement localStorage full (QuotaExceededError) error handling
  - Implement JSON parse failure handling with empty defaults
  - Add inline validation messages for all form inputs
  - Implement notification permission denied fallback with visual alert
  - Add invalid Date object handling in greeting display
  - Wrap risky operations in try-catch blocks with user-friendly messages
  - _Requirements: 11.3_

- [ ]* 14.1 Write unit tests for error handling
  - Test localStorage unavailable displays error message and disables features
  - Test QuotaExceededError shows inline error message
  - Test JSON parse failure returns empty defaults
  - Test notification denied shows visual completion alert
  - Test invalid Date displays "Invalid Date" message

- [ ] 15. Checkpoint - Full application review
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Performance optimization and final polish
  - Verify dashboard loads within 1 second
  - Verify all interactions provide feedback within 100ms
  - Ensure timer updates don't cause UI lag
  - Review localStorage operations for efficiency
  - Test application in all Modern_Browsers (Chrome, Firefox, Edge, Safari)
  - Verify keyboard navigation works for all interactive elements
  - Test accessibility with screen reader (basic check)
  - Verify color contrast meets WCAG AA standards
  - _Requirements: 11.1, 11.2, 11.4, 12.1, 12.2, 12.3, 12.4_

- [ ]* 16.1 Write performance tests
  - Test initial load time is under 1 second
  - Test interaction response time is under 100ms
  - Test timer update smoothness (no frame drops)

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for course correction
- Property tests validate universal correctness properties with 100+ random inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The design uses JavaScript, so all code examples and implementation should use JavaScript
- All modules persist state to Local Storage via StorageManager after every change
- Testing uses Vitest for unit tests and fast-check for property-based tests
- Property tests are tagged with Feature name and Property number for design traceability

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4", "4.5", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "7.1"] },
    { "id": 6, "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "8.1"] },
    { "id": 7, "tasks": ["8.2", "8.3", "8.4", "8.5", "8.6", "8.7"] },
    { "id": 8, "tasks": ["10.1", "11"] },
    { "id": 9, "tasks": ["10.2", "10.3", "11.1", "12.1"] },
    { "id": 10, "tasks": ["12.2", "12.3", "12.4", "12.5", "12.6"] },
    { "id": 11, "tasks": ["13"] },
    { "id": 12, "tasks": ["13.1", "14"] },
    { "id": 13, "tasks": ["14.1"] },
    { "id": 14, "tasks": ["16"] },
    { "id": 15, "tasks": ["16.1"] }
  ]
}
```
