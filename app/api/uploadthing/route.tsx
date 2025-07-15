import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core'; // adjust the path if needed

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
