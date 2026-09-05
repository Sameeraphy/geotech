const materialTable = {
  rock: { label: 'Rock', exponent: 0.45 }
};

const rockTypeTable = {
  granite: { label: 'Granite', factor: 23.0 },
  basalt: { label: 'Basalt', factor: 20.0 },
  limestone: { label: 'Limestone', factor: 14.0 },
  sandstone: { label: 'Sandstone', factor: 12.0 },
  siltstone: { label: 'Siltstone', factor: 10.0 },
  mudstone: { label: 'Mudstone / shale', factor: 22.5 },
  schist: { label: 'Schist / gneiss', factor: 15.0 },
  marble: { label: 'Marble', factor: 18.0 }
};

const sampleConfig = {
  diametral: {
    label: 'Diametral core',
    description: 'Core loaded across its diameter. AS 4133.4.1 uses the core diameter directly for equivalent core diameter.',
    fields: [
      { id: 'diameter', label: 'Core diameter, D (mm)', placeholder: 'e.g. 54' }
    ],
    sketch: ({ diameter }) => {
      const r = 86;
      const cx = 210;
      const cy = 140;
      return `
        <svg viewBox="0 0 420 280" role="img" aria-label="Diametral core specimen diagram">
          <rect x="0" y="0" width="420" height="280" fill="#f7faff"/>
          <g>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0a4d91" stroke-width="3"/>
            <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#0a4d91" stroke-width="3" opacity="0.9"/>
            <line x1="${cx - 100}" y1="${cy - 110}" x2="${cx - 100}" y2="${cy + 110}" stroke="#2c8fca" stroke-width="2" stroke-dasharray="6 6"/>
            <line x1="${cx + 100}" y1="${cy - 110}" x2="${cx + 100}" y2="${cy + 110}" stroke="#2c8fca" stroke-width="2" stroke-dasharray="6 6"/>
            <line x1="${cx - 60}" y1="${cy - 110}" x2="${cx + 60}" y2="${cy - 110}" stroke="#2c8fca" stroke-width="2" opacity="0.8"/>
            <line x1="${cx - 60}" y1="${cy + 110}" x2="${cx + 60}" y2="${cy + 110}" stroke="#2c8fca" stroke-width="2" opacity="0.8"/>
            <text x="${cx}" y="${cy + 150}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle">D = ${diameter.toFixed(1)} mm</text>
          </g>
        </svg>`;
    }
  },
  axial: {
    label: 'Axial core',
    description: 'Core loaded along its axis. The equivalent core diameter is taken as the specimen diameter for this calculation.',
    fields: [
      { id: 'diameter', label: 'Core diameter, D (mm)', placeholder: 'e.g. 52' },
      { id: 'length', label: 'Specimen length, L (mm)', placeholder: 'e.g. 110' }
    ],
    sketch: ({ diameter, length }) => {
      const w = 150;
      const h = 120;
      return `
        <svg viewBox="0 0 420 280" role="img" aria-label="Axial core specimen diagram">
          <rect x="0" y="0" width="420" height="280" fill="#f7faff"/>
          <g>
            <rect x="${150 - w / 2}" y="${140 - h / 2}" width="${w}" height="${h}" rx="10" fill="none" stroke="#0a4d91" stroke-width="3"/>
            <line x1="${150 - w / 2}" y1="${140 - h / 2 - 32}" x2="${150 + w / 2}" y2="${140 - h / 2 - 32}" stroke="#2c8fca" stroke-width="2"/>
            <line x1="${150 - w / 2}" y1="${140 + h / 2 + 32}" x2="${150 + w / 2}" y2="${140 + h / 2 + 32}" stroke="#2c8fca" stroke-width="2"/>
            <line x1="${150 - w / 2 - 20}" y1="${140 - h / 2}" x2="${150 - w / 2 - 20}" y2="${140 + h / 2}" stroke="#2c8fca" stroke-width="2"/>
            <line x1="${150 + w / 2 + 20}" y1="${140 - h / 2}" x2="${150 + w / 2 + 20}" y2="${140 + h / 2}" stroke="#2c8fca" stroke-width="2"/>
            <text x="210" y="${140 + h / 2 + 62}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle">D = ${diameter.toFixed(1)} mm</text>
            <text x="210" y="${140 - h / 2 - 44}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle">L = ${length.toFixed(1)} mm</text>
          </g>
        </svg>`;
    }
  },
  block: {
    label: 'Block',
    description: 'Block specimen with width and thickness dimensions across the failure plane. Equivalent diameter is calculated from the cross-sectional area.',
    fields: [
      { id: 'width', label: 'Width, b (mm)', placeholder: 'e.g. 120' },
      { id: 'thickness', label: 'Thickness, t (mm)', placeholder: 'e.g. 80' }
    ],
    sketch: ({ width, thickness }) => {
      const x = 120;
      const y = 150;
      const w = Math.min(200, width * 1.2);
      const h = Math.min(120, thickness * 1.1);
      return `
        <svg viewBox="0 0 420 280" role="img" aria-label="Block specimen diagram">
          <rect x="0" y="0" width="420" height="280" fill="#f7faff"/>
          <g>
            <rect x="${x}" y="${y - h / 2}" width="${w}" height="${h}" fill="none" stroke="#0a4d91" stroke-width="3"/>
            <line x1="${x}" y1="${y + h / 2 + 20}" x2="${x + w}" y2="${y + h / 2 + 20}" stroke="#2c8fca" stroke-width="2"/>
            <line x1="${x - 25}" y1="${y - h / 2}" x2="${x - 25}" y2="${y + h / 2}" stroke="#2c8fca" stroke-width="2"/>
            <text x="${x + w / 2}" y="${y + h / 2 + 52}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle">b = ${width.toFixed(1)} mm</text>
            <text x="${x - 52}" y="${y}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle" transform="rotate(-90 ${x - 52} ${y})">t = ${thickness.toFixed(1)} mm</text>
          </g>
        </svg>`;
    }
  },
  irregular: {
    label: 'Irregular lump',
    description: 'Irregular specimen approximated by a mean failure-plane width and thickness. Equivalent diameter is calculated from the approximate area.',
    fields: [
      { id: 'width', label: 'Approx. width, b (mm)', placeholder: 'e.g. 90' },
      { id: 'thickness', label: 'Approx. thickness, t (mm)', placeholder: 'e.g. 62' }
    ],
    sketch: ({ width, thickness }) => {
      const points = [120, 145, 220, 110, 315, 140, 268, 205, 170, 210, 120, 145].join(',');
      const approxW = Math.min(200, width * 1.4);
      const approxT = Math.min(120, thickness * 1.3);
      return `
        <svg viewBox="0 0 420 280" role="img" aria-label="Irregular lump specimen diagram">
          <rect x="0" y="0" width="420" height="280" fill="#f7faff"/>
          <g>
            <polygon points="${points}" fill="none" stroke="#0a4d91" stroke-width="3"/>
            <line x1="${115}" y1="${150}" x2="${310}" y2="${150}" stroke="#2c8fca" stroke-width="2"/>
            <line x1="${205}" y1="${105}" x2="${205}" y2="${205}" stroke="#2c8fca" stroke-width="2"/>
            <text x="210" y="${235}" fill="#0a4d91" font-size="18" font-weight="700" text-anchor="middle">b = ${width.toFixed(1)} mm</text>
            <text x="80" y="${155}" fill="#0a4d91" font-size="18" font-weight="700" transform="rotate(-90 80 155)">t = ${thickness.toFixed(1)} mm</text>
          </g>
        </svg>`;
    }
  }
};

