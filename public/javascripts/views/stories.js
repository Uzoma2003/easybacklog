App.Views.Stories = {
  List: Backbone.View.extend({
    initialize: function() {
      this.collection = this.options.collection;
      this.el = $('#theme-' + this.collection.theme.get('id') + ' ul.stories');
      this.render();
    },

    render: function() {
      var el = this.el;
      this.collection.each(function(story) {
        var view = new App.Views.Stories.Show({ model: story, id: 'story-' + story.get('id') })
        el.append(view.render().el);
      });
      return (this);
    }
  }),

  Show: Backbone.View.extend({
    tagName: 'li',
    className: 'story',
    id: function() { this.model.get('id'); },
    model: null,

    events: {
      "click": "click"
    },

    initialize: function() {
      this.model = this.options.model;
      this.id = this.model.get('id');
    },

    render: function() {
      $(this.el).html( JST['stories/show']({ model: this.model }) );
      new App.Views.AcceptanceCriteria.List({ collection: this.model.AcceptanceCriteria(), el: this.$('.acceptance-criteria ul') })
      return (this);
    },

    click: function() {
      alert ('click');
    }
  })
};