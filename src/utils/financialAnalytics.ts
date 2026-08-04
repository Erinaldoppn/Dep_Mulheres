import {
  FinancialMovement,
  MonthSummary,
  CategorySummary,
  ResponsibleSummary,
  PaymentMethodSummary,
  FinancialKPIs,
  AIInsightResponse
} from '../types';

export const MONTH_ORDER: Record<string, number> = {
  'Janeiro': 1,
  'Fevereiro': 2,
  'Março': 3,
  'Abril': 4,
  'Maio': 5,
  'Junho': 6,
  'Julho': 7,
  'Agosto': 8,
  'Setembro': 9,
  'Outubro': 10,
  'Novembro': 11,
  'Dezembro': 12
};

export const MONTH_LIST = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const SUMMARY_KEYWORDS = [
  'total', 'subtotal', 'resumo', 'saldo', 'saldo final', 'saldo em conta',
  'conta', 'espécie', 'especie', 'receita', 'despesa', 'dif', 'diferença',
  'diferenca', 'banco', 'caixa geral', 'balancete', 'consolidado'
];

/**
 * Sanitize movements to filter out header/summary rows and ensure valid calendar months
 */
export function sanitizeMovements(movements: FinancialMovement[]): FinancialMovement[] {
  if (!Array.isArray(movements)) return [];

  return movements.filter(m => {
    if (!m) return false;
    const desc = (m.movimento || '').trim().toLowerCase();
    const mes = (m.mes || '').trim();
    const valor = typeof m.valor === 'number' ? m.valor : parseFloat(String(m.valor)) || 0;

    // Check if movement is a summary term
    if (SUMMARY_KEYWORDS.includes(desc)) return false;
    if (SUMMARY_KEYWORDS.includes(mes.toLowerCase())) return false;

    // Must have a valid month
    if (!MONTH_LIST.includes(mes)) {
      // Try to find if mes contains one of the month names
      const found = MONTH_LIST.find(month => mes.toLowerCase().includes(month.toLowerCase().slice(0, 3)));
      if (found) {
        m.mes = found;
      } else {
        return false;
      }
    }

    // Must have positive value or descriptive title
    if (valor <= 0 && !desc) return false;

    return true;
  });
}

/**
 * Format currency to Brazilian Real (R$)
 */
export function formatBRL(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(val);
}

/**
 * Format percentage
 */
