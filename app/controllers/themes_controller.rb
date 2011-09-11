class ThemesController < ApplicationController
  before_filter :authenticate_user!, :set_backlog_and_protect
  after_filter :update_backlog_metadata, :only => [:create, :update, :destroy]
  ssl_required :index, :show, :new, :create, :update, :destroy, :re_number_stories if use_ssl?

  def index
    @themes = @backlog.themes.find(:all, :include => [:stories, { :stories => :acceptance_criteria } ])
    render :json => @themes.to_json(:include => { :stories => { :include => :acceptance_criteria } })
  end

  def show
    @theme = @backlog.themes.find(params[:id])
    render :json => @theme
  end

  def new
    @theme = @backlog.themes.new
    render :json => @theme
  end

  def create
    @theme = @backlog.themes.new(params)
    if @theme.save
      render :json => themes_json
    else
      send_json_error @theme.errors.full_messages.join(', ')
    end
  end

  def update
    @theme = @backlog.themes.find(params[:id])
    @theme.update_attributes params
    if @theme.save
      render :json => themes_json
    else
      send_json_error @theme.errors.full_messages.join(', ')
    end
  end

  def destroy
    @theme = @backlog.themes.find(params[:id])
    @theme.destroy
    send_json_notice 'Theme deleted', :score_statistics => @backlog.score_statistics(:force => true)
  end

  def re_number_stories
    @theme = @backlog.themes.find(params[:id])
    @theme.re_number_stories
    send_json_notice 'Stories re-numbered'
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

    def themes_json()
      @theme.to_json(:methods => [:score_statistics], :except => [:updated_at, :created_at])
    end

    def update_backlog_metadata
      @backlog.update_meta_data current_user
    end
end