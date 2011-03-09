Factory.sequence :theme_name do |n|
  "Theme-#{n}"
end

Factory.sequence :theme_position do |n|
  n
end

Factory.define :theme do |a|
  a.name { Factory.next(:theme_name) }
  a.position { Factory.next(:theme_position) }
  a.association :backlog, :factory => :backlog
  a.after_create { |theme| theme.backlog.themes.reload } # parent model needs refreshing as it will not know a new model has been created
end