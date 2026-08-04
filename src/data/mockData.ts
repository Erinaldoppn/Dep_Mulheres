import { FinancialMovement } from '../types';

export const INITIAL_MOVEMENTS: FinancialMovement[] = [
  // JANEIRO
  {
    id: 1,
    movimento: 'Saldo Inicial do Ano / Caixa Anterior',
    tipo: 'ENTRADA',
    data: '2026-01-05',
    mes: 'Janeiro',
    valor: 2850.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Saldo remanescente de 2025'
  },
  {
    id: 2,
    movimento: 'Oferta Especial Culto de Mulheres',
    tipo: 'ENTRADA',
    data: '2026-01-11',
    mes: 'Janeiro',
    valor: 480.00,
    transferencia: 'PIX',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Culto de Abertura do Ano'
  },
  {
    id: 3,
    movimento: 'Venda de Livros e Devocionais',
    tipo: 'ENTRADA',
    data: '2026-01-18',
    mes: 'Janeiro',
    valor: 620.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Literatura)',
    observacao: 'Devocional da Mulher Cristã'
  },
  {
    id: 4,
    movimento: 'Ornamentação Floral do Altar',
    tipo: 'SAIDA',
    data: '2026-01-10',
    mes: 'Janeiro',
    valor: 150.00,
    transferencia: 'PIX',
    responsavel: 'Débora Lima (Decoração)',
    observacao: 'Flores naturais culto de abertura'
  },
  {
    id: 5,
    movimento: 'Material de Estudo Bíblico (Apostilas)',
    tipo: 'SAIDA',
    data: '2026-01-20',
    mes: 'Janeiro',
    valor: 340.00,
    transferencia: 'Cartão Débito',
    responsavel: 'Pastora Helena',
    observacao: 'Impressão de 40 apostilas do trimestre'
  },
  {
    id: 6,
    movimento: 'Cantina de Domingo - Venda de Salgados',
    tipo: 'ENTRADA',
    data: '2026-01-25',
    mes: 'Janeiro',
    valor: 510.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Arrecadação cantina pós-culto'
  },
  {
    id: 7,
    movimento: 'Insumos e Bebidas para Cantina',
    tipo: 'SAIDA',
    data: '2026-01-24',
    mes: 'Janeiro',
    valor: 185.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Sucos, refrigerantes e descartáveis'
  },

  // FEVEREIRO
  {
    id: 8,
    movimento: 'Cantina Solidária Pós-Culto',
    tipo: 'ENTRADA',
    data: '2026-02-08',
    mes: 'Fevereiro',
    valor: 640.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Bolos e tortas das irmãs'
  },
  {
    id: 9,
    movimento: 'Doação Espontânea de Famílias',
    tipo: 'ENTRADA',
    data: '2026-02-15',
    mes: 'Fevereiro',
    valor: 750.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Doação para Fundo de Ação Social'
  },
  {
    id: 10,
    movimento: 'Cestas Básicas - Ação Social Comunitária',
    tipo: 'SAIDA',
    data: '2026-02-18',
    mes: 'Fevereiro',
    valor: 600.00,
    transferencia: 'PIX',
    responsavel: 'Débora Lima (Ação Social)',
    observacao: '4 cestas básicas para famílias carentes'
  },
  {
    id: 11,
    movimento: 'Lembrancinhas Encontro de Oração',
    tipo: 'SAIDA',
    data: '2026-02-22',
    mes: 'Fevereiro',
    valor: 120.00,
    transferencia: 'Dinheiro (Espécie)',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Chaveiros e cartões artesanais'
  },
  {
    id: 12,
    movimento: 'Oferta das Mulheres',
    tipo: 'ENTRADA',
    data: '2026-02-28',
    mes: 'Fevereiro',
    valor: 520.00,
    transferencia: 'PIX',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Reunião mensal de oração'
  },

  // MARÇO (Mês da Mulher)
  {
    id: 13,
    movimento: 'Inscrições Chá Especial Dia da Mulher',
    tipo: 'ENTRADA',
    data: '2026-03-05',
    mes: 'Março',
    valor: 3200.00,
    transferencia: 'PIX',
    responsavel: 'Ana Paula (Presidente)',
    observacao: '80 convites vendidos a R$ 40,00'
  },
  {
    id: 14,
    movimento: 'Venda de Camisas Temáticas do Ministério',
    tipo: 'ENTRADA',
    data: '2026-03-08',
    mes: 'Março',
    valor: 1450.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Eventos)',
    observacao: 'Venda de 29 camisas'
  },
  {
    id: 15,
    movimento: 'Buffet e Coquetel Chá das Mulheres',
    tipo: 'SAIDA',
    data: '2026-03-07',
    mes: 'Março',
    valor: 1650.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Salgados finos, doces e sucos naturais'
  },
  {
    id: 16,
    movimento: 'Decoração e Flores Chá das Mulheres',
    tipo: 'SAIDA',
    data: '2026-03-07',
    mes: 'Março',
    valor: 450.00,
    transferencia: 'PIX',
    responsavel: 'Débora Lima (Decoração)',
    observacao: 'Painel fotográfico e arranjos de mesa'
  },
  {
    id: 17,
    movimento: 'Confecção das Camisas Temáticas',
    tipo: 'SAIDA',
    data: '2026-03-02',
    mes: 'Março',
    valor: 870.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Eventos)',
    observacao: 'Custo de confecção de 30 camisas'
  },
  {
    id: 18,
    movimento: 'Lembrancinhas Especiais Dia da Mulher',
    tipo: 'SAIDA',
    data: '2026-03-06',
    mes: 'Março',
    valor: 380.00,
    transferencia: 'PIX',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Kits com caneca e sachê aromatizador'
  },

  // ABRIL
  {
    id: 19,
    movimento: 'Cantina de Domingo - Torta Salgada',
    tipo: 'ENTRADA',
    data: '2026-04-12',
    mes: 'Abril',
    valor: 580.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Arrecadação cantina'
  },
  {
    id: 20,
    movimento: 'Oferta Culto de Mulheres',
    tipo: 'ENTRADA',
    data: '2026-04-19',
    mes: 'Abril',
    valor: 490.00,
    transferencia: 'PIX',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Culto mensal'
  },
  {
    id: 21,
    movimento: 'Ajuda de Custo Preletora Convidada',
    tipo: 'SAIDA',
    data: '2026-04-19',
    mes: 'Abril',
    valor: 300.00,
    transferencia: 'PIX',
    responsavel: 'Pastora Helena',
    observacao: 'Honorário preletora ministração'
  },
  {
    id: 22,
    movimento: 'Ornamentação Culto de Páscoa',
    tipo: 'SAIDA',
    data: '2026-04-04',
    mes: 'Abril',
    valor: 160.00,
    transferencia: 'Dinheiro (Espécie)',
    responsavel: 'Débora Lima (Decoração)',
    observacao: 'Flores brancas e tecidos'
  },

  // MAIO (Mês das Mães)
  {
    id: 23,
    movimento: 'Bazar Beneficente das Mães',
    tipo: 'ENTRADA',
    data: '2026-05-09',
    mes: 'Maio',
    valor: 2650.00,
    transferencia: 'PIX',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Roupas, sapatos e artesanatos doados'
  },
  {
    id: 24,
    movimento: 'Venda de Lembrancinhas para Mães',
    tipo: 'ENTRADA',
    data: '2026-05-10',
    mes: 'Maio',
    valor: 890.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Literatura)',
    observacao: 'Porta-joias e marcadores bíblicos'
  },
  {
    id: 25,
    movimento: 'Almoço Comemorativo das Mães (Sobremesas)',
    tipo: 'SAIDA',
    data: '2026-05-10',
    mes: 'Maio',
    valor: 520.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Tortas doces e sorvetes para todas as mães'
  },
  {
    id: 26,
    movimento: 'Custo Produção Lembrancinhas Dia das Mães',
    tipo: 'SAIDA',
    data: '2026-05-05',
    mes: 'Maio',
    valor: 340.00,
    transferencia: 'Cartão Débito',
    responsavel: 'Débora Lima (Decoração)',
    observacao: 'Material para 120 lembrancinhas'
  },

  // JUNHO
  {
    id: 27,
    movimento: 'Noite de Caldos & Canjica Solidária',
    tipo: 'ENTRADA',
    data: '2026-06-13',
    mes: 'Junho',
    valor: 1980.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Venda de caldos, milho verde e bolos'
  },
  {
    id: 28,
    movimento: 'Ingredientes para Noite de Caldos',
    tipo: 'SAIDA',
    data: '2026-06-12',
    mes: 'Junho',
    valor: 580.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Carnes, legumes, queijos e descartáveis'
  },
  {
    id: 29,
    movimento: 'Oferta SAF para Missões Nacionais',
    tipo: 'SAIDA',
    data: '2026-06-25',
    mes: 'Junho',
    valor: 400.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Envio para campo missionário no Sertão'
  },
  {
    id: 30,
    movimento: 'Oferta Culto de Mulheres',
    tipo: 'ENTRADA',
    data: '2026-06-21',
    mes: 'Junho',
    valor: 430.00,
    transferencia: 'PIX',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: 'Reunião mensal'
  },

  // JULHO
  {
    id: 31,
    movimento: 'Lote 1 Inscrições Retiro de Mulheres 2026',
    tipo: 'ENTRADA',
    data: '2026-07-10',
    mes: 'Julho',
    valor: 3600.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Eventos)',
    observacao: '18 inscrições primeiro lote a R$ 200,00'
  },
  {
    id: 32,
    movimento: 'Sinal Reserva Pousada do Retiro',
    tipo: 'SAIDA',
    data: '2026-07-12',
    mes: 'Julho',
    valor: 1500.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Entrada de 30% para reserva do local em Pipa'
  },
  {
    id: 33,
    movimento: 'Cantina de Domingo',
    tipo: 'ENTRADA',
    data: '2026-07-26',
    mes: 'Julho',
    valor: 620.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Pastéis e refrigerantes'
  },
  {
    id: 34,
    movimento: 'Ação Social - Kits de Higiene para Idosas',
    tipo: 'SAIDA',
    data: '2026-07-20',
    mes: 'Julho',
    valor: 350.00,
    transferencia: 'PIX',
    responsavel: 'Débora Lima (Ação Social)',
    observacao: 'Visita ao lar de idosos com doação'
  },

  // AGOSTO (Mês Vigente)
  {
    id: 35,
    movimento: 'Lote 2 Inscrições Retiro de Mulheres 2026',
    tipo: 'ENTRADA',
    data: '2026-08-02',
    mes: 'Agosto',
    valor: 4400.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Eventos)',
    observacao: '20 inscrições segundo lote a R$ 220,00'
  },
  {
    id: 36,
    movimento: 'Oferta Especial Culto de Mulheres de Agosto',
    tipo: 'ENTRADA',
    data: '2026-08-03',
    mes: 'Agosto',
    valor: 590.00,
    transferencia: 'PIX',
    responsavel: 'Ana Paula (Presidente)',
    observacao: 'Culto de gratidão e consagração'
  },
  {
    id: 37,
    movimento: 'Cantina de Domingo - Salgados e Bolos',
    tipo: 'ENTRADA',
    data: '2026-08-04',
    mes: 'Agosto',
    valor: 670.00,
    transferencia: 'PIX',
    responsavel: 'Rebeca Costa (Cantina)',
    observacao: 'Arrecadação total domingo'
  },
  {
    id: 38,
    movimento: 'Segunda Parcela Locação Pousada Retiro',
    tipo: 'SAIDA',
    data: '2026-08-03',
    mes: 'Agosto',
    valor: 1800.00,
    transferencia: 'Transferência Bancária',
    responsavel: 'Ana Paula (Presidente)',
    observacao: '2ª parcela contrato local'
  },
  {
    id: 39,
    movimento: 'Adiantamento Brindes e Crachás Retiro',
    tipo: 'SAIDA',
    data: '2026-08-04',
    mes: 'Agosto',
    valor: 420.00,
    transferencia: 'PIX',
    responsavel: 'Priscila Santos (Eventos)',
    observacao: 'Bolsas ecológicas e blocos de anotações'
  },
  {
    id: 40,
    movimento: 'Ornamentação Culto de Mulheres',
    tipo: 'SAIDA',
    data: '2026-08-02',
    mes: 'Agosto',
    valor: 140.00,
    transferencia: 'Dinheiro (Espécie)',
    responsavel: 'Débora Lima (Decoração)',
    observacao: 'Arranjos florais de mesa e púlpito'
  }
];

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];
