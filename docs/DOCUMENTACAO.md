# Documentação — NADA MELHOR

Guia de uso, manutenção e publicação da loja. Documentação baseada no código do commit `0824568`, revisada em 30/09/2026.

## 1. O que este projeto faz

O site apresenta a marca NADA MELHOR, a coleção DROP 1 e duas camisetas: marrom e clara. A compra começa no atendimento pelo WhatsApp ou Instagram.

- Site: [fernando-srs.github.io/nada-melhor](https://fernando-srs.github.io/nada-melhor/)
- Código: [Fernando-SRS/nada-melhor](https://github.com/Fernando-SRS/nada-melhor)
- Instagram: [@nadamelh0r](https://www.instagram.com/nadamelh0r/)
- WhatsApp configurado: `5571987878944`

Não há carrinho, checkout, cobrança, cadastro, painel administrativo, banco de dados nem controle automático de estoque. Preços, tamanhos, disponibilidade e entrega são confirmados no atendimento. Abrir o WhatsApp preenche uma mensagem; o visitante ainda precisa enviá-la.

## 2. Começar a trabalhar

### Abrir a pasta correta

No VS Code, use **Arquivo → Abrir Pasta** e selecione a pasta clonada `nada-melhor`. A pasta correta contém `README.md`, `dist` e a pasta oculta `.git`.

Há uma cópia original usada durante a criação e pode haver outras cópias clonadas. Editar uma delas não modifica automaticamente as demais. Trabalhe em uma pasta de cada vez e use Git para sincronizar as alterações.

### Visualizar no computador

Use um servidor HTTP local. Uma opção é a extensão **Live Server** do VS Code: abra `dist/index.html` e escolha **Open with Live Server**. Caso a extensão não esteja instalada, instale-a antes de usar essa opção.

Outra opção, se Python estiver instalado, é executar na raiz do projeto:

```powershell
python -m http.server 5500 --bind 127.0.0.1 --directory dist
```

Abra `http://127.0.0.1:5500/`. Para parar o servidor, pressione `Ctrl+C` no terminal.

**Não abra o HTML por duplo clique para testar o 3D.** O endereço `file://` pode bloquear a importação dos módulos JavaScript. Use `http://` ou `https://`.

Um endereço local já aberto, como `127.0.0.1:4317`, pode estar servindo outra cópia do projeto. Inicie a prévia a partir da pasta em que você está editando.

Não há `npm install` nem etapa de compilação. Node.js é útil para verificar JavaScript, mas não é necessário para servir os arquivos estáticos.

## 3. Organização dos arquivos

```text
nada-melhor/
├── README.md                      Apresentação e início rápido
├── docs/
│   └── DOCUMENTACAO.md             Este guia
├── .github/workflows/pages.yml     Publicação automática no GitHub Pages
├── .openai/hosting.json            Identificação da hospedagem original no Sites
├── .gitignore                     Arquivos excluídos do versionamento
└── dist/                          Conteúdo publicado na web
    ├── index.html                 Página, produtos e janela 3D
    ├── style.css                  Estilos e adaptação para celular
    ├── carousel.js                Carrossel automático
    ├── viewer-loader.js           Abertura e carregamento da janela 3D
    ├── shirt-3d.js                Modelo, materiais, estampas e interação 3D
    ├── assets/                    Fotos e logotipo
    └── vendor/
        ├── three.module.min.js    Three.js 0.170.0
        └── THREE-LICENSE.txt      Licença da biblioteca
```

Apesar do nome `dist`, esta pasta contém os arquivos que são editados diretamente. Ela não é recriada por um compilador. Não a apague supondo que seja descartável.

Os caminhos internos são relativos para que o site funcione no subdiretório `/nada-melhor/` do GitHub Pages. Prefira `assets/foto.jpg` a `/assets/foto.jpg`.

## 4. Seções da página

| Área | Identificador | Conteúdo |
| --- | --- | --- |
| Abertura | `#inicio` | Mensagem principal e carrossel do DROP 1 |
| Coleção | `#colecao` | Camisetas marrom e clara, botões 3D e pedido |
| Sobre nós | `#sobre-nos` | Texto fornecido do destaque da marca |
| Como pedir | `#pedido` | Escolha, atendimento e confirmação do pedido |
| Rodapé | — | Instagram, WhatsApp e retorno ao início |

A âncora antiga `#essencia` permanece na seção Sobre nós para manter links anteriores funcionando.

O visual usa carvão, azul claro, marrom e branco suave. Os títulos usam Manrope, os textos DM Sans e os destaques serifados Georgia. As duas primeiras fontes são carregadas do Google Fonts; existem fontes alternativas caso a conexão falhe.

## 5. Como editar o conteúdo

### Textos e produtos

Edite `dist/index.html`. Use a busca do VS Code para localizar uma frase que aparece na página, como `Camiseta marrom` ou `SOBRE NÓS`.

Preserve os `id`, as classes e os atributos `data-*` usados pelo JavaScript. Alterar apenas o texto é mais seguro do que remover a estrutura do elemento.

Os produtos são escritos diretamente no HTML: não existe cadastro central. Ao adicionar uma terceira peça, será necessário criar o cartão, seu link de atendimento e, se desejado, configurar seu modelo 3D. Os identificadores atuais do 3D são `data-shirt="brown"` e `data-shirt="blue"`; um identificador novo não cria um modelo automaticamente.

### Cores, fontes e espaçamento

Edite `dist/style.css`. As variáveis iniciais incluem:

| Variável | Cor | Uso principal |
| --- | --- | --- |
| `--ink` | `#232522` | Texto e superfícies escuras |
| `--paper` | `#f5f4ef` | Fundo claro |
| `--blue` | `#d5e5e9` | Faixas e seção de pedido |
| `--brown` | `#885333` | Detalhes e destaques |

Há regras adicionais no final do arquivo para carrossel, Sobre nós e janela 3D. Em CSS, regras posteriores podem substituir as anteriores. Confira a classe específica quando uma mudança na variável não afetar determinado componente.

### Fotos

Copie novas fotos para `dist/assets` e atualize o atributo `src` correspondente. Escreva também um `alt` que descreva a imagem.

| Arquivo | Uso atual |
| --- | --- |
| `marca.jpg` | Logotipo no cabeçalho |
| `campanha-marrom.jpg` | Cartão da camiseta marrom |
| `campanha-clara.jpg` | Cartão da camiseta clara |
| `encontro.jpg` | Imagem da seção Sobre nós |
| `drop-azul-costas.jpg` | Carrossel e referência da estampa traseira clara |
| `drop-detalhe-marrom.jpg` | Carrossel e referência da estampa frontal marrom |
| `drop-azul-frente.jpg` | Carrossel e referência da estampa frontal clara |
| `drop-caminho.jpg` | Carrossel |
| `drop-marrom-costas.jpg` | Carrossel e referência da estampa traseira marrom |

**Atenção às imagens usadas no 3D:** a posição da estampa é calculada com coordenadas específicas das fotos atuais, de referência 640 × 1137 pixels. Substituí-las por imagens com outro enquadramento exige revisar `box` em `shirt-3d.js`, mesmo quando o nome do arquivo não muda.

### WhatsApp e Instagram

Busque por `wa.me/5571987878944` e `instagram.com/nadamelh0r` no HTML. Há links no cabeçalho, nos produtos, nas seções e no rodapé.

O formato do link de pedido é:

```text
https://wa.me/NUMERO?text=MENSAGEM_CODIFICADA
```

O número contém país e DDD, sem espaços ou pontuação. Para criar o parâmetro de mensagem em JavaScript, use `encodeURIComponent('Olá! Tenho interesse na camiseta marrom.')`. Atualize todos os locais relevantes ao trocar o contato.

## 6. Carrossel

O HTML define as cinco imagens em `.slide`; `carousel.js` controla sua exibição.

- Troca automática a cada **5 segundos** (`5000` milissegundos).
- Não há botão de pausa ou reprodução.
- Computador: setas laterais e teclas esquerda/direita quando o foco está dentro do carrossel.
- Dispositivo com toque: deslize horizontal de mais de 50 pixels. A distância horizontal deve superar a vertical, para preservar a rolagem da página.
- Cada troca manual reinicia a contagem de cinco segundos; o modo automático continua.
- O temporizador é suspenso enquanto a aba está oculta e retomado ao voltar.
- A preferência de movimento reduzido remove transições CSS, mas não desativa a troca automática, conforme o comportamento solicitado.

Para mudar o intervalo, altere `5000` em `carousel.js`. Para adicionar uma foto, copie um bloco `.slide` em `index.html`, altere a imagem e atualize os rótulos `aria-label="N de TOTAL"`. O contador visual usa a quantidade de slides encontrada no HTML.

As setas são ocultadas em dispositivos identificados pelo CSS como toque com ponteiro impreciso. A foto usada no cartão marrom não está repetida no carrossel.

## 7. Visualização 3D

### Experiência do visitante

O botão **Ver em 3D**, acima de **Quero essa peça**, abre um `<dialog>` sobre a página. Não abre uma nova aba nem navega para outro endereço.

- Arrastar: gira o modelo para os lados e inclina verticalmente, dentro dos limites configurados.
- Roda do mouse ou pinça com dois dedos: aumenta ou diminui o zoom.
- Botões: giro, zoom, restaurar, frente e costas.
- Teclado com foco na área do modelo: setas esquerda/direita, `+` e `-`.
- Fechar: botão ×, tecla Esc do diálogo nativo ou clique fora da janela.

Ao fechar, a renderização é suspensa e o foco volta ao botão que abriu o visualizador. O carregamento possui mensagem de espera e tratamento de falha.

### Como foi construído

`viewer-loader.js` gerencia a janela e importa `shirt-3d.js` somente quando necessário. O módulo usa a cópia local do Three.js, sem depender de um CDN para carregar a biblioteca.

O modelo é criado por código; não existe um arquivo `.glb` ou `.gltf`. As funções `surface`, `top`, `bottom` e `grid` definem os painéis, o contorno e as dobras. Há costuras, gola e uma textura procedural de tecido. A iluminação usa fontes suaves de preenchimento e luz direcional.

`setColor()` aplica a cor da peça e seleciona as referências fotográficas. `decal()` posiciona as estampas sobre a superfície, recortando a região da foto por coordenadas UV e reduzindo a presença da cor do tecido com um shader. A frente da marrom é girada porque a peça estava invertida na foto original.

| Parâmetro em `decal()` | Significado |
| --- | --- |
| `file` | Foto de origem |
| `box` | Recorte `[x, y, largura, altura]` na foto de referência |
| `width`, `height` | Tamanho da estampa no modelo |
| `x`, `y` | Posição da estampa no modelo |
| `back` | Aplicação nas costas |
| `rotate` | Inversão da orientação da referência |

O tamanho do renderizador acompanha a janela. A densidade de pixels é limitada a 2 para reduzir custo em telas de alta resolução. As texturas carregadas são mantidas em memória para reutilização durante a sessão.

### Limites de fidelidade

O resultado é uma **reconstrução visual aproximada**, não um escaneamento, uma simulação física de tecido ou um molde de produção. As estampas vêm das fotos, mas sua nitidez, perspectiva e remoção do fundo são limitadas pelas referências. Medidas, cor e caimento não devem ser tratados como especificações do produto.

Para maior precisão, seriam necessários arquivos originais das artes, medidas da peça e um modelo 3D validado. Substituir fotografias ou mudar o recorte pode exigir novos ajustes do shader e da posição das estampas.

## 8. Git e publicação

### Fluxo recomendado

No terminal aberto na pasta do projeto:

```powershell
git status
git pull --ff-only
```

Faça o `pull` antes de começar, preferencialmente com a pasta sem alterações pendentes. Se houver mudanças locais ou conflito, preserve-as e resolva a situação antes de continuar; não use comandos de descarte para forçar a atualização.

Depois de editar e testar:

```powershell
git diff
git add dist/index.html dist/style.css
git commit -m "Descreve a alteração realizada"
git push origin main
```

O exemplo adiciona apenas HTML e CSS. Inclua os outros arquivos que você realmente modificou. O `commit` registra as alterações localmente; o `push` as envia ao GitHub.

**Preferência do responsável:** o assistente deve pedir aprovação antes de enviar novas alterações ao GitHub. Uma solicitação explícita para enviar a versão atual é a aprovação dessa versão, não de futuras alterações.

### Como funciona o Pages

Em **Settings → Pages**, a origem é **GitHub Actions**. O arquivo `.github/workflows/pages.yml` é executado em cada push na branch `main`, ou manualmente pela aba Actions.

O fluxo:

1. Obtém os arquivos do repositório.
2. Configura a publicação do Pages.
3. Confere a existência de `dist/index.html` e `dist/shirt-3d.js`.
4. Envia somente o conteúdo de `dist` como artefato.
5. Publica o site no endereço do Pages.

Não há build de aplicação. O workflow só valida os dois arquivos indicados; isso não substitui testes de navegação, imagens e interação.

O problema anterior do README ocorreu porque o Pages publicava a raiz do repositório. Como o HTML estava dentro de `dist`, ele não era usado como página inicial. A publicação da pasta correta resolveu o problema sem mover os arquivos.

Os arquivos `README.md`, `docs` e `.openai` ficam fora do conteúdo servido pelo Pages. Como o gatilho é qualquer push em `main`, mudanças apenas na documentação também executam a publicação, mas não alteram a interface se `dist` não tiver mudado.

A hospedagem antiga no Sites, identificada por `.openai/hosting.json`, é independente. O workflow do GitHub não a atualiza. Use o endereço do GitHub Pages para acompanhar esta versão.

### Voltar uma alteração publicada

Para desfazer um commit preservando o histórico, use `git revert HASH_DO_COMMIT`, revise o resultado, teste e envie o novo commit quando aprovado. Não é necessário apagar o histórico nem usar `push --force`.

## 9. Conferência antes de enviar

- Abrir a prévia por HTTP e testar também em uma largura de celular.
- Conferir textos, fotos, links de seção e pedidos das duas peças.
- Observar a troca automática do carrossel e a continuidade após setas/deslizes.
- Abrir e fechar o 3D das duas camisas; verificar frente, costas, giro e zoom.
- Testar teclado, Esc e retorno do foco ao botão de abertura.
- Verificar o console do navegador e a aba Network para arquivos ausentes.
- Revisar `git diff` e não incluir arquivos pessoais, senhas ou credenciais.
- Após o push, conferir o resultado de **Publish storefront** em **Actions** e abrir o site publicado.

Se Node.js estiver instalado, estas verificações de sintaxe podem ser executadas no PowerShell:

```powershell
node --check dist/carousel.js
node --check dist/viewer-loader.js
Get-Content dist/shirt-3d.js -Raw | node --input-type=module --check
git diff --check
```

Esses comandos não validam o resultado visual nem o funcionamento do WebGL. O repositório não possui uma suíte de testes automatizados de navegador.

## 10. Solução de problemas

| Sintoma | O que conferir |
| --- | --- |
| O Pages mostra o README | Origem GitHub Actions e `path: dist` no workflow |
| Alterações não aparecem | Arquivo salvo, pasta correta, push realizado e execução Actions concluída; depois atualize com `Ctrl+F5` |
| Prévia local difere do GitHub | São versões ou cópias diferentes; confira `git status`, `git log -1` e o servidor local |
| Foto funciona no Windows, mas não no Pages | Maiúsculas/minúsculas do nome, caminho relativo e arquivo incluído no commit |
| O 3D não carrega | Usar HTTP, navegador com WebGL e arquivos `shirt-3d.js`, `viewer-loader.js`, `vendor` e `assets` disponíveis |
| Erro de MIME ao importar o 3D | Servidor deve entregar `.js` como JavaScript, não como HTML ou arquivo genérico |
| Estampa cortada ou fora do lugar | Foto original foi substituída ou coordenadas `box` e dimensões não correspondem |
| Modelo pesado no celular | Rever densidade da malha, tamanho das texturas e resolução; não remover a suspensão ao fechar |
| WhatsApp abre conversa errada | Conferir todas as ocorrências do número e a mensagem no HTML |
| `git push` é rejeitado | Buscar alterações remotas e reconciliar; não forçar o envio |

## 11. Dependências e conteúdo

- HTML, CSS e JavaScript executados no navegador.
- Three.js 0.170.0, distribuído localmente sob licença MIT preservada em `dist/vendor/THREE-LICENSE.txt`.
- Google Fonts para DM Sans e Manrope.
- GitHub Actions/Pages para publicação.
- WhatsApp e Instagram como destinos externos de contato.

As fotos, estampas, logotipo e texto institucional pertencem ao conteúdo da marca fornecido ou referenciado para este projeto. A licença do Three.js não concede direitos sobre esses materiais. Não há rastreador de análise, formulário próprio de coleta de dados ou armazenamento de pedidos implementado no código atual; fontes e links externos seguem o funcionamento dos respectivos serviços.

Ao alterar funcionalidades, atualize esta documentação e o README junto com o código.
