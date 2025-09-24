let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

// Ensure all budgets have valid amount and expenses
budgets = budgets.map(budget => ({
  ...budget,
  id: budget.id || Date.now().toString(),
  amount: parseFloat(budget.amount) || 0,
  expenses: Array.isArray(budget.expenses) ? budget.expenses : [],
  spent: parseFloat(budget.spent) || 0,
  emoji: budget.emoji || '💰',
  name: budget.name || 'Unnamed Budget'
}));
localStorage.setItem('budgets', JSON.stringify(budgets));

document.addEventListener('DOMContentLoaded', () => {
  const createBudgetBtn = document.getElementById('createBudgetBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const cancelBtn = document.getElementById('cancelBtn');
  const budgetForm = document.getElementById('budgetForm');
  const emojiPickerModal = document.getElementById('emojiPickerModal');
  const openEmojiPicker = document.getElementById('openEmojiPicker');
  const closeEmojiPicker = document.getElementById('closeEmojiPicker');
  const emojiGrid = document.getElementById('emojiGrid');
  const selectedEmoji = document.getElementById('selectedEmoji');
  const categoryButtons = document.querySelectorAll('.emoji-categories button');
  const budgetCardsContainer = document.getElementById('budgetCardsContainer');

  let currentCategory = 'smileys';
  let currentEmoji = '😊';

  const emojiData = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠'],
    activities: ['⚽', '🖤', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷']
  };

  function loadEmojis(category) {
    emojiGrid.innerHTML = '';
    emojiData[category].forEach(emoji => {
      const emojiElement = document.createElement('div');
      emojiElement.className = 'emoji-item';
      emojiElement.textContent = emoji;
      emojiElement.addEventListener('click', () => {
        currentEmoji = emoji;
        selectedEmoji.textContent = emoji;
        emojiPickerModal.style.display = 'none';
      });
      emojiGrid.appendChild(emojiElement);
    });
  }

  loadEmojis(currentCategory);

  openEmojiPicker.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    emojiPickerModal.style.display = 'block';
    loadEmojis(currentCategory);
  });

  closeEmojiPicker.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPickerModal.style.display = 'none';
  });

  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.dataset.category;
      loadEmojis(currentCategory);
    });
  });

  createBudgetBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    budgetForm.reset();
    selectedEmoji.textContent = '😊';
    currentEmoji = '😊';
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
      budgetForm.reset();
      selectedEmoji.textContent = '😊';
      currentEmoji = '😊';
    }
  });

  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('budgetName').value.trim();
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (!name || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid budget name and amount.');
      return;
    }

    const newBudget = {
      id: Date.now().toString(),
      name,
      amount,
      emoji: currentEmoji,
      spent: 0,
      expenses: []
    };

    budgets.push(newBudget);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    createBudgetCard(newBudget);

    modalOverlay.style.display = 'none';
    budgetForm.reset();
    selectedEmoji.textContent = '😊';
    currentEmoji = '😊';
  });

  function createBudgetCard(budget) {
    const { id, name, emoji = '💰' } = budget;
    const amount = parseFloat(budget.amount) || 0;
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const spent = transactions
        .filter(t => t.type === 'Expense' && t.category === name)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const remaining = amount - spent;
    const progressPercent = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

    const card = document.createElement('div');
    card.className = 'budget-card';
    card.innerHTML = `
      <div class="budget-card-header">
        <div class="emoji">${emoji}</div>
        <div class="title">${name}</div>
        <div class="amount">₹${amount.toFixed(2)}</div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="info-label">Spent</span>
          <span class="info-value spent">₹${spent.toFixed(2)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Remaining</span>
          <span class="info-value remaining">₹${remaining.toFixed(2)}</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width: ${progressPercent}%"></div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `expense.html?id=${id}`;
    });

    budgetCardsContainer.appendChild(card);
  }

  function refreshBudgetCards() {
    budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    budgetCardsContainer.innerHTML = '<div class="create-budget-card" id="createBudgetBtn"><i class="fas fa-plus" style="opacity: 0.5;"></i><p>Create New Budget</p></div>';
    budgets.forEach(budget => createBudgetCard(budget));
    document.getElementById('createBudgetBtn').addEventListener('click', () => {
      modalOverlay.style.display = 'flex';
    });
  }

  // Initial render
  refreshBudgetCards();

  // Listen for storage changes to refresh dynamically
  window.addEventListener('storage', function(e) {
    if (e.key === 'budgets' || e.key === 'transactions') {
      refreshBudgetCards();
    }
  });

  // Auto-refresh every 4 seconds if modal is not open
  setInterval(() => {
    if (modalOverlay.style.display !== 'flex') {
      console.log('Dynamically refreshing budget cards');
      refreshBudgetCards();
    } else {
      console.log('Skipping refresh: Budget creation modal is open');
    }
  }, 4000);
});