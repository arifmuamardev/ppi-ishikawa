// Every request, including static asset requests, passes through this Worker.
export default {
  async fetch(request, env, ctx) {
    // Defense in depth: deny requests if Worker-level Cloudflare Access is absent.
    if (!ctx.access) {
      return new Response('Private preview: authentication required.', {
        status: 401,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
          'x-robots-tag': 'noindex, nofollow, noarchive'
        }
      });
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
    headers.set('cache-control', 'private, no-store');
    return new Response(response.body, { status: response.status, headers });
  },
};
