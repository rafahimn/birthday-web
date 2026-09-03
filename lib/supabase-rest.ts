const base = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server environment is not configured');
  return { url: url.replace(/\/$/, ''), key };
};

export async function supabaseRest<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = base();
  const headers = new Headers(init.headers);
  headers.set('apikey', key);
  headers.set('Authorization', `Bearer ${key}`);
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers, cache: 'no-store' });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${text}`);
  }
  if (response.status === 204) return null as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function getPublishedSite(slug: string) {
  const rows = await supabaseRest<any[]>(
    `websites?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`
  );
  const site = rows?.[0] || null;
  if (site) {
    // Fire-and-forget view counter so a failed increment never breaks the page render.
    supabaseRest('rpc/increment_website_views', {
      method: 'POST',
      body: JSON.stringify({ p_website_id: site.id }),
    }).catch(() => {});
  }
  return site;
}
