import * as XLSX from 'xlsx';
import { FinancialMovement, MovementType } from '../types';

export interface ParseResult {
  movements: FinancialMovement[];
  sheetName: string;
  totalRows: number;
  warnings: string[];
}

// Clean string helper
function cleanStr(val: unknown): string {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

// Normalize movement type to ENTRADA or SAIDA
export function normalizeMovementType(val: unknown): MovementType {
  const s = cleanStr(val).toUpperCase();
  if (
    s.includes('ENTRADA') ||
    s.includes('RECEITA') ||
    s.includes('CREDITO') ||
    s.includes('CRÉDITO') ||
    s.includes('OFERTA') ||
    s.includes('VENDA') ||
    s.includes('DOAÇÃO') ||
    s.includes('DOACAO') ||
    s.includes('INSCRIÇÃO') ||
    s.includes('INSCRICAO') ||
    s.includes('LOTE')
  ) {
    return 'ENTRADA';
  }
  if (
    s.includes('SAÍDA') ||
    s.includes('SAIDA') ||
    s.includes('DESPESA') ||
    s.includes('DEBITO') ||
    s.includes('DÉBITO') ||
    s.includes('PAGAMENTO') ||
    s.includes('COMPRA') ||
    s.includes('CUSTO')
  ) {
    return 'SAIDA';
  }
  // Default to ENTRADA if unclear
  return 'ENTRADA';
}

// Parse value into number safely
export function parseCurrency(val: unknown): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : Math.abs(val);
  }
  if (!val) return 0;
  
  let s = String(val).trim();
  // Remove currency symbols, non-breaking spaces, brackets
  s = s.replace(/R\$|\$|€/gi, '').replace(/\s+/g, '');
  
  // Handle parentheses for negative numbers e.g. (150,00)
  const isNegative = s.includes('(') && s.includes(')');
  s = s.replace(/[()]/g, '');

  // Handle Brazilian formatting: 1.250,50 -> 1250.50
  if (s.includes(',') && s.includes('.')) {
    if (s.indexOf('.') < s.indexOf(',')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  }

  const num = parseFloat(s);
  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : Math.abs(num);
}

// Parse Excel date or formatted date string
export function parseDate(val: unknown): { dateStr: string; monthName: string } {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (!val) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return { dateStr: `${yyyy}-${mm}-${dd}`, monthName: monthNames[now.getMonth()] };
  }

  // If it's an Excel numeric date (e.g. 45678)
  if (typeof val === 'number') {
    try {
      const dateObj = XLSX.SSF.parse_date_code(val);
      if (dateObj) {
        const yyyy = dateObj.y;
        const mm = String(dateObj.m).padStart(2, '0');
        const dd = String(dateObj.d).padStart(2, '0');
        const monthIndex = Math.max(0, Math.min(11, dateObj.m - 1));
        return {
          dateStr: `${yyyy}-${mm}-${dd}`,
          monthName: monthNames[monthIndex]
        };
      }
    } catch {
      // ignore and fallback
    }
  }

  const str = String(val).trim();

  // Match DD/MM/YYYY
  const brMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (brMatch) {
    const d = brMatch[1].padStart(2, '0');
    const m = parseInt(brMatch[2], 10);
    let y = brMatch[3];
    if (y.length === 2) y = '20' + y;
    const monthIndex = Math.max(0, Math.min(11, m - 1));
    return {
      dateStr: `${y}-${String(m).padStart(2, '0')}-${d}`,
      monthName: monthNames[monthIndex]
    };
  }

  // Match YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = parseInt(isoMatch[2], 10);
    const d = isoMatch[3].padStart(2, '0');
    const monthIndex = Math.max(0, Math.min(11, m - 1));
    return {
      dateStr: `${y}-${String(m).padStart(2, '0')}-${d}`,
      monthName: monthNames[monthIndex]
    };
  }

  return { dateStr: str, monthName: 'Agosto' };
}

