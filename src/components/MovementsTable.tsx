import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { FinancialMovement, MovementType } from '../types';
import { formatBRL } from '../utils/financialAnalytics';

interface MovementsTableProps {
  movements: FinancialMovement[];
  selectedMonth: string;
  onEditMovement: (m: FinancialMovement) => void;
  onDeleteMovement: (id: string | number) => void;
  onAddNew: () => void;
}

type SortField = 'id' | 'data' | 'movimento' | 'tipo' | 'valor' | 'responsavel' | 'transferencia';
type SortOrder = 'asc' | 'desc';

export const MovementsTable: React.FC<MovementsTableProps> = ({
  movements,
  selectedMonth,
  onEditMovement,
  onDeleteMovement,
  onAddNew
}) => {
  const [filterType, setFilterType] = useState<'TODOS' | 'ENTRADA' | 'SAIDA'>('TODOS');
  const [filterResp, setFilterResp] = useState<string>('TODOS');
  const [filterTrans, setFilterTrans] = useState<string>('TODOS');
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Distinct lists for dropdowns
  const distinctResponsibles = useMemo(() => {
    const set = new Set<string>();
    movements.forEach(m => m.responsavel && set.add(m.responsavel));
    return Array.from(set).sort();
  }, [movements]);

  const distinctTransfers = useMemo(() => {
    const set = new Set<string>();
    movements.forEach(m => m.transferencia && set.add(m.transferencia));
    return Array.from(set).sort();
  }, [movements]);

  // Filtering
  const filtered = useMemo(() => {
    return movements.filter(m => {
      if (filterType !== 'TODOS' && m.tipo !== filterType) return false;
      if (filterResp !== 'TODOS' && m.responsavel !== filterResp) return false;
      if (filterTrans !== 'TODOS' && m.transferencia !== filterTrans) return false;
      return true;
    });
  }, [movements, filterType, filterResp, filterTrans]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'valor') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // Summary Totals
  const totalEntradas = filtered.filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.valor, 0);
  const totalSaidas = filtered.filter(m => m.tipo === 'SAIDA').reduce((acc, m) => acc + m.valor, 0);
  const saldoFinal = totalEntradas - totalSaidas;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/15 shadow-xl overflow-hidden">
      
      {/* Controls and Filters Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Title & Badge */}
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                Planilha de Lançamentos & Movimentações
              </h3>
              <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                {sorted.length} registros
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Estrutura idêntica à aba <strong className="text-teal-300 font-semibold">"MOVIMENTOS"</strong> do Excel ({selectedMonth})
            </p>
          </div>

          {/* Quick Action */}
          <button
            onClick={onAddNew}
            id="btn-add-table-row"
            className="inline-flex items-center justify-center px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Novo Lançamento
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
          
          {/* Tipo Filter Buttons */}
          <div className="flex items-center space-x-1 bg-slate-950/50 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setFilterType('TODOS')}
              className={`flex-1 py-1.5 text-center rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'TODOS' ? 'bg-white/20 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('ENTRADA')}
              className={`flex-1 py-1.5 text-center rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'ENTRADA' ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold shadow-xs' : 'text-teal-400/70 hover:text-teal-300'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilterType('SAIDA')}
              className={`flex-1 py-1.5 text-center rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'SAIDA' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold shadow-xs' : 'text-rose-400/70 hover:text-rose-300'
              }`}
            >
              Saídas
            </button>
          </div>

          {/* Responsável Filter */}
          <div className="relative">
            <select
              value={filterResp}
              onChange={(e) => setFilterResp(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
            >
              <option value="TODOS" className="bg-slate-900 text-white">Todos os Responsáveis</option>
              {distinctResponsibles.map(r => (
                <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
              ))}
            </select>
          </div>

          {/* Transferência Filter */}
          <div className="relative">
            <select
              value={filterTrans}
              onChange={(e) => setFilterTrans(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
            >
              <option value="TODOS" className="bg-slate-900 text-white">Todas as Formas de Pgto</option>
              {distinctTransfers.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(filterType !== 'TODOS' || filterResp !== 'TODOS' || filterTrans !== 'TODOS') && (
            <div className="flex items-center">
              <button
                onClick={() => {
                  setFilterType('TODOS');
                  setFilterResp('TODOS');
                  setFilterTrans('TODOS');
                }}
                className="text-xs text-teal-300 hover:text-teal-200 font-semibold underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/[0.06] text-slate-300 font-bold border-b border-white/10 select-none">
            <tr>
              <th 
                className="py-3.5 px-3 w-14 text-center cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('data')}
              >
                <div className="flex items-center space-x-1">
                  <span>DATA</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('movimento')}
              >
                <div className="flex items-center space-x-1">
                  <span>MOVIMENTO / HISTÓRICO</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 text-center cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('tipo')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>TIPO</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 text-center"
              >
                <span>MÊS</span>
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('valor')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>VALOR</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('transferencia')}
              >
                <div className="flex items-center space-x-1">
                  <span>TRANSFERÊNCIA</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-3 cursor-pointer hover:bg-white/[0.08] transition-colors"
                onClick={() => handleSort('responsavel')}
              >
                <div className="flex items-center space-x-1">
                  <span>RESPONSÁVEL</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-center w-20">AÇÕES</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  Nenhum lançamento encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              sorted.map((m, idx) => {
                const isEntrada = m.tipo === 'ENTRADA';
                return (
                  <tr 
                    key={`${m.id}-${idx}`}
                    className="hover:bg-white/[0.05] transition-colors group"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400 font-medium">
                      {m.id}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {m.data}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      <div>{m.movimento}</div>
                      {m.observacao && (
                        <div className="text-[11px] text-slate-400 font-normal">
                          {m.observacao}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isEntrada
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {isEntrada ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300 whitespace-nowrap">
                      {m.mes}
                    </td>
                    <td className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                      isEntrada ? 'text-teal-300' : 'text-rose-300'
                    }`}>
                      {isEntrada ? '+' : '-'}{formatBRL(m.valor)}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      <span className="bg-white/[0.06] border border-white/10 text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-medium">
                        {m.transferencia}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200 whitespace-nowrap font-medium">
                      {m.responsavel}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onEditMovement(m)}
                          className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-teal-500/20 rounded-lg transition-colors cursor-pointer"
                          title="Editar lançamento"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMovement(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer with Summary */}
          <tfoot className="bg-white/[0.04] font-bold text-white border-t border-white/15">
            <tr>
              <td colSpan={3} className="py-3.5 px-3 text-slate-300">
                TOTAL CONSOLIDADO DO FILTRO ({sorted.length} itens)
              </td>
              <td className="py-3.5 px-3 text-center">
                <span className="text-[11px] text-teal-300 font-medium">
                  {filtered.filter(m => m.tipo === 'ENTRADA').length}E / {filtered.filter(m => m.tipo === 'SAIDA').length}S
                </span>
              </td>
              <td className="py-3.5 px-3 text-center text-slate-400">-</td>
              <td className="py-3.5 px-3 text-right">
                <div className="text-xs text-teal-300">+{formatBRL(totalEntradas)}</div>
                <div className="text-xs text-rose-300">-{formatBRL(totalSaidas)}</div>
                <div className={`text-sm font-extrabold pt-1 border-t border-white/10 ${
                  saldoFinal >= 0 ? 'text-teal-300' : 'text-rose-300'
                }`}>
                  Saldo: {formatBRL(saldoFinal)}
                </div>
              </td>
              <td colSpan={3} className="py-3.5 px-3 text-slate-400 text-right text-xs font-normal">
                Grupo de Mulheres da 3ª IPI do Natal
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
