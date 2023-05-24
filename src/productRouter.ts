import { Router } from 'itty-router';

// types
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

// now let's create a router (note the lack of "new")
const router = Router();

// GET collection index
router.get('/products', async (_, env) => {
  return new Response(await env.PRODUCTS.get('all'), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

// GET item
router.get('/products/:id', async ({ params }, env) => {
  const products: Product[] = JSON.parse(await env.PRODUCTS.get('all'));
  const selectedProduct = products?.find((product) => product.id?.toString() === params.id);
  return new Response(JSON.stringify(selectedProduct), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

// // POST to the collection (we'll use async here)
// router.post('/api/todos', async (request) => {
//   const content = await request.json();

//   return new Response('Creating Todo: ' + JSON.stringify(content));
// });

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
