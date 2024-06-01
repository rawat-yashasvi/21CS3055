const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const BASE_URL = "http://20.244.56.144/test/companies";
const COMPANIES = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const AUTHORIZATION_HEADER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjIzNjc4LCJpYXQiOjE3MTcyMjMzNzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMwYWYwMWI5LWQwMzItNGFmNi04MTc4LTRlOTllZGM1ODIyNiIsInN1YiI6IjIxY3MzMDU1QHJnaXB0LmFjLmluIn0sImNvbXBhbnlOYW1lIjoiUkdJUFQiLCJjbGllbnRJRCI6IjMwYWYwMWI5LWQwMzItNGFmNi04MTc4LTRlOTllZGM1ODIyNiIsImNsaWVudFNlY3JldCI6ImtuQ0tsSHB2Y0pMUE5ZVHMiLCJvd25lck5hbWUiOiJZYXNoYXN2aSBSYXdhdCIsIm93bmVyRW1haWwiOiIyMWNzMzA1NUByZ2lwdC5hYy5pbiIsInJvbGxObyI6IjIxQ1MzMDU1In0.Tp-myy7Brwe8Sep6DiCkCY8tqd7CX59bOSrnjcI1Ju0';  

const productCache = {};

const fetchProducts = async (company, category, top, minPrice, maxPrice) => {
  const url = `${BASE_URL}/${company}/categories/${category}/products`;
  console.log(`Fetching products from ${url} with params: top=${top}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
  console.log("Hello")
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': AUTHORIZATION_HEADER
      },
      params: {
        top,
        minPrice,
        maxPrice
      }
    });
    console.log(`Received ${response.data.length} products from ${company}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products from ${company}:`, error.message);
    return [];
  }
};

app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const top = parseInt(req.query.top) || 10;
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  const sortBy = req.query.sortBy || 'rating';
  const order = req.query.order || 'desc';
  const page = parseInt(req.query.page) || 1;

  let allProducts = [];

  for (const company of COMPANIES) {
    const products = await fetchProducts(company, categoryname, top, minPrice, maxPrice);
    products.forEach(product => {
      const productId = uuidv4();
      productCache[productId] = { ...product, id: productId, company };
      allProducts.push(productCache[productId]);
    });
  }

  if (allProducts.length === 0) {
    console.log("No products found for the given criteria.");
  }

  // Sorting
  const sortOrder = order === 'desc' ? -1 : 1;
  allProducts.sort((a, b) => (a[sortBy] > b[sortBy] ? sortOrder : -sortOrder));

  // Pagination
  const start = (page - 1) * top;
  const paginatedProducts = allProducts.slice(start, start + top);

  console.log(`Returning ${paginatedProducts.length} products`);
  res.json(paginatedProducts);
});

app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { productid } = req.params;
  const product = productCache[productid];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
