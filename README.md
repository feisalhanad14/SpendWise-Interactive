# SpendWise

SpendWise is a budgeting app that lets you set a monthly budget, log expenses, and see how much of your budget you have used. This week I made it interactive with JavaScript: it now makes decisions, stores multiple records, loops through them, updates the page, and responds to user actions.

## Files

- `index.html` – page structure (dashboard, budget form, expense form)
- `style.css` – layout and styling
- `script.js` – all application logic

## Improvements made this week

- Expenses are stored in an array of objects instead of separate variables.
- The dashboard (spent, remaining, budget, progress bar, status message, tip) updates on the page instead of only in the console.
- Users can set a budget, add expenses, delete expenses, filter by category, and clear all expenses.
- The app gives feedback based on how much of the budget has been used.
- Forms are validated, and errors show on the page next to the form.
- Data is saved in `localStorage`, so it is still there after a refresh.
- The largest expense is tagged, and a category breakdown shows where the money goes.

## How conditionals are used

- `getBudgetStatus()` uses `if / else if / else` to decide the budget state from the percentage used:
  - over 100%: over budget, with the amount by which the budget is exceeded
  - 80% to 100%: warning
  - 50% to 79%: watch
  - under 50%: on track
  - no spending yet: prompts the user to add an expense
- `getTip()` uses conditionals to choose advice, for example when one category makes up half of all spending, or when a single expense takes a large share of the budget.
- The form submit handlers check for empty names, invalid amounts and missing dates before changing any data.
- The expense list checks the selected filter and shows an empty-state message when there is nothing to display.

## How arrays are used to store data

All expenses live in one array called `expenses`. Each record is an object:

\`\`\`js
{ id: 4, name: "Lunch", amount: 12.5, category: "Food", date: "2026-09-10" }
\`\`\`

- **Add:** `expenses.push(...)` adds a new record.
- **Delete:** a loop builds a new array without the record whose `id` matches.
- **Filter:** a loop copies matching records into a `visible` array for display.
- `CATEGORIES` is also an array and is used to build both dropdowns and the category breakdown.

Loops are used throughout to process these arrays:

- `for` in `calculateTotal()` sums the amounts.
- `for...of` in `totalsByCategory()` and `findLargest()` totals each category and finds the biggest expense.
- `for...in` in `findTopCategory()` finds the category with the highest total.
- The render functions loop over the records to build the list and the category bars.

## How the DOM is updated

- `renderSummary()` sets the text of the totals with `textContent`, sets the width of the progress bar, and sets a `data-status` attribute so CSS can change the colour (green, amber, orange, red).
- `renderCategories()` and `renderExpenses()` clear their lists, then build each row with `document.createElement()` and `append()`.
- `renderAll()` calls all three, so the whole dashboard stays in sync after any change.
- Text is inserted with `textContent` rather than `innerHTML`, so anything a user types is displayed as plain text and cannot inject HTML.

## How user interactions are handled through events

| Event | What happens |
|---|---|
| `submit` on the expense form | Validates input, pushes a new record into `expenses`, saves, re-renders |
| `submit` on the budget form | Validates the number, updates `budget`, re-renders |
| `click` on the expense list | One listener handles every Delete button using `event.target.closest()` and the button's `data-id` |
| `change` on the category dropdown | Updates the active filter and re-renders the list |
| `click` on Clear all | Asks for confirmation, empties the array, re-renders |

Every interaction follows the same flow: **user action → event listener → validate → update the array → save → re-render the page.**

## Challenges and how I solved them

- **Delete buttons that are created dynamically.** Buttons created by JavaScript did not exist when the page loaded, so I could not attach listeners to them directly. I used event delegation: one listener on the parent list checks which button was clicked.
- **Progress bar going past 100%.** When spending exceeded the budget, the bar overflowed its container. I capped the fill width at 100% and let the status message and the red colour show the overspend.
- **Dates shifting by a day.** Creating a date from `"2026-09-10"` can be read as UTC and display the wrong day. I added `T00:00:00` when formatting so it is treated as local time.
- **Keeping everything in sync.** Early on, I updated pieces of the page separately and they went out of date. Putting all rendering behind `renderAll()` fixed this.
- **User-entered text in the page.** I switched to `createElement` and `textContent` so entered text cannot be treated as HTML.

## How to run

1. Download or clone the repository.
2. Open `index.html` in a browser. No build step or installation is needed.

## Testing checklist

- [x] Add an expense and see totals, bars and list update
- [x] Submit empty or invalid forms and see an error message
- [x] Set a new budget and see the status change
- [x] Push spending above 50%, 80% and 100% and see the message and colour change
- [x] Delete an expense
- [x] Filter by category
- [x] Refresh the page and confirm the data is still there