const typeSelect = document.getElementById('sampleType');
const rockTypeSelect = document.getElementById('rockType');
const kFactorSelect = document.getElementById('kFactor');
const dynamicInputs = document.getElementById('dynamicInputs');
const peakLoadInput = document.getElementById('peakLoad');
const loadUnit = document.getElementById('loadUnit');
const resultsContainer = document.getElementById('results');

function inputMarkup(typeKey) {
  const config = sampleConfig[typeKey];
  return config.fields
    .map(
      (field) => `
        <div class="field-group">
          <label for="${field.id}">${field.label}</label>
          <input id="${field.id}" type="number" step="0.01" placeholder="${field.placeholder}" />
        </div>
      `
    )
    .join('');
}

function renderTypeInputs() {
  const key = typeSelect.value;
  dynamicInputs.innerHTML = inputMarkup(key);
}

function validatePositive(value, label) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
  return num;
}

function calculateEquivalentDiameter(typeKey, values) {
  switch (typeKey) {
    case 'diametral':
    case 'axial':
      return validatePositive(values.diameter, 'Core diameter');
    case 'block':
    case 'irregular':
      const area = validatePositive(values.width, 'Width') * validatePositive(values.thickness, 'Thickness');
      return Math.sqrt((4 * area) / Math.PI);
    default:
      throw new Error('Unsupported sample type.');
  }
}

function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits);
}

function buildSketch(typeKey, values) {
  const config = sampleConfig[typeKey];
  return config.sketch(values);
}

