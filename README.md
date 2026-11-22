# Chronopolis — reconstrução v0.2 (pré-publicação)

Este ramo contém uma proposta de reconstrução do **Chronopolis**, arquivo de fã sobre *Chrono Trigger*. O site original foi produzido em 2022–2023 e permanece acessível pelo histórico do Git.

## O que foi preservado
- 24 páginas internas: textos, índices, personagens, história e páginas de arquivo, incorporados nos arquivos `assets/archive-part*.js`.
- Todo o texto histórico continua no repositório desta proposta, sem depender de acesso ao `raw.githubusercontent.com` no momento da leitura.
- Os 25 HTML antigos permanecem no Git (este ramo só substitui a página inicial `index.html`).
- Links históricos de origem são exibidos nas matérias, e arquivos incorporados indicam a procedência.

**Atenção:** imagens, vídeos e arquivos vinculados originalmente a serviços externos **não foram copiados**. Alguns podem estar indisponíveis ou exigir revisão de direitos e fontes. Os links originais também não foram validados individualmente.

## Como visualizar
O site funciona como arquivos estáticos HTML/CSS/JS. Para uma prévia, abra `index.html` no navegador. Na prévia local, publicações novas da coleção Jekyll não aparecem até a compilação com Jekyll, mas os textos históricos são legíveis sem internet. As imagens externas continuam dependendo da internet.

## Como publicar novos artigos
1. Após aprovar e mesclar esta proposta na branch publicada do GitHub Pages, abra https://pagescms.org/ .
2. Faça login com GitHub e escolha o repositório `joesouzah/Chronopolis`.
3. Em **Publicações**, clique em **New**; preencha título, data, categoria, resumo, corpo e capa (opcional).
4. Salve/publice no ramo configurado no Pages CMS. O GitHub Pages, **se estiver configurado para compilar Jekyll nesse ramo**, construirá `/artigos/<slug>/` e atualizará `artigos.json`.
5. Consulte o site para verificar o novo conteúdo.

A integração com o Pages CMS requer autorização do GitHub pelo proprietário. Não é um editor hospedado no próprio site. O site permanece gratuito em GitHub Pages para repositório público, sujeito às políticas do serviço.

## Estrutura
- `index.html`: portal e navegação
- `assets/catalog.js`: metadados de cartões históricos
- `assets/archive-part1.js` a `archive-part3.js`: textos HTML históricos incorporados
- `assets/app.js`: catálogo, pesquisa e leitor (com sanitização do HTML legado)
- `_artigos/`: novos conteúdos Markdown, editáveis via Pages CMS
- `_layouts/artigo.html`: modelo Jekyll para novas postagens
- `.pages.yml`: configuração do editor
- `MIGRACAO.md`: inventário de preservação e limitações

## Situação
Versão de revisão: esta proposta não deve substituir a publicação atual sem conferir o visual e os links. O objetivo é preservar o Chronopolis ao longo do tempo, em vez de tratar a criação de 2022 apenas como trabalho de curso.