export const MONTH_LIST = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Normalize month name string - ONLY return valid calendar months
export function normalizeMonthName(mesVal: unknown, fallbackMonth: string): string {
  const validFallback = MONTH_LIST.includes(fallbackMonth) ? fallbackMonth : 'Agosto';
  const s = cleanStr(mesVal);
  if (!s) return validFallback;

  const monthMap: Record<string, string> = {
    'jan': 'Janeiro', 'janeiro': 'Janeiro', '01': 'Janeiro', '1': 'Janeiro',
    'fev': 'Fevereiro', 'fevereiro': 'Fevereiro', '02': 'Fevereiro', '2': 'Fevereiro',
    'mar': 'Março', 'marco': 'Março', 'março': 'Março', '03': 'Março', '3': 'Março',
    'abr': 'Abril', 'abril': 'Abril', '04': 'Abril', '4': 'Abril',
    'mai': 'Maio', 'maio': 'Maio', '05': 'Maio', '5': 'Maio',
    'jun': 'Junho', 'junho': 'Junho', '06': 'Junho', '6': 'Junho',
    'jul': 'Julho', 'julho': 'Julho', '07': 'Julho', '7': 'Julho',
    'ago': 'Agosto', 'agosto': 'Agosto', '08': 'Agosto', '8': 'Agosto',
    'set': 'Setembro', 'setembro': 'Setembro', '09': 'Setembro', '9': 'Setembro',
    'out': 'Outubro', 'outubro': 'Outubro', '10': 'Outubro',
    'nov': 'Novembro', 'novembro': 'Novembro', '11': 'Novembro',
    'dez': 'Dezembro', 'dezembro': 'Dezembro', '12': 'Dezembro'
  };

  const lower = s.toLowerCase();
  for (const [key, name] of Object.entries(monthMap)) {
    if (lower === key || lower.includes(key)) {
      return name;
    }
  }

  // Never return non-month strings (such as CONTA, ESPÉCIE, RESUMO, TOTAL, etc.)
  return validFallback;
}

const SUMMARY_ROW_PATTERNS = [
  'total', 'subtotal', 'resumo', 'saldo', 'saldo final', 'saldo em conta',
  'conta', 'espécie', 'especie', 'receita', 'despesa', 'dif', 'diferença',
  'diferenca', 'banco', 'caixa geral', 'balancete', 'consolidado'
];

/**
 * Parse an Excel file ArrayBuffer / Uint8Array
 */
