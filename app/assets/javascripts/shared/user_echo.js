if (!window.App || (App.environment !== 'test')) {
  /* Standard UserEcho link code */
  _ues = {
    host:'easybacklog.userecho.com',
    forum:'4890',
    lang:'en',
    tab_show:false
  };
  (function() {
      var s, _ue = document.createElement('script');
      _ue.type = 'text/javascript';
      _ue.async = true;
      _ue.src = ('https:' === document.location.protocol ? 'https://s3.amazonaws.com/' : 'http://') + 'cdn.userecho.com/js/widget-1.4.gz.js';
      s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(_ue, s);
  }());
}