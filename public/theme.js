// Chart color schemes
const chartColors = {
    light: {
        backgroundColor: '#ffffff',
        gridColor: '#dfe6e9',
        textColor: '#2d3748',
        income: [
            '#3498db',  // Bright Blue (salary)
            '#e74c3c',  // Pink-Red (hi)
            '#9b59b6',  // Purple (kit)
            '#f1c40f',  // Yellow (jkh)
            '#2ecc71'   // Green (kkk)
        ],
        expense: [
            '#FF6B6B',  // Coral Red
            '#4ECDC4',  // Turquoise
            '#FFA07A',  // Light Salmon
            '#45B7D1',  // Ocean Blue
            '#FFB6B9',  // Pink
            '#96CEB4',  // Sage Green
            '#6C88C4',  // Steel Blue
            '#88D8B0',  // Mint
            '#427aa1',  // Requested: Steel Blue
            '#aa968a',  // Requested: Taupe Gray
            '#ADB2D4',  // Requested: Light Periwinkle
            '#FFDCCC',  // Requested: Peach Puff
            '#D4A5A5',  // Dusty Rose
            '#9B59B6',  // Medium Purple
            '#F4A261'   // Sandy Brown
        ],
        savings: ['#E75480', '#01BAEF'],  // Pink and Blue
        scatterIncome: '#ff6384',  // Pink for scatter income
        scatterExpense: '#7B68EE',  // Purple for scatter expenses
        pie: [
            '#FF9AA2',  // Pastel Red
            '#66C7F4',  // Light Blue
            '#FFB347',  // Pastel Orange
            '#A8E6CF',  // Pastel Green
            '#FFDAC1',  // Peach
            '#C3B1E1'   // Pastel Purple
        ]
    },
    dark: {
        backgroundColor: '#2d2d2d',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        textColor: '#ffffff',
        income: [
            '#3498db',  // Bright Blue (salary)
            '#e74c3c',  // Pink-Red (hi)
            '#9b59b6',  // Purple (kit)
            '#f1c40f',  // Yellow (jkh)
            '#2ecc71'   // Green (kkk)
        ],
        expense: [
            '#FF6B6B',  // Coral Red
            '#4ECDC4',  // Turquoise
            '#FFA07A',  // Light Salmon
            '#45B7D1',  // Ocean Blue
            '#FFB6B9',  // Pink
            '#96CEB4',  // Sage Green
            '#6C88C4',  // Steel Blue
            '#88D8B0',  // Mint
            '#427aa1',  // Requested: Steel Blue
            '#aa968a',  // Requested: Taupe Gray
            '#ADB2D4',  // Requested: Light Periwinkle
            '#FFDCCC',  // Requested: Peach Puff
            '#D4A5A5',  // Dusty Rose
            '#9B59B6',  // Medium Purple
            '#F4A261'   // Sandy Brown
        ],
        savings: ['#E75480', '#01BAEF'],  // Pink and Blue
        scatterIncome: '#ff6384',  // Pink for scatter income
        scatterExpense: '#7B68EE',  // Purple for scatter expenses
        pie: [
            '#FF9AA2',  // Pastel Red
            '#66C7F4',  // Light Blue
            '#FFB347',  // Pastel Orange
            '#A8E6CF',  // Pastel Green
            '#FFDAC1',  // Peach
            '#C3B1E1'   // Pastel Purple
        ]
    }
};

// Get the saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Function to update chart defaults
function updateChartDefaults(theme) {
    const colors = chartColors[theme];
    if (window.Chart) {
        Chart.defaults.color = colors.textColor;
        Chart.defaults.borderColor = colors.gridColor;
        
        Chart.defaults.scale.grid = {
            color: colors.gridColor,
            borderColor: colors.gridColor,
            display: true
        };
        
        Chart.defaults.scale.ticks = {
            color: colors.textColor,
            display: true
        };

        Chart.defaults.scale.pointLabels = {
            color: colors.textColor,
            display: true
        };
    }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const logoutBtn = document.getElementById('logoutBtn');

    // Update chart colors and styles
    function updateChartColors(theme) {
        const colors = chartColors[theme];
        updateChartDefaults(theme);

        if (!window.Chart) return;

        // Update all existing charts
        Object.values(Chart.instances).forEach(chart => {
            // Update scale colors
            Object.values(chart.scales).forEach(scale => {
                if (scale.options.grid) {
                    scale.options.grid.color = colors.gridColor;
                    scale.options.grid.borderColor = colors.gridColor;
                    scale.options.grid.display = true;
                }
                if (scale.options.ticks) {
                    scale.options.ticks.color = colors.textColor;
                    scale.options.ticks.display = true;
                }
                if (scale.options.pointLabels) {
                    scale.options.pointLabels.color = colors.textColor;
                    scale.options.pointLabels.display = true;
                }
            });

            // Update dataset colors based on chart type
            if (chart.config.type === 'scatter') {
                chart.data.datasets.forEach((dataset, index) => {
                    dataset.backgroundColor = index === 0 ? colors.scatterIncome : colors.scatterExpense;
                });
            } else if (chart.config.type === 'doughnut') {
                const data = chart.data.datasets[0].data || [];
                chart.data.datasets[0].backgroundColor = data.map((_, i) => colors.income[i % colors.income.length]);
            } else if (chart.config.type === 'bar') {
                const data = chart.data.datasets[0].data || [];
                chart.data.datasets[0].backgroundColor = data.map((_, i) => colors.expense[i % colors.expense.length]);
            } else if (chart.config.type === 'pie') {
                const data = chart.data.datasets[0].data || [];
                chart.data.datasets[0].backgroundColor = data.map((_, i) => colors.pie[i % colors.pie.length]);
            }

            // Update legend colors
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }

            // Force chart update
            chart.update();
        });

        // Update legend colors
        document.querySelectorAll('.chart-legend').forEach(legend => {
            if (legend) legend.style.color = colors.textColor;
        });
    }

    // Profile menu functionality
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Dark mode toggle functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            darkModeToggle.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun"></i><span>Light Mode</span>'
                : '<i class="fas fa-moon"></i><span>Dark Mode</span>';

            // Update charts with a small delay to ensure DOM updates
            setTimeout(() => {
                updateChartColors(newTheme);
                // Notify other scripts about theme change
                document.dispatchEvent(new Event('themeChanged'));
            }, 100);
        });

        // Set initial icon based on current theme
        if (savedTheme === 'dark') {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        }
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Initialize charts with current theme
    setTimeout(() => {
        updateChartColors(savedTheme);
        document.dispatchEvent(new Event('themeChanged'));
    }, 100);
});

// Export chartColors for other scripts
window.chartColors = chartColors;