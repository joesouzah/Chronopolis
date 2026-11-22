import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(path, 'utf8');
const source = read('index.html');
const sandbox = {window: {}};
const scripts = [
  'assets/catalog.js',
  'assets/archive-part1.js',
  'assets/archive-part2.js',
  'assets/archive-part3.js'
];
for (const path of scripts) {
  assert(fs.existsSync(path), 'Arquivo ausente: ' + path);
  vm.runInNewContext(read(path), sandbox, {filename: path, timeout: 1000});
  assert(source.includes('src="' + path + '"'), 'Script não ligado ao portal: ' + path);
}
const articles = sandbox.window.CHRONO_LEGACY;
const archive = sandbox.window.CHRONO_ARCHIVE;
assert(Array.isArray(articles), 'Catálogo inexistente');
assert.equal(articles.length, 24, 'Catálogo histórico incompleto');
assert.equal(Object.keys(archive).length, 24, 'Importação de páginas incompleta');
for (const item of articles) {
  const file = item.id + '.html';
  assert(fs.existsSync(file), 'HTML histórico desapareceu: ' + file);
  assert(archive[item.id], 'Sem conteúdo incorporado: ' + item.id);
  assert(archive[item.id].body.trim().length > 100, 'Conteúdo vazio: ' + item.id);
  assert.equal(archive[item.id].source, file, 'Proveniência inconsistente: ' + item.id);
}
assert.equal(articles.filter(x => x.kind !== 'index').length, 20);
vm.runInNewContext('window={};', {window:{}});
new vm.Script(read('assets/app.js'), {filename: 'assets/app.js'});
assert(read('assets/app.js').includes('archive[record.id]'), 'Leitor não usa acervo local');
assert(!read('assets/app.js').includes('raw.githubusercontent.com'), 'Leitor depende do servidor antigo');
for (const p of ['_config.yml','.pages.yml','_layouts/artigo.html','artigos.json','assets/site.css','assets/favicon.svg']) {
  assert(fs.existsSync(p), 'Arquivo de publicação ausente: '+p);
}
assert(read('artigos.json').includes('site.artigos'), 'Índice de publicações não é dinâmico');
assert(read('.pages.yml').includes('path: _artigos'), 'Coleção do editor ausente');
console.log('Chronopolis v0.2: 24 documentos íntegros no catálogo, 20 entradas de leitura, scripts válidos e CMS configurado.');
