declare module "@/components/MiniChart" {
  import * as React from "react";
  export interface MiniChartProps {
    symbol: string;
    side: 'Long' | 'Short';
    entry: number;
    current: number;
  }
  const MiniChart: React.FC<MiniChartProps>;
  export default MiniChart;
} 