/**
 * Live market data — stocks via Finnhub, crypto via CoinGecko.
 *
 * Server-side only. Cached per process via a 60-second TTL plus Next's
 * `fetch` data cache, so concurrent renders collapse to a single upstream
 * call. Degrades gracefully when Finnhub is missing or either provider
 * fails — the last good payload is retained per process.
 */

export type TickerData = {
  symbol: string
  label: string
  price: number
  change: number
  changePercent: number
  source: 'stocks' | 'crypto'
}

export type MarketSnapshot = {
  stocks: TickerData[]
  crypto: TickerData[]
  fetchedAt: number
  errors: string[]
}

// ── Symbol catalogue ─────────────────────────────────────────────
const STOCK_SYMBOLS: { symbol: string; label: string }[] = [
  { symbol: 'SPY', label: 'S&P 500' },
  { symbol: 'QQQ', label: 'NASDAQ 100' },
  { symbol: 'AAPL', label: 'AAPL' },
  { symbol: 'MSFT', label: 'MSFT' },
  { symbol: 'NVDA', label: 'NVDA' },
  { symbol: 'GOOGL', label: 'GOOGL' },
  { symbol: 'META', label: 'META' },
  { symbol: 'TSLA', label: 'TSLA' },
]

const CRYPTO_IDS: { id: string; symbol: string; label: string }[] = [
  { id: 'bitcoin', symbol: 'BTC', label: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', label: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', label: 'Solana' },
]

// ── In-process cache ─────────────────────────────────────────────
const CACHE_TTL_MS = 60_000

let cached: MarketSnapshot | null = null
let inflight: Promise<MarketSnapshot> | null = null

// ── Finnhub (stocks) ─────────────────────────────────────────────
type FinnhubQuote = {
  c: number // current
  d: number | null // change
  dp: number | null // % change
  pc: number // previous close
}

async function fetchStocks(): Promise<{ data: TickerData[]; errors: string[] }> {
  const key = process.env.FINNHUB_API_KEY
  if (!key) return { data: [], errors: ['no Finnhub key configured'] }

  const errors: string[] = []
  const results = await Promise.all(
    STOCK_SYMBOLS.map(async ({ symbol, label }) => {
      try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`
        const res = await fetch(url, {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) {
          errors.push(`${symbol} ${res.status}`)
          return null
        }
        const q = (await res.json()) as FinnhubQuote
        if (!q.c) return null
        const item: TickerData = {
          symbol,
          label,
          price: q.c,
          change: q.d ?? 0,
          changePercent: q.dp ?? 0,
          source: 'stocks',
        }
        return item
      } catch (err) {
        errors.push(`${symbol} ${(err as Error).message}`)
        return null
      }
    }),
  )
  return { data: results.filter((r): r is TickerData => r !== null), errors }
}

// ── CoinGecko (crypto) — no key required ─────────────────────────
type CoinGeckoCoin = {
  id: string
  symbol: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
}

async function fetchCrypto(): Promise<{ data: TickerData[]; errors: string[] }> {
  try {
    const ids = CRYPTO_IDS.map((c) => c.id).join(',')
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'User-Agent': 'PulseMagazine/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { data: [], errors: [`CoinGecko ${res.status}`] }
    const coins = (await res.json()) as CoinGeckoCoin[]
    const data = CRYPTO_IDS.map(({ id, symbol, label }): TickerData | null => {
      const coin = coins.find((c) => c.id === id)
      if (!coin) return null
      return {
        symbol,
        label,
        price: coin.current_price,
        change: coin.price_change_24h ?? 0,
        changePercent: coin.price_change_percentage_24h ?? 0,
        source: 'crypto',
      }
    }).filter((r): r is TickerData => r !== null)
    return { data, errors: [] }
  } catch (err) {
    return { data: [], errors: [`CoinGecko ${(err as Error).message}`] }
  }
}

// ── Public surface ──────────────────────────────────────────────
export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  // Fresh cache hit
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached
  }
  // Coalesce concurrent calls
  if (inflight) return inflight

  inflight = (async () => {
    const [stocks, crypto] = await Promise.all([fetchStocks(), fetchCrypto()])
    const snapshot: MarketSnapshot = {
      stocks: stocks.data.length > 0 ? stocks.data : (cached?.stocks ?? []),
      crypto: crypto.data.length > 0 ? crypto.data : (cached?.crypto ?? []),
      fetchedAt: Date.now(),
      errors: [...stocks.errors, ...crypto.errors],
    }
    cached = snapshot
    return snapshot
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}
