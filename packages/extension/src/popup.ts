import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../website/lib/routers/_app';
import type { ExtensionSettings } from '@bookmarks/shared';

const settingsLink = document.getElementById('settings-link') as HTMLAnchorElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const urlInput = document.getElementById('url') as HTMLInputElement;
const noteInput = document.getElementById('note') as HTMLTextAreaElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

function showMessage(text: string, type: 'success' | 'error') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

async function getSettings(): Promise<ExtensionSettings | null> {
  const result = await chrome.storage.sync.get(['apiKey', 'savedBy', 'apiUrl']);
  if (!result.apiKey || !result.savedBy || !result.apiUrl) {
    return null;
  }
  return result as ExtensionSettings;
}

settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Get current tab info
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];
  if (tab && tab.url && tab.title) {
    urlInput.value = tab.url;
    titleInput.value = tab.title;
  }
});

saveButton.addEventListener('click', async () => {
  const settings = await getSettings();

  if (!settings) {
    showMessage('Please configure the extension first', 'error');
    return;
  }

  const url = urlInput.value.trim();
  const title = titleInput.value.trim();
  const note = noteInput.value.trim();

  if (!url || !title) {
    showMessage('URL and title are required', 'error');
    return;
  }

  try {
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    const trpc = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${settings.apiUrl}/api/trpc`,
        }),
      ],
    });

    await trpc.bookmarks.create.mutate({
      url,
      title,
      note: note || undefined,
      savedBy: settings.savedBy,
      apiKey: settings.apiKey,
    });

    showMessage('Bookmark saved successfully!', 'success');
    noteInput.value = '';
  } catch (error) {
    console.error('Error saving bookmark:', error);
    showMessage('Failed to save bookmark. Check your settings.', 'error');
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Save Bookmark';
  }
});
