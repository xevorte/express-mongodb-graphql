import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    navs: [
      { path: '/', label: 'Home' },
      { path: '/products', label: 'Product' },
      { path: '/suppliers', label: 'Supplier' },
    ],
  });
});

export { default as product } from './product/routes.js';
export { default as supplier } from './supplier/routes.js';
export default router;