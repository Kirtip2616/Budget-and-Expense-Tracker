let incomeChart, expenseChart, expenseTrendChart, budgetChart, savingsRateChart, transactionScatter, expensePie;

document.addEventListener('DOMContentLoaded', function() {
    incomeChart = initIncomeChart();
    expenseChart = initExpenseChart();
    budgetChart = initBudgetChart();
    expenseTrendChart = initExpenseTrendChart();
    savingsRateChart = initSavingsRateChart();
    transactionScatter = initTransactionScatter();
    expensePie = initExpensePie();
    
    loadDashboardData();
    
    window.addEventListener('storageUpdate', loadDashboardData);
    
    let lastDataHash = '';
    window.addEventListener('storage', function(e) {
        if (e.key === 'transactions' || e.key === 'budgets') {
            const currentTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const currentBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
            const currentHash = JSON.stringify(currentTransactions) + JSON.stringify(currentBudgets);
            if (currentHash !== lastDataHash) {
                console.log('Data changed, reloading dashboard...');
                lastDataHash = currentHash;
                loadDashboardData();
            } else {
                console.log('Data unchanged, skipping reload.');
            }
        }
    });

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            console.log('Tab is visible, checking for data updates...');
            const currentTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const currentBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
            const currentHash = JSON.stringify(currentTransactions) + JSON.stringify(currentBudgets);
            if (currentHash !== lastDataHash) {
                console.log('Data changed while tab was hidden, reloading dashboard...');
                lastDataHash = currentHash;
                loadDashboardData();
            }
        }
    });
});

function getThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    return {
        gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#dfe6e9',
        textColor: theme === 'dark' ? '#ffffff' : '#2d3748',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff'
    };
}

function initIncomeChart() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('incomeChart').getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: window.chartColors[currentTheme].income,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: themeColors.textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    },
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                },
                datalabels: { display: false }
            }
        }
    });
}
function initExpenseChart() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses',
                data: [],
                backgroundColor: [],  // Initialize as empty; colors will be set in update
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor
                    },
                    ticks: {
                        color: themeColors.textColor
                    },
                    title: {
                        display: true,
                        text: 'Amount (₹)',
                        color: themeColors.textColor
                    }
                },
                x: {
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor
                    },
                    ticks: {
                        color: themeColors.textColor
                    },
                    title: {
                        display: true,
                        text: 'Category',
                        color: themeColors.textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: themeColors.textColor
                    }
                },
                tooltip: {
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                },
                datalabels: { display: false }
            }
        }
    });
}

