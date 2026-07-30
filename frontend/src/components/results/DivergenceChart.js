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
 * Visualizes Factual, Interpretive, and Emotional divergence scores using Recharts.
 *
 * @param {Object} props
 * @param {number} props.factual - factual divergence (0 to 1)
 * @param {number} props.interpretive - interpretive divergence (0 to 1)
 * @param {number} props.emotional - emotional divergence (0 to 1)
 */
export function DivergenceChart({ factual = 0, interpretive = 0, emotional = 0 }) {
  const data = [
    { category: 'Factual', score: Number(factual.toFixed(3)), fill: '#818cf8' },
    { category: 'Interpretive', score: Number(interpretive.toFixed(3)), fill: '#06b6d4' },
    { category: 'Emotional', score: Number(emotional.toFixed(3)), fill: '#f43f5e' },
  ];

  return (
    <div className="card mb-6" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '1rem' }}>
        Memory Reconstruction Divergence Breakdown
      </h3>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a24',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
              formatter={(val) => [`${val}`, 'Divergence Score']}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-center mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
        0.00 = identical to consensus | 1.00 = maximal divergence
      </p>
    </div>
  );
}

export default DivergenceChart;
