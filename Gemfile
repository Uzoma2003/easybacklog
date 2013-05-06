source 'http://rubygems.org'
ruby '1.9.3'

gem 'rails', '3.2.12'
gem 'pg'
gem 'jquery-rails'

gem 'haml'
# support for JST templates in sprockets
gem 'ejs'

# authentication
gem 'devise'
gem 'devise-encryptable'
gem 'devise-async'

# orderable items
gem 'acts_as_list', require: false

# pdf generation
gem 'prawn', '~> 0.12'

# monitoring and reporting of errors
gem 'exceptional'
gem 'newrelic_rpm'

gem 'rack'
gem 'rack-force_domain', :git => 'https://github.com/cwninja/rack-force_domain.git'

gem 'shortly' # shorten URLs using an external service such as bit.ly

gem 'will_paginate'

# load XML as an object
gem 'xml-object'

gem 'deep_merge', :require => 'deep_merge/rails_compat'

# improved hosting on Heroku
gem 'unicorn'
gem 'foreman'

# queuing
gem 'sidekiq', '>= 2.3', require: false
gem 'slim', '>= 1.3.0'
gem 'sinatra', '>= 1.3.0', require: false

group :assets do
  gem 'sass-rails'
  gem 'compass'
  gem 'compass-rails'
  gem 'compass-960-plugin'
  gem 'uglifier'
  # speed up generation of assets by only regenerating changed files
  gem 'turbo-sprockets-rails3'
end

group :development, :test do
  gem 'debugger'
  gem 'awesome_print'
  gem 'watchr'
  gem 'growl'
  gem 'pry'
  gem 'pry-rails', :git => 'git://github.com/chrisfarber/pry-rails.git'
  # gem 'pry-doc' # apparently causing segmentation faults http://stackoverflow.com/questions/8065611/ruby-1-9-3-p0-and-rspec-causes-frequent-segmentation-faults/8619319#8619319
  gem 'better_errors'
end

group :test do
  gem 'rspec','>=2.7.0'
  gem 'rspec-rails','>=2.7.0'
  gem 'shoulda-matchers'
  gem 'factory_girl_rails'
  gem 'webrat'
  gem 'cucumber-rails', :require => false
  gem 'autotest'
  gem 'autotest-growl'
  gem 'autotest-rails'
  gem 'database_cleaner'
  gem 'selenium-webdriver', '~> 2.22'
  gem 'capybara', '~> 1.0'
  gem 'capybara-webkit'
  gem 'timecop'
  gem 'launchy', '>=2'
  gem 'pdf-reader'
  gem 'email_spec'
  gem 'capybara-screenshot'
  gem 'recursive-open-struct', :git => 'git://github.com/mattheworiordan/recursive-open-struct.git'
end

group :development do
  gem 'ruby_parser' # for Devise generators
  gem 'hpricot' # for Devise generators
  gem 'jslint_on_rails'
  gem 'quiet_assets' # reduce verbosity of console messages for serving up assets
end
