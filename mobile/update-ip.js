#!/usr/bin/env node

/**
 * Helper script to automatically detect and update the IP address in mobile/src/api.js
 * Run this script when your IP changes or before starting the mobile app
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to get primary IP address
function getPrimaryIP() {
  const interfaces = networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return null;
}

async function updateIP() {
  try {
    const apiJsPath = join(__dirname, 'src', 'api.js');
    const currentIP = getPrimaryIP();
    
    if (!currentIP) {
      console.error('❌ Could not detect IP address. Make sure you are connected to a network.');
      process.exit(1);
    }
    
    console.log(`\n🔍 Detected IP: ${currentIP}`);
    
    // Read the current api.js file
    let content = await readFile(apiJsPath, 'utf-8');
    
    // Check current IP
    const currentIPMatch = content.match(/const HARDCODED_IP = "([\d.]+)"/);
    const oldIP = currentIPMatch ? currentIPMatch[1] : null;
    
    if (oldIP === currentIP) {
      console.log(`✅ IP is already set to ${currentIP}. No changes needed.`);
      return;
    }
    
    // Update the IP
    let updatedContent = content.replace(
      /const HARDCODED_IP = "[\d.]+"/,
      `const HARDCODED_IP = "${currentIP}"`
    );
    
    // Also update the comment if it exists (flexible pattern)
    updatedContent = updatedContent.replace(
      /\/\/ Current IP detected: [\d.]+( \([\w\s]+\))?/,
      `// Current IP detected: ${currentIP} (Auto-detected)`
    );
    
    await writeFile(apiJsPath, updatedContent, 'utf-8');
    
    console.log(`\n✅ Updated IP from ${oldIP || 'unknown'} to ${currentIP}`);
    console.log(`\n📝 File updated: ${apiJsPath}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Restart Expo: npx expo start --clear`);
    console.log(`   2. Reload app on your phone`);
    console.log(`   3. Test: http://${currentIP}:4000/health from phone browser\n`);
    
  } catch (error) {
    console.error('❌ Error updating IP:', error.message);
    process.exit(1);
  }
}

updateIP();

