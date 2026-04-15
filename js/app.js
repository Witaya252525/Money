const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STORAGE_KEY = 'buck2bar-data-v1';

// Login validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password: minimum 10 chars, at least one uppercase and one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]).{10,}$/;

function validateEmail(email){ return EMAIL_REGEX.test(email); }
function validatePassword(pw){ return PASSWORD_REGEX.test(pw); }

function onLogin(){
  const feedbackEl = byId('loginFeedback');
  if(!feedbackEl) return;
  const email = (byId('emailInput')?.value || '').trim();
  const pw = (byId('passwordInput')?.value || '');
  if(!validateEmail(email)){
    feedbackEl.textContent = 'Invalid email format.'; return;
  }
  if(!validatePassword(pw)){
    feedbackEl.textContent = 'Password must be at least 10 characters and include one uppercase and one special character.'; return;
  }
  feedbackEl.textContent = '';
  // Show success toast and clear inputs
  const toastEl = byId('loginToast');
  const toastBody = byId('loginToastBody');
  if(toastBody) toastBody.textContent = 'Login successful — email: ' + email;
  if(toastEl){
    const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl);
    bsToast.show();
  } else {
    alert('Login successful — email: ' + email);
  }
  // Clear sensitive inputs
  if(byId('passwordInput')) byId('passwordInput').value = '';
  if(byId('emailInput')) byId('emailInput').value = '';
}

let chart = null;

function byId(id){ return document.getElementById(id); }

function randomValue(){ return Math.round((Math.random()*9000 + 500)*100)/100; }

function makeRandomData(){
  const inc = MONTHS.map(()=> randomValue());
  const exp = MONTHS.map(()=> Math.round((Math.random()*4000 + 200)*100)/100 );
  return { income: inc, expense: exp };
}

function createInputs(){
  const tbody = byId('monthsBody');
  tbody.innerHTML = '';
  MONTHS.forEach((m, i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m}</td>
      <td class="text-end"><input type="number" min="0" step="0.01" class="form-control form-control-sm text-end" id="income-${i}" /></td>
      <td class="text-end"><input type="number" min="0" step="0.01" class="form-control form-control-sm text-end" id="expense-${i}" /></td>
    `;
    tbody.appendChild(tr);
  });
}

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try{ return JSON.parse(raw); }catch(e){ return null; }
}

function saveData(obj){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function populateInputs(data){
  if(!data) return;
  data.income.forEach((v,i)=>{ const el = byId(`income-${i}`); if(el) el.value = Number(v); });
  data.expense.forEach((v,i)=>{ const el = byId(`expense-${i}`); if(el) el.value = Number(v); });
}

function gatherInputs(){
  const income = []; const expense = [];
  for(let i=0;i<MONTHS.length;i++){
    const inc = parseFloat((byId(`income-${i}`).value || '0').toString());
    const exp = parseFloat((byId(`expense-${i}`).value || '0').toString());
    income.push(isFinite(inc)?inc:0);
    expense.push(isFinite(exp)?exp:0);
  }
  return { income, expense };
}

function validateData(data){
  for(let v of data.income) if(v < 0 || isNaN(v)) return false;
  for(let v of data.expense) if(v < 0 || isNaN(v)) return false;
  return true;
}

function showFeedback(msg=''){
  byId('formFeedback').textContent = msg;
}

function initChart(data){
  const ctx = byId('moneyChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'Income', data: data.income.slice(), backgroundColor: 'rgba(25, 135, 84, 0.8)' },
        { label: 'Expense', data: data.expense.slice(), backgroundColor: 'rgba(220, 53, 69, 0.8)' }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function updateChart(data){
  if(!chart) { initChart(data); return; }
  chart.data.datasets[0].data = data.income.slice();
  chart.data.datasets[1].data = data.expense.slice();
  chart.update();
}

function onSave(){
  const data = gatherInputs();
  if(!validateData(data)){
    showFeedback('All values must be numbers >= 0.');
    return;
  }
  saveData(data);
  showFeedback('Saved.');
  updateChart(data);
}

function onRandomize(){
  const data = makeRandomData();
  populateInputs(data);
  saveData(data);
  showFeedback('Randomized and saved.');
  updateChart(data);
}

function onClear(){
  const zeros = { income: MONTHS.map(()=>0), expense: MONTHS.map(()=>0) };
  populateInputs(zeros);
  saveData(zeros);
  showFeedback('Cleared and saved.');
  updateChart(zeros);
}

function onDownload(){
  if(!chart) return;
  try{
    chart.update();
    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buck2bar-chart.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }catch(e){
    console.error('Download failed', e);
    showFeedback('Unable to download chart.');
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  createInputs();
  const existing = loadData();
  if(existing){ populateInputs(existing); initChart(existing); }
  else { const rnd = makeRandomData(); populateInputs(rnd); saveData(rnd); initChart(rnd); }

  byId('saveBtn').addEventListener('click', onSave);
  byId('randomBtn').addEventListener('click', onRandomize);
  byId('clearBtn').addEventListener('click', onClear);
  // Login handlers
  const loginBtn = byId('loginBtn');
  if(loginBtn) loginBtn.addEventListener('click', onLogin);
  const pwInput = byId('passwordInput');
  if(pwInput) pwInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); onLogin(); } });
  const dl = byId('downloadBtn');
  if(dl) dl.addEventListener('click', onDownload);

  // Update chart when Chart tab becomes visible
  const chartTab = document.querySelector('#chart-tab');
  if(chartTab){
    chartTab.addEventListener('shown.bs.tab', ()=>{ if(chart) chart.resize(); });
  }
});
