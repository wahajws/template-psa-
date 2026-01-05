require('dotenv').config();
const app = require('../app');
const request = require('supertest');

// Test if routes are registered
const routes = [];
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    routes.push({
      path: middleware.route.path,
      methods: Object.keys(middleware.route.methods)
    });
  } else if (middleware.name === 'router') {
    // This is a router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        routes.push({
          path: handler.route.path,
          methods: Object.keys(handler.route.methods)
        });
      }
    });
  }
});

console.log('Registered routes:');
routes.forEach(route => {
  console.log(`  ${route.methods.join(', ').toUpperCase()} ${route.path}`);
});

// Check for admin platform routes
const adminRoutes = routes.filter(r => r.path.includes('/admin/platform'));
console.log('\nAdmin Platform Routes:');
adminRoutes.forEach(route => {
  console.log(`  ${route.methods.join(', ').toUpperCase()} ${route.path}`);
});

if (adminRoutes.length === 0) {
  console.log('\n⚠ No admin platform routes found!');
  console.log('Make sure the server has been restarted after adding routes.');
}

process.exit(0);

