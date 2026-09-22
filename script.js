/* =========================================================
   SpendWise – interactive budgeting
   Flow:  user action (event)  ->  update data (array)
          ->  process data (loops + conditionals)  ->  update page (DOM)
   ========================================================= */

const CURRENCY = "$";
const CATEGORIES = ["Food", "Transport", "Rent & bills", "Fun", "Health", "Other"];
const STORAGE_KEY = "spendwise-data";

/* ---------- 1. DATA (arrays store multiple records) ---------- */
let budget = 1000;
let expenses = [
  { id: 1, name: "Groceries",     amount: 120,  category: "Food",         date: "2026-09-03" },
  { id: 2, name: "Bus pass",      amount: 45,   category: "Transport",    date: "2026-09-05" },
  { id: 3, name: "Electricity",   amount: 90.5, category: "Rent & bills", date: "2026-09-08" }
];
let nextId = 4;
let activeFilter = "All";

/* ---------- 2. DOM REFERENCES ---------- */
const $ = (id) => document.getElementById(id);

const totalSpentEl   = $("total-spent");
const remainingEl    = $("remaining");
const budgetDisplay  = $("budget-display");
const gaugeEl        = $("gauge");
const gaugeFill      = $("gauge-fill");
const statusEl       = $("status-message");
const tipEl          = $("tip-message");
const categoryListEl = $("category-list");
const expenseListEl  = $("expense-list");
const listSummaryEl  = $("list-summary");
const filterSelect   = $("filter-category");

const budgetForm     = $("budget-form");
const budgetInput    = $("budget-input");
const budgetError    = $("budget-error");
const expenseForm    = $("expense-form");
const nameInput      = $("expense-name");
const amountInput    = $("expense-amount");
const categorySelect = $("expense-category");
const dateInput      = $("expense-date");
const expenseError   = $("expense-error");
const clearAllBtn    = $("clear-all");

/* ---------- 3. SAVING (so data survives a refresh) ---------- */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ budget, expenses, nextId }));
  } catch (err) { /* storage unavailable: app still works for this session */ }
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.expenses)) {
      budget = saved.budget;
      expenses = saved.expenses;
      nextId = saved.nextId;
    }
  } catch (err) { /* nothing saved yet, keep the starter data */ }
}

/* ---------- 4. PROCESSING (loops) ---------- */

// FOR loop: add up every expense
function calculateTotal(list) {
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    total += list[i].amount;
  }
  return total;
}

// FOR...OF loop: total for each category, returned as an object
function totalsByCategory(list) {
  const totals = {};
  for (const category of CATEGORIES) {
    totals[category] = 0;
  }
  for (const item of list) {
    totals[item.category] += item.amount;
  }
  return totals;
}

// Loop to find the single biggest expense
function findLargest(list) {
  let largest = null;
  for (const item of list) {
    if (largest === null || item.amount > largest.amount) {
      largest = item;
    }
  }
  return largest;
}

// Loop to find the category with the highest spending
function findTopCategory(totals) {
  let topName = null;
  let topAmount = 0;
  for (const name in totals) {
    if (totals[name] > topAmount) {
      topName = name;
      topAmount = totals[name];
    }
  }
  return topName;
}

/* ---------- 5. DECISIONS (conditionals) ---------- */

// Decide how the user is doing, based on how much of the budget is used
function getBudgetStatus(spent, budgetAmount) {
  if (budgetAmount <= 0) {
    return { level: "ok", message: "Set a monthly budget to start tracking." };
  }

  const percent = (spent / budgetAmount) * 100;

  if (percent > 100) {
    const over = spent - budgetAmount;
    return { level: "over", percent, message: `You are over budget by ${money(over)}.` };
  } else if (percent >= 80) {
    return { level: "warning", percent, message: `${Math.round(percent)}% used. You are close to your limit.` };
  } else if (percent >= 50) {
    return { level: "watch", percent, message: `${Math.round(percent)}% used. Past the halfway mark, so keep an eye on it.` };
  } else if (spent === 0) {
    return { level: "ok", percent, message: "No spending yet. Add your first expense." };
  } else {
    return { level: "ok", percent, message: `${Math.round(percent)}% used. You are on track.` };
  }
}

// Decide what advice to give based on the data
function getTip(list, totals, spent, budgetAmount) {
  if (list.length === 0) {
    return "Your expenses will appear here once you add them.";
  }
  const topCategory = findTopCategory(totals);
  const share = (totals[topCategory] / spent) * 100;
  const largest = findLargest(list);

  if (budgetAmount > 0 && spent > budgetAmount) {
    return `${topCategory} is your biggest category. Cutting back there would help the most.`;
  } else if (share >= 50 && list.length >= 3) {
    return `${topCategory} makes up ${Math.round(share)}% of your spending.`;
  } else if (budgetAmount > 0 && largest.amount >= budgetAmount * 0.3) {
    return `"${largest.name}" alone takes ${Math.round((largest.amount / budgetAmount) * 100)}% of your budget.`;
  }
  return `Your largest expense so far is "${largest.name}" at ${money(largest.amount)}.`;
}

