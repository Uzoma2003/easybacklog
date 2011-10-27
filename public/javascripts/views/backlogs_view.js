/*global Backbone:false, $:false, _:false, JST:false, App:false, window:false, htmlEncode:false */

App.Views.Backlogs = {
  Show: App.Views.BaseView.extend({
    dataArea: $('#backlog-data-area'), // this view will never exist with others so build an absolute JQuery link

    initialize: function(options) {
      App.Views.BaseView.prototype.initialize.call(this);
      this.sprintTabsView = options.sprintTabsView;
      _.bindAll(this, 'navigateEvent', 'print', 'newSnapshot', 'jumpToSnapshot', 'compareSnapshot', 'activated');
    },

    render: function() {
      var use5090estimates = $('#backlog-container #themes-header .columns .score-50').length ? true : false;
      var view = new App.Views.Themes.Index({ collection: this.model.Themes(), use5090estimates: use5090estimates });
      this.$('#themes-container').html(view.render().el);

      var show_view = this;

      this.updateStatistics();

      // print link should show a dialog first
      $('#backlog-data-area .actions #print').click(this.print);

      // new snapshot link should show the new snapshot dialog
      $('#backlog-data-area #new-snapshot').click(this.newSnapshot);
      $('#backlog-data-area #compare-snapshot').click(this.compareSnapshot);
      $('#backlog-data-area select#snapshot-selector').change(this.jumpToSnapshot);

      if (this.model.IsEditable()) {
        var firstEditableElem = $('ul.themes li.theme:first .theme-data .name .data');
        if (firstEditableElem.length) {
          firstEditableElem.click();
        } else {
          $('ul.themes li.actions a.new-theme').focus();
        }
      } else {
        $('#backlog-data-area').addClass('not-editable');
        $('#backlog-container').addClass('not-editable');
      }

      return (this);
    },

    updateStatistics: function() {
      $('#backlog-data-area .backlog-stats').html( JST['backlogs/stats']({ model: this.model }) );
      this.sprintTabsView.adjustTabConstraints(true);
    },

    // view is made active, but not necessarily re-rendered for performance reasons
    activated: function() {
      this.updateStatistics();
      this.$('ul.stories>li.story').each(function(index, elem) {
        $(elem).data('update-model-data')();
      });
    },

    // Tab or Enter key pressed so let's move on
    navigateEvent: function(event) {
      if (_.include([9,13,27], event.keyCode)) { // tab, enter, esc
        $(event.target).blur();
        try { // cannot preventDefault if esc as esc event is triggered manually from jeditable
          event.preventDefault();
        } catch (e) { }

        if (!event.shiftKey) { // moving -->
          var firstTheme = $('#themes-container ul.themes li.theme:first>.theme-data .name .data');
          if (firstTheme.length) {
            firstTheme.click();
          } else {
            $('#themes-container ul.themes li.actions a.new-theme').focus();
          }
        } else {
          // there are no further items so focus on title if not on title
          if (!$(event.target).parents('h2.name').is('h2')) {
            $('#backlog-data-area h2.name>div.data').click();
          } else {
            // nothing higher, focus on last button
            $('li:last a:last').focus();
          }
        }
      }
    },

    print: function(event) {
      var view = this;
      event.preventDefault();
      $('#dialog-print').remove(); // ensure old dialog HTML is not still in the DOM
      $('body').append(JST['backlogs/print-dialog']({ backlog: this.model }));
      $('#dialog-print').dialog({
        resizable: false,
        height:350,
        width: 400,
        modal: true,
        buttons: {
          Print: function() {
            // get the page size & fold side values from the select fields
            var page_size = $(this).find('#page-size option:selected').attr('id');
            var fold_side = $(this).find('#fold-side option:selected').attr('id');

            // save the cookie so settings are remembered
            $.cookie("fold-side-default", fold_side);
            $.cookie("page-size-default", page_size);

            // download the PDF in the background
            var printUrl = $(event.target).attr('href');
            printUrl += '?print_scope=' + $(this).find('#print-scope option:selected').attr('id') +
              '&page_size=' + page_size + '&fold_side=' + fold_side;
            document.location.href = printUrl;

            // update the dialog to say we're updating and then close after a short period
            $(this).find('p.progress-placeholder').html('Please wait, we\'re preparing your PDF...');
            $(this).parent().find('.ui-dialog-buttonset button:nth-child(2) span').text('Preparing...');
            $(this).parent().find('.ui-dialog-buttonset button:nth-child(1)').remove();
            var dialog = this;
            _.delay(function() { $(dialog).dialog("close"); }, 2000);
          },

          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });
    },

    newSnapshot: function(event) {
      var view = this;
      var newSnapshotLink = $(event.target);
      event.preventDefault();
      $('#dialog-create-snapshot').remove(); // ensure old dialog HTML is not still in the DOM
      $('body').append(JST['backlogs/create-snapshot-dialog']({ backlog: this.model }));
      $('#dialog-create-snapshot').dialog({
        resizable: false,
        height:210,
        width: 350,
        modal: true,
        buttons: {
          'Create Snapshot': function() {
            // create snapshot on server by posting a request
            var name = $(this).find('input[type=text]').val();
            if ($.trim(name) === '') {
              $(this).find('div.progress-area label').text('You must name your snapshot to continue.');
              $(this).find('div.progress-area').addClass('field_with_errors').find('input[type=text]').focus();
            } else {
              // post a hidden form to set up a new snapshot
              var href = newSnapshotLink.attr('href'),
                csrf_token = $('meta[name=csrf-token]').attr('content'),
                csrf_param = $('meta[name=csrf-param]').attr('content'),
                form = $('<form method="post" action="' + href + '"></form>');
              var fields = '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />' +
                '<input name="name" value="' + htmlEncode(name) + '" type="hidden" />';
              form.hide().append(fields).appendTo('body');
              form.submit();

              // update the dialog to say we're updating and then close after a short period
              $(this).find('div.progress-area').html('Please wait, we\'re creating your snapshot...<br /><br />' +
                '<span class="progress-icon"></span>');
              $(this).parent().find('.ui-dialog-buttonset button:nth-child(2) span').text('Preparing...');
              $(this).parent().find('.ui-dialog-buttonset button:nth-child(1)').remove();
            }
          },

          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });
    },

    jumpToSnapshot: function(event) {
      event.preventDefault();
      var val = $(event.target).val();
      var baseUrl = document.location.pathname.match(/^\/accounts\/\d+\/backlogs\/\d+/i)[0];
      if (val.match(/^\d+$/)) {
        // user has selected a backlog
        baseUrl += '/snapshots/' + val;
      }
      $('#loading-new-snapshot').show();
      document.location.pathname = baseUrl;
    },

    compareSnapshot: function(event) {
      var view = this;
      var newSnapshotLink = $(event.target);
      event.preventDefault();
      $('#dialog-compare-snapshot').remove(); // ensure old dialog HTML is not still in the DOM
      $('body').append(JST['backlogs/compare-snapshot-dialog']({ snapshot_options: $('#backlog-data-area select#snapshot-selector').html() }));
      var currentSnapshot = document.location.pathname.match(/^\/accounts\/\d+\/backlogs\/\d+\/snapshots\/(\d+)/i);
      if (currentSnapshot) {
        // viewing a snapshot now, so set the compare against as the working version
        $('#dialog-compare-snapshot select#target-snapshot').val($('#dialog-compare-snapshot select#target-snapshot option:first-child').val());
      }
      $('#dialog-compare-snapshot').dialog({
        resizable: false,
        height:320,
        width: 400,
        modal: true,
        buttons: {
          'Compare': function() {
            // create snapshot on server by posting a request
            var base = $(this).find('select#base-snapshot').val();
            var target = $(this).find('select#target-snapshot').val();
            if (base == target) {
              $(this).find('div.error-message').html('<p><span class="error-alert ui-icon ui-icon-alert"></span>' +
                'You cannot compare the same snapshots.  Please make another selection.</p>');
            } else {
              var baseUrl = document.location.pathname.match(/^\/accounts\/\d+\/backlogs/i)[0];
              var backlogId = document.location.pathname.match(/^\/accounts\/\d+\/backlogs\/(\d+)/i)[1];
              var url = baseUrl + '/compare/' + (base.match(/^\d+$/) ? base : backlogId) + '/' + (target.match(/^\d+$/) ? target : backlogId);
              if (App.environment === 'test') {
                document.location.href = url;
              } else {
                window.open(url, '_newtab' + Math.floor(Math.random()*10000));
              }
              $(this).dialog("close");
            }
          },

          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });
    }
  })
};