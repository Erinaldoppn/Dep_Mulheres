import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  RefreshCw,
  Award,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { 
  FinancialMovement, 
  FinancialKPIs, 
  MonthSummary, 
  CategorySummary, 
  ResponsibleSummary, 
  AIInsightResponse 
} from '../types';
import { generateLocalInsights, formatBRL } from '../utils/financialAnalytics';

interface InsightsViewProps {
  movements: FinancialMovement[];
  kpis: FinancialKPIs;
  selectedMonth: string;
  monthlySummaries: MonthSummary[];
  topEntradas: CategorySummary[];
  topSaidas: CategorySummary[];
  responsibles: ResponsibleSummary[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  movements,
  kpis,
  selectedMonth,
  monthlySummaries,
  topEntradas,
  topSaidas,
  responsibles
}) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsightResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fallback / default rule-based insights
  const localInsight = generateLocalInsights(movements, kpis, selectedMonth);
  const activeInsight = aiInsight || localInsight;

  const handleGenerateGeminiAI = async () => {
    setLoadingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/financial-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedMonth,
          kpis,
          monthlySummaries,
          topEntradas,
          topSaidas,
          responsibles
        })
      });

      const data = await response.json();
      if (data.success && data.insight) {
        setAiInsight(data.insight);
      } else if (data.fallback) {
        setAiInsight(localInsight);
      } else {
        throw new Error(data.error || 'Erro ao processar com IA');
      }
    } catch (err: any) {
      console.warn('Using local intelligence engine:', err.message);
      setAiInsight(localInsight);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / AI Trigger */}
      <div className="glass-card border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden bg-gradient-to-r from-teal-950/60 via-slate-900/80 to-indigo-950/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-300 animate-pulse" />
                Inteligência Financeira 3ª IPI
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-300 text-xs font-medium">
                Período: {selectedMonth === 'TODOS' ? 'Consolidado Anual' : selectedMonth}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2.5 tracking-tight">
              Diagnóstico & Parecer Orçamentário Automático
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Auditoria inteligente das movimentações financeiras do Grupo de Mulheres, destacando saúde do caixa, pontos de atenção e projeções para próximos eventos e cultos.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerateGeminiAI}
              disabled={loadingAI}
              id="btn-trigger-gemini-ai"
              className="inline-flex items-center px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {loadingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin text-slate-950" />
                  Gerando Parecer com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
                  Consultar Consultor Gemini IA
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Score and Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Índice de Saúde do Caixa
              </span>
              <Award className="w-5 h-5 text-teal-400" />
            </div>

            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-white">
                {activeInsight.scoreSaude}
              </span>
              <span className="text-slate-400 font-bold text-lg">/ 100</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                activeInsight.nivelSaude === 'Excelente' || activeInsight.nivelSaude === 'Saudável'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {activeInsight.nivelSaude.toUpperCase()}
              </span>
            </div>

            {/* Visual Progress Gauge */}
            <div className="w-full bg-white/10 h-2.5 rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  activeInsight.scoreSaude >= 80 ? 'bg-teal-400' : activeInsight.scoreSaude >= 60 ? 'bg-indigo-400' : 'bg-rose-400'
                }`}
                style={{ width: `${activeInsight.scoreSaude}%` }}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Retenção Orçamentária:</span>
              <strong className="text-white">{kpis.margemEconomia.toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Saldo Acumulado:</span>
              <strong className="text-teal-300">{formatBRL(kpis.saldoAcumuladoTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-teal-300 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Parecer da Tesouraria e Auditoria
              </h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2.5">
              {activeInsight.resumoExecutivo}
            </p>
          </div>

          <div className="mt-4 p-3.5 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-200 flex items-start space-x-2.5">
            <TrendingUp className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Diagnóstico de Projeção:</strong> {activeInsight.projecaoProximoMesTexto}
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Highlights vs Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Destaques Positivos */}
        <div className="glass-card rounded-2xl p-6 border border-teal-500/30 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 text-teal-300">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <h4 className="text-sm font-bold text-white">
              Pontos Fortes & Destaques Positivos
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            {activeInsight.destaquesPositivos.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alertas de Atenção */}
        <div className="glass-card rounded-2xl p-6 border border-amber-500/30 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Pontos de Atenção & Gestão de Risco
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            {activeInsight.alertasAtencao.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Recomendações e Ideias para o Ministério */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recomendações Orçamentárias */}
        <div className="glass-card rounded-2xl p-6 border border-white/15 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 text-teal-300">
            <Lightbulb className="w-5 h-5 text-teal-400" />
            <h4 className="text-sm font-bold text-white">
              Recomendações Práticas para a Tesouraria
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            {activeInsight.recomendacoesOrcamentarias.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sugestões para Futuros Eventos */}
        <div className="glass-card rounded-2xl p-6 border border-white/15 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 text-indigo-300">
            <HeartHandshake className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">
              Oportunidades de Captação & Ministério
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            {activeInsight.sugestoesEventosFuturos.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
