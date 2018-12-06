const execa = require('execa');
const fs = require('fs-extra');
const Listr = require('listr');
const sane = require('sane');
var unified = require('unified');
var markdown = require('remark-parse');
var html = require('remark-html');
const replace = require('replace-in-file');
const stringify = require('rehype-stringify');
var highlight = require('rehype-highlight');
const remarkAttr = require('remark-attr');
const remark2rehype = require('remark-rehype');
var raw = require('rehype-raw');
var format = require('rehype-format');
var watcher = sane('./docs/markdown', { glob: ['**/*.md'] });

const tasks = new Listr([
  {
    title: 'fetch contents',
    task: ctx => {
      return fs.readFile('./docs/markdown/main.md', 'utf8').then(c => (ctx.contents = c));
    }
  },
  {
    title: 'converting markdown to html',
    task: ctx => {
      return unified()
        .use(markdown)
        .use(remarkAttr)
        .use(remark2rehype, { allowDangerousHTML: true })
        .use(raw)
        .use(format)
        .use(highlight)
        .use(stringify)
        .process(ctx.contents)
        .then(c => String(c))
        .then(c => (ctx.contents = c));
    }
  },
  {
    title: 'file contents changed',
    task: ctx => {
      return fs.outputFile('./docs/app/utils/content/content.component.html', ctx.contents);
    }
  },
  {
    title: 'replace braces',
    task: ctx => {
      return replace({
        files: './docs/app/utils/content/content.component.html',
        from: [/\{/g, /\}/g],
        to: ['&#123;', '&#125;']
      }).then(c => (ctx.contents = c));
    }
  }
]);

watcher.on('change', () => {
  tasks.run().catch(err => {
    console.error(err);
  });
});
