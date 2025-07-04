import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface TradingChartProps {
  symbol?: string;
  data?: CandlestickData[];
  height?: number;
  width?: number;
}

interface ChartControlsProps {
  onTimeframeChange: (timeframe: string) => void;
  currentTimeframe: string;
}

export default function ChartControls({ onTimeframeChange, currentTimeframe }: ChartControlsProps) {
  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  return (
    <div className="flex gap-2 mb-4">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => onTimeframeChange(tf)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            currentTimeframe === tf
              ? 'bg-violet-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
} 