function calculate() {
  try {
    const typeKey = typeSelect.value;
    const rockKey = rockTypeSelect.value;
    const rawValues = {};
    sampleConfig[typeKey].fields.forEach((field) => {
      rawValues[field.id] = document.getElementById(field.id).value;
    });

    const loadValue = validatePositive(peakLoadInput.value, 'Peak load');
    const loadInNewtons = loadUnit.value === 'kN' ? loadValue * 1000 : loadValue;

    const geometryValues = {};
    sampleConfig[typeKey].fields.forEach((field) => {
      geometryValues[field.id] = Number(rawValues[field.id]);
    });

    const de = calculateEquivalentDiameter(typeKey, geometryValues);
    const isIndex = loadInNewtons / (de * de);
    const rockType = rockTypeTable[rockKey] || rockTypeTable.granite;
    const material = materialTable.rock;
    const ucsFactor = Number(kFactorSelect.value);
    if (!Number.isFinite(ucsFactor) || ucsFactor <= 0) {
      throw new Error('Enter a valid UCS conversion factor, K.');
    }
    const sizeCorrection = Math.pow(de / 50, material.exponent);
    const is50 = isIndex * sizeCorrection;
    const ucs = is50 * ucsFactor;

    const resultMarkup = `
      <div class="result-card">
        <div class="summary-grid">
          <div class="metric">
            <span class="label">Sample type</span>
            <strong>${sampleConfig[typeKey].label}</strong>
          </div>
          <div class="metric">
            <span class="label">Rock type</span>
            <strong>${rockType.label}</strong>
          </div>
          <div class="metric">
            <span class="label">Peak load</span>
            <strong>${formatNumber(loadValue, 2)} ${loadUnit.value}</strong>
          </div>
          <div class="metric">
            <span class="label">Equivalent diameter, De</span>
            <strong>${formatNumber(de, 2)} mm</strong>
          </div>
          <div class="metric">
            <span class="label">Is</span>
            <strong>${formatNumber(isIndex, 3)} MPa</strong>
          </div>
          <div class="metric">
            <span class="label">Correction factor</span>
            <strong>${formatNumber(sizeCorrection, 4)}</strong>
          </div>
          <div class="metric">
            <span class="label">Size exponent, m</span>
            <strong>${material.exponent.toFixed(2)}</strong>
          </div>
          <div class="metric">
            <span class="label">Is(50)</span>
            <strong>${formatNumber(is50, 3)} MPa</strong>
          </div>
          <div class="metric">
            <span class="label">UCS factor, K</span>
            <strong>${ucsFactor.toFixed(1)}</strong>
          </div>
          <div class="metric">
            <span class="label">Estimated UCS</span>
            <strong>${formatNumber(ucs, 2)} MPa</strong>
          </div>
        </div>

        <div class="formula-box">
          <h3>Calculation summary</h3>
          <div class="equation">Is = P / De²</div>
          <div>${formatNumber(loadInNewtons, 2)} N / (${formatNumber(de, 2)} mm)² = ${formatNumber(isIndex, 3)} MPa</div>
          <div class="equation">Is(50) = Is × (De / 50)^m</div>
          <div>${formatNumber(isIndex, 3)} × (${formatNumber(de, 2)} / 50)^${material.exponent.toFixed(2)} = ${formatNumber(is50, 3)} MPa</div>
          <div class="equation">UCS ≈ K × Is(50)</div>
          <div>${ucsFactor.toFixed(1)} × ${formatNumber(is50, 3)} MPa = ${formatNumber(ucs, 2)} MPa</div>
        </div>

        <div class="sketch-wrap">
          ${buildSketch(typeKey, geometryValues)}
        </div>

        <p class="note">AS 4133.4.1 size correction is based on De/50 and the standard rock exponent. Select the UCS conversion factor K from the input list for the rock type being tested.</p>
        <p class="note">${sampleConfig[typeKey].description}</p>
      </div>
    `;

    resultsContainer.classList.remove('results-empty');
    resultsContainer.innerHTML = resultMarkup;
  } catch (error) {
    resultsContainer.classList.remove('results-empty');
    resultsContainer.innerHTML = `<div class="error">${error.message}</div>`;
  }
}

function resetForm() {
  typeSelect.value = 'diametral';
  rockTypeSelect.value = 'granite';
  kFactorSelect.value = '';
  peakLoadInput.value = '';
  loadUnit.value = 'kN';
  renderTypeInputs();
  resultsContainer.innerHTML = 'Select a sample type and enter the test data to calculate the point load strength index.';
  resultsContainer.classList.add('results-empty');
}

typeSelect.addEventListener('change', () => {
  renderTypeInputs();
  resultsContainer.innerHTML = 'Select a sample type and enter the test data to calculate the point load strength index.';
  resultsContainer.classList.add('results-empty');
});

rockTypeSelect.addEventListener('change', () => {
  if (resultsContainer.innerHTML && !resultsContainer.classList.contains('results-empty')) {
    calculate();
  }
});

kFactorSelect.addEventListener('input', () => {
  if (resultsContainer.innerHTML && !resultsContainer.classList.contains('results-empty')) {
    calculate();
  }
});

document.getElementById('calculateBtn').addEventListener('click', calculate);
document.getElementById('resetBtn').addEventListener('click', resetForm);

renderTypeInputs();