export function formatPercent(val: number, withSign = true): string {
  if (isNaN(val)) return '0,0%';
  const sign = withSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1).replace('.', ',')}%`;
}

/**
 * Get sorted unique list of valid calendar months present in movements
 */
export function getDistinctMonths(movements: FinancialMovement[]): string[] {
  const clean = sanitizeMovements(movements);
  const presentMonths = new Set<string>();

  clean.forEach(m => {
    const cleanMes = m.mes.trim();
    if (MONTH_LIST.includes(cleanMes)) {
      presentMonths.add(cleanMes);
    }
  });

  return MONTH_LIST.filter(mes => presentMonths.has(mes));
}

/**
 * Determine default active month (Current calendar month or latest month in dataset)
 */
export function getDefaultActiveMonth(movements: FinancialMovement[]): string {
  const distinct = getDistinctMonths(movements);
  if (distinct.length === 0) return 'Agosto';

  const currentMonthName = MONTH_LIST[new Date().getMonth()];
  if (distinct.includes(currentMonthName)) {
    return currentMonthName;
  }
  // Return the last month in dataset
  return distinct[distinct.length - 1];
}

/**
 * Calculate Monthly Evolution Summaries for all valid calendar months in order
 */
export function calculateMonthlySummaries(movements: FinancialMovement[]): MonthSummary[] {
  const clean = sanitizeMovements(movements);
  const monthMap = new Map<string, {
    totalEntradas: number;
    totalSaidas: number;
    quantidadeMovimentos: number;
    quantidadeEntradas: number;
    quantidadeSaidas: number;
  }>();

  // Initialize ordered months present in dataset
  const distinct = getDistinctMonths(clean);
  distinct.forEach(m => {
    monthMap.set(m, {
      totalEntradas: 0,
      totalSaidas: 0,
      quantidadeMovimentos: 0,
      quantidadeEntradas: 0,
      quantidadeSaidas: 0
    });
  });

  clean.forEach(m => {
    const mes = m.mes.trim();
    if (!MONTH_LIST.includes(mes)) return;

    if (!monthMap.has(mes)) {
      monthMap.set(mes, {
        totalEntradas: 0,
        totalSaidas: 0,
        quantidadeMovimentos: 0,
        quantidadeEntradas: 0,
        quantidadeSaidas: 0
      });
    }

    const current = monthMap.get(mes)!;
    current.quantidadeMovimentos += 1;

    if (m.tipo === 'ENTRADA') {
      current.totalEntradas += m.valor;
      current.quantidadeEntradas += 1;
    } else {
      current.totalSaidas += m.valor;
      current.quantidadeSaidas += 1;
    }
  });

  let runningSaldo = 0;
  const summaries: MonthSummary[] = [];

  MONTH_LIST.forEach((mes, idx) => {
    if (monthMap.has(mes)) {
      const data = monthMap.get(mes)!;
      const saldoMes = data.totalEntradas - data.totalSaidas;
      runningSaldo += saldoMes;

      summaries.push({
        mes,
        mesKey: `M-${idx + 1}`,
        mesIndex: idx,
        totalEntradas: data.totalEntradas,
        totalSaidas: data.totalSaidas,
        saldo: saldoMes,
        saldoAcumulado: runningSaldo,
        quantidadeMovimentos: data.quantidadeMovimentos,
        quantidadeEntradas: data.quantidadeEntradas,
        quantidadeSaidas: data.quantidadeSaidas
      });
    }
  });

  return summaries;
}

/**
 * Filter movements by selected month ("TODOS" or specific month name)
 */
export function filterMovements(
  movements: FinancialMovement[],
  selectedMonth: string,
  searchQuery = '',
  selectedType: 'TODOS' | 'ENTRADA' | 'SAIDA' = 'TODOS',
  selectedResponsible = 'TODOS'
): FinancialMovement[] {
  return movements.filter(m => {
    // Month filter
    if (selectedMonth !== 'TODOS' && m.mes.toLowerCase() !== selectedMonth.toLowerCase()) {
      return false;
    }

    // Type filter
    if (selectedType !== 'TODOS' && m.tipo !== selectedType) {
      return false;
    }

    // Responsible filter
    if (selectedResponsible !== 'TODOS' && m.responsavel !== selectedResponsible) {
      return false;
    }

    // Search query
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
}

/**
 * Compute KPIs and Next Month Projection
 */
export function calculateFinancialKPIs(
  allMovements: FinancialMovement[],
  selectedMonth: string
): FinancialKPIs {
  const filtered = selectedMonth === 'TODOS'
    ? allMovements
    : allMovements.filter(m => m.mes.toLowerCase() === selectedMonth.toLowerCase());

  let totalEntradas = 0;
  let totalSaidas = 0;
  let countEntradas = 0;
  let countSaidas = 0;
  let maiorEntrada: FinancialMovement | null = null;
  let maiorSaida: FinancialMovement | null = null;

  filtered.forEach(m => {
    if (m.tipo === 'ENTRADA') {
      totalEntradas += m.valor;
      countEntradas += 1;
      if (!maiorEntrada || m.valor > maiorEntrada.valor) {
        maiorEntrada = m;
      }
    } else {
      totalSaidas += m.valor;
      countSaidas += 1;
      if (!maiorSaida || m.valor > maiorSaida.valor) {
        maiorSaida = m;
      }
    }
  });

  const saldoPeriodo = totalEntradas - totalSaidas;

  // Calculate cumulative balance across all movements
  let saldoAcumuladoTotal = 0;
  allMovements.forEach(m => {
    if (m.tipo === 'ENTRADA') saldoAcumuladoTotal += m.valor;
    else saldoAcumuladoTotal -= m.valor;
  });

  // Calculate monthly summaries to compute projection and month-over-month comparison
  const monthlySummaries = calculateMonthlySummaries(allMovements);

  let comparativoMesAnterior: { entradasVariacao: number; saidasVariacao: number; saldoVariacao: number } | undefined;

  if (selectedMonth !== 'TODOS' && monthlySummaries.length > 1) {
    const currentIdx = monthlySummaries.findIndex(s => s.mes.toLowerCase() === selectedMonth.toLowerCase());
    if (currentIdx > 0) {
      const prev = monthlySummaries[currentIdx - 1];
      const prevEntradas = prev.totalEntradas || 1;
      const prevSaidas = prev.totalSaidas || 1;
      const prevSaldo = prev.saldo || 1;

      comparativoMesAnterior = {
        entradasVariacao: ((totalEntradas - prev.totalEntradas) / prevEntradas) * 100,
        saidasVariacao: ((totalSaidas - prev.totalSaidas) / prevSaidas) * 100,
        saldoVariacao: ((saldoPeriodo - prev.saldo) / Math.abs(prevSaldo)) * 100
      };
    }
  }

  // --- Next Month Projection Engine ---
  // Uses weighted moving average of last 3 months + linear momentum
  const numMonths = monthlySummaries.length;
  let projEntradas = 0;
  let projSaidas = 0;
  let projMotivo = '';
  let confianca: 'ALTA' | 'MEDIA' | 'MODERADA' = 'MEDIA';

  if (numMonths >= 3) {
    const last3 = monthlySummaries.slice(-3);
    const w1 = 0.5, w2 = 0.3, w3 = 0.2; // Most recent has highest weight
    projEntradas = (last3[2].totalEntradas * w1) + (last3[1].totalEntradas * w2) + (last3[0].totalEntradas * w3);
    projSaidas = (last3[2].totalSaidas * w1) + (last3[1].totalSaidas * w2) + (last3[0].totalSaidas * w3);
    
    // Apply conservative momentum
    const recentTrend = (last3[2].saldo - last3[0].saldo) / 2;
    projEntradas = Math.max(0, projEntradas + (recentTrend > 0 ? recentTrend * 0.15 : 0));
    
    confianca = 'ALTA';
    projMotivo = `Baseado na média ponderada dos últimos 3 meses (${last3.map(m => m.mes).join(', ')}) com ajuste de tendência orçamentária.`;
  } else if (numMonths > 0) {
    const avgEntradas = monthlySummaries.reduce((sum, m) => sum + m.totalEntradas, 0) / numMonths;
    const avgSaidas = monthlySummaries.reduce((sum, m) => sum + m.totalSaidas, 0) / numMonths;
    projEntradas = avgEntradas;
    projSaidas = avgSaidas;
    confianca = 'MEDIA';
    projMotivo = `Baseado na média histórica dos ${numMonths} meses cadastrados na planilha.`;
  } else {
    projEntradas = totalEntradas;
    projSaidas = totalSaidas;
    confianca = 'MODERADA';
    projMotivo = 'Estimativa baseada no período atual.';
  }

  const projSaldo = projEntradas - projSaidas;
  const variacaoPercentual = totalEntradas > 0 ? ((projSaldo - saldoPeriodo) / Math.abs(saldoPeriodo || 1)) * 100 : 0;

  const margemEconomia = totalEntradas > 0 ? (saldoPeriodo / totalEntradas) * 100 : 0;
  const ticketMedioEntrada = countEntradas > 0 ? totalEntradas / countEntradas : 0;
  const ticketMedioSaida = countSaidas > 0 ? totalSaidas / countSaidas : 0;

  return {
    totalEntradas,
    totalSaidas,
    saldoPeriodo,
    saldoAcumuladoTotal,
    projecaoProximoMes: {
      saldoEstimado: projSaldo,
      entradasEstimadas: projEntradas,
      saidasEstimadas: projSaidas,
      variacaoPercentual,
      confianca,
      motivo: projMotivo
    },
    margemEconomia,
    ticketMedioEntrada,
    ticketMedioSaida,
    maiorEntrada,
    maiorSaida,
    comparativoMesAnterior
  };
}

/**
 * Breakdown by Categories / Movements
 */
export function calculateCategoryBreakdown(
  movements: FinancialMovement[],
  tipo: 'ENTRADA' | 'SAIDA'
): CategorySummary[] {
  const filtered = movements.filter(m => m.tipo === tipo);
  const total = filtered.reduce((acc, m) => acc + m.valor, 0);

  const map = new Map<string, { total: number; count: number }>();

  filtered.forEach(m => {
    const cat = m.movimento.trim() || 'Outros';
    if (!map.has(cat)) {
      map.set(cat, { total: 0, count: 0 });
    }
    const curr = map.get(cat)!;
    curr.total += m.valor;
    curr.count += 1;
  });

  return Array.from(map.entries())
    .map(([categoria, data]) => ({
      categoria,
      total: data.total,
      quantidade: data.count,
      percentual: total > 0 ? (data.total / total) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Breakdown by Responsável
 */
export function calculateResponsibleBreakdown(movements: FinancialMovement[]): ResponsibleSummary[] {
  const map = new Map<string, { totalEntradas: number; totalSaidas: number; count: number }>();

  movements.forEach(m => {
    const resp = m.responsavel.trim() || 'Não Informado';
    if (!map.has(resp)) {
      map.set(resp, { totalEntradas: 0, totalSaidas: 0, count: 0 });
    }
    const curr = map.get(resp)!;
    curr.count += 1;
    if (m.tipo === 'ENTRADA') curr.totalEntradas += m.valor;
    else curr.totalSaidas += m.valor;
  });

  return Array.from(map.entries())
    .map(([responsavel, data]) => ({
      responsavel,
      totalEntradas: data.totalEntradas,
      totalSaidas: data.totalSaidas,
      saldo: data.totalEntradas - data.totalSaidas,
      movimentosCount: data.count
    }))
    .sort((a, b) => (b.totalEntradas + b.totalSaidas) - (a.totalEntradas + a.totalSaidas));
}

/**
 * Breakdown by Payment / Transfer Method
 */
export function calculatePaymentMethodBreakdown(movements: FinancialMovement[]): PaymentMethodSummary[] {
  const total = movements.reduce((acc, m) => acc + m.valor, 0);
  const map = new Map<string, { total: number; count: number }>();

  movements.forEach(m => {
    const met = m.transferencia.trim() || 'Outros';
    if (!map.has(met)) {
      map.set(met, { total: 0, count: 0 });
    }
    const curr = map.get(met)!;
    curr.total += m.valor;
    curr.count += 1;
  });

  return Array.from(map.entries())
    .map(([metodo, data]) => ({
      metodo,
      total: data.total,
      quantidade: data.count,
      percentual: total > 0 ? (data.total / total) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Generate comprehensive Rule-based Automatic Insights
 * Tailored for 3ª IPI Women's Ministry
 */
export function generateLocalInsights(
  movements: FinancialMovement[],
  kpis: FinancialKPIs,
  selectedMonth: string
): AIInsightResponse {
  const topEntradas = calculateCategoryBreakdown(movements, 'ENTRADA');
  const topSaidas = calculateCategoryBreakdown(movements, 'SAIDA');
  const responsibles = calculateResponsibleBreakdown(movements);
  const monthly = calculateMonthlySummaries(movements);

  // Score calculation 0-100
  let score = 75;
  if (kpis.saldoPeriodo > 0) score += 12;
  else score -= 18;

  if (kpis.margemEconomia > 30) score += 8;
  else if (kpis.margemEconomia < 10) score -= 10;

  if (kpis.saldoAcumuladoTotal > 5000) score += 5;

  score = Math.max(20, Math.min(98, Math.round(score)));

  let nivelSaude: 'Excelente' | 'Saudável' | 'Atenção' | 'Crítico' = 'Saudável';
  if (score >= 88) nivelSaude = 'Excelente';
  else if (score >= 70) nivelSaude = 'Saudável';
  else if (score >= 50) nivelSaude = 'Atenção';
  else nivelSaude = 'Crítico';

  const destaques: string[] = [];
  const alertas: string[] = [];
  const recomendacoes: string[] = [];
  const eventos: string[] = [];

  // Positive Highlights
  if (kpis.saldoPeriodo > 0) {
    destaques.push(`Superávit positivo de ${formatBRL(kpis.saldoPeriodo)} no período (${kpis.margemEconomia.toFixed(1)}% de retenção líquida).`);
  }
  if (topEntradas.length > 0) {
    destaques.push(`Principal fonte de receita: "${topEntradas[0].categoria}" com ${formatBRL(topEntradas[0].total)} (${topEntradas[0].percentual.toFixed(1)}% do total arrecadado).`);
  }
  if (kpis.saldoAcumuladoTotal > 0) {
    destaques.push(`Fundo de reserva acumulado no caixa da 3ª IPI: ${formatBRL(kpis.saldoAcumuladoTotal)} disponível para projetos do ministério.`);
  }

  // Alerts
  if (topSaidas.length > 0 && topSaidas[0].percentual > 40) {
    alertas.push(`Alta concentração de despesa em "${topSaidas[0].categoria}" representando ${topSaidas[0].percentual.toFixed(1)}% de todos os gastos.`);
  }
  if (kpis.saldoPeriodo <= 0) {
    alertas.push(`Atenção: O período registrou déficit de ${formatBRL(Math.abs(kpis.saldoPeriodo))}. Recomenda-se acionar eventos arrecadatórios como a Cantina ou Bazar.`);
  }
  if (kpis.comparativoMesAnterior && kpis.comparativoMesAnterior.saidasVariacao > 25) {
    alertas.push(`As despesas cresceram ${kpis.comparativoMesAnterior.saidasVariacao.toFixed(1)}% em relação ao mês anterior.`);
  }

  // Budgetary Recommendations
  recomendacoes.push('Manter reserva estratégica de no mínimo 3 meses de despesas médias operacionais para imprevistos do ministério.');
  recomendacoes.push('Padronizar 100% dos recebimentos de eventos e cantina via chave PIX oficial da tesouraria para agilidade na conciliação.');
  if (topSaidas.length > 1) {
    recomendacoes.push(`Planejar compras antecipadas de insumos para "${topSaidas[1].categoria}" visando obter descontos com fornecedores.`);
  }

  // Next month projection text
  const projTexto = `Para o próximo mês, estima-se uma arrecadação de ${formatBRL(kpis.projecaoProximoMes.entradasEstimadas)} e saídas de ${formatBRL(kpis.projecaoProximoMes.saidasEstimadas)}, resultando em saldo projetado de ${formatBRL(kpis.projecaoProximoMes.saldoEstimado)} (${kpis.projecaoProximoMes.confianca.toLowerCase()} previsibilidade).`;

  // Upcoming ministry suggestions
  eventos.push('Fortalecer a Cantina Solidária de Domingo como fluxo contínuo de receita para o caixa.');
  eventos.push('Planejar o cronograma de arrecadação do Retiro e Chá das Mulheres com 60 dias de antecedência para cobrir parcelas de locação sem desfalcar o saldo corrente.');
  eventos.push('Destinar percentual fixo (ex: 10% a 15%) das receitas para o fundo de Ação Social e Cestas Básicas da igreja.');

  const resumo = `O caixa do Grupo de Mulheres da 3ª IPI do Natal apresenta saúde financeira classificada como ${nivelSaude.toUpperCase()} (${score}/100) no período analisado (${selectedMonth === 'TODOS' ? 'Consolidado Anual' : selectedMonth}). Foram movimentados ${formatBRL(kpis.totalEntradas)} em receitas e ${formatBRL(kpis.totalSaidas)} em despesas operacionais.`;

  return {
    scoreSaude: score,
    nivelSaude,
    resumoExecutivo: resumo,
    destaquesPositivos: destaques,
    alertasAtencao: alertas.length > 0 ? alertas : ['Nenhum alerta crítico identificado. O caixa opera dentro dos limites de segurança orçamentária.'],
    recomendacoesOrcamentarias: recomendacoes,
    projecaoProximoMesTexto: projTexto,
    sugestoesEventosFuturos: eventos
  };
}
