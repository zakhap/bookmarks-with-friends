const form = document.getElementById('settings-form') as HTMLFormElement;
const apiUrlInput = document.getElementById('apiUrl') as HTMLInputElement;
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const savedByInput = document.getElementById('savedBy') as HTMLInputElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

// Load saved settings
chrome.storage.sync.get(['apiUrl', 'apiKey', 'savedBy'], (result) => {
  if (result.apiUrl) apiUrlInput.value = result.apiUrl;
  if (result.apiKey) apiKeyInput.value = result.apiKey;
  if (result.savedBy) savedByInput.value = result.savedBy;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiUrl = apiUrlInput.value.trim().replace(/\/$/, ''); // Remove trailing slash
  const apiKey = apiKeyInput.value.trim();
  const savedBy = savedByInput.value.trim();

  if (!apiUrl || !apiKey || !savedBy) {
    showMessage('All fields are required', false);
    return;
  }

  try {
    await chrome.storage.sync.set({
      apiUrl,
      apiKey,
      savedBy,
    });

    showMessage('Settings saved successfully!', true);
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('Failed to save settings', false);
  }
});

function showMessage(text: string, success: boolean) {
  messageDiv.textContent = text;
  messageDiv.className = success ? 'message success' : 'message error';
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}
