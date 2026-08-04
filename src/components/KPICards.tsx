import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  ShieldCheck,
  AlertCircle,
  PiggyBank
} from 'lucide-react';
import { FinancialKPIs } from '../types';
import { formatBRL, formatPercent } from '../utils/financialAnalytics';

interface KPICardsProps {
  kpis: FinancialKPIs;
  selectedMonth: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, selectedMonth }) => {
  const isPositiveSaldo = kpis.saldoPeriodo >= 0;
  const isPositiveProjection = kpis.projecaoProximoMes.saldoEstimado >= 0;

  return (
    <div className="space-y-4">
      {/* 4 Primary Executive BI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: TOTAL ENTRADAS */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/15 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Receitas / Entradas
            </span>
            <div className="p-2.5 bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatBRL(kpis.totalEntradas)}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            {kpis.comparativoMesAnterior ? (
              <span className={`inline-flex items-center font-semibold ${
                kpis.comparativoMesAnterior.entradasVariacao >= 0 ? 'text-teal-300' : 'text-rose-400'
              }`}>
                {kpis.comparativoMesAnterior.entradasVariacao >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {formatPercent(kpis.comparativoMesAnterior.entradasVariacao)} vs mês anterior
              </span>
            ) : (
              <span className="text-slate-400">Período: {selectedMonth}</span>
            )}
            <span className="text-slate-400">
              Média: {formatBRL(kpis.ticketMedioEntrada)}
            </span>
          </div>
        </div>

        {/* CARD 2: TOTAL SAÍDAS */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/15 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Despesas / Saídas
            </span>
            <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatBRL(kpis.totalSaidas)}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            {kpis.comparativoMesAnterior ? (
              <span className={`inline-flex items-center font-semibold ${
                kpis.comparativoMesAnterior.saidasVariacao <= 0 ? 'text-teal-300' : 'text-rose-400'
              }`}>
                {kpis.comparativoMesAnterior.saidasVariacao > 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {formatPercent(kpis.comparativoMesAnterior.saidasVariacao)} vs mês anterior
              </span>
            ) : (
              <span className="text-slate-400">Período: {selectedMonth}</span>
            )}
            <span className="text-slate-400">
              Média: {formatBRL(kpis.ticketMedioSaida)}
            </span>
          </div>
        </div>

        {/* CARD 3: SALDO DO PERÍODO */}
        <div className={`glass-card glass-card-hover rounded-2xl p-5 border relative overflow-hidden ${
          isPositiveSaldo 
            ? 'border-teal-500/30 bg-teal-950/20' 
            : 'border-rose-500/30 bg-rose-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Resultado / Saldo do Mês
            </span>
            <div className={`p-2.5 rounded-xl border ${
              isPositiveSaldo 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPositiveSaldo ? 'text-teal-300' : 'text-rose-400'
            }`}>
              {formatBRL(kpis.saldoPeriodo)}
            </h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              isPositiveSaldo 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {isPositiveSaldo ? 'SUPERÁVIT' : 'DÉFICIT'}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <Percent className="w-3.5 h-3.5 mr-1 text-teal-400" />
              Retenção: <strong className="ml-1 text-slate-200">{kpis.margemEconomia.toFixed(1)}%</strong>
            </span>
            <span className="text-slate-400">
              {kpis.totalEntradas > 0 ? 'Taxa Saudável' : 'Sem Entradas'}
            </span>
          </div>
        </div>

        {/* CARD 4: PROJEÇÃO PRÓXIMO MÊS */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-slate-900/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                Projeção Próx. Mês
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {kpis.projecaoProximoMes.confianca}
            </span>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPositiveProjection ? 'text-teal-300' : 'text-rose-400'
            }`}>
              {formatBRL(kpis.projecaoProximoMes.saldoEstimado)}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span title="Entradas Estimadas">
              Entr: <strong className="text-teal-300 font-semibold">{formatBRL(kpis.projecaoProximoMes.entradasEstimadas)}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span title="Saídas Estimadas">
              Saíd: <strong className="text-rose-300 font-semibold">{formatBRL(kpis.projecaoProximoMes.saidasEstimadas)}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Secondary Quick Metric Highlights Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 font-medium">Saldo Geral Acumulado no Caixa:</span>{' '}
            <strong className="text-teal-300 text-sm font-bold ml-1">{formatBRL(kpis.saldoAcumuladoTotal)}</strong>
          </div>
        </div>

        {kpis.maiorEntrada && (
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 font-medium">Maior Entrada:</span>{' '}
              <strong className="text-teal-300 font-semibold">{kpis.maiorEntrada.movimento}</strong>{' '}
              <span className="text-slate-400">({formatBRL(kpis.maiorEntrada.valor)})</span>
            </div>
          </div>
        )}

        {kpis.maiorSaida && (
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 font-medium">Maior Saída:</span>{' '}
              <strong className="text-rose-400 font-semibold">{kpis.maiorSaida.movimento}</strong>{' '}
              <span className="text-slate-400">({formatBRL(kpis.maiorSaida.valor)})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