function initBudgetChart() {
    console.log('Initializing budget chart...');
    const themeColors = getThemeColors();
    const ctx = document.getElementById('budgetChart');
    
    if (!ctx) {
        console.error('Could not find budgetChart canvas element!');
        return null;
    }
    
    console.log('Creating new Chart instance for budget chart...');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Budget Allocated',
                    data: [],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 4,
                    fill: true
                },
                {
                    label: 'Amount Spent',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: themeColors.gridColor,
                        display: true
                    },
                    ticks: {
                        color: themeColors.textColor,
                        backdropColor: 'transparent',
                        callback: function(value) {
                            return '₹' + value;
                        }
                    },
                    pointLabels: {
                        color: themeColors.textColor,
                        font: {
                            size: 12
                        }
                    },
                    angleLines: {
                        display: true,
                        color: themeColors.gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: themeColors.textColor,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.raw.toFixed(2)}`;
                        }
                    },
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                }
            }
        }
    });
}

function initExpenseTrendChart() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('expenseTrend').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Income',
                    data: [],
                    borderColor: '#1e90ff',
                    backgroundColor: 'rgba(30, 144, 255, 0.1)',
                    pointBackgroundColor: '#1e90ff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#ff4500',
                    backgroundColor: 'rgba(255, 69, 0, 0.1)',
                    pointBackgroundColor: '#ff4500',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 10
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor
                    },
                    ticks: {
                        color: themeColors.textColor,
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    },
                    title: {
                        display: true,
                        text: 'Amount (₹)',
                        color: themeColors.textColor
                    }
                },
                x: {
                    type: 'category',
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor,
                        display: false
                    },
                    ticks: {
                        color: themeColors.textColor,
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        color: themeColors.textColor
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: themeColors.textColor,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
                        }
                    }
                },
                datalabels: { display: false }
            }
        }
    });
}

function initSavingsRateChart() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('savingsRateChart').getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Expenses'],
            datasets: [{
                data: [0, 100],
                backgroundColor: window.chartColors[currentTheme].savings,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { 
                    display: true, 
                    position: 'bottom',
                    labels: {
                        color: themeColors.textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    },
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                },
                datalabels: { display: false }
            }
        }
    });
}

function initTransactionScatter() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('transactionScatter').getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Income',
                    data: [],
                    backgroundColor: window.chartColors[currentTheme].scatterIncome,  // Pink
                    pointRadius: 5
                },
                {
                    label: 'Expenses',
                    data: [],
                    backgroundColor: window.chartColors[currentTheme].scatterExpense,  // Purple
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM D'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        color: themeColors.textColor
                    },
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor
                    },
                    ticks: {
                        color: themeColors.textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)',
                        color: themeColors.textColor
                    },
                    grid: {
                        color: themeColors.gridColor,
                        borderColor: themeColors.gridColor
                    },
                    ticks: {
                        color: themeColors.textColor
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: themeColors.textColor
                    }
                },
                tooltip: {
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                },
                datalabels: { display: false }
            }
        }
    });
}
function initExpensePie() {
    const themeColors = getThemeColors();
    const ctx = document.getElementById('expensePie').getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: window.chartColors[currentTheme].pie,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,  // Enable the legend
                    position: 'bottom',  // Position it at the bottom
                    labels: {
                        color: themeColors.textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}% (${formatCurrency(context.dataset.rawAmounts[context.dataIndex])})`;
                        }
                    },
                    backgroundColor: themeColors.backgroundColor,
                    titleColor: themeColors.textColor,
                    bodyColor: themeColors.textColor
                },
                datalabels: { display: false }
            }
        }
    });
}

function parseTransactionDate(dateString) {
    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (ddmmyyyyRegex.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateString);
}

function loadDashboardData() {
    console.log('Starting loadDashboardData...');
    let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    let manualTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let importedTransactions = JSON.parse(localStorage.getItem('importedTransactions')) || [];
    
    // For manual transactions, show them with budget categories
    const transactions = manualTransactions.filter(t => !t.isImported);
    
    console.log('Initial data load:', {
        budgetsCount: budgets.length,
        manualTransactionsCount: transactions.length,
        importedTransactionsCount: importedTransactions.length,
        budgets,
        transactions,
        importedTransactions
    });

    // Reset charts if no data
    if (!transactions.length && !importedTransactions.length) {
        console.log('No transactions found, resetting charts...');
        if (expenseChart) {
            expenseChart.data.labels = [];
            expenseChart.data.datasets[0].data = [];
            expenseChart.update();
        }
        if (incomeChart) {
            incomeChart.data.labels = [];
            incomeChart.data.datasets[0].data = [];
            incomeChart.update();
        }
        updateSummaryCards({ income: 0, expense: 0 });
        return;
    }

    // Normalize transaction dates for both types
    const normalizeTransactions = (trans) => trans.map(t => {
        const parsedDate = parseTransactionDate(t.date);
        if (!isNaN(parsedDate.getTime())) {
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            return { ...t, date: `${year}-${month}-${day}` };
        }
        return t;
    });

    const normalizedManual = normalizeTransactions(transactions);
    const normalizedImported = normalizeTransactions(importedTransactions);
    const allTransactions = [...normalizedManual, ...normalizedImported];

    // Process data
    const summary = calculateSummary(allTransactions);
    console.log('Calculated summary:', summary);

    const { incomeData, expenseData } = categorizeTransactions(allTransactions);
    console.log('Categorized transactions:', { incomeData, expenseData });
    
    const savingsRate = calculateSavingsRate(summary);
    console.log('Calculated savings rate:', savingsRate);

    try {
        console.log('Updating charts with processed data...');
        
        // Update all charts
        updateSummaryCards(summary);
        updateIncomeChartData(incomeChart, incomeData);
        updateExpenseChartData(expenseChart, expenseData);
        updateExpenseTrendChart(expenseTrendChart, allTransactions);
        updateSavingsRateChart(savingsRateChart, savingsRate);
        updateTransactionScatter(transactionScatter, allTransactions);
        updateIncomeExpensePie(expensePie, summary);
        updateBudgetChartData(budgetChart, budgets, transactions); // Only use manual transactions for budget comparison
        updateDateRange();

        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.add('loaded');
        });
        
        console.log('All charts updated successfully');
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

