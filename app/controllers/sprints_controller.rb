class SprintsController < ApplicationController
  before_filter :authenticate_user!, :set_backlog_and_protect
  after_filter :update_backlog_metadata, :only => [:create, :update, :destroy]
  SPRINT_METHODS = [:completed?, :deletable?]

  def index
    @sprints = @backlog.sprints.find(:all, :include => :stories)
    render :json => @sprints.to_json(:include => { :stories => { :only => [:id, :theme_id, :sprint_status_id] } }, :methods => SPRINT_METHODS)
  end

  def show
    @sprint = @backlog.sprints.find(params[:id])
    render :json => @sprint.to_json(:methods => SPRINT_METHODS)
  end

  def create
    @sprint = @backlog.sprints.new(params)
    if @sprint.save
      render :json => @sprint.to_json(:methods => SPRINT_METHODS)
    else
      send_json_error @sprint.errors.full_messages.join(', ')
    end
  end

  def update
    @sprint = @backlog.sprints.find(params[:id])
    @sprint.update_attributes params
    if @sprint.save
      render :json => @sprint.to_json(:methods => SPRINT_METHODS)
    else
      send_json_error @sprint.errors.full_messages.join(', ')
    end
  end

  def destroy
    @sprint = @backlog.sprints.find(params[:id])
    @sprint.destroy
    send_json_notice 'Sprint deleted'
  end

  private
    # set the @backlog instance variable from nested route
    # ensure user has access to this based on account
    def set_backlog_and_protect
      @backlog = Backlog.find(params[:backlog_id])
      if @backlog.account.users.find(current_user.id).blank?
        flash[:error] = 'You do not have permission to view this theme'
        redirect_to accounts_path
      end
    end

    def update_backlog_metadata
      @backlog.update_meta_data current_user
    end
end