/* ---------- 6. HELPERS ---------- */
function money(value) {
  return CURRENCY + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/* ---------- 7. DOM UPDATES ---------- */

function renderSummary() {
  const spent = calculateTotal(expenses);
  const remaining = budget - spent;
  const status = getBudgetStatus(spent, budget);
  const totals = totalsByCategory(expenses);

  totalSpentEl.textContent = money(spent);
  budgetDisplay.textContent = money(budget);
  remainingEl.textContent = money(remaining);
  remainingEl.style.color = remaining < 0 ? "var(--over)" : "";

  const fillPercent = Math.min(status.percent || 0, 100);
  gaugeFill.style.width = fillPercent + "%";
  gaugeEl.dataset.status = status.level;
  gaugeEl.setAttribute("aria-label", `${Math.round(status.percent || 0)}% of budget used`);

  statusEl.textContent = status.message;
  statusEl.dataset.status = status.level;
  tipEl.textContent = getTip(expenses, totals, spent, budget);
}

function renderCategories() {
  const totals = totalsByCategory(expenses);
  const spent = calculateTotal(expenses);
  const top = findTopCategory(totals);

  categoryListEl.innerHTML = "";

  for (const category of CATEGORIES) {
    const share = spent > 0 ? (totals[category] / spent) * 100 : 0;

    const row = document.createElement("li");
    row.className = "category-row" + (category === top ? " is-top" : "");

    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = category;

    const bar = document.createElement("div");
    bar.className = "category-bar";
    const fill = document.createElement("span");
    fill.style.width = share + "%";
    bar.appendChild(fill);

    const amount = document.createElement("span");
    amount.className = "category-amount";
    amount.textContent = money(totals[category]);

    row.append(name, bar, amount);
    categoryListEl.appendChild(row);
  }
}

function renderExpenses() {
  // Filtering decision: show everything, or only the chosen category
  const visible = [];
  for (const item of expenses) {
    if (activeFilter === "All" || item.category === activeFilter) {
      visible.push(item);
    }
  }
  visible.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const largest = findLargest(visible);
  expenseListEl.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = expenses.length === 0
      ? "No expenses yet. Use the form to add one."
      : `No expenses in ${activeFilter}.`;
    expenseListEl.appendChild(empty);
    listSummaryEl.textContent = "";
    return;
  }

  const label = visible.length === 1 ? "expense" : "expenses";
  listSummaryEl.textContent =
    `${visible.length} ${label}, ${money(calculateTotal(visible))} total` +
    (activeFilter === "All" ? "" : ` in ${activeFilter}`);

  for (const item of visible) {
    const li = document.createElement("li");
    li.className = "expense-item" + (visible.length > 1 && item === largest ? " is-largest" : "");

    const main = document.createElement("div");
    main.className = "expense-main";
    const title = document.createElement("strong");
    title.textContent = item.name;
    const meta = document.createElement("span");
    meta.className = "expense-meta";
    meta.textContent = `${item.category} · ${formatDate(item.date)}`;
    main.append(title, meta);

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = money(item.amount);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn-delete";
    del.textContent = "Delete";
    del.dataset.id = item.id;
    del.setAttribute("aria-label", `Delete ${item.name}`);

    li.append(main, amount, del);
    expenseListEl.appendChild(li);
  }
}

function renderAll() {
  renderSummary();
  renderCategories();
  renderExpenses();
}

function fillDropdowns() {
  categorySelect.innerHTML = "";
  filterSelect.innerHTML = '<option value="All">All categories</option>';
  for (const category of CATEGORIES) {
    categorySelect.add(new Option(category, category));
    filterSelect.add(new Option(category, category));
  }
}

/* ---------- 8. EVENT LISTENERS (user actions) ---------- */

// Add an expense
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;
  const date = dateInput.value;

  // Validate with conditionals before touching the data
  if (name === "") {
    expenseError.textContent = "Enter what the expense was for.";
    nameInput.focus();
    return;
  } else if (isNaN(amount) || amount <= 0) {
    expenseError.textContent = "Enter an amount greater than zero.";
    amountInput.focus();
    return;
  } else if (date === "") {
    expenseError.textContent = "Pick the date of the expense.";
    dateInput.focus();
    return;
  }

  expenseError.textContent = "";
  expenses.push({ id: nextId++, name, amount, category, date });   // update the array
  saveData();
  renderAll();                                                     // update the page

  expenseForm.reset();
  dateInput.value = todayISO();
  nameInput.focus();
});

// Set the budget
budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = parseFloat(budgetInput.value);

  if (isNaN(value) || value <= 0) {
    budgetError.textContent = "Enter a budget greater than zero.";
    return;
  }

  budgetError.textContent = "";
  budget = value;
  budgetInput.value = "";
  saveData();
  renderAll();
});

// Delete an expense (one listener on the list handles every Delete button)
expenseListEl.addEventListener("click", (event) => {
  const button = event.target.closest(".btn-delete");
  if (!button) return;

  const id = Number(button.dataset.id);
  const remaining = [];
  for (const item of expenses) {
    if (item.id !== id) remaining.push(item);
  }
  expenses = remaining;
  saveData();
  renderAll();
});

// Filter the list
filterSelect.addEventListener("change", () => {
  activeFilter = filterSelect.value;
  renderExpenses();
});

// Clear everything
clearAllBtn.addEventListener("click", () => {
  if (expenses.length === 0) return;
  if (confirm("Delete all expenses? This can't be undone.")) {
    expenses = [];
    saveData();
    renderAll();
  }
});

/* ---------- 9. START ---------- */
loadData();
fillDropdowns();
dateInput.value = todayISO();
renderAll();
