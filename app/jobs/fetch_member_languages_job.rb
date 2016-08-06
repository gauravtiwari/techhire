class FetchMemberLanguagesJob < ActiveJob::Base
  queue_as :urgent

  def perform(username)
    Rails.cache.fetch(['users', username, 'languages'], expires_in: 2.days) do
      # Find user repos
      request = Github::Api.new("/users/#{username}/repos").fetch
      if Github::Response.new(request).found?
        # Map uniq! repo languages for user
        Github::Response.new(request.parsed_response).user_languages_collection
      else
        return false
      end
    end
  end
end
