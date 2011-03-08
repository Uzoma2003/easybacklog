class Backlog < ActiveRecord::Base
  belongs_to :company
  belongs_to :author, :class_name => 'User'
  belongs_to :last_modified_user, :class_name => 'User'

  has_many :themes, :dependent => :delete_all, :order => 'position'

  validates_uniqueness_of :name, :scope => [:company_id], :message => 'has already been taken for another backlog'
  validates_presence_of :name, :rate, :velocity
  validates_numericality_of :rate, :velocity

  attr_accessible :company, :name, :rate, :velocity

  def days
    themes.inject(0) { |val, theme| val + theme.days }
  end

  def cost
    themes.inject(0) { |val, theme| val + theme.cost }
  end

  def copy_children_to_backlog(destination)
    self.themes.each do |theme|
      destination.themes << theme
    end
  end
end