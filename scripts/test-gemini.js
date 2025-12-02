const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let key = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match && match[1]) {
    key = match[1].trim();
  }
} catch (e) {
  console.error('Error reading .env.local:', e.message);
}

if (!key) {
  console.error('Error: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error('API Error:', json.error);
      } else {
        console.log('Available Models:');
        const models = json.models || [];
        const generateModels = models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
        generateModels.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
        
        if (generateModels.length === 0) {
            console.log('No models found that support generateContent.');
        }
      }
    } catch (e) {
      console.error('Parse Error:', e.message);
      console.log('Raw Data:', data);
    }
  });
}).on('error', (e) => {
  console.error('Request Error:', e.message);
});
