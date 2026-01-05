const express = require('express');
const BaseController = require('../controllers/BaseController');
const { authenticate } = require('../middlewares/auth');
const { validateCompany, validateBranch } = require('../middlewares/tenant');

class CrudRouterFactory {
  static create(service, options = {}) {
    const router = express.Router();
    const controller = new BaseController(service);
    
    const {
      requireAuth = true,
      requireCompany = false,
      requireBranch = false,
      rbac = null,
      customRoutes = []
    } = options;

    const middlewares = [];

    if (requireAuth) {
      middlewares.push(authenticate);
    }

    if (requireCompany) {
      middlewares.push(validateCompany);
    }

    if (requireBranch) {
      middlewares.push(validateBranch);
    }

    if (rbac) {
      middlewares.push(rbac);
    }

    router.get('/', ...middlewares, controller.getAll.bind(controller));
    router.get('/:id', ...middlewares, controller.getById.bind(controller));
    router.post('/', ...middlewares, controller.create.bind(controller));
    router.patch('/:id', ...middlewares, controller.update.bind(controller));
    router.delete('/:id', ...middlewares, controller.delete.bind(controller));

    customRoutes.forEach(route => {
      const [method, path, ...handlers] = route;
      router[method](path, ...middlewares, ...handlers);
    });

    return router;
  }
}

module.exports = CrudRouterFactory;