function calculateSavingsRate(summary) {
    if (!summary || summary.income <= 0) return 0;
    
    const savings = summary.income - summary.expense;
    const rate = (savings / summary.income) * 100;
    
    return Math.max(0, Math.min(100, rate));
}

function updateIncomeChartData(chart, data) {
    const themeColors = getThemeColors();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const labels = Object.keys(data);
    const amounts = Object.values(data);
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = amounts;
    chart.data.datasets[0].backgroundColor = labels.map((_, i) => window.chartColors[currentTheme].income[i % window.chartColors[currentTheme].income.length]);
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
    
    updateLegend('incomeLegend', data, chart.data.datasets[0].backgroundColor);
}

function updateExpenseChartData(chart, data) {
    if (!chart) return;
    
    const themeColors = getThemeColors();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const labels = Object.keys(data);
    const amounts = Object.values(data);
    
    // Clear chart if no data
    if (!labels.length) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.data.datasets[0].backgroundColor = [];
        chart.update();
        return;
    }
    
    // Update chart data
    chart.data.labels = labels;
    chart.data.datasets[0].data = amounts;
    
    // Map colors to each category
    const expenseColors = window.chartColors[currentTheme].expense;
    chart.data.datasets[0].backgroundColor = labels.map((_, i) => expenseColors[i % expenseColors.length]);
    
    // Update chart options
    chart.options.scales.y.ticks.color = themeColors.textColor;
    chart.options.scales.y.title.color = themeColors.textColor;
    chart.options.scales.y.grid.color = themeColors.gridColor;
    chart.options.scales.y.grid.borderColor = themeColors.gridColor;
    chart.options.scales.x.ticks.color = themeColors.textColor;
    chart.options.scales.x.title.color = themeColors.textColor;
    chart.options.scales.x.grid.color = themeColors.gridColor;
    chart.options.scales.x.grid.borderColor = themeColors.gridColor;
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
    
    updateLegend('expenseLegend', data, chart.data.datasets[0].backgroundColor);
}
function updateBudgetChartData(chart, budgets, transactions) {
    console.log('Updating budget chart with:', { budgets, transactions });
    const themeColors = getThemeColors();
    if (!budgets.length) {
        chart.data.labels = ['No Budgets'];
        chart.data.datasets[0].data = [0];
        chart.data.datasets[1].data = [0];
        
        chart.options.scales.r.ticks.color = themeColors.textColor;
        chart.options.scales.r.pointLabels.color = themeColors.textColor;
        chart.options.scales.r.grid.color = themeColors.gridColor;
        chart.options.plugins.legend.labels.color = themeColors.textColor;
        chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
        chart.options.plugins.tooltip.titleColor = themeColors.textColor;
        chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
        
        chart.update();
        updateBudgetLegend('budgetLegend', []);
        return;
    }

    const processedBudgets = budgets.map(budget => {
        const relevantTransactions = transactions.filter(t => t.type === 'Expense' && t.category === budget.name);
        console.log(`Processing budget "${budget.name}":`, {
            budgetAmount: budget.amount,
            relevantTransactions,
            transactionCount: relevantTransactions.length
        });
        
        const spent = relevantTransactions.reduce((sum, t) => {
            const amount = parseFloat(t.amount);
            console.log(`Transaction in ${budget.name}:`, { amount, date: t.date });
            return sum + amount;
        }, 0);
        
        const percentage = (spent / budget.amount) * 100;
        console.log(`Budget "${budget.name}" summary:`, {
            allocated: budget.amount,
            spent,
            percentage: percentage.toFixed(1) + '%'
        });
        
        return {
            ...budget,
            spent,
            percentage
        };
    });

    processedBudgets.sort((a, b) => b.amount - a.amount);
    const topBudgets = processedBudgets.slice(0, 6);
    console.log('Top 6 budgets for display:', topBudgets);

    const labels = topBudgets.map(b => `${b.name} ${b.emoji}`);
    const allocated = topBudgets.map(b => b.amount);
    const spent = topBudgets.map(b => b.spent);

    chart.data.labels = labels;
    chart.data.datasets[0].data = allocated;
    chart.data.datasets[1].data = spent;
    
    chart.options.scales.r.ticks.color = themeColors.textColor;
    chart.options.scales.r.pointLabels.color = themeColors.textColor;
    chart.options.scales.r.grid.color = themeColors.gridColor;
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();

    updateBudgetLegend('budgetLegend', topBudgets);
}

