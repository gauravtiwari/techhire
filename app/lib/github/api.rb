require 'typhoeus/adapters/faraday'
module Github
  class Api
    attr_reader :access_token

    def initialize(token = nil)
      @access_token = if token.present?
                        token
                      else
                        ENV.fetch('github_access_token')
                      end
    end

    def search(params)
      Rails.cache.fetch([params[:query], params[:page], 'search']) do
        client.search_users(params[:query], page: params[:page])
      end
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def fetch_developers(params)
      logins = {}

      search(params).items.each do |item|
        logins["developer/#{item.login}"] = item.login
      end

      all = Rails.cache.fetch_multi(logins.keys) do |key|
        local = Developer.where(login: logins.values)
        remaining = logins.values - local.map(&:login)
        github = remaining.map do |login|
          fetch_developer(login)
        end

        [local + github]
      end

      # Sort developers based on given criterias
      all[logins.keys].flatten.sort_by do |item|
        [
          item.premium && item.hireable ? 0 : 1,
          item.hireable && item.email.present? ? 0 : 1,
          item.hireable ? 0 : 1,
          item.premium ? 0 : 1,
        ]
      end
    end

    def fetch_developer(login)
      Rails.cache.fetch(['developer', login]) do
        client.user(login)
      end
    end

    def fetch_developer_languages(login)
      Rails.cache.fetch(['developer', login, 'languages']) do
        fetch_developer_repos(login)
          .lazy
          .map(&:language)
          .to_a
          .compact
          .map(&:downcase)
          .uniq!
      end
    end

    def fetch_developer_repos(login)
      Rails.cache.fetch(['developer', login, 'repos']) do
        client.auto_paginate = true
        client.repositories(login)
      end
    end

    def fetch_developer_orgs(login)
      Rails.cache.fetch(['developer', login, 'organizations']) do
        client
          .organizations(login)
          .lazy
          .take(5)
          .to_a
      end
    end

    def client
      client = Octokit::Client.new(access_token: access_token)
      client.configure do |c|
        c.middleware = faraday_stack
        c.per_page = 51
      end

      client
    end

    private

    def faraday_stack
      Faraday::RackBuilder.new do |builder|
        builder.response :logger unless Rails.env.test?
        builder.use Octokit::Response::RaiseError
        builder.request :url_encoded
        builder.request :retry
        builder.adapter :typhoeus
      end
    end
  end
end
