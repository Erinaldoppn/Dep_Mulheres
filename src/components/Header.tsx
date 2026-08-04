import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  FileDown, 
  PlusCircle, 
  Sparkles, 
  Landmark, 
  Calendar, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { FinancialKPIs } from '../types';
import { formatBRL } from '../utils/financialAnalytics';

interface HeaderProps {
  selectedMonth: string;
  totalRecords: number;
  lastImportTime: string | null;
  kpis: FinancialKPIs;
  onOpenImport: () => void;
  onDownloadTemplate: () => void;
  onExportPDF: () => void;
  onOpenNewEntry: () => void;
  onOpenAIInsights: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMonth,
  totalRecords,
  lastImportTime,
  kpis,
  onOpenImport,
  onDownloadTemplate,
  onExportPDF,
  onOpenNewEntry,
  onOpenAIInsights,
  onResetData
}) => {
  return (
    <header className="glass-card sticky top-0 z-30 border-b border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo and Titles */}
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl shadow-lg shadow-teal-500/20 border border-teal-300/40 flex items-center justify-center shrink-0">
              <Landmark className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-teal-400">
                  3ª Igreja Presbiteriana Independente de Natal
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] sm:text-xs font-medium text-slate-300">
                  Ministério de Mulheres / SAF
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5 drop-shadow-sm">
                Caixa Financeiro & Painel BI Consolidado
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="inline-flex items-center text-teal-300 font-medium bg-teal-950/60 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" />
                  {totalRecords} Lançamentos Carregados
                </span>
                {lastImportTime && (
                  <span className="text-slate-400">
                    Última importação: {lastImportTime}
                  </span>
                )}
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-slate-300">
                  Saldo Geral Acumulado:{' '}
                  <strong className="text-teal-300 font-bold">
                    {formatBRL(kpis.saldoAcumuladoTotal)}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenImport}
              id="btn-import-excel"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Importar Planilha (.xlsm)
            </button>

            <button
              onClick={onExportPDF}
              id="btn-export-pdf"
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/15 text-xs sm:text-sm font-medium transition-all backdrop-blur-md cursor-pointer"
              title="Exportar Relatório Consolidado em PDF"
            >
              <FileDown className="w-4 h-4 mr-1.5 text-rose-400" />
              Relatório PDF
            </button>

            <button
              onClick={onOpenAIInsights}
              id="btn-ai-insights"
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/80 to-indigo-600/80 hover:from-teal-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-md cursor-pointer"
              title="Análise com Inteligência Orçamentária"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-teal-200 animate-pulse" />
              Insights IA
            </button>

            <button
              onClick={onOpenNewEntry}
              id="btn-new-entry"
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/15 text-xs sm:text-sm font-medium transition-all backdrop-blur-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1 text-teal-400" />
              Lançamento
            </button>

            <button
              onClick={onDownloadTemplate}
              id="btn-download-template"
              className="inline-flex items-center p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/15 text-xs transition-all cursor-pointer"
              title="Baixar Modelo de Planilha Oficial (.xlsx)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onResetData}
              id="btn-reset-demo"
              className="inline-flex items-center p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white border border-white/15 text-xs transition-all cursor-pointer"
              title="Restaurar Dados Padrão de Demonstração"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
