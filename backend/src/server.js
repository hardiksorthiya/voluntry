import app from "./app.js";
import { networkInterfaces } from "os";

const port = process.env.PORT || 4000;

// Function to get all local IP addresses
function getAllLocalIPs() {
  const interfaces = networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          name: name,
          address: iface.address
        });
      }
    }
  }

  return ips.length > 0 ? ips : [{ name: 'localhost', address: 'localhost' }];
}

// Function to get primary IP (first non-localhost)
function getPrimaryIP() {
  const ips = getAllLocalIPs();
  return ips[0]?.address || 'localhost';
}

const allIPs = getAllLocalIPs();
const primaryIP = getPrimaryIP();

// Listen on all network interfaces (0.0.0.0) so it can be accessed from anywhere
app.listen(port, '0.0.0.0', () => {
  // Clear console and show header
  console.log('\n' + '='.repeat(60));
  console.log('🚀 VOLUNTRY API SERVER STARTED');
  console.log('='.repeat(60));

  console.log(`\n✅ Server Status: Running on port ${port}`);
  console.log(`\n📡 Network Access Information:`);
  console.log('─'.repeat(60));

  // Show localhost access
  console.log(`\n💻 Local Access:`);
  console.log(`   http://localhost:${port}`);
  console.log(`   http://127.0.0.1:${port}`);

  // Show network IPs
  if (allIPs.length > 0 && allIPs[0].address !== 'localhost') {
    console.log(`\n🌐 Network Access (Use these IPs in Mobile App):`);
    allIPs.forEach((ip, index) => {
      const isPrimary = index === 0 ? ' ⭐ PRIMARY' : '';
      console.log(`   ${index + 1}. http://${ip.address}:${port} (${ip.name})${isPrimary}`);
    });

    console.log(`\n📱 Mobile App Configuration:`);
    console.log(`   Update HARDCODED_IP in mobile/src/api.js to: ${primaryIP}`);
    console.log(`   Or use: http://${primaryIP}:${port}/api`);
  } else {
    console.log(`\n⚠️  No network interfaces found. Using localhost only.`);
    console.log(`   Make sure you're connected to a network.`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`\n⚠️  Security Note: Make sure your firewall allows connections on port ${port}`);
  console.log('─'.repeat(60));
  console.log('\n');
});