function updateBudgetLegend(legendId, budgets) {
    const legendContainer = document.getElementById(legendId);
    legendContainer.innerHTML = '';

    if (!budgets.length) {
        const noData = document.createElement('div');
        noData.className = 'legend-item';
        noData.textContent = 'No budgets available';
        legendContainer.appendChild(noData);
        return;
    }

    budgets.forEach((budget) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const percentage = (budget.spent / budget.amount) * 100;
        const utilization = percentage > 100 ? 'Over!' : `${percentage.toFixed(1)}%`;
        
        const label = document.createElement('span');
        label.innerHTML = `${budget.name} ${budget.emoji} <span style="color: ${percentage > 100 ? '#ff6384' : '#3498db'}">${utilization}</span>`;
        
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });
}

function updateExpenseTrendChart(chart, transactions) {
    const themeColors = getThemeColors();
    const monthlyData = calculateMonthlyData(transactions);
    
    const labels = monthlyData.map(d => d.month);
    const incomeData = monthlyData.map(d => d.income);
    const expenseData = monthlyData.map(d => d.expense);
    
    // If no data, show empty state with some default months
    if (labels.length === 0) {
        const defaultMonths = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
        chart.data.labels = defaultMonths;
        chart.data.datasets[0].data = defaultMonths.map(() => 0);
        chart.data.datasets[1].data = defaultMonths.map(() => 0);
    } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = incomeData;
        chart.data.datasets[1].data = expenseData;
    }

    // Update theme colors
    chart.options.scales.y.grid.color = themeColors.gridColor;
    chart.options.scales.y.grid.borderColor = themeColors.gridColor;
    chart.options.scales.y.ticks.color = themeColors.textColor;
    chart.options.scales.y.title.color = themeColors.textColor;
    
    chart.options.scales.x.grid.color = themeColors.gridColor;
    chart.options.scales.x.grid.borderColor = themeColors.gridColor;
    chart.options.scales.x.ticks.color = themeColors.textColor;
    chart.options.scales.x.title.color = themeColors.textColor;
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
}

function updateSavingsRateChart(chart, rate) {
    const themeColors = getThemeColors();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const remaining = 100 - rate;
    
    chart.data.datasets[0].data = [rate, remaining];
    chart.data.labels = [`Savings (${rate.toFixed(1)}%)`, `Expenses (${remaining.toFixed(1)}%)`];
    
    chart.data.datasets[0].backgroundColor = window.chartColors[currentTheme].savings;
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
}

