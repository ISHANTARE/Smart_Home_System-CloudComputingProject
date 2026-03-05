import React, { useMemo, useState } from 'react';
import { BarChart3, LayoutGrid, ChevronDown } from 'lucide-react';

const timeFilters = ['Today', 'This Week', 'This Month'];

function UsageStatus({ data, totalSpend, totalHours }) {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const maxVal = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const peakIdx = useMemo(() => data.findIndex(d => d.value === maxVal), [data, maxVal]);

  // compute displayed data based on filter (simulated multipliers for demo)
  const displayData = useMemo(() => {
    if (activeFilter === 'Today') return data;
    const multiplier = activeFilter === 'This Week' ? 5.2 : 22;
    return data.map((d) => ({ ...d, value: Math.round(d.value * (0.8 + Math.random() * 0.4) * multiplier / 10) }));
  }, [data, activeFilter]);

  const displayMax = useMemo(() => Math.max(...displayData.map(d => d.value)), [displayData]);
  const displayPeak = useMemo(() => displayData.findIndex(d => d.value === displayMax), [displayData, displayMax]);

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-line/60 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[17px] font-semibold text-text-white mb-3">Usage Status</h3>
          <div className="flex items-center gap-10">
            <div>
              <p className="text-text-muted text-[12px] mb-0.5">Total spend</p>
              <p className="text-[22px] font-bold text-text-white">{totalSpend}</p>
            </div>
            <div>
              <p className="text-text-muted text-[12px] mb-0.5">Total hours</p>
              <p className="text-[22px] font-bold text-text-white">{totalHours}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-bg-card-inner text-text-muted hover:text-text-gray border border-border-line/40 transition-all">
            <LayoutGrid size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-blue text-white shadow-lg shadow-accent-blue/25 transition-all">
            <BarChart3 size={16} />
          </button>

          {/* Time filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu((v) => !v)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-semibold bg-bg-card-inner border border-border-line/40 text-text-gray hover:text-text-white transition-all"
              id="usage-filter-btn"
            >
              {activeFilter}
              <ChevronDown size={12} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-10 w-36 bg-bg-card border border-border-line rounded-xl shadow-2xl z-30 overflow-hidden anim-scale">
                {timeFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setActiveFilter(f); setShowFilterMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-[12px] transition-colors
                      ${activeFilter === f
                        ? 'text-accent-blue bg-accent-blue/10 font-semibold'
                        : 'text-text-gray hover:bg-bg-card-inner/40 hover:text-text-white'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 flex-1 flex flex-col justify-end min-h-0">
        <div className="flex items-end gap-[6px] md:gap-2.5 h-40 lg:h-44 relative">
          {displayData.map((item, i) => {
            const pct = (item.value / (displayMax + 8)) * 100;
            const isPeak = i === displayPeak;
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Peak label */}
                {isPeak && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10
                                  bg-accent-cyan text-bg-main text-[10px] font-bold
                                  px-2 py-0.5 rounded-full whitespace-nowrap shadow-glow-cyan">
                    {item.value}kw
                  </div>
                )}
                {!isPeak && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2
                                  bg-bg-card-inner text-text-gray text-[10px] font-semibold
                                  px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100
                                  transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.value}kw
                  </div>
                )}

                <div
                  className="w-full rounded-lg transition-all duration-500 group-hover:brightness-110"
                  style={{
                    height: `${Math.max(pct, 5)}%`,
                    background: isPeak
                      ? 'linear-gradient(180deg, #22D3EE 0%, #4F6EF7 100%)'
                      : 'linear-gradient(180deg, #262A3D 0%, #1E2235 100%)',
                    boxShadow: isPeak ? '0 0 16px rgba(34,211,238,0.2)' : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-[6px] md:gap-2.5 mt-2.5">
          {displayData.map((item, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[10px] text-text-dark">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsageStatus;