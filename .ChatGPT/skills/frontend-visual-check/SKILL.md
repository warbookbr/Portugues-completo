# Skill: Frontend Visual Check

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando neste repositório e neste tipo de ambiente. **Não é uma instrução para Codex** e não deve ser interpretada como documentação sobre como o Codex funciona.

## Objetivo

Permitir que o ChatGPT valide visualmente o frontend do projeto `Portugues-completo` durante o desenvolvimento, em vez de depender apenas da leitura de HTML, CSS e JavaScript.

## Ambiente esperado

O ambiente do ChatGPT pode disponibilizar:

- Chromium em modo headless;
- Playwright para automação do navegador;
- geração de screenshots;
- inspeção visual das imagens renderizadas.

Quando essas ferramentas estiverem disponíveis, o ChatGPT deve preferir validar visualmente mudanças relevantes de interface.

## Fluxo recomendado

1. Ler ou alterar os arquivos do frontend.
2. Renderizar a interface em Chromium usando Playwright.
3. Gerar um screenshot da página ou do estado relevante.
4. Inspecionar visualmente o resultado.
5. Verificar problemas como:
   - alinhamento;
   - espaçamento;
   - tipografia;
   - responsividade;
   - overflow;
   - elementos cortados;
   - contraste;
   - estados de botões e componentes;
   - comportamento visual em diferentes larguras de tela.
6. Corrigir o código quando necessário.
7. Repetir a renderização até que o resultado esteja coerente.

## GitHub Pages

A URL pública do projeto é:

`https://warbookbr.github.io/Portugues-completo/`

Quando o ambiente do ChatGPT permitir acesso externo normal, o ChatGPT pode abrir essa URL diretamente no Chromium com Playwright e validar a versão publicada.

### Limitação de rede observada

Neste ambiente do ChatGPT já foi observado que o Chromium/Playwright pode funcionar normalmente para renderização, mas o processo local do navegador pode ficar sem resolução DNS ou acesso externo ao domínio `warbookbr.github.io`.

Portanto, **não assumir que falha ao abrir a URL pública significa falha do frontend ou do GitHub Pages**.

Quando o acesso direto ao domínio público estiver bloqueado, usar este procedimento:

1. buscar no GitHub o HTML/CSS/JavaScript real da branch `main`;
2. renderizar esse conteúdo com Chromium + Playwright;
3. gerar e inspecionar screenshots normalmente;
4. verificar separadamente, pela API do GitHub, se o GitHub Pages está configurado para `main:/` e se o status da publicação está `built`;
5. deixar claro ao usuário que a inspeção visual foi feita sobre o conteúdo real da `main`, enquanto a publicação foi confirmada separadamente pelo GitHub.

Isso é uma validação em duas partes:

```text
Código real da main -> Chromium/Playwright -> screenshot e inspeção visual

GitHub Pages API -> status built -> confirmação de publicação
```

Quando o acesso de rede do Chromium estiver disponível, preferir a validação ponta a ponta abrindo diretamente a URL pública.

## Teste local antes da publicação

Quando for mais conveniente testar antes da publicação, o ChatGPT pode renderizar os próprios arquivos do projeto com Playwright.

Se o ambiente bloquear navegação `file://`, carregar o HTML por outro método compatível, como conteúdo injetado diretamente na página ou servidor HTTP local, em vez de interpretar esse bloqueio como falha do Playwright.

## Viewports recomendados

Validar pelo menos:

- Desktop: `1920x1080` ou `1440x900`;
- Tablet: largura aproximada de `768px`;
- Celular: largura aproximada de `390px`.

Não é necessário gerar screenshots de todos os tamanhos para cada pequena alteração. Use-os quando a mudança puder afetar layout ou responsividade.

## Regra de trabalho

Para mudanças visuais relevantes, não considerar o frontend concluído apenas porque o código parece correto. Sempre que possível, renderizar e inspecionar o resultado real.

Nunca afirmar que a URL pública foi aberta diretamente pelo Chromium quando isso não aconteceu. Distinguir claramente entre:

- renderização local do conteúdo real do repositório;
- confirmação de publicação pelo GitHub;
- navegação direta no site público.

## Limitações

Esta skill documenta um procedimento de trabalho do ChatGPT. A disponibilidade de Chromium, Playwright, DNS, acesso externo e acesso à página publicada deve ser confirmada no ambiente atual antes do uso.

Ela não define nem presume capacidades do Codex.
