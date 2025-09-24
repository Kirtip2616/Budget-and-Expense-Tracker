document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const budgetId = urlParams.get('id');

  // Profile menu functionality
  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const logoutBtn = document.getElementById('logoutBtn');

  // Toggle profile dropdown
  profileIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
    console.log('Profile icon clicked, dropdown toggled');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('show');
    }
  });

  // Dark mode toggle
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    console.log('Theme toggled to:', newTheme);
  });

  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  let selectedBudget = budgets.find(b => b.id === budgetId);

  const budgetName = document.getElementById('budgetName');
  const budgetTotal = document.getElementById('budgetTotal');
  const budgetEmoji = document.getElementById('budgetEmoji');
  const budgetProgress = document.getElementById('budgetProgress');
  const budgetSpentText = document.getElementById('budgetSpentText');
  const budgetRemainingText = document.getElementById('budgetRemainingText');
  const expenseTableBody = document.getElementById('expenseTableBody');
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const editBudgetBtn = document.getElementById('editBudgetBtn');
  const deleteBudgetBtn = document.getElementById('deleteBudgetBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const budgetForm = document.getElementById('budgetForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const openEmojiPicker = document.getElementById('openEmojiPicker');
  const closeEmojiPicker = document.getElementById('closeEmojiPicker');
  const emojiGrid = document.getElementById('emojiGrid');
  const selectedEmoji = document.getElementById('selectedEmoji');
  const categoryButtons = document.querySelectorAll('.emoji-categories button');
  const expenseNameInput = document.getElementById('expenseName');
  const expenseAmountInput = document.getElementById('expenseAmount');
  const budgetNameInput = document.getElementById('budgetNameInput');
  const budgetAmountInput = document.getElementById('budgetAmountInput');

  // Custom Alert Function
  function showCustomAlert(message, onConfirm, onCancel, showCancel = true) {
    console.log('showCustomAlert: Starting with message:', message, 'showCancel:', showCancel);
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('customAlertMessage');
    const alertOk = document.getElementById('customAlertOk');
    const alertCancel = document.getElementById('customAlertCancel');

    if (!alertBox || !alertMessage || !alertOk || !alertCancel) {
      console.error('showCustomAlert: Missing elements:', {
        alertBox: !!alertBox,
        alertMessage: !!alertMessage,
        alertOk: !!alertOk,
        alertCancel: !!alertCancel
      });
      if (onConfirm) onConfirm();
      return;
    }

    try {
      alertMessage.textContent = message;
      alertCancel.style.display = showCancel ? 'inline-block' : 'none';
      alertBox.classList.add('show');
      console.log('showCustomAlert: Alert displayed, Cancel button:', showCancel ? 'visible' : 'hidden');

      const closeAlert = (executeConfirm = false) => {
        console.log('showCustomAlert: closeAlert triggered, executeConfirm:', executeConfirm);
        alertBox.classList.remove('show');
        alertOk.removeEventListener('click', handleOk);
        alertCancel.removeEventListener('click', handleCancel);
        alertBox.removeEventListener('click', outsideClick);
        document.removeEventListener('keydown', keyPress);
        if (executeConfirm && onConfirm) {
          try {
            onConfirm();
          } catch (error) {
            console.error('showCustomAlert: onConfirm error:', error);
          }
        } else if (!executeConfirm && onCancel) {
          try {
            onCancel();
          } catch (error) {
            console.error('showCustomAlert: onCancel error:', error);
          }
        }
      };

      const handleOk = () => closeAlert(true);
      const handleCancel = () => closeAlert(false);

      const outsideClick = (e) => {
        if (e.target === alertBox) {
          console.log('showCustomAlert: Outside click detected');
          closeAlert(false);
        }
      };

      const keyPress = (e) => {
        if (e.key === 'Enter') {
          console.log('showCustomAlert: Enter key pressed');
          closeAlert(true);
        } else if (e.key === 'Escape' && showCancel) {
          console.log('showCustomAlert: Escape key pressed');
          closeAlert(false);
        }
      };

      alertOk.removeEventListener('click', handleOk);
      alertCancel.removeEventListener('click', handleCancel);
      alertBox.removeEventListener('click', outsideClick);
      document.removeEventListener('keydown', keyPress);

      alertOk.addEventListener('click', handleOk);
      if (showCancel) {
        alertCancel.addEventListener('click', handleCancel);
      }
      alertBox.addEventListener('click', outsideClick);
      document.addEventListener('keydown', keyPress);
      console.log('showCustomAlert: Event listeners attached');
    } catch (error) {
      console.error('showCustomAlert: Error displaying alert:', error);
      if (onConfirm) onConfirm();
    }
  }

  // Check for duplicate IDs
  console.log('budgetName elements:', document.querySelectorAll('#budgetName').length);
  console.log('budgetTotal elements:', document.querySelectorAll('#budgetTotal').length);
  console.log('budgetEmoji elements:', document.querySelectorAll('#budgetEmoji').length);

  let currentCategory = 'smileys';
  let currentEmoji = selectedBudget ? selectedBudget.emoji : '😊';

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
        document.getElementById('emojiPickerModal').style.display = 'none';
      });
      emojiGrid.appendChild(emojiElement);
    });
  }

  loadEmojis(currentCategory);

  openEmojiPicker.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('emojiPickerModal').style.display = 'block';
    loadEmojis(currentCategory);
  });

  closeEmojiPicker.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('emojiPickerModal').style.display = 'none';
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

  function getBudgetExpenses() {
    return transactions.filter(t => t.type === 'Expense' && t.category === selectedBudget.name);
  }

  function renderBudget() {
    if (!selectedBudget) {
      console.log('No selected budget');
      return;
    }
    const expenses = getBudgetExpenses();
    const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const remaining = selectedBudget.amount - spent;
    const progress = selectedBudget.amount > 0 ? Math.min((spent / selectedBudget.amount) * 100, 100) : 0;

    console.log('Rendering budget:', { name: selectedBudget.name, amount: selectedBudget.amount, emoji: selectedBudget.emoji, spent, remaining, progress });

    try {
      console.log('Current budgetName:', budgetName.textContent);
      console.log('Current budgetTotal:', budgetTotal.textContent);
      console.log('Current budgetEmoji:', budgetEmoji.textContent);

      budgetName.innerText = selectedBudget.name || 'Unnamed Budget';
      console.log('Set budgetName to:', budgetName.innerText);
      budgetTotal.innerText = `₹${parseFloat(selectedBudget.amount || 0).toFixed(2)}`;
      console.log('Set budgetTotal to:', budgetTotal.innerText);
      budgetEmoji.innerText = selectedBudget.emoji || '💰';
      console.log('Set budgetEmoji to:', budgetEmoji.innerText);
      budgetSpentText.innerText = `₹${spent.toFixed(2)}`;
      console.log('Set budgetSpentText to:', budgetSpentText.innerText);
      budgetRemainingText.innerText = `₹${remaining.toFixed(2)}`;
      console.log('Set budgetRemainingText to:', budgetRemainingText.innerText);
      budgetProgress.style.width = `${progress}%`;
      console.log('Set budgetProgress to:', budgetProgress.style.width);
    } catch (error) {
      console.error('Error updating DOM:', error);
    }
  }

  function renderExpenses() {
    expenseTableBody.innerHTML = '';
    const expenses = getBudgetExpenses();
    console.log('Rendering expenses:', expenses);
    expenses.forEach((exp, index) => {
      const tr = document.createElement('tr');
      tr.className = 'tdg';
      tr.innerHTML = `
        <td>${exp.name || 'Unnamed Expense'}</td>
        <td>₹${parseFloat(exp.amount).toFixed(2)}</td>
        <td>${exp.date}</td>
        <td><button class="delete-btn" data-index="${index}">🗑️</button></td>
      `;
      expenseTableBody.appendChild(tr);
    });

    // Attach event listeners to delete buttons
    const deleteButtons = expenseTableBody.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        const expense = expenses[index];
        showCustomAlert(
          `Are you sure you want to delete the expense "${expense.name || 'Unnamed Expense'}"?`,
          () => {
            console.log('Deleting expense at index:', index);
            deleteExpense(index);
          },
          () => {
            console.log('Expense deletion cancelled');
          }
        );
      });
    });
  }

  function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (!name || isNaN(amount) || amount <= 0) {
      showCustomAlert('Please enter a valid expense name and amount.', null, null, false);
      return;
    }

    const expense = {
      id: Date.now().toString(),
      name: name,
      description: name,
      amount: amount,
      type: 'Expense',
      category: selectedBudget.name,
      date: new Date().toISOString().split('T')[0] // ISO format (YYYY-MM-DD)
    };

    // Add to transactions array
    transactions.push(expense);
    
    // Update localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear input fields
    expenseNameInput.value = '';
    expenseAmountInput.value = '';

    // Re-render both the budget details and expenses table
    renderBudget();
    renderExpenses();

    showCustomAlert('Expense added successfully!', null, null, false);
  }

  function deleteExpense(index) {
    const expenses = getBudgetExpenses();
    const expenseToDelete = expenses[index];
    
    // Find the actual index in the transactions array
    const transactionIndex = transactions.findIndex(t => 
      t.name === expenseToDelete.name && 
      t.amount === expenseToDelete.amount && 
      t.date === expenseToDelete.date
    );

    if (transactionIndex !== -1) {
      transactions.splice(transactionIndex, 1);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Re-render both the budget details and expenses table
      renderBudget();
      renderExpenses();
      
      showCustomAlert('Expense deleted successfully!', null, null, false);
    }
  }

  function editBudget() {
    if (!selectedBudget) {
      showCustomAlert('No budget selected for editing.');
      return;
    }
    budgetNameInput.value = selectedBudget.name || '';
    budgetAmountInput.value = selectedBudget.amount || '';
    selectedEmoji.textContent = selectedBudget.emoji || '😊';
    currentEmoji = selectedBudget.emoji || '😊';
    modalOverlay.style.display = 'flex';
  }

  function deleteBudget() {
    showCustomAlert(
      'Are you sure you want to delete this budget?',
      () => {
        console.log('Deleting budget and associated expenses');
        
        // Remove associated expenses from transactions
        const updatedTransactions = transactions.filter(t => 
          t.type !== 'Expense' || t.category !== selectedBudget.name
        );
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Remove the budget
        budgets = budgets.filter(b => b.id !== selectedBudget.id);
        localStorage.setItem('budgets', JSON.stringify(budgets));
        
        // Trigger storage events to update all charts
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'transactions',
          newValue: JSON.stringify(updatedTransactions),
          storageArea: localStorage
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'budgets',
          newValue: JSON.stringify(budgets),
          storageArea: localStorage
        }));
        
        window.location.href = 'budget.html';
      },
      () => {
        console.log('Budget deletion cancelled');
      }
    );
  }

  budgetForm.removeEventListener('submit', handleFormSubmit);
  function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    const name = budgetNameInput.value.trim();
    const amount = parseFloat(budgetAmountInput.value.trim());

    if (!name || isNaN(amount) || amount <= 0) {
      showCustomAlert('Please enter a valid budget name and amount.');
      return;
    }

    if (!selectedBudget) {
      showCustomAlert('No budget selected for editing.');
      return;
    }

    selectedBudget.name = name;
    selectedBudget.amount = amount;
    selectedBudget.emoji = currentEmoji;

    budgets = budgets.map(b => b.id === selectedBudget.id ? { ...selectedBudget } : b);
    console.log('Updated budgets:', budgets);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    window.dispatchEvent(new Event('storage'));

    modalOverlay.style.display = 'none';
    renderBudget();
  }
  budgetForm.addEventListener('submit', handleFormSubmit);

  addExpenseBtn.addEventListener('click', addExpense);
  editBudgetBtn.addEventListener('click', editBudget);
  deleteBudgetBtn.addEventListener('click', deleteBudget);
  cancelBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });

  // Dynamic refresh on storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'budgets' || e.key === 'transactions') {
      budgets = JSON.parse(localStorage.getItem('budgets')) || [];
      transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      selectedBudget = budgets.find(b => b.id === budgetId);
      if (!selectedBudget) {
        showCustomAlert(
          'This budget has been deleted.',
          () => {
            window.location.href = 'budget.html';
          },
          null,
          false
        );
        return;
      }
      renderBudget();
      renderExpenses();
    }
  });

  if (selectedBudget) {
    renderBudget();
    renderExpenses();
  } else {
    console.log('No selected budget, showing alert and preparing redirect');
    showCustomAlert(
      'Please select a budget card to add expenses',
      () => {
        console.log('Attempting redirect to budget.html');
        try {
          window.location.href = 'budget.html';
        } catch (error) {
          console.error('Redirect failed:', error);
        }
      },
      null,
      false
    );
  }
  const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection pool

// POST /api/expenses - Add a new expense
router.post('/', (req, res) => {
  const { budgetId, amount, description } = req.body;

  if (!budgetId || !amount) {
    return res.status(400).json({ error: 'budgetId and amount are required.' });
  }

  const query = `
    INSERT INTO Expenses (budgetId, amount, description, timestamp)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [budgetId, amount, description || ''], (err, result) => {
    if (err) {
      console.error('Error inserting expense:', err);
      return res.status(500).json({ error: 'Failed to add expense' });
    }

    res.status(201).json({ success: true, expenseId: result.insertId });
  });
});

module.exports = router;

});