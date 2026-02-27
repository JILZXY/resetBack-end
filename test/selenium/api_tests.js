const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runApiTests() {
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const baseUrl = 'http://64.23.248.243:80/api/v1';
    let token = '';

    try {
        console.log('--- Starting API Tests via Selenium ---');

        // Navigate to a blank page to execute scripts
        await driver.get('about:blank');

        // 1. Login Test
        console.log('\n[1] Testing POST /auth/login...');
        const loginData = {
            email: "fullgamer494@hotmail.com",
            password: "qwerty123"
        };

        const loginScript = `
            return fetch('${baseUrl}/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(${JSON.stringify(loginData)})
            }).then(r => r.json().then(data => ({ status: r.status, data })));
        `;

        const loginResult = await driver.executeScript(loginScript);

        if (loginResult.status === 201 || loginResult.status === 200) {
            console.log('✅ Login Successful');
            token = loginResult.data.data.accessToken;
            if (!token) {
                throw new Error('Token not found in response');
            }
            console.log('Token acquired.');
        } else {
            console.error('❌ Login Failed:', JSON.stringify(loginResult));
            return;
        }

        // 2. Get Contacts Test
        console.log('\n[2] Testing GET /emergency/contacts...');
        const getContactsScript = `
            return fetch('${baseUrl}/emergency/contacts', {
                method: 'GET',
                headers: { 
                    'Authorization': 'Bearer ${token}',
                    'Content-Type': 'application/json'
                }
            }).then(r => r.json().then(data => ({ status: r.status, data })));
        `;

        const getContactsResult = await driver.executeScript(getContactsScript);
        if (getContactsResult.status === 200) {
            console.log('✅ Get Contacts Successful');
            console.log('Contacts found:', getContactsResult.data.length || 0);
        } else {
            console.error('❌ Get Contacts Failed:', JSON.stringify(getContactsResult));
        }

        // 3. Add Contact Test
        console.log('\n[3] Testing POST /emergency/contacts...');
        const newContact = {
            contact_name: "Selenium Support " + Date.now(),
            email: "test@example.com",
            phone: "555-9999"
        };

        const addContactScript = `
            return fetch('${baseUrl}/emergency/contacts', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ${token}',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(${JSON.stringify(newContact)})
            }).then(r => r.json().then(data => ({ status: r.status, data })));
        `;

        const addContactResult = await driver.executeScript(addContactScript);
        if (addContactResult.status === 201 || addContactResult.status === 200) {
            console.log('✅ Add Contact Successful');
        } else {
            console.error('❌ Add Contact Failed:', JSON.stringify(addContactResult));
        }

        // 4. Trigger Alert Test
        console.log('\n[4] Testing POST /emergency/alert...');
        const alertData = {
            resulted_in_relapse: false,
            resolution_notes: "Selenium automated test alert " + new Date().toISOString()
        };

        const alertScript = `
            return fetch('${baseUrl}/emergency/alert', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ${token}',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(${JSON.stringify(alertData)})
            }).then(r => r.json().then(data => ({ status: r.status, data })));
        `;

        const alertResult = await driver.executeScript(alertScript);
        if (alertResult.status === 201 || alertResult.status === 200) {
            console.log('✅ Trigger Alert Successful');
        } else {
            console.error('❌ Trigger Alert Failed:', JSON.stringify(alertResult));
        }

        console.log('\n--- All Tests Completed ---');

    } catch (error) {
        console.error('An error occurred during verification:', error);
    } finally {
        await driver.quit();
    }
}

runApiTests();