function updateTransactionScatter(chart, transactions) {
    const themeColors = getThemeColors();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const incomeData = transactions
        .filter(t => t.type === 'Income')
        .map(t => ({
            x: new Date(t.date).getTime(),
            y: parseFloat(t.amount)
        }));
    
    const expenseData = transactions
        .filter(t => t.type === 'Expense')
        .map(t => ({
            x: new Date(t.date).getTime(),
            y: parseFloat(t.amount)
        }));
    
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.data.datasets[0].backgroundColor = window.chartColors[currentTheme].scatterIncome;  // Pink
    chart.data.datasets[1].backgroundColor = window.chartColors[currentTheme].scatterExpense;  // Purple
    
    chart.options.scales.x.ticks.color = themeColors.textColor;
    chart.options.scales.x.title.color = themeColors.textColor;
    chart.options.scales.x.grid.color = themeColors.gridColor;
    chart.options.scales.x.grid.borderColor = themeColors.gridColor;
    chart.options.scales.y.ticks.color = themeColors.textColor;
    chart.options.scales.y.title.color = themeColors.textColor;
    chart.options.scales.y.grid.color = themeColors.gridColor;
    chart.options.scales.y.grid.borderColor = themeColors.gridColor;
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
}

function updateIncomeExpensePie(chart, summary) {
    const themeColors = getThemeColors();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const total = summary.income + summary.expense;
    const incomePercentage = total > 0 ? (summary.income / total) * 100 : 0;
    const expensePercentage = total > 0 ? (summary.expense / total) * 100 : 0;
    
    chart.data.datasets[0].data = [incomePercentage, expensePercentage];
    chart.data.datasets[0].rawAmounts = [summary.income, summary.expense];
    chart.data.datasets[0].backgroundColor = window.chartColors[currentTheme].pie;
    
    chart.options.plugins.legend.labels.color = themeColors.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
    
    chart.update();
    
    updateProportionLegend('expensePieLegend', {
        Income: incomePercentage,
        Expenses: expensePercentage
    }, chart.data.datasets[0].backgroundColor, {
        Income: summary.income,
        Expenses: summary.expense
    });
}
function updateProportionLegend(legendId, proportions, colors, amounts) {
    const legendContainer = document.getElementById(legendId);
    if (!legendContainer) return;
    
    legendContainer.innerHTML = '';
    
    Object.keys(proportions).forEach((category, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const label = document.createElement('span');
        label.textContent = `${category}: ${proportions[category].toFixed(1)}% (${formatCurrency(amounts[category])})`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });
}

function calculateMonthlyData(transactions) {
    if (!transactions || transactions.length === 0) {
        return [];
    }

    // Create a map to store monthly totals
    const monthlyTotals = new Map();

    transactions.forEach(transaction => {
        const date = parseTransactionDate(transaction.date);
        if (isNaN(date.getTime())) return;

        const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyTotals.has(monthKey)) {
            monthlyTotals.set(monthKey, { income: 0, expense: 0 });
        }
        
        const amount = parseFloat(transaction.amount || 0);
        if (transaction.type === 'Income') {
            monthlyTotals.get(monthKey).income += amount;
        } else {
            monthlyTotals.get(monthKey).expense += amount;
        }
    });

    // Convert the map to an array and sort by date
    const sortedData = Array.from(monthlyTotals.entries())
        .map(([month, data]) => ({
            month,
            ...data
        }))
        .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
        });

    return sortedData;
}

function categorizeTransactions(transactions) {
    return transactions.reduce((acc, transaction) => {
        const key = transaction.type === 'Income' ? 'incomeData' : 'expenseData';
        acc[key][transaction.category] = (acc[key][transaction.category] || 0) + 
                                      parseFloat(transaction.amount);
        return acc;
    }, { incomeData: {}, expenseData: {} });
}

function calculateSummary(transactions) {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            income += parseFloat(transaction.amount);
        } else {
            expense += parseFloat(transaction.amount);
        }
    });
    
    return {
        income,
        expense,
        balance: income - expense
    };
}

function updateSummaryCards(summary) {
    document.getElementById('totalBalance').textContent = formatCurrency(summary.balance);
    document.getElementById('totalIncome').textContent = formatCurrency(summary.income);
    document.getElementById('totalExpense').textContent = formatCurrency(summary.expense);
}

