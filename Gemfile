ruby '2.2.5'
source 'https://rubygems.org'

# Setup Rails and API
gem 'rails', '4.2.7'

# Setup server
gem 'passenger'

# Asset compilation and NPM modules
gem 'browserify-rails'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails'

# Setup react and dependencies
gem 'therubyracer', platforms: :ruby
gem 'react-rails', '1.6.2'

# Setup Octokit and HTTP cache
gem 'httparty'
gem 'sidekiq'
gem 'redis'
gem 'redis-namespace'

# Setup caching and Marshalling
gem 'readthis'
gem 'hiredis'
gem 'oj'

# Throttle Malacious requests
gem 'rack-attack'

# Geocode location from IP
gem 'geocoder'

#Speed up links
gem 'turbolinks', '~> 5.0.x'

group :production do
  gem 'rails_12factor'
end

group :development do
  gem 'spring'
  gem 'foreman'
  gem 'figaro'
end
