// Generated by LiveScript 1.2.0
(function(){
  var PBClient, RSSEmitter, program, preludeLs, url, defaults, purl, dst;
  PBClient = require('../index');
  RSSEmitter = require('rss-emitter');
  program = require('commander');
  preludeLs = require('prelude-ls');
  url = require('url');
  import$(global, preludeLs);
  defaults = {
    feedDb: './feed.db'
  };
  program.option('-s, --src [RSS_URL]', 'URL of RSS/Atom Feed to pull content from').option('-d, --dst [PB_URL]', 'Thread or Forum URL of PowerBulletin Site to post content to').option('-e, --email [PB_LOGIN_EMAIL]', 'Login Email for PowerBulletin').option('-p, --password [PB_PASSWORD]', 'Password for PowerBulletin').option('-f, --feed-db [LEVEL_DB_PATH]', "Path to LevelDB file (default: '" + defaults.feedDb + "')", id, defaults.feedDb).option('-w, --watch', 'Watch --src for changes');
  program.parse(process.argv);
  purl = url.parse(program.dst);
  dst = new PBClient(purl.href, program.email, program.password);
  dst.login(function(err){
    var src;
    if (err) {
      console.error(err);
    }
    src = new RSSEmitter(program.feedDb);
    src.on('item:new', function(guid, item){
      dst.createThread;
      console.log(item);
      return console.log("----------------------------------------------------------------------------------------");
    });
    src.on('item:skipped', function(guid){
      return console.log('skipping', guid);
    });
    src['import'](program.src);
    if (program.watch) {
      return setInterval(function(){
        return src['import'](program.src);
      }, 60000);
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);