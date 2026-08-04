import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  FinancialMovement, 
  MonthSummary, 
  CategorySummary, 
  ResponsibleSummary, 
  PaymentMethodSummary,
  FinancialKPIs
} from '../types';
import { formatBRL, formatPercent } from '../utils/financialAnalytics';

interface VisualAnalyticsProps {
  monthlySummaries: MonthSummary[];
  topEntradas: CategorySummary[];
  topSaidas: CategorySummary[];
  responsibles: ResponsibleSummary[];
  paymentMethods: PaymentMethodSummary[];
  kpis: FinancialKPIs;
  selectedMonth: string;
}

const COLORS_ENTRADAS = ['#2dd4bf', '#5eead4', '#14b8a6', '#0d9488', '#0f766e', '#115e59'];
const COLORS_SAIDAS = ['#fb7185', '#fda4af', '#f43f5e', '#e11d48', '#be123c', '#9f1239'];
const COLORS_PIE = ['#2dd4bf', '#818cf8', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa'];

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  monthlySummaries,
  topEntradas,
  topSaidas,
  responsibles,
  paymentMethods,
  kpis,
  selectedMonth
}) => {

  // Prepare projection forecast chart data
  const forecastData = [...monthlySummaries.map(m => ({
    mes: m.mes,
    entradas: m.totalEntradas,
    saidas: m.totalSaidas,
    saldo: m.saldo,
    saldoAcumulado: m.saldoAcumulado,
    tipo: 'Histórico'
  }))];

  // Add next month forecast
  const lastAccum = monthlySummaries.length > 0 
    ? monthlySummaries[monthlySummaries.length - 1].saldoAcumulado 
    : 0;

  forecastData.push({
    mes: 'Setembro (Proj.)',
    entradas: Math.round(kpis.projecaoProximoMes.entradasEstimadas),
    saidas: Math.round(kpis.projecaoProximoMes.saidasEstimadas),
    saldo: Math.round(kpis.projecaoProximoMes.saldoEstimado),
    saldoAcumulado: Math.round(lastAccum + kpis.projecaoProximoMes.saldoEstimado),
    tipo: 'Projeção'
  });

  forecastData.push({
    mes: 'Outubro (Proj.)',
    entradas: Math.round(kpis.projecaoProximoMes.entradasEstimadas * 1.05),
    saidas: Math.round(kpis.projecaoProximoMes.saidasEstimadas * 0.98),
    saldo: Math.round((kpis.projecaoProximoMes.entradasEstimadas * 1.05) - (kpis.projecaoProximoMes.saidasEstimadas * 0.98)),
    saldoAcumulado: Math.round(lastAccum + (kpis.projecaoProximoMes.saldoEstimado * 2.05)),
    tipo: 'Projeção'
  });

  return (
    <div className="space-y-6">
      
      {/* 1. MÊS A MÊS: COMPARATIVO DE RECEITAS E DESPESAS POR MÊS */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Comparativo Mensal: Receitas vs Despesas
              </h3>
              <p className="text-xs text-slate-400">
                Valores consolidados de receitas (entradas) e despesas (saídas) por mês
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center text-teal-300 font-medium">
              <span className="w-3 h-3 bg-teal-400 rounded-sm mr-1.5 inline-block shadow-sm" />
              Receitas (Entradas)
            </span>
            <span className="flex items-center text-rose-300 font-medium">
              <span className="w-3 h-3 bg-rose-400 rounded-sm mr-1.5 inline-block shadow-sm" />
              Despesas (Saídas)
            </span>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySummaries}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis 
                dataKey="mes" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `R$${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  const labelMap: Record<string, string> = {
                    totalEntradas: 'Receitas',
                    totalSaidas: 'Despesas'
                  };
                  return [formatBRL(Number(value)), labelMap[name] || name];
                }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(12px)'
                }}
              />
              <Bar dataKey="totalEntradas" name="totalEntradas" fill="#2dd4bf" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="totalSaidas" name="totalSaidas" fill="#fb7185" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. DUPLA DE DONUTS: ORIGEM DAS ENTRADAS E DESTINO DAS SAÍDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DONUT 1: ENTRADAS POR MOVIMENTO */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  Receitas por Categoria / Evento
                </h4>
              </div>
              <span className="text-xs text-teal-300 font-semibold">
                Total: {formatBRL(kpis.totalEntradas)}
              </span>
            </div>

            <div className="h-60 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topEntradas.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="categoria"
                  >
                    {topEntradas.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-ent-${index}`} fill={COLORS_ENTRADAS[index % COLORS_ENTRADAS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [formatBRL(Number(val)), 'Valor']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.18)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranked List */}
          <div className="space-y-2 mt-2 pt-3 border-t border-white/10 text-xs">
            {topEntradas.slice(0, 4).map((item, idx) => (
              <div key={item.categoria} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS_ENTRADAS[idx % COLORS_ENTRADAS.length] }} 
                  />
                  <span className="text-slate-300 font-medium truncate" title={item.categoria}>
                    {item.categoria}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-white font-bold">{formatBRL(item.total)}</span>{' '}
                  <span className="text-teal-300">({item.percentual.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONUT 2: SAÍDAS POR CATEGORIA */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  Despesas por Centro de Custo
                </h4>
              </div>
              <span className="text-xs text-rose-300 font-semibold">
                Total: {formatBRL(kpis.totalSaidas)}
              </span>
            </div>

            <div className="h-60 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topSaidas.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="categoria"
                  >
                    {topSaidas.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-sai-${index}`} fill={COLORS_SAIDAS[index % COLORS_SAIDAS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [formatBRL(Number(val)), 'Valor']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.18)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranked List */}
          <div className="space-y-2 mt-2 pt-3 border-t border-white/10 text-xs">
            {topSaidas.slice(0, 4).map((item, idx) => (
              <div key={item.categoria} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS_SAIDAS[idx % COLORS_SAIDAS.length] }} 
                  />
                  <span className="text-slate-300 font-medium truncate" title={item.categoria}>
                    {item.categoria}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-white font-bold">{formatBRL(item.total)}</span>{' '}
                  <span className="text-rose-300">({item.percentual.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. PROJEÇÃO DE FLUXO DE CAIXA E PRESTAÇÃO POR RESPONSÁVEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO DE PROJEÇÃO DE SALDO FUTURO */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
                <Sparkles className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Projeção de Saldo e Tendência Orçamentária
                </h4>
                <p className="text-xs text-slate-400">
                  Histórico real e estimativa estatística para os próximos períodos
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold px-2.5 py-0.5 rounded-full">
              Previsão Inteligente
            </span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={forecastData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(val: any) => [formatBRL(Number(val)), 'Saldo Acumulado']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.18)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="saldoAcumulado" 
                  stroke="#2dd4bf" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorSaldo)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3.5 bg-teal-950/40 rounded-xl border border-teal-500/30 text-xs text-teal-200 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Diagnóstico da Projeção:</strong> {kpis.projecaoProximoMes.motivo} Saldo estimado para o próximo mês:{' '}
              <strong className="text-teal-300 font-bold">{formatBRL(kpis.projecaoProximoMes.saldoEstimado)}</strong>.
            </div>
          </div>
        </div>

        {/* PRESTAÇÃO DE CONTAS POR RESPONSÁVEL */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Prestação de Contas por Responsável
                  </h4>
                  <p className="text-xs text-slate-400">
                    Volume de entradas e saídas gerenciado pela liderança
                  </p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={responsibles.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `R$${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                  />
                  <YAxis 
                    dataKey="responsavel" 
                    type="category" 
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip 
                    formatter={(val: any, name: any) => [
                      formatBRL(Number(val)), 
                      name === 'totalEntradas' ? 'Entradas' : 'Saídas'
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.18)', fontSize: '12px' }}
                  />
                  <Bar dataKey="totalEntradas" name="totalEntradas" fill="#2dd4bf" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  <Bar dataKey="totalSaidas" name="totalSaidas" fill="#fb7185" radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 bg-teal-400 rounded-sm mr-1.5 inline-block" />
              Entradas Arrecadadas
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm mr-1.5 inline-block" />
              Despesas Executadas
            </span>
          </div>
        </div>

      </div>

      {/* 4. FORMAS DE TRANSFERÊNCIA / PAGAMENTO */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/[0.08] text-slate-200 border border-white/15 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Movimentação por Meio de Transferência & Pagamento
              </h4>
              <p className="text-xs text-slate-400">
                Canais de transação (PIX, Espécie, Bancário, Cartão)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {paymentMethods.map((pm) => (
            <div key={pm.metodo} className="p-4 bg-white/[0.04] rounded-xl border border-white/10 hover:border-teal-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 truncate" title={pm.metodo}>
                  {pm.metodo}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {pm.percentual.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2.5">
                <h5 className="text-base font-extrabold text-white">
                  {formatBRL(pm.total)}
                </h5>
                <span className="text-[11px] text-slate-400">
                  {pm.quantidade} transações
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-teal-400 h-full rounded-full" 
                  style={{ width: `${Math.min(100, pm.percentual)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
