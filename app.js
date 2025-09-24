const express = require('express');
const path = require('path');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const csv = require('csv-parse');
const fs = require('fs');
const { promisify } = require('util');
const parseAsync = promisify(csv.parse);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/options', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'options.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/pdf-import', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pdf-import.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login1.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup1.html'));
});

// API to handle signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length > 0) return res.status(400).json({ message: 'Username or email already exists' });
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'Error creating account' });
        res.status(201).json({ message: 'Account created successfully! Please login.' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account' });
  }
});

// API to handle login using username or email
app.post('/api/login', (req, res) => {
  const { userInput, password } = req.body;
  if (!userInput || !password) {
    return res.status(400).json({ message: 'Username/email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [userInput, userInput], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Send both userId and username
    res.status(200).json({
      message: 'Login successful!',
      userId: user.id,
      username: user.username
    });
  });
});



// API to fetch all transactions
app.get('/api/transactions', (req, res) => {
  const userId = req.query.userId || 1; // Hardcoded for demo
  const query = 'SELECT * FROM transactions WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('Error');
    }
    res.json(results);
  });
});

// API to insert a new transaction
app.post('/api/transaction', (req, res) => {
  const { user_id, type, amount, category, description, date } = req.body;
  const query = 'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [user_id, type, amount, category, description, date], (err) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).send('Error');
    }
    io.emit('dataUpdated');
    res.status(200).send('Inserted');
  });
});

// API to upload CSV file
app.post('/api/upload-transactions', async (req, res) => {
  const userId = req.body.userId || 1; // Hardcoded for demo
  const csvData = req.body.csvData; // Assuming CSV data is sent as text
  try {
    const records = await parseAsync(csvData, { columns: true, skip_empty_lines: true });
    const query = 'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)';
    for (const record of records) {
      const { type, amount, category, description, date } = record;
      db.query(query, [userId, type, parseFloat(amount), category, description, date], (err) => {
        if (err) console.error('Error inserting transaction from CSV:', err);
      });
    }
    io.emit('dataUpdated');
    res.status(200).json({ message: 'Transactions uploaded successfully' });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    res.status(500).json({ message: 'Error uploading transactions' });
  }
});

// API to generate PDF report
app.get('/api/generate-pdf', (req, res) => {
  const userId = req.query.userId || 1; // Hardcoded for demo
  const transactionsQuery = 'SELECT * FROM transactions WHERE user_id = ?';
  const analyticsQuery = `
    SELECT type, category, SUM(amount) as total 
    FROM transactions 
    WHERE user_id = ? 
    GROUP BY type, category
  `;
  db.query(transactionsQuery, [userId], (err, transactions) => {
    if (err) return res.status(500).send('Error fetching transactions');
    db.query(analyticsQuery, [userId], (err, analytics) => {
      if (err) return res.status(500).send('Error fetching analytics');

      // Calculate totals
      let totalIncome = 0, totalExpense = 0;
      analytics.forEach(row => {
        if (row.type === 'Income') totalIncome += row.total;
        else if (row.type === 'Expense') totalExpense += row.total;
      });

      // Generate LaTeX content
      const latexContent = `
\\documentclass{article}
\\usepackage{geometry}
\\usepackage{longtable}
\\usepackage{booktabs}
\\geometry{a4paper, margin=1in}
\\title{Budget Tracker Transaction Report}
\\author{User ID: ${userId}}
\\date{${new Date().toISOString().split('T')[0]}}
\\begin{document}
\\maketitle

% Analytics Section
\\section{Analytics Summary}
\\begin{itemize}
  \\item Total Income: \\\\$ ${totalIncome.toFixed(2)}
  \\item Total Expenses: \\\\$ ${totalExpense.toFixed(2)}
  \\item Net Balance: \\\\$ ${(totalIncome - totalExpense).toFixed(2)}
\\end{itemize}

% Category-wise Breakdown
\\section{Category-wise Breakdown}
\\begin{tabular}{|l|l|r|}
  \\hline
  \\textbf{Type} & \\textbf{Category} & \\textbf{Total Amount (\\\\$)} \\\\
  \\hline
  ${analytics.map(row => `${row.type} & ${row.category} & ${row.total.toFixed(2)} \\\\`).join('\n  \\hline\n  ')}
  \\hline
\\end{tabular}

% Transaction Logs
\\section{Transaction Logs}
\\begin{longtable}{|r|l|r|l|p{5cm}|l|}
  \\hline
  \\textbf{ID} & \\textbf{Type} & \\textbf{Amount (\\\\$)} & \\textbf{Category} & \\textbf{Description} & \\textbf{Date} \\\\
  \\hline
  \\endhead
  ${transactions.map(t => `${t.id} & ${t.type} & ${t.amount.toFixed(2)} & ${t.category} & ${t.description.replace(/&/g, '\\&')} & ${t.date} \\\\`).join('\n  \\hline\n  ')}
  \\hline
\\end{longtable}

\\end{document}
      `;
      res.setHeader('Content-Type', 'text/latex');
      res.send(latexContent);
    });
  });
});

// Socket.IO connection
io.on('connection', socket => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});