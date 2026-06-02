# A'Veloz Performance Hub

## 📊 Conferir o Projeto ao vivo
https://allandevindie.github.io/aveloz-performance/

## 📊 Sistema de Ranking de Vendedores

Um sistema web moderno para gerenciar e visualizar o ranking mensal de vendedores da A'Veloz Têxtil, com integração automática ao Google Sheets.

### 🎯 Funcionalidades

- **Pódio Visual:** Visualização em tempo real do ranking mensal com design profissional
- **Ranking Geral:** Pontuação acumulada de todos os meses (1º=10pts, 2º=8pts, 3º=6pts, 4º=4pts, 5º=2pts)
- **Destaques Especiais:** Prêmios para "Mais Novos Clientes" e "Reativação de Clientes"
- **Histórico Completo:** Consulte rankings de meses anteriores
- **Atualização Automática:** Dados sincronizados em tempo real com a planilha do Google Sheets

---

## 🛠️ Configuração da Planilha Google Sheets

### Estrutura das Colunas

Crie uma planilha com as seguintes colunas:

| Coluna | Nome | Tipo | Exemplo |
|--------|------|------|---------|
| A | Mes | Texto | janeiro, fevereiro, marco, abril... |
| B | Vendedor | Texto | Marcos, Junior, Regis, Thiago, Allef |
| C | Posicao | Número | 1, 2, 3, 4, 5 |
| D | Faturamento | Texto | R$ 15.000,00 |
| E | Destaque_Novos | Sim/Não | sim ou nao |
| F | Destaque_Reativacao | Sim/Não | sim ou nao |

### Exemplo de Dados

```
Mes,Vendedor,Posicao,Faturamento,Destaque_Novos,Destaque_Reativacao
janeiro,Junior,1,R$ 25.000,sim,nao
janeiro,Marcos,2,R$ 20.000,nao,sim
janeiro,Thiago,3,R$ 18.000,nao,nao
janeiro,Allef,4,R$ 15.000,nao,nao
janeiro,Regis,5,R$ 12.000,nao,nao
fevereiro,Marcos,1,R$ 22.000,nao,nao
fevereiro,Junior,2,R$ 21.000,nao,nao
```

### Como Publicar a Planilha

1. Abra sua planilha no Google Sheets
2. Clique em **Arquivo > Compartilhar > Publicar na Web**
3. Mude de "Página da Web" para **Valores separados por vírgulas (.csv)**
4. Clique em **Publicar**
5. Copie o link gerado (deve terminar com `output=csv`)

---

## 🔗 Conectando ao Site

1. Abra o arquivo `js/performance.js`
2. Procure pela linha: `const SHEET_URL = 'COLE_SEU_LINK_CSV_AQUI';`
3. Substitua `'COLE_SEU_LINK_CSV_AQUI'` pelo link que você copiou
4. Salve o arquivo

**Exemplo:**
```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNIKV5qC2ng7Kb34hKF46UHIXDsIvYdcUMAIDnYlex_rSEki8FLSmRzRDrNv1atUyk8cEzZPrzIA2l/pub?output=csv';
```

---

## 📋 Boas Práticas

### ✅ Faça

- Use nomes de mês em **minúsculas** (janeiro, fevereiro, marco, etc.)
- Escreva "sim" ou "nao" (sem acento) nos campos de destaque
- Mantenha a ordem das colunas conforme especificado
- Atualize a planilha regularmente para que o site sempre mostre dados atuais

### ❌ Evite

- Deixar células em branco (use "N/A" se necessário)
- Usar caracteres especiais nos nomes dos vendedores
- Mudar a ordem das colunas sem atualizar o código
- Adicionar colunas no meio (sempre adicione no final)

---

## 🎨 Personalizações

### Alterar Cores

Abra `css/style.css` e procure por:
```css
:root {
    --primary: #E3C053;      /* Amarelo da A'Veloz */
    --dark: #000000;         /* Preto */
    --white: #FFFFFF;        /* Branco */
}
```

### Alterar Tabela de Pontos

Abra `js/performance.js` e procure por:
```javascript
const TABELA_PONTOS = {
    1: 10,  // 1º lugar = 10 pontos
    2: 8,   // 2º lugar = 8 pontos
    3: 6,   // 3º lugar = 6 pontos
    4: 4,   // 4º lugar = 4 pontos
    5: 2    // 5º lugar = 2 pontos
};
```

---

## 📱 Responsividade

O site funciona perfeitamente em:
- 💻 Computadores
- 📱 Tablets
- 📲 Celulares

---

## 🚀 Deploy

Para colocar o site no ar:

1. Crie um novo repositório no GitHub chamado `aveloz-performance`
2. Suba todos os arquivos
3. Vá em **Settings > Pages** e ative o GitHub Pages
4. Seu site estará disponível em: `https://seu-usuario.github.io/aveloz-performance`

---

## 📞 Suporte

Para dúvidas sobre a integração ou personalização, consulte o desenvolvedor.

---

**Desenvolvido por:** DEV ALBK  
**Última atualização:** Junho 2026  
**Versão:** 1.0
