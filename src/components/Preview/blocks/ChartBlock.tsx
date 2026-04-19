import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { ChartDataRow } from '../../../types/story';
import styles from './ChartBlock.module.css';

type Props = {
  chartType: 'bar' | 'line' | 'area';
  data: ChartDataRow[];
  dataKey: string;
  xKey: string;
  label?: string;
};

const AMBER = '#e8a838';
const GRID = 'rgba(255,255,255,0.08)';
const TICK = { fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' };

export default function ChartBlock({ chartType, data, dataKey, xKey, label }: Props) {
  const commonProps = {
    data,
    margin: { top: 8, right: 16, left: -8, bottom: 0 },
  };

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
      <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} />
      <YAxis tick={TICK} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
        labelStyle={{ color: '#e8a838' }}
        itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
      />
    </>
  );

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}
      <ResponsiveContainer width="100%" height={260}>
        {chartType === 'bar' ? (
          <BarChart {...commonProps}>
            {axes}
            <Bar dataKey={dataKey} fill={AMBER} radius={[3, 3, 0, 0]} />
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart {...commonProps}>
            {axes}
            <Line type="monotone" dataKey={dataKey} stroke={AMBER} strokeWidth={2} dot={{ fill: AMBER, r: 3 }} />
          </LineChart>
        ) : (
          <AreaChart {...commonProps}>
            {axes}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={AMBER} stopOpacity={0.35} />
                <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey={dataKey} stroke={AMBER} strokeWidth={2} fill="url(#areaGrad)" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
