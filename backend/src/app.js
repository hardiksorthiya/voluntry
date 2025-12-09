import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import setupRoutes from "./routes/setupRoutes.js";

dotenv.config();
await connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// API Documentation Route - Authentication APIs Only
app.get("/docs", async (_req, res) => {
  const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
  try {
    const { readFile } = await import('fs/promises');
    const { fileURLToPath } = await import('url');
    const { dirname, join } = await import('path');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = join(__dirname, 'docs-template.html');
    let html = await readFile(templatePath, 'utf-8');
    html = html.replace('BASE_URL_PLACEHOLDER', baseUrl);
    res.send(html);
  } catch (error) {
    res.status(500).send(`Error loading docs: ${error.message}`);
  }
});

// Old docs route (commented out for reference)
/*
app.get("/docs", (_req, res) => {
  const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voluntry API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header p { opacity: 0.9; }
    .content { padding: 30px; }
    .token-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #667eea;
    }
    .token-section input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      margin-top: 10px;
    }
    .endpoint-group {
      margin-bottom: 40px;
    }
    .endpoint-group h2 {
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .endpoint {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e0e0e0;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
    .method {
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
    }
    .method.get { background: #61affe; color: white; }
    .method.post { background: #49cc90; color: white; }
    .method.put { background: #fca130; color: white; }
    .method.delete { background: #f93e3e; color: white; }
    .path {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .description {
      color: #666;
      margin-bottom: 15px;
    }
    .auth-badge {
      display: inline-block;
      background: #ffc107;
      color: #333;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 10px;
    }
    .body-example {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .test-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
    }
    .test-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.3s;
    }
    .test-btn:hover { background: #5568d3; }
    .response {
      margin-top: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #667eea;
      display: none;
    }
    .response.show { display: block; }
    .response pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .response.success { border-left-color: #49cc90; }
    .response.error { border-left-color: #f93e3e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Voluntry API Documentation</h1>
      <p>Test all endpoints directly from this page</p>
    </div>
    <div class="content">
      <div class="token-section">
        <h3>🔑 Authentication Token</h3>
        <p>After logging in, paste your JWT token here to test authenticated endpoints:</p>
        <input type="text" id="authToken" placeholder="Bearer token will be auto-filled after login">
      </div>

      <div class="endpoint-group">
        <h2>Health Check</h2>
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method get">GET</span>
            <span class="path">/health</span>
          </div>
          <div class="description">Health check endpoint - no authentication required</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('GET', '/health', null)">Test</button>
            <div class="response" id="response-health"></div>
          </div>
        </div>
      </div>

      <div class="endpoint-group">
        <h2>Authentication</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method post">POST</span>
            <span class="path">/api/auth/signup</span>
          </div>
          <div class="description">Create a new user account</div>
          <div class="test-section">
            <div style="display: grid; gap: 10px; margin-bottom: 15px;">
              <input type="text" id="signup-name" placeholder="Name" value="John Doe" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="email" id="signup-email" placeholder="Email" value="john@example.com" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="password" id="signup-password" placeholder="Password (min 6 chars)" value="password123" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
            </div>
            <button class="test-btn" onclick="testSignup()">Test Signup</button>
            <div class="response" id="response-signup"></div>
          </div>
        </div>

        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
          </div>
          <div class="description">Login and get JWT token</div>
          <div class="test-section">
            <div style="display: grid; gap: 10px; margin-bottom: 15px;">
              <input type="email" id="login-email" placeholder="Email" value="john@example.com" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="password" id="login-password" placeholder="Password" value="password123" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
            </div>
            <button class="test-btn" onclick="testLogin()">Test Login</button>
            <div class="response" id="response-login"></div>
          </div>
        </div>
      </div>

      <div class="endpoint-group">
        <h2>Profile</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method get">GET</span>
            <span class="path">/api/profile</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Get current user profile</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('GET', '/api/profile', null, true)">Test</button>
            <div class="response" id="response-profile-get"></div>
          </div>
        </div>

        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method put">PUT</span>
            <span class="path">/api/profile</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Update user profile (all fields optional)</div>
          <div class="test-section">
            <div style="display: grid; gap: 10px; margin-bottom: 15px;">
              <input type="text" id="profile-name" placeholder="Name (optional)" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="email" id="profile-email" placeholder="Email (optional)" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="text" id="profile-bio" placeholder="Bio (optional)" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="text" id="profile-phone" placeholder="Phone (optional)" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <input type="text" id="profile-location" placeholder="Location (optional)" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
            </div>
            <button class="test-btn" onclick="testProfileUpdate()">Test Update</button>
            <div class="response" id="response-profile-update"></div>
          </div>
        </div>

        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method delete">DELETE</span>
            <span class="path">/api/profile</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Delete user account and all associated data (chat messages, volunteer activities)</div>
          <div class="test-section">
            <button class="test-btn" onclick="testProfileDelete()" style="background: #f93e3e;">Delete Profile</button>
            <div class="response" id="response-profile-delete"></div>
          </div>
        </div>
      </div>

      <div class="endpoint-group">
        <h2>Chat</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method post">POST</span>
            <span class="path">/api/chat</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Send a message to AI chat</div>
          <div class="body-example">{
  "content": "How can I help with volunteering?"
}</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('POST', '/api/chat', {content: 'How can I help with volunteering?'}, true)">Test</button>
            <div class="response" id="response-chat"></div>
          </div>
        </div>

        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method get">GET</span>
            <span class="path">/api/chat/history</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Get chat history</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('GET', '/api/chat/history', null, true)">Test</button>
            <div class="response" id="response-chat-history"></div>
          </div>
        </div>
      </div>

      <div class="endpoint-group">
        <h2>Volunteer Activities</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method post">POST</span>
            <span class="path">/api/volunteer</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Create a new volunteer activity</div>
          <div class="body-example">{
  "title": "Food Drive",
  "description": "Help pack food boxes",
  "status": "planned",
  "hours": 3,
  "impactScore": 10
}</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('POST', '/api/volunteer', {title: 'Food Drive', description: 'Help pack food boxes', status: 'planned', hours: 3, impactScore: 10}, true)">Test</button>
            <div class="response" id="response-volunteer-create"></div>
          </div>
        </div>

        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method get">GET</span>
            <span class="path">/api/volunteer</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Get all volunteer activities</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('GET', '/api/volunteer', null, true)">Test</button>
            <div class="response" id="response-volunteer-getall"></div>
          </div>
        </div>
      </div>

      <div class="endpoint-group">
        <h2>Statistics</h2>
        
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method get">GET</span>
            <span class="path">/api/stats/dashboard</span>
            <span class="auth-badge">Auth Required</span>
          </div>
          <div class="description">Get volunteer statistics dashboard</div>
          <div class="test-section">
            <button class="test-btn" onclick="testEndpoint('GET', '/api/stats/dashboard', null, true)">Test</button>
            <div class="response" id="response-stats"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const baseUrl = '${baseUrl}';
    
    function getResponseId(endpoint) {
      const map = {
        '/health': 'health',
        '/api/auth/signup': 'signup',
        '/api/auth/login': 'login',
        '/api/profile': 'profile-get',
        '/api/chat': 'chat',
        '/api/chat/history': 'chat-history',
        '/api/volunteer': 'volunteer-create',
        '/api/stats/dashboard': 'stats'
      };
      return map[endpoint] || endpoint.replace(/[^a-z]/gi, '-');
    }

    async function testEndpoint(method, endpoint, body, needsAuth = false) {
      const responseId = 'response-' + getResponseId(endpoint);
      const responseDiv = document.getElementById(responseId);
      responseDiv.className = 'response';
      responseDiv.innerHTML = '<pre>Loading...</pre>';

      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (needsAuth) {
        const token = document.getElementById('authToken').value;
        if (!token) {
          responseDiv.className = 'response error show';
          responseDiv.innerHTML = '<pre>Error: Please add authentication token first (login to get token)</pre>';
          return;
        }
        options.headers['Authorization'] = 'Bearer ' + token;
      }

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(baseUrl + endpoint, options);
        const data = await response.json();
        
        responseDiv.className = 'response ' + (response.ok ? 'success' : 'error') + ' show';
        responseDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        
        // Auto-fill token if login successful
        if (endpoint === '/api/auth/login' && data.token) {
          document.getElementById('authToken').value = data.token;
        }
        if (endpoint === '/api/auth/signup' && data.token) {
          document.getElementById('authToken').value = data.token;
        }
      } catch (error) {
        responseDiv.className = 'response error show';
        responseDiv.innerHTML = '<pre>Error: ' + error.message + '</pre>';
      }
    }

    function testSignup() {
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      
      if (!name || !email || !password) {
        const responseDiv = document.getElementById('response-signup');
        responseDiv.className = 'response error show';
        responseDiv.innerHTML = '<pre>Error: Please fill in all fields</pre>';
        return;
      }
      
      testEndpoint('POST', '/api/auth/signup', {name, email, password});
    }

    function testLogin() {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        const responseDiv = document.getElementById('response-login');
        responseDiv.className = 'response error show';
        responseDiv.innerHTML = '<pre>Error: Please fill in all fields</pre>';
        return;
      }
      
      testEndpoint('POST', '/api/auth/login', {email, password});
    }

    function testProfileUpdate() {
      const name = document.getElementById('profile-name').value;
      const email = document.getElementById('profile-email').value;
      const bio = document.getElementById('profile-bio').value;
      const phone = document.getElementById('profile-phone').value;
      const location = document.getElementById('profile-location').value;
      
      const body = {};
      if (name) body.name = name;
      if (email) body.email = email;
      if (bio) body.bio = bio;
      if (phone) body.phone = phone;
      if (location) body.location = location;
      
      if (Object.keys(body).length === 0) {
        const responseDiv = document.getElementById('response-profile-update');
        responseDiv.className = 'response error show';
        responseDiv.innerHTML = '<pre>Error: Please fill in at least one field</pre>';
        return;
      }
      
      testEndpoint('PUT', '/api/profile', body, true);
    }

    function testProfileDelete() {
      if (!confirm('⚠️ WARNING: This will permanently delete your account and all associated data (chat messages, volunteer activities). Are you sure?')) {
        return;
      }
      testEndpoint('DELETE', '/api/profile', null, true);
    }
  </script>
</body>
</html>
  `);
});
*/

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes); // Keep for backward compatibility
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/setup", setupRoutes); // Setup routes (for initial admin creation)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

