const SFD_URL =
  'https://web.seattle.gov/sfd/realtime911/getRecsForDatePub.asp?action=Today&incDate=&rad1=des';

export default async function handler(req, res) {
  try {
    const upstream = await fetch(SFD_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; seattle-fire-map)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).end();
      return;
    }

    const html = await upstream.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
