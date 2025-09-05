const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Function to load products dynamically (not cached)
const loadProducts = () => {
  try {
    const productsPath = path.join(__dirname, '../data/products.json');
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

router.get('/', (req, res) => {
  const products = loadProducts();
  let filteredProducts = [...products];
  
  // Search functionality
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Category filter
  if (req.query.category && req.query.category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Price range filter
  if (req.query.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(req.query.minPrice));
  }
  if (req.query.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(req.query.maxPrice));
  }
  
  // MPG filter
  if (req.query.minMPG) {
    filteredProducts = filteredProducts.filter(p => {
      const mpg = p.specs.efficiency?.combinedMPG || p.specs.efficiency?.combinedMPGe || 0;
      return mpg >= parseInt(req.query.minMPG);
    });
  }
  
  // In stock filter
  if (req.query.inStock === 'true') {
    filteredProducts = filteredProducts.filter(p => p.inStock > 0);
  }
  
  // Sorting
  if (req.query.sort) {
    switch(req.query.sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'mpg-desc':
        filteredProducts.sort((a, b) => {
          const mpgA = a.specs.efficiency?.combinedMPG || a.specs.efficiency?.combinedMPGe || 0;
          const mpgB = b.specs.efficiency?.combinedMPG || b.specs.efficiency?.combinedMPGe || 0;
          return mpgB - mpgA;
        });
        break;
      case 'stock-desc':
        filteredProducts.sort((a, b) => b.inStock - a.inStock);
        break;
      default:
        break;
    }
  }
  
  res.json(filteredProducts);
});

router.get('/compare', (req, res) => {
  const products = loadProducts();
  const ids = req.query.ids ? req.query.ids.split(',').map(id => parseInt(id)) : [];
  const compareProducts = products.filter(p => ids.includes(p.id));
  res.json(compareProducts);
});

router.get('/categories', (req, res) => {
  const products = loadProducts();
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

router.get('/price-range', (req, res) => {
  const products = loadProducts();
  const prices = products.map(p => p.price);
  res.json({
    min: Math.min(...prices),
    max: Math.max(...prices)
  });
});

router.get('/:id', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.get('/category/:category', (req, res) => {
  const products = loadProducts();
  const categoryProducts = products.filter(
    p => p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json(categoryProducts);
});

router.post('/:id/calculate-finance', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { downPayment, months } = req.body;
  const principal = product.price - downPayment;
  const monthlyRate = product.financing.apr / 100 / 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1);
  const totalCost = (monthlyPayment * months) + downPayment;
  const totalInterest = totalCost - product.price;
  
  res.json({
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    downPayment,
    principal,
    apr: product.financing.apr,
    months
  });
});

module.exports = router;