function generateColors(count, isExpense = false) {
    const colors = [];
    const hueStep = 360 / count;
    const baseHue = isExpense ? 0 : 200;
    
    for (let i = 0; i < count; i++) {
        const hue = (baseHue + i * hueStep) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    
    return colors;
}

function updateLegend(legendId, data, colors) {
    const legendContainer = document.getElementById(legendId);
    legendContainer.innerHTML = '';
    
    Object.keys(data).forEach((category, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const label = document.createElement('span');
        label.textContent = `${category}: ${formatCurrency(data[category])}`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString, format = 'full') {
    const date = new Date(dateString);
    
    if (format === 'month') {
        return date.toLocaleString('en-US', { month: 'short' });
    }
    
    return date.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function updateDateRange() {
    const dateRangeElement = document.getElementById('dateRange');
    if (!dateRangeElement) {
        console.warn('Element with ID "dateRange" not found in the DOM.');
        return;
    }
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    dateRangeElement.textContent = 
        `${formatDate(firstDay)} - ${formatDate(now)}`;
}

function reinitializeCharts() {
    console.log('Reinitializing charts with theme colors...');
    const themeColors = getThemeColors();
    console.log('Current theme colors:', themeColors);
    
    [incomeChart, expenseChart, budgetChart, expenseTrendChart, savingsRateChart, transactionScatter, expensePie].forEach(chart => {
        if (chart && chart.options) {
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.grid) {
                        scale.grid.color = themeColors.gridColor;
                        scale.grid.borderColor = themeColors.gridColor;
                    }
                    if (scale.ticks) {
                        scale.ticks.color = themeColors.textColor;
                    }
                    if (scale.title) {
                        scale.title.color = themeColors.textColor;
                    }
                    if (scale.pointLabels) {
                        scale.pointLabels.color = themeColors.textColor;
                    }
                });
            }

            if (chart.options.plugins) {
                if (chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = themeColors.textColor;
                }
                if (chart.options.plugins.tooltip) {
                    chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
                    chart.options.plugins.tooltip.titleColor = themeColors.textColor;
                    chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
                }
            }

            chart.update();
        }
    });

    updateLegend('incomeLegend', incomeChart.data.datasets[0].data.reduce((acc, val, i) => {
        acc[incomeChart.data.labels[i]] = val;
        return acc;
    }, {}), incomeChart.data.datasets[0].backgroundColor);

    updateLegend('expenseLegend', expenseChart.data.datasets[0].data.reduce((acc, val, i) => {
        acc[expenseChart.data.labels[i]] = val;
        return acc;
    }, {}), expenseChart.data.datasets[0].backgroundColor);

    updateProportionLegend('expensePieLegend', {
        Income: expensePie.data.datasets[0].data[0],
        Expenses: expensePie.data.datasets[0].data[1]
    }, expensePie.data.datasets[0].backgroundColor, {
        Income: expensePie.data.datasets[0].rawAmounts[0],
        Expenses: expensePie.data.datasets[0].rawAmounts[1]
    });
}

document.addEventListener('themeChanged', function() {
    console.log('Theme changed, updating chart colors...');
    reinitializeCharts();
});

function confirmClearTransactions() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="custom-alert-content">
            <p>Are you sure you want to delete all transactions? This action cannot be undone.</p>
            <div class="custom-alert-buttons">
                <button class="custom-alert-btn custom-alert-cancel" onclick="closeAlert()">Cancel</button>
                <button class="custom-alert-btn custom-alert-ok" onclick="clearAllTransactions()">Delete All</button>
            </div>
        </div>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add('show'), 10);
}

function closeAlert() {
    const alert = document.querySelector('.custom-alert');
    if (alert) {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }
}

function clearAllTransactions() {
    // Clear all transactions from localStorage
    localStorage.setItem('transactions', '[]');
    localStorage.setItem('importedTransactions', '[]');
    
    // Close the alert
    closeAlert();
    
    // Reload the dashboard data
    loadDashboardData();
}