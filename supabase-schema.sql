-- ═══════════════════════════════════════════════════════
-- NexIA Partners — Schema SQL para Supabase
-- Executar no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════

-- Tabela de parceiros
CREATE TABLE IF NOT EXISTS parceiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  empresa TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela principal de oportunidades
CREATE TABLE IF NOT EXISTS oportunidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parceiro_id UUID REFERENCES parceiros(id) ON DELETE SET NULL,
  parceiro_nome TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  orgao_empresa TEXT NOT NULL,
  solucao_especifica TEXT,
  registrado_por TEXT NOT NULL,
  registrado_por_id UUID,
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  data_validade DATE NOT NULL,
  status TEXT GENERATED ALWAYS AS (
    CASE
      WHEN data_validade < CURRENT_DATE THEN 'expirado'
      WHEN data_validade <= CURRENT_DATE + INTERVAL '15 days' THEN 'vencendo'
      ELSE 'ativo'
    END
  ) STORED,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados podem gerenciar oportunidades" ON oportunidades
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem gerenciar parceiros" ON parceiros
  FOR ALL USING (auth.role() = 'authenticated');

-- Índices
CREATE INDEX IF NOT EXISTS idx_oportunidades_parceiro ON oportunidades(parceiro_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_status ON oportunidades(status);
CREATE INDEX IF NOT EXISTS idx_oportunidades_validade ON oportunidades(data_validade);
