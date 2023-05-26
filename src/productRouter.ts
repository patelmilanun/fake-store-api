import { Router } from 'itty-router';
import { z } from 'zod';

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

// GET all products
router.get('/products', async (_, env) => {
  return new Response(await env.PRODUCTS.get('all'), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

// GET specific product with id
router.get('/products/:id', async ({ params }, env) => {
  const products: Product[] = JSON.parse(await env.PRODUCTS.get('all'));
  const selectedProduct = products?.find((product) => product.id?.toString() === params.id);
  return new Response(JSON.stringify(selectedProduct), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

// Add new product
router.post('/products', async (request, env) => {
  const content = await request.json();

  const newPorduct = {
    id: new Date().getTime(),
    title: content.title,
    price: content.price,
    description: content.description,
    category: content.category,
    image: content.image,
    rating: content.rating,
  };

  const schema = z.object({
    id: z.number().int().positive(),
    title: z.string().nonempty(),
    price: z.number().positive(),
    description: z.string().nonempty(),
    category: z.string().nonempty(),
    image: z.string().url(),
    rating: z.object({
      rate: z.number().min(0).max(5),
      count: z.number().int().nonnegative(),
    }),
  });

  const res = schema.safeParse(newPorduct);

  const products: Product[] = JSON.parse(await env.PRODUCTS.get('all'));
  products.push(newPorduct);

  await env.PRODUCTS.put('all', JSON.stringify(products));

  return new Response(JSON.stringify(res.success ? products : res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
