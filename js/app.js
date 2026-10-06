async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function getKitData(modelNumber) {
  const kits = await loadJSON('data/tamiyabase/kits.json');
  return kits[modelNumber] || null;
}

async function getTtpHopupsForChassis(chassis) {
  const key = chassis.toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `data/ttpmodels/${key}.json`;
  try {
    const data = await loadJSON(path);
    return data.hopups || [];
  } catch {
    return [];
  }
}

function renderKitInfo(kit) {
  const div = document.getElementById('kitInfo');
  if (!kit) {
    div.innerHTML = '<p>No kit data found for this selection.</p>';
    return;
  }

  div.innerHTML = `
    <h3>Kit info</h3>
    <p><strong>${kit.name}</strong> (${kit.model_number})</p>
    <p>Chassis: ${kit.chassis}</p>
    <p>Release year: ${kit.release_year}</p>
    <p>Wheelbase: ${kit.wheelbase_mm} mm</p>
    <p>Track (front/rear): ${kit.track_front_mm} / ${kit.track_rear_mm} mm</p>
    <p>Manual: <a href="${kit.manual_url}" target="_blank">View manual</a></p>
    <p>Known issues: ${kit.known_issues.join(', ')}</p>
  `;
}

function renderHopups(hopups) {
  const div = document.getElementById('hopups');
  if (!hopups.length) {
    div.innerHTML = '<p>No hop-ups found for this chassis (yet).</p>';
    return;
  }

  const list = hopups.map(h => `
    <li>
      <strong>${h.name}</strong> (£${h.price_gbp.toFixed(2)})
      — ${h.tags.join(', ')}
      — <span>${h.in_stock ? 'In stock' : 'Out of stock'}</span>
      — <a href="${h.url}" target="_blank">Buy at TTPModels</a>
    </li>
  `).join('');

  div.innerHTML = `
    <h3>TTPModels hop-ups</h3>
    <ul>${list}</ul>
  `;
}

async function handleGenerate() {
  const modelNumber = document.getElementById('chassisSelect').value;
  const motor = document.getElementById('motor').value.trim();
  const track = document.getElementById('track').value.trim();
  const budget = parseFloat(document.getElementById('budget').value || '0');
  const symptoms = document.getElementById('symptoms').value.trim();

  if (!modelNumber || !motor || !track) {
    alert('Please select a chassis and fill in motor and track.');
    return;
  }

  const kit = await getKitData(modelNumber);
  const hopups = kit ? await getTtpHopupsForChassis(kit.chassis) : [];

  renderKitInfo(kit);
  renderHopups(hopups);

  const aiDiv = document.getElementById('aiOutput');
  aiDiv.innerHTML = '<p>Generating AI setup…</p>';

  const aiText = await generateAiSetup({
    kit,
    hopups,
    motor,
    track,
    budget,
    symptoms
  });

  aiDiv.innerHTML = `<h3>AI setup & recommendations</h3><pre>${aiText}</pre>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);
});
// Main UI logic
