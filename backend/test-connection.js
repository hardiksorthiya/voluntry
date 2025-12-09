// Quick test script to verify server connectivity
import http from 'http';

const testUrl = 'http://192.168.1.5:4000/health';
const localUrl = 'http://localhost:4000/health';

console.log('🔍 Testing server connectivity...\n');

async function testConnection(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`✅ ${name}: Connected! Status: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);
        resolve(true);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name}: Failed - ${error.message}\n`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏱️  ${name}: Timeout - Server not responding\n`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

(async () => {
  const localOk = await testConnection(localUrl, 'Localhost');
  const networkOk = await testConnection(testUrl, 'Network (192.168.1.5)');

  console.log('─'.repeat(60));
  if (localOk && networkOk) {
    console.log('✅ All tests passed! Server is accessible.');
  } else if (localOk && !networkOk) {
    console.log('⚠️  Server is running locally but not accessible from network.');
    console.log('   This might be a firewall issue.');
    console.log('   Try: netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=4000');
  } else {
    console.log('❌ Server is not running or not accessible.');
    console.log('   Make sure to run: npm start');
  }
  console.log('─'.repeat(60));
  process.exit(0);
})();

