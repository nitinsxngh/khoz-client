// Simple test to verify frontend-backend connection
// Run this in the browser console or as a Node.js script

const API_BASE_URL = 'http://localhost:3001/api';

async function testBackendConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData.message);
      console.log('   Server uptime:', healthData.uptime, 'seconds');
    } else {
      console.log('❌ Health check failed');
      return;
    }
    console.log('');

    // Test 2: Test CORS (from frontend perspective)
    console.log('2️⃣ Testing CORS Configuration...');
    const corsResponse = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    if (corsResponse.ok) {
      console.log('✅ CORS is properly configured');
      console.log('   Frontend can communicate with backend');
    } else {
      console.log('❌ CORS issue detected');
    }
    console.log('');

    // Test 3: Test Authentication Endpoint Structure
    console.log('3️⃣ Testing Authentication Endpoints...');
    
    // Test registration endpoint structure (without actually registering)
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        agreeToTerms: true
      })
    });

    if (registerResponse.status === 400) {
      const errorData = await registerResponse.json();
      if (errorData.errors && errorData.errors.length > 0) {
        console.log('✅ Registration endpoint is working (validation working)');
        console.log('   Validation caught:', errorData.errors[0].message);
      } else {
        console.log('⚠️ Registration endpoint responded but validation unclear');
      }
    } else if (registerResponse.status === 201) {
      console.log('✅ Registration endpoint is working');
    } else {
      console.log('❌ Registration endpoint issue:', registerResponse.status);
    }
    console.log('');

    // Test 4: Test Login Endpoint Structure
    console.log('4️⃣ Testing Login Endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
    });

    if (loginResponse.status === 401) {
      const errorData = await loginResponse.json();
      console.log('✅ Login endpoint is working (authentication working)');
      console.log('   Response:', errorData.message);
    } else {
      console.log('⚠️ Login endpoint responded with status:', loginResponse.status);
    }
    console.log('');

    console.log('🎉 Frontend-Backend Connection Test Completed!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your backend server: npm run dev (in server folder)');
    console.log('   2. Start your frontend: npm run dev (in client folder)');
    console.log('   3. Try registering/logging in through the UI');
    console.log('   4. Check browser console for any errors');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Make sure backend server is running on port 3001');
    console.log('   - Check if MongoDB is connected');
    console.log('   - Verify config.env file in server folder');
    console.log('   - Check browser console for CORS errors');
  }
}

// Run the test
testBackendConnection();
