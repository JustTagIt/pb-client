// Generated by LiveScript 1.2.0
(function(){
  var PBClient, RSSEmitter, program, preludeLs, url, defaults, haveRequiredParams, purl, site, dst;
  PBClient = require('../index');
  RSSEmitter = require('rss-emitter');
  program = require('commander');
  preludeLs = require('prelude-ls');
  url = require('url');
  import$(global, preludeLs);
  defaults = {
    feedDb: './feed.db',
    watch: 1000 * 60 * 10
  };
  program.option('-s, --src <RSS_URL>', 'URL of RSS/Atom Feed to pull content from').option('-d, --dst <PB_URL>', 'Thread or Forum URL of PowerBulletin Site to post content to').option('-e, --email <PB_LOGIN_EMAIL>', 'Login Email for PowerBulletin').option('-p, --password <PB_PASSWORD>', 'Password for PowerBulletin').option('-f, --feed-db <LEVEL_DB_PATH>', "Path to LevelDB file (default: '" + defaults.feedDb + "')", id, defaults.feedDb).option('-w, --watch [INTERVAL]', "Watch --src for changes (default: '" + defaults.watch + "')", parseInt, defaults.watch);
  program.parse(process.argv);
  haveRequiredParams = all(id, [program.src, program.dst, program.email, program.password]);
  if (!haveRequiredParams) {
    console.warn("Error:  --src, --dst, --email, and --password must be provided");
    program.outputHelp();
    process.exit(1);
  }
  purl = url.parse(program.dst);
  site = purl.protocol + "//" + purl.hostname;
  dst = new PBClient(site, program.email, program.password);
  dst.login(function(err){
    var src;
    if (err) {
      console.error("login failed");
      console.error(err);
      process.exit(1);
    }
    src = new RSSEmitter(program.feedDb);
    src.on('item:new', function(guid, item){
      var body;
      body = item.categories
        ? item.description + ("\n\n " + join(' ')(
        map(function(it){
          return '#' + it;
        })(
        item.categories)))
        : item.description;
      return dst.createPost(purl.pathname, item.title, body, function(err){
        console.log(item);
        return console.log("----------------------------------------------------------------------------------------");
      });
    });
    src.on('item:skipped', function(guid){});
    src['import'](program.src);
    if (program.watch) {
      return setInterval(function(){
        return src['import'](program.src);
      }, program.watch);
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
