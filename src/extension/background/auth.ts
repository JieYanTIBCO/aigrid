import { ServiceAdapter } from './services';

class ChatGPTAuthManager implements ServiceAdapter {
  private _sessionToken: string | null = null;

  async authenticate(): Promise<void> {
    const cookie = await chrome.cookies.get({
      url: 'https://chat.openai.com',
      name: '__Secure-next-auth.session-token'
    });

    if (cookie?.value) {
      this._sessionToken = cookie.value;
      this._startSessionHeartbeat();
    } else {
      throw new Error('ChatGPT session not found');
    }
  }

  private _startSessionHeartbeat() {
    setInterval(async () => {
      try {
        await this._validateSession();
      } catch (error) {
        console.error('Session validation failed:', error);
      }
    }, 600000); // 10 minute interval
  }

  private async _validateSession() {
    if (!this._sessionToken) return;

    const response = await fetch('https://chat.openai.com/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._sessionToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid session');
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this._sessionToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('https://chat.openai.com/backend-api/conversation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Message send failed');
    }

    const data = await response.json();
    return data.response;
  }

  handleResponse(response: any): void {
    // Handle and process ChatGPT responses
    console.log('Received response:', response);
  }
}

export const chatGPTManager = new ChatGPTAuthManager();
