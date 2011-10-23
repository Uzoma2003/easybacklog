class AcceptanceCriterion < ActiveRecord::Base
  acts_as_list :scope => :story

  belongs_to :story

  attr_accessible :criterion, :position

  def editable?
    story.theme.backlog.editable?
  end
  include Snapshot
end