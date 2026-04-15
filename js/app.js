const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STORAGE_KEY = 'buck2bar-data-v1';

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

document.addEventListener('DOMContentLoaded',()=>{
  createInputs();
  const existing = loadData();
  if(existing){ populateInputs(existing); initChart(existing); }
  else { const rnd = makeRandomData(); populateInputs(rnd); saveData(rnd); initChart(rnd); }

  byId('saveBtn').addEventListener('click', onSave);
  byId('randomBtn').addEventListener('click', onRandomize);
  byId('clearBtn').addEventListener('click', onClear);

  // Update chart when Chart tab becomes visible
  const chartTab = document.querySelector('#chart-tab');
  if(chartTab){
    chartTab.addEventListener('shown.bs.tab', ()=>{ if(chart) chart.resize(); });
  }
});
