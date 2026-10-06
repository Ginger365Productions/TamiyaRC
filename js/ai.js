// Replace this stub with a real AI API call when you're ready.
// For now, it uses the data to generate a sensible text response.

async function generateAiSetup(context) {
  const { kit, hopups, motor, track, budget, symptoms } = context;

  const inStockHopups = hopups.filter(h => h.in_stock);
  const essential = inStockHopups.filter(h => h.tags.includes('essential'));
  const handling = inStockHopups.filter(
    h => h.tags.includes('handling') || h.tags.includes('steering') || h.tags.includes('suspension')
  );

  let text = '';

  text += `Chassis: ${kit.name} (${kit.chassis})\n`;
  text += `Motor: ${motor}\n`;
  text += `Track: ${track}\n`;
  text += `Budget: £${budget.toFixed(2)}\n\n`;

  if (symptoms) {
    text += `Reported issues/symptoms:\n${symptoms}\n\n`;
  }

  text += `Known issues for this kit:\n`;
  kit.known_issues.forEach(i => text += ` - ${i}\n`);
  text += `\n`;

  text += `Recommended hop-ups from TTPModels (in stock, prioritised):\n`;
  const prioritized = [...essential, ...handling].length ? [...essential, ...handling] : inStockHopups;
  prioritized.slice(0, 5).forEach(h => {
    text += ` - ${h.name} (£${h.price_gbp.toFixed(2)}): ${h.tags.join(', ')}\n   ${h.url}\n`;
  });

  text += `\nSuggested baseline setup (generic starting point):\n`;
  text += ` - Front camber: -2°\n`;
  text += ` - Rear camber: -1.5°\n`;
  text += ` - Front toe: 0.5° out\n`;
  text += ` - Rear toe: 1° in\n`;
  text += ` - Ride height: 6 mm front, 7 mm rear (carpet); add 2–3 mm for rough tarmac/dirt\n`;
  text += ` - Shock oil: 400 cSt front, 350 cSt rear\n`;
  text += ` - Springs: medium front, soft–medium rear\n`;

  text += `\nNext steps:\n`;
  text += ` - Once you connect this to an AI API (OpenAI, etc.), you can send the full kit + hop-up context\n`;
  text += `   and ask for a chassis-specific, track-specific setup and troubleshooting plan.\n`;

  return text;
}
// AI integration logic
