class DevelopersResolver
  attr_accessor :params, :current_developer

  def self.call(*args)
    new(*args).call
  end

  def initialize(obj, args, ctx)
    @params = args.instance_variable_get(:@argument_values)
    @current_developer = ctx[:current_developer]
  end

  def call
    puts params.inspect
    api = Github::Api.new(current_developer.try(:id))
    api.token = current_developer.access_token unless current_developer.nil?
    api.fetch_developers(query)
  end

  def query
    Github::Params.new(params).set
  end
end
