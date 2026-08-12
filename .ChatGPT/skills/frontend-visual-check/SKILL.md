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

Quando a versão publicada estiver disponível, o ChatGPT pode validar diretamente a página publicada em:

`https://warbookbr.github.io/Portugues-completo/`

Quando for mais conveniente testar antes da publicação, o ChatGPT pode renderizar uma cópia local dos arquivos do projeto com Playwright.

## Viewports recomendados

Validar pelo menos:

- Desktop: `1920x1080` ou `1440x900`;
- Tablet: largura aproximada de `768px`;
- Celular: largura aproximada de `390px`.

Não é necessário gerar screenshots de todos os tamanhos para cada pequena alteração. Use-os quando a mudança puder afetar layout ou responsividade.

## Regra de trabalho

Para mudanças visuais relevantes, não considerar o frontend concluído apenas porque o código parece correto. Sempre que possível, renderizar e inspecionar o resultado real.

## Limitações

Esta skill documenta um procedimento de trabalho do ChatGPT. A disponibilidade de Chromium, Playwright ou acesso à página publicada deve ser confirmada no ambiente atual antes do uso.

Ela não define nem presume capacidades do Codex.
