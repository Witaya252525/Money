(() => {
  const STORAGE_KEY = 'buck2bar:data';
  const MONTHS = 12;

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.income) || !Array.isArray(obj.expense)) return null;
      return obj;
    } catch (e) {
      console.warn('Failed to load saved data', e);
      return null;
    }
  }

  function saveData(incomeArr, expenseArr) {
    const payload = { income: incomeArr, expense: expenseArr };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function readInputs() {
    const income = [];
    const expense = [];
    for (let i = 0; i < MONTHS; i++) {
      const incEl = document.getElementById('income-' + i);
      const expEl = document.getElementById('expense-' + i);
      let inc = parseFloat(incEl.value);
      let exp = parseFloat(expEl.value);
      if (!isFinite(inc) || inc < 0) inc = 0;
      if (!isFinite(exp) || exp < 0) exp = 0;
      income.push(Number(inc.toFixed(2)));
      expense.push(Number(exp.toFixed(2)));
    }
    return { income, expense };
  }

  function populateInputs(incomeArr, expenseArr) {
    for (let i = 0; i < MONTHS; i++) {
      const incEl = document.getElementById('income-' + i);
      const expEl = document.getElementById('expense-' + i);
      if (!incEl || !expEl) continue;
      incEl.value = (incomeArr && incomeArr[i] != null) ? incomeArr[i] : '';
      expEl.value = (expenseArr && expenseArr[i] != null) ? expenseArr[i] : '';
    }
  }

  function clearInputs() {
    for (let i = 0; i < MONTHS; i++) {
      const incEl = document.getElementById('income-' + i);
      const expEl = document.getElementById('expense-' + i);
      if (!incEl || !expEl) continue;
      incEl.value = '';
      expEl.value = '';
    }
  }

  function updateChartFromInputs() {
    const { income, expense } = readInputs();
    if (window.buckChartApi && typeof window.buckChartApi.updateChart === 'function') {
      window.buckChartApi.updateChart(income, expense);
    }
    saveData(income, expense);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = loadData();
    if (saved) {
      populateInputs(saved.income, saved.expense);
      // render initial chart
      if (window.buckChartApi && typeof window.buckChartApi.updateChart === 'function') {
        window.buckChartApi.updateChart(saved.income, saved.expense);
      }
    }

    const updateBtn = document.getElementById('updateBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (updateBtn) updateBtn.addEventListener('click', updateChartFromInputs);
    if (resetBtn) resetBtn.addEventListener('click', () => {
      clearInputs();
      saveData(Array(MONTHS).fill(0), Array(MONTHS).fill(0));
      if (window.buckChartApi && typeof window.buckChartApi.updateChart === 'function') {
        window.buckChartApi.updateChart(Array(MONTHS).fill(0), Array(MONTHS).fill(0));
      }
    });

    // Prevent negative input: strip leading '-' on key/paste/input for all income/expense fields
    for (let i = 0; i < MONTHS; i++) {
      const incEl = document.getElementById('income-' + i);
      const expEl = document.getElementById('expense-' + i);
      [incEl, expEl].forEach(el => {
        if (!el) return;
        // Prevent typing '-'
        el.addEventListener('keydown', (e) => {
          if (e.key === '-') e.preventDefault();
        });
        // Strip '-' if inserted via input or paste
        el.addEventListener('input', () => {
          if (el.value && el.value.includes('-')) {
            el.value = el.value.replace(/-/g, '');
          }
        });
        el.addEventListener('paste', (e) => {
          const text = (e.clipboardData || window.clipboardData).getData('text');
          if (text && text.includes('-')) {
            e.preventDefault();
            const sanitized = text.replace(/-/g, '');
            const start = el.selectionStart || 0;
            const end = el.selectionEnd || 0;
            const before = el.value.slice(0, start);
            const after = el.value.slice(end);
            el.value = before + sanitized + after;
          }
        });
      });
    }
  });
})();
