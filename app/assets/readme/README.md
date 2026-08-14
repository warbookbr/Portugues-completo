# Mecanismo visual do README

Este diretório concentra os recursos visuais usados para estilizar o `README.md` principal do repositório sem transformar o próprio README em um arquivo grande e difícil de manter.

Atualmente, o mecanismo funciona assim:

```text
README.md
   └── exibe e envolve em um link
       └── app/assets/readme/portugues-completo-banner.svg
           ├── layout
           ├── textos
           ├── cores e gradientes
           ├── partículas
           ├── brilhos e feixes
           └── animações CSS
```

## 1. O que fica no README principal

O `README.md` deve cuidar apenas da estrutura externa: posicionamento do banner, tamanho, texto alternativo e destino do clique.

Exemplo usado neste projeto:

```html
<p align="center">
  <a href="https://warbookbr.github.io/Portugues-completo/">
    <img
      src="app/assets/readme/portugues-completo-banner.svg"
      alt="Português Completo — abrir aplicativo"
      width="100%"
    >
  </a>
</p>
```

O link fica no README, e não dentro do SVG. Assim, o banner inteiro funciona como uma área clicável e a navegação não depende de comportamento interativo interno do SVG.

## 2. O que fica no SVG

O arquivo `portugues-completo-banner.svg` contém praticamente toda a apresentação visual do cabeçalho:

- fundo;
- título e subtítulo;
- CTA visual;
- partículas;
- halos e brilhos;
- gradientes;
- feixes decorativos;
- animações com `@keyframes`;
- regra de `prefers-reduced-motion` para acessibilidade.

Como SVG é um formato vetorial baseado em texto, ele permite editar visual e animação diretamente no código, continua nítido em diferentes resoluções e evita depender de um arquivo GIF pesado.

## 3. Por que usar SVG animado

Para este projeto, o SVG foi escolhido porque oferece algumas vantagens práticas:

- permanece leve;
- escala sem perder qualidade;
- aceita gradientes, filtros, formas e texto;
- permite animações CSS sem JavaScript;
- pode ser versionado e revisado como código;
- é mais fácil de modificar por IA ou por uma pessoa do que uma animação rasterizada pronta.

O GitHub não transforma o README em uma página web livre. Não se deve contar com JavaScript próprio, CSS externo ou um sistema completo de componentes dentro do README. O padrão adotado aqui contorna essa limitação deixando a parte visual sofisticada encapsulada em uma imagem SVG.

## 4. Como replicar em outro repositório

Uma forma simples é copiar este diretório ou usar apenas o SVG como base.

### Passo 1 — criar um diretório para os assets

Exemplo:

```text
app/assets/readme/
```

Ou, em outro projeto:

```text
assets/readme/
```

Não existe obrigação de usar exatamente este caminho. O importante é manter os arquivos do README separados dos assets de produção da aplicação quando isso fizer sentido.

### Passo 2 — criar ou copiar o SVG

Exemplo:

```text
assets/readme/banner.svg
```

Edite dentro dele:

- nome do projeto;
- subtítulo;
- texto do CTA;
- paleta;
- tamanho;
- quantidade de partículas;
- intensidade de glow;
- velocidades de animação.

### Passo 3 — referenciar o SVG no README

```html
<p align="center">
  <a href="URL_DO_PROJETO">
    <img src="assets/readme/banner.svg" alt="Descrição do projeto" width="100%">
  </a>
</p>
```

### Passo 4 — evitar duplicação visual

Se o banner já contém:

- o nome do projeto;
- uma chamada para ação;
- a identidade visual principal;

normalmente não é necessário repetir imediatamente abaixo um `# Título` ou outro botão equivalente.

O README pode começar direto pelo conteúdo seguinte.

## 5. Onde customizar o banner atual

No `portugues-completo-banner.svg`, os principais pontos de ajuste são:

### Cores

Procure por gradientes e valores hexadecimais, por exemplo:

```svg
<linearGradient id="bg">...</linearGradient>
<linearGradient id="button">...</linearGradient>
```

Também é possível alterar cores diretamente nas classes CSS:

```css
.particleCore { fill: #4dff9a; }
.particleHalo { fill: #22dc67; }
```