export function parseExcelFile(data: ArrayBuffer): ParseResult {
  const warnings: string[] = [];
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('O arquivo de planilha não contém nenhuma aba ou planilha válida.');
  }

  // Find sheet "MOVIMENTOS" (case-insensitive) or default to first sheet
  let targetSheetName = workbook.SheetNames.find(
    name => name.trim().toUpperCase() === 'MOVIMENTOS'
  );

  if (!targetSheetName) {
    targetSheetName = workbook.SheetNames.find(name =>
      name.toLowerCase().includes('moviment')
    );
  }

  if (!targetSheetName) {
    targetSheetName = workbook.SheetNames[0];
    warnings.push(`Aba "MOVIMENTOS" não foi encontrada. Usando aba padrão "${targetSheetName}".`);
  }

  const worksheet = workbook.Sheets[targetSheetName];
  if (!worksheet) {
    throw new Error(`Não foi possível ler a aba "${targetSheetName}".`);
  }

  // Convert worksheet to array of arrays
  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    blankrows: false
  });

  if (rawRows.length === 0) {
    throw new Error(`A aba "${targetSheetName}" está vazia.`);
  }

  // Look for header row: ID | MOVIMENTO | TIPO | DATA | MÊS | VALOR | TRANSFERÊNCIA | RESPONSÁVEL
  let headerRowIndex = -1;
  let colIndexes = {
    id: 0,
    movimento: 1,
    tipo: 2,
    data: 3,
    mes: 4,
    valor: 5,
    transferencia: 6,
    responsavel: 7
  };

  // Search through rows 0 to 15 to find the header row
  for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
    const row = rawRows[r];
    if (!Array.isArray(row)) continue;

    const rowStrings = row.map(c => cleanStr(c).toUpperCase());
    const hasMovimento = rowStrings.some(s => s.includes('MOVIMENTO') || s.includes('DESCRIC') || s.includes('HISTORICO'));
    const hasValor = rowStrings.some(s => s.includes('VALOR') || s.includes('R$') || s.includes('QUANTIA'));
    const hasTipo = rowStrings.some(s => s.includes('TIPO') || s.includes('ENTRADA') || s.includes('SAIDA'));

    if ((hasMovimento && hasValor) || (hasMovimento && hasTipo) || (hasValor && hasTipo)) {
      headerRowIndex = r;
      // Map specific columns
      rowStrings.forEach((s, idx) => {
        if (s === 'ID' || s.startsWith('ID') || s.includes('CÓDIGO')) colIndexes.id = idx;
        else if (s.includes('MOVIMENTO') || s.includes('DESCRIC') || s.includes('HISTORICO')) colIndexes.movimento = idx;
        else if (s.includes('TIPO') || s.includes('CATEGORIA')) colIndexes.tipo = idx;
        else if (s.includes('DATA') || s.includes('DIA')) colIndexes.data = idx;
        else if (s.includes('MÊS') || s.includes('MES') || s.includes('PERIODO')) colIndexes.mes = idx;
        else if (s.includes('VALOR') || s.includes('R$') || s.includes('TOTAL')) colIndexes.valor = idx;
        else if (s.includes('TRANSFER') || s.includes('PAGAMENTO') || s.includes('MEIO') || s.includes('CONTA')) colIndexes.transferencia = idx;
        else if (s.includes('RESPONS') || s.includes('MEMBRO') || s.includes('NOME')) colIndexes.responsavel = idx;
      });
      break;
    }
  }

  // If no header found, assume rows 1-6 are frozen/title and data starts at index 6 (row 7)
  const startRowIndex = headerRowIndex !== -1 ? headerRowIndex + 1 : 6;

  const parsedMovements: FinancialMovement[] = [];

  for (let r = startRowIndex; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!Array.isArray(row) || row.length === 0) continue;

    // Check if entire row is empty
    const hasAnyContent = row.some(cell => cleanStr(cell) !== '');
    if (!hasAnyContent) continue;

    const rawId = row[colIndexes.id];
    const rawMovimento = row[colIndexes.movimento];
    const rawTipo = row[colIndexes.tipo];
    const rawData = row[colIndexes.data];
    const rawMes = row[colIndexes.mes];
    const rawValor = row[colIndexes.valor];
    const rawTransferencia = row[colIndexes.transferencia];
    const rawResponsavel = row[colIndexes.responsavel];

    const movimentoStr = cleanStr(rawMovimento);
    const valorNum = parseCurrency(rawValor);

    // Skip totalizers or summary rows (e.g. "TOTAL GERAL", "SALDO FINAL", "CONTA", "ESPÉCIE", "RESUMO", "DIF")
    const lowerMov = movimentoStr.toLowerCase();
    const lowerMes = cleanStr(rawMes).toLowerCase();
    const lowerId = cleanStr(rawId).toLowerCase();

    const isSummaryRow = SUMMARY_ROW_PATTERNS.some(pat => 
      lowerMov === pat || 
      lowerMov.startsWith(pat + ' ') || 
      lowerMes === pat ||
      lowerId === pat
    );

    if (isSummaryRow) {
      continue;
    }

    // If movement description and value are both empty, skip
    if (!movimentoStr && valorNum === 0) {
      continue;
    }

    const { dateStr, monthName: fallbackMonth } = parseDate(rawData);
    const mesFinal = normalizeMonthName(rawMes, fallbackMonth);
    const tipoFinal = normalizeMovementType(rawTipo || movimentoStr);

    parsedMovements.push({
      id: rawId ? cleanStr(rawId) : `MOV-${parsedMovements.length + 1}`,
      movimento: movimentoStr || 'Movimentação Sem Descrição',
      tipo: tipoFinal,
      data: dateStr,
      mes: mesFinal,
      valor: valorNum,
      transferencia: cleanStr(rawTransferencia) || 'PIX',
      responsavel: cleanStr(rawResponsavel) || 'Tesouraria'
    });
  }

  if (parsedMovements.length === 0) {
    throw new Error('Nenhuma movimentação financeira foi encontrada na aba especificada. Verifique o layout da planilha.');
  }

  return {
    movements: parsedMovements,
    sheetName: targetSheetName,
    totalRows: parsedMovements.length,
    warnings
  };
}

