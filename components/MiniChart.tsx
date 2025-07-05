import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { generateSampleData } from '@/lib/chartData';

interface MiniChartProps {
  symbol: string;
  side: 'Long' | 'Short';
  entry: number;
  current: number;
  height?: number;
}

export default function MiniChart({ symbol, side, entry, current, height = 176 }: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const container = chartContainerRef.current;
    const containerWidth = container.clientWidth;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d2d2d' },
        horzLines: { color: '#2d2d2d' },
      },
      width: containerWidth,
      height: height,
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#2d2d2d' },
      timeScale: { borderColor: '#2d2d2d', timeVisible: true, secondsVisible: false },
    });
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });
    const candles: CandlestickData[] = generateSampleData(symbol, 14);
    candlestickSeries.setData(candles);
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    // Resize handler
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) chartRef.current.remove();
    };
  }, [symbol, side, height]);

  return <div ref={chartContainerRef} className="w-full h-full bg-white/10 dark:bg-black/20 rounded-2xl" style={{ minHeight: height, height }} />;
} 