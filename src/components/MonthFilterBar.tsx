import React from 'react';
import { Calendar, Layers, Search, BarChart3, Table as TableIcon, Sparkles } from 'lucide-react';
import { MonthSummary } from '../types';

interface MonthFilterBarProps {
  distinctMonths: string[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  monthlySummaries: MonthSummary[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: 'DASHBOARD' | 'TABLE' | 'INSIGHTS';
  onViewChange: (view: 'DASHBOARD' | 'TABLE' | 'INSIGHTS') => void;
}

export const MonthFilterBar: React.FC<MonthFilterBarProps> = ({
  distinctMonths,
  selectedMonth,
  onSelectMonth,
  monthlySummaries,
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange
}) => {
  // Find current calendar month or default
  const nowMonth = 'Agosto';

  return (
    <div className="glass-card sticky top-[73px] z-20 border-b border-white/10 shadow-lg backdrop-blur-xl bg-slate-900/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Month Slicers / Filters */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center shrink-0">
              <Calendar className="w-3.5 h-3.5 mr-1 text-teal-400" />
              Filtrar:
            </span>

            {/* Current Month Quick Preset */}
            <button
              onClick={() => onSelectMonth(nowMonth)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMonth.toLowerCase() === nowMonth.toLowerCase()
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30'
              }`}
            >
              Mês Vigente ({nowMonth})
            </button>

            {/* All Months / Consolidated */}
            <button
              onClick={() => onSelectMonth('TODOS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMonth === 'TODOS'
                  ? 'bg-white/20 text-white border border-teal-400/50 shadow-md'
                  : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/10'
              }`}
            >
              <Layers className="w-3 h-3 inline-block mr-1 text-teal-300" />
              Todos os Meses (Consolidado)
            </button>

            {/* Individual Months */}
            <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
              {distinctMonths.map(mes => {
                const isSelected = selectedMonth.toLowerCase() === mes.toLowerCase();
                const summary = monthlySummaries.find(s => s.mes.toLowerCase() === mes.toLowerCase());
                const isPositive = summary ? summary.saldo >= 0 : true;

                return (
                  <button
                    key={mes}
                    onClick={() => onSelectMonth(mes)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40 font-bold shadow-xs'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.09] border border-white/10'
                    }`}
                  >
                    <span>{mes}</span>
                    {summary && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPositive ? 'bg-teal-400' : 'bg-rose-400'
                        }`}
                        title={`Saldo do mês: ${summary.saldo >= 0 ? '+' : ''}R$ ${summary.saldo.toFixed(2)}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and View Mode Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar lançamento..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 glass-input rounded-xl text-xs placeholder-slate-400 transition-all"
              />
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-white/[0.05] p-1 rounded-xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => onViewChange('DASHBOARD')}
                className={`flex items-center px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'DASHBOARD'
                    ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Visualizar Painel BI com Gráficos"
              >
                <BarChart3 className={`w-3.5 h-3.5 mr-1 ${activeView === 'DASHBOARD' ? 'text-slate-950' : 'text-teal-400'}`} />
                Painel BI
              </button>

              <button
                onClick={() => onViewChange('TABLE')}
                className={`flex items-center px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'TABLE'
                    ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Visualizar Tabela Detalhada de Lançamentos"
              >
                <TableIcon className={`w-3.5 h-3.5 mr-1 ${activeView === 'TABLE' ? 'text-slate-950' : 'text-teal-400'}`} />
                Lançamentos
              </button>

              <button
                onClick={() => onViewChange('INSIGHTS')}
                className={`flex items-center px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'INSIGHTS'
                    ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Diagnóstico e Parecer Orçamentário"
              >
                <Sparkles className={`w-3.5 h-3.5 mr-1 ${activeView === 'INSIGHTS' ? 'text-slate-950' : 'text-teal-400'}`} />
                Diagnóstico IA
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
