import app from "./app.js";

const port = process.env.PORT || 4000;

// Listen on all network interfaces (0.0.0.0) so phone can access it
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API listening on port ${port}`);
  console.log(`📱 Access from phone: http://192.168.1.3:${port}/api`);
  console.log(`💻 Access locally: http://localhost:${port}/api`);
});

