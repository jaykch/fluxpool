import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.THEGRAPH_TOKEN_API_KEY;
  // Log the API key (redacted for safety)
  if (apiKey) {
    console.log('THEGRAPH_TOKEN_API_KEY loaded:', apiKey.slice(0, 3) + '...' + apiKey.slice(-3));
  } else {
    console.log('THEGRAPH_TOKEN_API_KEY is NOT set');
  }

  const limit = typeof req.query.limit === 'string' ? req.query.limit : '5';
  const url = `https://token-api.thegraph.com/pools/evm?network_id=mainnet&protocol=uniswap_v3&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error fetching pools' });
  }
} 