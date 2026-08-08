import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * DivergenceChart Component
 * Visualizes Factual, Interpretive, and Emotional divergence scores.
 *
 * @param {Object} props
 * @param {number} props.factual - factual divergence (0 to 1)
 * @param {number} props.interpretive - interpretive divergence (0 to 1)
 * @param {number} props.emotional - emotional divergence (0 to 1)
 */
export function DivergenceChart({ factual = 0, interpretive = 0, emotional = 0 }) {
  const data = [
    { category: 'Factual', score: Number(factual.toFixed(3)), fill: '#8b7be8' },
    { category: 'Interpretive', score: Number(interpretive.toFixed(3)), fill: '#d4a574' },
    { category: 'Emotional', score: Number(emotional.toFixed(3)), fill: '#e06c75' },
  ];

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <h3 style={{
        fontSize: 'var(--text-sm)', fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: '1.25rem',
      }}>
        Memory Divergence Breakdown
      </h3>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <XAxis
              dataKey="category"
              stroke="var(--color-text-disabled)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="var(--color-text-disabled)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
              }}
              formatter={(val) => [`${val}`, 'Divergence']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{
        fontSize: 'var(--text-xs)', textAlign: 'center',
        color: 'var(--color-text-disabled)', marginTop: '0.5rem',
      }}>
        0.00 = identical to consensus · 1.00 = maximal divergence
      </p>
    </div>
  );
}

export default DivergenceChart;
