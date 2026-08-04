import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  MonthFilterBar 
} from './components/MonthFilterBar';
import { 
  KPICards 
} from './components/KPICards';
import { 
  VisualAnalytics 
} from './components/VisualAnalytics';
import { 
  MovementsTable 
} from './components/MovementsTable';
import { 
  InsightsView 
} from './components/InsightsView';
import { 
  ImportExcelModal 
} from './components/ImportExcelModal';
import { 
  ManualEntryModal 
} from './components/ManualEntryModal';
import { 
  INITIAL_MOVEMENTS 
} from './data/mockData';
import { 
  FinancialMovement, 
  MovementType 
} from './types';
import { 
  getDistinctMonths, 
  getDefaultActiveMonth, 
  calculateMonthlySummaries, 
  calculateFinancialKPIs, 
  calculateCategoryBreakdown, 
  calculateResponsibleBreakdown, 
  calculatePaymentMethodBreakdown,
  generateLocalInsights,
  sanitizeMovements
} from './utils/financialAnalytics';
import { 
  generateFinancialPDF 
} from './utils/pdfGenerator';
import { 
  generateExcelTemplate 
} from './utils/excelParser';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const STORAGE_KEY_MOVEMENTS = 'caixa_3ipi_mulheres_movimentos_v1';
const STORAGE_KEY_META = 'caixa_3ipi_mulheres_meta_v1';

