import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface TradingChartProps {
  symbol?: string;
  data?: CandlestickData[];
  height?: number;
}

export default function TradingChart({ 
  symbol = 'BTC/USDT', 
  data = [], 
  height = 400
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Get container width
    const containerWidth = chartContainerRef.current.clientWidth;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
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
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2d2d2d',
      },
      timeScale: {
        borderColor: '#2d2d2d',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    // Set data
    if (data.length > 0) {
      candlestickSeries.setData(data);
    }

    // Store references
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height]);

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{symbol}</h3>
        {isLoading && <div className="text-gray-400">Loading chart...</div>}
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
} 