### Quantidade de partículas

Cada partícula é representada por elementos como:

```svg
<g class="p1">
  <circle class="particleHalo" ... />
  <circle class="particleCore" ... />
</g>
```

Duplicar um grupo e mudar `cx`/`cy` adiciona uma nova partícula.

### Movimento

As distâncias de movimento ficam nos `@keyframes`:

```css
@keyframes drift-a {
  to { transform: translate(34px, -18px); }
}
```

Valores maiores deixam a animação mais perceptível. Valores menores deixam o movimento mais sutil.

### Velocidade

A duração está na propriedade `animation`:

```css
.p1 { animation: drift-a 4.8s ease-in-out infinite alternate; }
```

- duração menor → movimento mais rápido;
- duração maior → movimento mais lento.

É melhor variar levemente os tempos entre as partículas para evitar que todas se movam em sincronia.

### Brilho

Os filtros são controlados por `feGaussianBlur` e pela opacidade dos elementos de glow:

```svg
<feGaussianBlur stdDeviation="14" />
```

Aumentar demais o blur ou a quantidade de halos pode deixar o banner visualmente pesado e reduzir contraste do texto.

### Texto

O título, subtítulo e CTA são elementos `<text>` normais do SVG.

Isso permite trocar o conteúdo sem gerar outra imagem.

## 6. Até onde dá para customizar

Com esse padrão é possível criar, por exemplo:

- partículas;
- estrelas;
- linhas de energia;
- gradientes animados;
- pulsos de luz;
- brilho em botões;
- ondas e curvas em movimento;
- logos vetoriais;
- pequenos ícones;
- indicadores visuais;
- temas claro/escuro específicos do próprio banner;
- cabeçalhos diferentes para cada repositório.

O ideal é usar o SVG como uma peça visual, e não tentar transformar o README em uma aplicação completa.

## 7. Limitações importantes

O README do GitHub não deve ser tratado como uma página HTML comum.

Evite depender de:

- JavaScript;
- folhas de estilo externas para controlar o README;
- CSS arbitrário aplicado à página do GitHub;
- eventos de mouse complexos;
- componentes que dependam da aplicação principal;
- animações que sejam essenciais para transmitir informação.

O conteúdo importante precisa continuar compreensível mesmo se a animação não rodar.

## 8. Acessibilidade

O banner deve manter:

- `alt` descritivo no `<img>` do README;
- `<title>` e `<desc>` no SVG;
- contraste suficiente entre texto e fundo;
- CTA compreensível mesmo sem animação;
- suporte a `prefers-reduced-motion`.

Exemplo:

```css
@media (prefers-reduced-motion: reduce) {
  .particleCore,
  .particleHalo,
  .beam,
  .pulse {
    animation: none !important;
  }
}
```

## 9. Performance

Prefira:

- poucos filtros de blur grandes;
- quantidade moderada de partículas;
- movimentos baseados em `transform` e `opacity`;
- SVG vetorial em vez de GIF de alta resolução quando a animação puder ser construída dessa forma.

O objetivo é melhorar a apresentação do repositório sem tornar o README pesado.

## 10. Checklist para reutilização

Antes de publicar um banner semelhante em outro repositório, conferir:

- [ ] nome do projeto correto;
- [ ] subtítulo correto;
- [ ] URL do `<a>` correta;
- [ ] `alt` correto;
- [ ] caminho do SVG correto;
- [ ] nenhuma informação duplicada logo abaixo do banner;
- [ ] contraste adequado;
- [ ] animação perceptível, mas não excessiva;
- [ ] comportamento aceitável sem animação;
- [ ] `prefers-reduced-motion` preservado;
- [ ] README continua simples de ler e manter.

## 11. Regra de manutenção deste projeto

Neste repositório, a divisão preferida é:

```text
README.md
→ estrutura, link e conteúdo textual do repositório

app/assets/readme/
→ recursos visuais específicos da apresentação do README

portugues-completo-banner.svg
→ implementação visual e animação do cabeçalho
```

Se o banner precisar mudar, preferir alterar o SVG. Alterar o `README.md` apenas quando a estrutura, o link, o posicionamento ou o conteúdo textual externo também precisarem mudar.
