import { Builder, WebDriver, Options } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env.development') });

interface ApiResponse {
  status: number;
  data: any;
  error?: string;
}

const LOG_FILE = path.join(__dirname, 'test_results.log');

function logResult(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
}

async function runApiTests() {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver: WebDriver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  logResult(`Using API Base URL: ${baseUrl}`);
  let token = '';
  let testCount = 0;
  let successCount = 0;

  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  try {
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
    logResult(
      '--- Starting Comprehensive API Tests via Selenium (Final Run) ---',
    );

    logResult(`Navigating to ${baseUrl}...`);
    await driver.get(baseUrl);
    await driver.sleep(1000);

    async function testEndpoint(
      name: string,
      endpointPath: string,
      method: string = 'GET',
      body: any = null,
    ) {
      testCount++;
      logResult(
        `\n[${testCount}] Testing ${method} ${endpointPath} (${name})...`,
      );

      const script = `
                const options = {
                    method: '${method}',
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
                if ('${token}') {
                    options.headers['Authorization'] = 'Bearer ${token}';
                }
                if (${!!body}) {
                    options.body = JSON.stringify(${JSON.stringify(body)});
                }
                const url = '${baseUrl}' + '${endpointPath}';
                return fetch(url, options)
                    .then(r => r.json().then(data => ({ status: r.status, data })).catch(() => ({ status: r.status, data: null })))
                    .catch(err => ({ status: 0, error: err.message }));
            `;

      try {
        const result = (await driver.executeScript(script)) as ApiResponse;
        if (result.status >= 200 && result.status < 300) {
          logResult(
            `✅ SUCCESS: ${method} ${endpointPath} returned ${result.status}`,
          );
          successCount++;
          return result.data;
        } else {
          const errorDetails = result.error || JSON.stringify(result.data);
          logResult(
            `❌ FAILED: ${method} ${endpointPath} returned ${result.status}. Detail: ${errorDetails}`,
          );
          return result;
        }
      } catch (err: any) {
        logResult(
          `❌ ERROR: ${method} ${endpointPath} threw an exception: ${err.message}`,
        );
      }
      return null;
    }

    logResult(`Attempting to register user: ${email}`);
    await testEndpoint('Register', '/auth/register', 'POST', {
      name: 'Selenium Test User',
      email: email,
      password: password,
      role: 'ADICTO',
      addictionName: 'Testing',
    });

    const loginRes = await testEndpoint('Login', '/auth/login', 'POST', {
      email,
      password,
    });
    let loginData = loginRes?.data || loginRes;
    if (loginData && (loginData.accessToken || loginData.data?.accessToken)) {
      token = loginData.accessToken || loginData.data.accessToken;
      logResult('Token acquired.');
    } else {
      logResult('New user login failed, trying fallback credentials...');
      const fallbackRes = await testEndpoint(
        'Login Fallback',
        '/auth/login',
        'POST',
        {
          email: 'fullgamer494@hotmail.com',
          password: 'qwerty123',
        },
      );
      let fallbackData = fallbackRes?.data || fallbackRes;
      if (
        fallbackData &&
        (fallbackData.accessToken || fallbackData.data?.accessToken)
      ) {
        token = fallbackData.accessToken || fallbackData.data.accessToken;
        logResult('Fallback token acquired.');
      } else {
        logResult('Aborting further tests due to login failure.');
        return;
      }
    }

    await testEndpoint('Get Tracking Logs', '/tracking/logs');
    await testEndpoint('Get Tracking Statistics', '/tracking/statistics');
    await testEndpoint('Create Tracking Log', '/tracking/logs', 'POST', {
      log_date: new Date().toISOString().split('T')[0],
      consumed: false,
      emotional_state: 7,
      craving_level: 3,
      notes: 'Final automated test log',
    });

    await testEndpoint('Get Current Streak', '/streak');
    await testEndpoint('Get Streak Events', '/streak/events');

    await testEndpoint('Get Emergency Contacts', '/emergency/contacts');
    await testEndpoint('Get Alerts', '/emergency/alerts');

    const contactRes = await testEndpoint(
      'Add Contact',
      '/emergency/contacts',
      'POST',
      {
        contactName: 'Final Support ' + Date.now(),
        email: 'final@example.com',
        relationship: 'amigo',
      },
    );

    await testEndpoint('Trigger Alert', '/emergency/alert', 'POST', {
      resulted_in_relapse: false,
      resolution_notes: 'Automated test alert (Final)',
    });

    const contactData = contactRes?.data || contactRes;
    const contactId = contactData?.id;
    if (contactId) {
      await testEndpoint(
        'Delete Contact',
        `/emergency/contacts/${contactId}`,
        'DELETE',
      );
    }

    await testEndpoint('Get Forum Posts', '/forum/posts');
    await testEndpoint('Get My Posts', '/forum/posts/my/list');

    const postRes = await testEndpoint(
      'Create Forum Post',
      '/forum/posts',
      'POST',
      {
        title: 'Final Test Post ' + Date.now(),
        content: 'Final test post content.',
        is_anonymous: false,
      },
    );

    const postData = postRes?.data || postRes;
    const postId = postData?.id;
    if (postId) {
      await testEndpoint('Get Post Details', `/forum/posts/${postId}`);
      await testEndpoint('Edit Post', `/forum/posts/${postId}`, 'PUT', {
        title: 'Updated Post Title',
        content: 'Updated content.',
      });
      await testEndpoint(
        'React to Post',
        `/forum/posts/${postId}/react`,
        'POST',
        { type: 'like' },
      );
      await testEndpoint('Get Comments', `/forum/posts/${postId}/comments`);
      const commentRes = await testEndpoint(
        'Add Comment',
        `/forum/posts/${postId}/comments`,
        'POST',
        {
          content: 'Final automated test comment',
          is_anonymous: false,
        },
      );
      const commentData = commentRes?.data || commentRes;
      const commentId = commentData?.id;
      if (commentId) {
        await testEndpoint(
          'Delete Comment',
          `/forum/comments/${commentId}`,
          'DELETE',
        );
      }
      await testEndpoint('Delete Post', `/forum/posts/${postId}`, 'DELETE');
    }

    logResult('\n--- Checking Admin Endpoints ---');
    await testEndpoint('Admin Overview', '/admin/metrics/overview');
    await testEndpoint('Admin Logs Frequency', '/admin/metrics/logs-frequency');

    logResult(`\n--- Summary: ${successCount}/${testCount} tests passed ---`);
    logResult('--- Comprehensive API Tests Completed ---');
  } catch (error: any) {
    logResult(`An unexpected error occurred: ${error.message}`);
  } finally {
    await driver.quit();
  }
}

runApiTests();