export default function App() {
  // Load movements from localStorage or initialize with mockData
  const [movements, setMovements] = useState<FinancialMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeMovements(parsed);
          if (sanitized.length > 0) {
            return sanitized;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    return sanitizeMovements(INITIAL_MOVEMENTS);
  });

  const [lastImportTime, setLastImportTime] = useState<string | null>(() => {
    try {
      const meta = localStorage.getItem(STORAGE_KEY_META);
      if (meta) {
        const parsed = JSON.parse(meta);
        return parsed.lastImportTime || null;
      }
    } catch {
      // ignore
    }
    return '04/08/2026 10:44';
  });

  // Selected Month filter (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return getDefaultActiveMonth(INITIAL_MOVEMENTS);
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'TABLE' | 'INSIGHTS'>('DASHBOARD');

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<FinancialMovement | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage whenever movements change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
    } catch (e) {
      console.warn('Failed to save movements to localStorage:', e);
    }
  }, [movements]);

  // Derived lists & calculations
  const distinctMonths = useMemo(() => getDistinctMonths(movements), [movements]);

  // Filtered movements for current view
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      if (selectedMonth !== 'TODOS' && m.mes.toLowerCase() !== selectedMonth.toLowerCase()) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchMov = m.movimento.toLowerCase().includes(q);
        const matchResp = m.responsavel.toLowerCase().includes(q);
        const matchTrans = m.transferencia.toLowerCase().includes(q);
        const matchObs = (m.observacao || '').toLowerCase().includes(q);
        const matchVal = m.valor.toString().includes(q);
        if (!matchMov && !matchResp && !matchTrans && !matchObs && !matchVal) {
          return false;
        }
      }
      return true;
    });
  }, [movements, selectedMonth, searchQuery]);

  // KPIs for selected month
  const kpis = useMemo(() => {
    return calculateFinancialKPIs(movements, selectedMonth);
  }, [movements, selectedMonth]);

  // Monthly Evolution Summaries
  const monthlySummaries = useMemo(() => {
    return calculateMonthlySummaries(movements);
  }, [movements]);

  // Category & Entity Breakdowns
  const topEntradas = useMemo(() => {
    return calculateCategoryBreakdown(filteredMovements, 'ENTRADA');
  }, [filteredMovements]);

  const topSaidas = useMemo(() => {
    return calculateCategoryBreakdown(filteredMovements, 'SAIDA');
  }, [filteredMovements]);

  const responsibles = useMemo(() => {
    return calculateResponsibleBreakdown(filteredMovements);
  }, [filteredMovements]);

  const paymentMethods = useMemo(() => {
    return calculatePaymentMethodBreakdown(filteredMovements);
  }, [filteredMovements]);

  // Handlers
  const handleImportSuccess = (newMovements: FinancialMovement[], fileName: string) => {
    const cleanList = sanitizeMovements(newMovements);
    setMovements(cleanList);
    const now = new Date();
    const timeStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setLastImportTime(timeStr);
    
    try {
      localStorage.setItem(STORAGE_KEY_META, JSON.stringify({ lastImportTime: timeStr, fileName }));
    } catch {}

    // Auto-select latest month
    const defaultM = getDefaultActiveMonth(cleanList);
    setSelectedMonth(defaultM);

    showToast(`Planilha "${fileName}" importada com sucesso! ${cleanList.length} lançamentos válidos carregados.`);
  };

  const handleDownloadTemplate = () => {
    const templateBytes = generateExcelTemplate();
    const blob = new Blob([templateBytes], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Modelo_Planilha_Caixa_Mulheres_3IPI.xlsx';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Modelo de planilha oficial baixado com sucesso!');
  };

  const handleExportPDF = () => {
    generateFinancialPDF({
      movements: filteredMovements,
      kpis,
      selectedMonth,
      monthlySummaries
    });
    showToast(`Relatório financeiro do mês de ${selectedMonth} exportado em PDF!`);
  };

  const handleSaveMovement = (movement: FinancialMovement) => {
    setMovements(prev => {
      const existsIndex = prev.findIndex(m => m.id === movement.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = movement;
        return copy;
      } else {
        return [movement, ...prev];
      }
    });
    showToast('Lançamento salvo com sucesso!');
  };

  const handleDeleteMovement = (id: string | number) => {
    if (window.confirm('Deseja realmente excluir este lançamento financeiro?')) {
      setMovements(prev => prev.filter(m => m.id !== id));
      showToast('Lançamento excluído com sucesso.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados originais de demonstração da 3ª IPI?')) {
      setMovements(INITIAL_MOVEMENTS);
      setSelectedMonth('Agosto');
      showToast('Dados restaurados com sucesso.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans relative overflow-x-hidden">
      {/* Frosted Glass Mesh Background */}
      <div className="mesh-bg" />
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 glass-card text-white px-4 py-3 rounded-xl border border-teal-500/30 flex items-center space-x-2.5 text-xs shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-medium text-slate-100">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header */}
      <Header
        selectedMonth={selectedMonth}
        totalRecords={movements.length}
        lastImportTime={lastImportTime}
        kpis={kpis}
        onOpenImport={() => setIsImportModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onExportPDF={handleExportPDF}
        onOpenNewEntry={() => {
          setEditingMovement(null);
          setIsManualModalOpen(true);
        }}
        onOpenAIInsights={() => setActiveView('INSIGHTS')}
        onResetData={handleResetData}
      />

      {/* 2. Month Filter Bar / Period Slicer */}
      <MonthFilterBar
        distinctMonths={distinctMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        monthlySummaries={monthlySummaries}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* 3. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6 relative z-10">
        
        {/* KPI Cards (Always visible on top of views) */}
        <KPICards
          kpis={kpis}
          selectedMonth={selectedMonth}
        />

        {/* View Switching: BI Charts Dashboard vs Movements Table vs Insights */}
        {activeView === 'DASHBOARD' && (
          <VisualAnalytics
            monthlySummaries={monthlySummaries}
            topEntradas={topEntradas}
            topSaidas={topSaidas}
            responsibles={responsibles}
            paymentMethods={paymentMethods}
            kpis={kpis}
            selectedMonth={selectedMonth}
          />
        )}

        {activeView === 'TABLE' && (
          <MovementsTable
            movements={filteredMovements}
            selectedMonth={selectedMonth}
            onEditMovement={(m) => {
              setEditingMovement(m);
              setIsManualModalOpen(true);
            }}
            onDeleteMovement={handleDeleteMovement}
            onAddNew={() => {
              setEditingMovement(null);
              setIsManualModalOpen(true);
            }}
          />
        )}

        {activeView === 'INSIGHTS' && (
          <InsightsView
            movements={filteredMovements}
            kpis={kpis}
            selectedMonth={selectedMonth}
            monthlySummaries={monthlySummaries}
            topEntradas={topEntradas}
            topSaidas={topSaidas}
            responsibles={responsibles}
          />
        )}

      </main>

      {/* 4. Footer */}
      <footer className="glass-card border-t border-white/10 py-5 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>
            © {new Date().getFullYear()} Grupo de Mulheres / SAF • 3ª Igreja Presbiteriana Independente de Natal - RN
          </p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-slate-300">Aba Planilha: <strong className="text-teal-300 font-semibold">"MOVIMENTOS"</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Linhas 1 a 6 congeladas • Dados a partir da linha 7</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => {
          setIsManualModalOpen(false);
          setEditingMovement(null);
        }}
        onSave={handleSaveMovement}
        initialData={editingMovement}
      />

    </div>
  );
}
