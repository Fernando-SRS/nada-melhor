# NADA MELHOR

Site da marca NADA MELHOR, com apresentação do DROP 1 e pedidos pelo WhatsApp e Instagram.

## Documentação

Consulte o [guia completo do projeto](docs/DOCUMENTACAO.md) para editar a página, testar localmente, entender o carrossel e o 3D, publicar e solucionar problemas.

## Estrutura

- `dist/index.html`: conteúdo e links de atendimento.
- `dist/style.css`: identidade visual e layout responsivo.
- `dist/assets/`: fotografias da campanha e logotipo.
- `.openai/hosting.json`: identificação da hospedagem no Sites; não contém credenciais.

## Visualizar e editar

O projeto usa HTML, CSS e JavaScript estáticos, sem etapa de compilação. Sirva a pasta `dist` com um servidor HTTP local (por exemplo, a extensão Live Server do VS Code). A visualização 3D usa módulos JavaScript e precisa de HTTP, não de abertura por `file://`. As fontes são carregadas pelo Google Fonts, com fontes alternativas disponíveis.

Edite o HTML para atualizar textos, nomes das peças e links. Os pedidos são encaminhados para o WhatsApp público da marca, com mensagem preenchida; o visitante confirma o envio no aplicativo. Não há checkout, processamento de pagamentos ou armazenamento de pedidos no site.

Preços, tamanhos e disponibilidade estão sob consulta. As fotos e o logotipo vieram do perfil público da marca; não há licença de redistribuição concedida por este repositório.

## Hospedagem

Versão inicial: https://nada-melhor-drop.fernando-bk77.chatgpt.site

GitHub Pages: https://fernando-srs.github.io/nada-melhor/

O workflow `.github/workflows/pages.yml` publica somente a pasta `dist` a cada push na branch `main`. Em Settings → Pages, a origem deve ser GitHub Actions. O README e os arquivos de configuração ficam fora do conteúdo publicado. A hospedagem original no Sites continua separada e não é atualizada pelo workflow do GitHub.

## Visualização 3D

Os botões Ver em 3D abrem uma janela na própria página, com giro, zoom, pinça e vistas de frente e costas. A reconstrução usa superfícies de tecido e as fotografias do DROP 1 como textura para as estampas. Não é um escaneamento nem um molde industrial: proporções, caimento e cores são aproximados. O carregamento do Three.js é feito somente quando o visitante abre o visualizador.

`dist/vendor/three.module.min.js` contém Three.js 0.170.0; a licença MIT está em `dist/vendor/THREE-LICENSE.txt`.