/**
 * Generate a ready-to-use template Excel workbook (.xlsx) matching the exact specification:
 * - Tab named "MOVIMENTOS"
 * - Rows 1-6 with header/title and church info
 * - Row 6: ID | MOVIMENTO | TIPO | DATA | MÊS | VALOR | TRANSFERÊNCIA | RESPONSÁVEL
 * - Row 7+: Sample rows
 */
export function generateExcelTemplate(): Uint8Array {
  const wb = XLSX.utils.book_new();

  const wsData = [
    ['3ª IGREJA PRESBITERIANA INDEPENDENTE DE NATAL - RN'],
    ['MINISTÉRIO DE MULHERES / SOCIEDADE AUXILIADORA FEMININA (SAF)'],
    ['CONTROLE DE CAIXA FINANCEIRO & GESTÃO ORÇAMENTÁRIA'],
    ['Planilha Modelo Oficial - Atualize os dados e importe diretamente no sistema'],
    [''],
    ['ID', 'MOVIMENTO', 'TIPO', 'DATA', 'MÊS', 'VALOR', 'TRANSFERÊNCIA', 'RESPONSÁVEL'],
    [1, 'Chá das Mulheres - Ingressos', 'ENTRADA', '08/03/2026', 'Março', 3200.00, 'PIX', 'Ana Paula (Presidente)'],
    [2, 'Buffet e Coquetel Chá das Mulheres', 'SAÍDA', '08/03/2026', 'Março', 1650.00, 'Transferência Bancária', 'Ana Paula (Presidente)'],
    [3, 'Bazar Beneficente das Irmãs', 'ENTRADA', '09/05/2026', 'Maio', 2650.00, 'PIX', 'Ana Paula (Presidente)'],
    [4, 'Cantina de Domingo', 'ENTRADA', '17/05/2026', 'Maio', 580.00, 'PIX', 'Rebeca Costa (Cantina)'],
    [5, 'Ornamentação Floral do Altar', 'SAÍDA', '17/05/2026', 'Maio', 150.00, 'Dinheiro (Espécie)', 'Débora Lima (Decoração)'],
    [6, 'Inscrições Retiro de Mulheres 2026', 'ENTRADA', '12/07/2026', 'Julho', 4400.00, 'PIX', 'Priscila Santos (Eventos)'],
    [7, 'Reserva Pousada do Retiro', 'SAÍDA', '15/07/2026', 'Julho', 1800.00, 'Transferência Bancária', 'Ana Paula (Presidente)'],
    [8, 'Kits de Ação Social e Cestas Básicas', 'SAÍDA', '20/07/2026', 'Julho', 450.00, 'PIX', 'Débora Lima (Ação Social)'],
    [9, 'Oferta Culto de Gratidão', 'ENTRADA', '02/08/2026', 'Agosto', 590.00, 'PIX', 'Maria Clara (Tesouraria)']
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // ID
    { wch: 38 }, // MOVIMENTO
    { wch: 12 }, // TIPO
    { wch: 14 }, // DATA
    { wch: 14 }, // MÊS
    { wch: 16 }, // VALOR
    { wch: 26 }, // TRANSFERÊNCIA
    { wch: 28 }  // RESPONSÁVEL
  ];

  // Set frozen rows at row 6
  ws['!freeze'] = { xSplit: 0, ySplit: 6 };

  XLSX.utils.book_append_sheet(wb, ws, 'MOVIMENTOS');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(out);
}
