/*global $, _, App, event, JST, Backbone, Story */ // for jslint.com

App.Views.Backlogs = {
  Show: App.Views.BaseView.extend({
    dataArea: $('#backlog-data-area'), // this view will never exist with others so build an absolute JQuery link

    events: {
      "click div.themes ul.themes .actions a.new-theme": "newTheme"
    },

    initialize: function() {
      App.Views.BaseView.prototype.initialize.call(this);
    },

    render: function() {
      var view = new App.Views.Themes.Index({ collection: this.model.Themes() });
      this.$('td.themes').html(view.render().el);

      var show_view = this;

      this.$('td.themes ul.themes').append(JST['themes/new']());

      this.makeFieldsEditable();
      return (this);
    },

    makeFieldsEditable: function() {
      var show_view = this;
      var contentUpdatedFunc = function() { return show_view.contentUpdated(arguments[0], arguments[1], this); };
      var beforeChangeFunc = function() { return show_view.beforeChange(arguments[0], arguments[1], this); };
      var defaultOptions = _.extend(this.defaultEditableOptions, { data: beforeChangeFunc });

      $('#backlog-data-area h2.name div.data').editable(contentUpdatedFunc, _.extend(defaultOptions, { cssclass: 'inherit' }));
    },

    newTheme: function() {
      event.preventDefault();
      var model = new Theme();
      this.model.Themes().add(model);
      this.$('.themes ul.themes li:last').before(new App.Views.Themes.Show({ model: model}).render().el);
    }
  })
};