export type MovementType = 'ENTRADA' | 'SAIDA';

export interface FinancialMovement {
  id: string | number;
  movimento: string;
  tipo: MovementType;
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  mes: string;  // e.g. "Janeiro", "Fevereiro" or "01 - Janeiro"
  valor: number;
  transferencia: string;
  responsavel: string;
  observacao?: string;
}

export interface MonthSummary {
  mes: string;
  mesKey: string; // e.g. "2026-08" or "08"
  mesIndex: number; // 0-11
  ano?: number;
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  saldoAcumulado: number;
  quantidadeMovimentos: number;
  quantidadeEntradas: number;
  quantidadeSaidas: number;
}

export interface CategorySummary {
  categoria: string;
  total: number;
  quantidade: number;
  percentual: number;
}

export interface ResponsibleSummary {
  responsavel: string;
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  movimentosCount: number;
}

export interface PaymentMethodSummary {
  metodo: string;
  total: number;
  quantidade: number;
  percentual: number;
}

export interface FinancialKPIs {
  totalEntradas: number;
  totalSaidas: number;
  saldoPeriodo: number;
  saldoAcumuladoTotal: number;
  projecaoProximoMes: {
    saldoEstimado: number;
    entradasEstimadas: number;
    saidasEstimadas: number;
    variacaoPercentual: number;
    confianca: 'ALTA' | 'MEDIA' | 'MODERADA';
    motivo: string;
  };
  margemEconomia: number; // (saldo / totalEntradas) * 100
  ticketMedioEntrada: number;
  ticketMedioSaida: number;
  maiorEntrada: FinancialMovement | null;
  maiorSaida: FinancialMovement | null;
  comparativoMesAnterior?: {
    entradasVariacao: number; // %
    saidasVariacao: number; // %
    saldoVariacao: number; // %
  };
}

export interface AIInsightResponse {
  scoreSaude: number; // 0-100
  nivelSaude: 'Excelente' | 'Saudável' | 'Atenção' | 'Crítico';
  resumoExecutivo: string;
  destaquesPositivos: string[];
  alertasAtencao: string[];
  recomendacoesOrcamentarias: string[];
  projecaoProximoMesTexto: string;
  sugestoesEventosFuturos: string[];
}
