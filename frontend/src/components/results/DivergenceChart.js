import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

/**
 * DivergenceChart Component
 * Visualizes Factual, Interpretive, and Emotional divergence scores
 * against cohort consensus benchmarks.
 *
 * @param {Object} props
 * @param {number} props.factual - factual divergence (0 to 1)
 * @param {number} props.interpretive - interpretive divergence (0 to 1)
 * @param {number} props.emotional - emotional divergence (0 to 1)
 * @param {Object} [props.cohortAverages] - cohort baseline averages
 * @param {number} [props.overallImmediate] - Session 1 overall divergence
 * @param {number} [props.overallDelayed] - Session 2 overall divergence
 */
export function DivergenceChart({
  factual = 0,
  interpretive = 0,
  emotional = 0,
  cohortAverages = null,
  overallImmediate = null,
  overallDelayed = null,
}) {
  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'drift'

  // Default cohort benchmarks if not yet supplied from backend
  const cohortFact = cohortAverages?.factual_divergence ?? 0.30;
  const cohortInt = cohortAverages?.interpretive_divergence ?? 0.54;
  const cohortEm = cohortAverages?.emotional_divergence ?? 0.58;

  const categoryData = [
    {
      category: 'Factual Recall',
      userScore: Number(Number(factual).toFixed(3)),
      cohortAvg: Number(Number(cohortFact).toFixed(3)),
      description: 'Deviation from objective ground truth details in the stimulus.',
      color: '#60a5fa', // Blue
      level: factual < 0.25 ? 'High Accuracy' : factual < 0.60 ? 'Moderate Drift' : 'High Divergence',
      levelColor: factual < 0.25 ? 'var(--color-success)' : factual < 0.60 ? 'var(--color-warning)' : 'var(--color-error)',
    },
    {
      category: 'Interpretive',
      userScore: Number(Number(interpretive).toFixed(3)),
      cohortAvg: Number(Number(cohortInt).toFixed(3)),
      description: 'Semantic divergence in perceived motivations & interpersonal conflict.',
      color: '#fbbf24', // Gold
      level: interpretive < 0.40 ? 'Consensus Aligned' : interpretive < 0.70 ? 'Nuanced Perspective' : 'Distinct Framing',
      levelColor: interpretive < 0.40 ? 'var(--color-success)' : interpretive < 0.70 ? 'var(--color-accent)' : '#c084fc',
    },
    {
      category: 'Emotional Tone',
      userScore: Number(Number(emotional).toFixed(3)),
      cohortAvg: Number(Number(cohortEm).toFixed(3)),
      description: 'Affective divergence in perceived tension, sentiment, and empathy.',
      color: '#f43f5e', // Rose/Pink
      level: emotional < 0.40 ? 'Normative Empathy' : emotional < 0.70 ? 'Balanced Perception' : 'Unique Affective Lens',
      levelColor: emotional < 0.40 ? 'var(--color-success)' : emotional < 0.70 ? 'var(--color-accent)' : '#f43f5e',
    },
  ];

  const hasDriftData = overallImmediate != null && overallDelayed != null;
  const driftData = hasDriftData ? [
    {
      stage: 'Immediate Recall (Session 1)',
      divergence: Number(Number(overallImmediate).toFixed(3)),
      fill: 'var(--color-accent)',
    },
    {
      stage: 'Delayed Recall (48-Hr)',
      divergence: Number(Number(overallDelayed).toFixed(3)),
      fill: 'var(--color-primary)',
    },
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const userVal = payload.find(p => p.dataKey === 'userScore')?.value;
      const cohortVal = payload.find(p => p.dataKey === 'cohortAvg')?.value;
      const diff = (userVal != null && cohortVal != null) ? (userVal - cohortVal).toFixed(3) : null;

      return (
        <div style={{
          backgroundColor: '#18181b',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          minWidth: '200px',
        }}>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            {label}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Your Score:</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {userVal ?? '—'}
            </span>
          </div>
          {cohortVal != null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)' }}>Cohort Mean:</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {cohortVal}
              </span>
            </div>
          )}
          {diff != null && (
            <div style={{
              borderTop: '1px solid #27272a',
              paddingTop: '0.35rem',
              marginTop: '0.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
            }}>
              <span style={{ color: 'var(--color-text-tertiary)' }}>Consensus Gap:</span>
              <span style={{
                color: Number(diff) > 0 ? '#f87171' : '#34d399',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)'
              }}>
                {Number(diff) > 0 ? `+${diff}` : diff}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header with View Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <h3 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Memory Divergence Profile
          </h3>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            margin: '0.2rem 0 0 0',
          }}>
            Semantic distance relative to collective participant consensus
          </p>
        </div>

        {hasDriftData && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-elevated)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <button
              onClick={() => setViewMode('categories')}
              style={{
                background: viewMode === 'categories' ? 'var(--color-accent)' : 'transparent',
                color: viewMode === 'categories' ? '#000' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.65rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Category Breakdown
            </button>
            <button
              onClick={() => setViewMode('drift')}
              style={{
                background: viewMode === 'drift' ? 'var(--color-accent)' : 'transparent',
                color: viewMode === 'drift' ? '#000' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.65rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              48-Hr Consolidation Drift
            </button>
          </div>
        )}
      </div>

      {/* Main Chart Rendering */}
      {viewMode === 'categories' ? (
        <div style={{ width: '100%', height: 250, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="category"
                stroke="var(--color-text-tertiary)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1.0]}
                stroke="var(--color-text-disabled)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                formatter={(value) => (
                  <span style={{ color: 'var(--color-text-secondary)', marginLeft: '4px' }}>
                    {value === 'userScore' ? 'Your Divergence' : 'Cohort Consensus Average'}
                  </span>
                )}
              />
              <Bar
                name="userScore"
                dataKey="userScore"
                fill="var(--color-accent)"
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
                isAnimationActive={true}
                animationDuration={800}
              />
              <Bar
                name="cohortAvg"
                dataKey="cohortAvg"
                fill="#3f3f46"
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={driftData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="stage"
                stroke="var(--color-text-tertiary)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1.0]}
                stroke="var(--color-text-disabled)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val}`, 'Overall Divergence']}
              />
              <Bar
                dataKey="divergence"
                fill="var(--color-accent)"
                radius={[5, 5, 0, 0]}
                maxBarSize={55}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Dynamic Category Badges & Explanations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border-subtle)',
      }}>
        {categoryData.map((item) => (
          <div
            key={item.category}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {item.category}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: item.levelColor,
                }}>
                  {item.level}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: 1.4, margin: 0 }}>
                {item.description}
              </p>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>
                {item.userScore.toFixed(3)}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-disabled)' }}>
                (vs {item.cohortAvg.toFixed(2)} avg)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Axis & Interpretation Legend */}
      <p style={{
        fontSize: '11px',
        textAlign: 'center',
        color: 'var(--color-text-disabled)',
        marginTop: '1rem',
        marginBottom: 0,
      }}>
        <strong style={{ color: 'var(--color-text-tertiary)' }}>Metric Scale:</strong> 0.00 = Identical to group consensus · 1.00 = Maximal subjective divergence
      </p>
    </div>
  );
}

export default DivergenceChart;
