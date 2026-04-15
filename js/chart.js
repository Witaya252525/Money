(() => {
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let chart = null;

  function initChart() {
    const canvas = document.getElementById('buckChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Income', backgroundColor: '#0d6efd', data: Array(12).fill(0) },
          { label: 'Expense', backgroundColor: '#dc3545', data: Array(12).fill(0) }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: false },
          y: { beginAtZero: true }
        },
        plugins: {
          tooltip: { mode: 'index', intersect: false },
          legend: { position: 'top' }
        }
      }
    });
  }

  function updateChart(incomeArr, expenseArr) {
    if (!chart) return;
    chart.data.datasets[0].data = incomeArr.slice(0,12);
    chart.data.datasets[1].data = expenseArr.slice(0,12);
    chart.update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initChart();
  });

  window.buckChartApi = { updateChart };
})();
