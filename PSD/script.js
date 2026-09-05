const sieveInput = document.getElementById('sieveSizes');
const retainedInput = document.getElementById('retainedMasses');
const resultsContainer = document.getElementById('results');

function parseList(value, label) {
  const raw = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (raw.length === 0) {
    throw new Error(`Enter at least one value for ${label}.`);
  }

  const numbers = raw.map((item) => Number(item));
  if (numbers.some((num) => !Number.isFinite(num))) {
    throw new Error(`All values in ${label} must be numeric.`);
  }

  return numbers;
}

function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toFixed(digits);
}

function interpolateD(sizes, percentPassing, targetPercent) {
  const paired = sizes.map((size, index) => ({ size, percent: percentPassing[index] })).sort((a, b) => b.size - a.size);

  for (let i = 0; i < paired.length; i += 1) {
    if (Math.abs(paired[i].percent - targetPercent) < 1e-9) {
      return paired[i].size;
    }
  }

  for (let i = 0; i < paired.length - 1; i += 1) {
    const p1 = paired[i].percent;
    const p2 = paired[i + 1].percent;
    if ((p1 >= targetPercent && targetPercent >= p2) || (p2 >= targetPercent && targetPercent >= p1)) {
      const s1 = paired[i].size;
      const s2 = paired[i + 1].size;
      if (Math.abs(p1 - p2) < 1e-9) {
        return Math.sqrt(s1 * s2);
      }
      const log1 = Math.log10(s1);
      const log2 = Math.log10(s2);
      const t = (targetPercent - p1) / (p2 - p1);
      const logX = log1 + t * (log2 - log1);
      return 10 ** logX;
    }
  }

  return null;
}

function computeGradation(sieves, retained) {
  if (sieves.length !== retained.length) {
    throw new Error('Sieve sizes and retained masses must have the same number of entries.');
  }

  const totalMass = retained.reduce((sum, item) => sum + item, 0);
  if (totalMass <= 0) {
    throw new Error('Total retained mass must be greater than zero.');
  }

  const paired = sieves
    .map((size, index) => ({ size, retained: retained[index] }))
    .sort((a, b) => b.size - a.size);

  const sizes = paired.map((item) => item.size);
  const percentPassing = [];
  let cumulative = 0;

  for (const item of paired) {
    const percent = ((totalMass - cumulative) / totalMass) * 100;
    percentPassing.push(percent);
    cumulative += item.retained;
  }

  const D10 = interpolateD(sizes, percentPassing, 10);
  const D30 = interpolateD(sizes, percentPassing, 30);
  const D60 = interpolateD(sizes, percentPassing, 60);

  let Cu = null;
  let Cc = null;
  if (D10 && D60 && D10 > 0) {
    Cu = D60 / D10;
    Cc = D30 && D30 > 0 ? (D30 * D30) / (D10 * D60) : null;
  }

  return { sizes, percentPassing, D10, D30, D60, Cu, Cc };
}

function buildChart(sizes, percentPassing) {
  const width = 640;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  const minX = Math.min(...sizes.filter((s) => s > 0));
  const maxX = Math.max(...sizes);
  const values = percentPassing;

  const xScale = (size) => {
    const logMin = Math.log10(minX);
    const logMax = Math.log10(maxX);
    const logVal = Math.log10(size);
    return margin.left + ((logVal - logMin) / (logMax - logMin || 1)) * (width - margin.left - margin.right);
  };

  const yScale = (value) => {
    const y = height - margin.bottom - (value / 100) * (height - margin.top - margin.bottom);
    return y;
  };

  const path = percentPassing
    .map((value, index) => {
      const x = xScale(sizes[index]);
      const y = yScale(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const points = sizes.map((size, index) => `${xScale(size)},${yScale(percentPassing[index])}`).join(' ');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Particle size distribution chart">
      <rect x="0" y="0" width="${width}" height="${height}" fill="#f7faff" />
      <g>
        <line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="#0a4d91" stroke-width="1.5" />
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="#0a4d91" stroke-width="1.5" />
        <path d="${path}" fill="none" stroke="#2c8fca" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="${points}" fill="none" stroke="#0a4d91" stroke-width="1" opacity="0.15" />
        <text x="${width / 2}" y="${height - 8}" fill="#0a4d91" font-size="12" text-anchor="middle">Particle size (mm)</text>
        <text x="18" y="${height / 2}" fill="#0a4d91" font-size="12" transform="rotate(-90 18 ${height / 2})" text-anchor="middle">Percent passing (%)</text>
      </g>
    </svg>
  `;
}

function calculate() {
  try {
    const sizes = parseList(sieveInput.value, 'sieve sizes');
    const retained = parseList(retainedInput.value, 'retained masses');

    const result = computeGradation(sizes, retained);
    const tableRows = result.sizes
      .map((size, index) => `
        <tr>
          <td>${formatNumber(size, 3)}</td>
          <td>${formatNumber(result.percentPassing[index], 1)}</td>
        </tr>
      `)
      .join('');

    const output = `
      <div class="result-card">
        <div class="summary-grid">
          <div class="metric">
            <span class="label">D10</span>
            <strong>${formatNumber(result.D10, 3)} mm</strong>
          </div>
          <div class="metric">
            <span class="label">D30</span>
            <strong>${formatNumber(result.D30, 3)} mm</strong>
          </div>
          <div class="metric">
            <span class="label">D60</span>
            <strong>${formatNumber(result.D60, 3)} mm</strong>
          </div>
          <div class="metric">
            <span class="label">Cu</span>
            <strong>${formatNumber(result.Cu, 2)}</strong>
          </div>
          <div class="metric">
            <span class="label">Cc</span>
            <strong>${formatNumber(result.Cc, 2)}</strong>
          </div>
        </div>

        <div class="chart-wrap">
          ${buildChart(result.sizes, result.percentPassing)}
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sieve size (mm)</th>
                <th>Percent passing (%)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <p class="note">Note: The PSD summary is based on log-interpolated D values and the standard coefficient of uniformity (Cu = D60 / D10) and curvature (Cc = D30² / (D10 × D60)).</p>
      </div>
    `;

    resultsContainer.classList.remove('results-empty');
    resultsContainer.innerHTML = output;
  } catch (error) {
    resultsContainer.classList.remove('results-empty');
    resultsContainer.innerHTML = `<div class="error">${error.message}</div>`;
  }
}

function resetForm() {
  sieveInput.value = '75, 53, 37.5, 26.5, 19, 13.2, 9.5, 4.75, 2.36, 1.18, 0.6, 0.425, 0.3, 0.15, 0.075';
  retainedInput.value = '0, 120, 280, 540, 620, 710, 890, 760, 520, 410, 220, 180, 150, 80, 40';
  resultsContainer.innerHTML = 'Enter sieve sizes and retained masses to compute the PSD summary.';
  resultsContainer.classList.add('results-empty');
}

document.getElementById('calculateBtn').addEventListener('click', calculate);
document.getElementById('resetBtn').addEventListener('click', resetForm);
resetForm();
