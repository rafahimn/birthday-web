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
  const site = rows?.[0];
  if (!site) return null;
  return {
    ...site,
    content: site.content || {},
    views: Number(site.views || 0),
  };
}

export async function supabaseStorageDelete(bucket: string, path: string) {
  const { url, key } = base();
  const response = await fetch(
    `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`,
    { method: 'DELETE', headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store' }
  );
  // Not fatal if the file is already gone; the DB row is the source of truth for the admin UI.
  return response.ok;
}
export async function supabaseStorageUpload(
  bucket: string,
  path: string,
  file: File
) {
  const { url, key } = base();
  const response = await fetch(
    `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`,
    {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: Buffer.from(await file.arrayBuffer()),
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase Storage ${response.status}: ${text}`);
  }
  return `${url}/storage/v1/object/public/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`;
}
