class AccountsController < ApplicationController
  before_filter :authenticate_user!, :except => :name_available
  ssl_required :index, :show, :edit, :new, :create, :update if use_ssl?
  ssl_allowed :name_available

  def index
    redirect_to account_path(current_user.accounts.first) if current_user.accounts.length == 1
    @accounts = current_user.accounts.order('LOWER(name)')
  end

  def show
    @account = Account.where(:id => params[:id]).first
    @current_account = @account # used for current_account method of Application controller

    if @account.users.find(current_user.id).blank?
      flash[:error] = 'You do not have permission to view this account'
      redirect_to accounts_path
    else
      @backlogs = @account.backlogs.active.order('updated_at desc').limit(15)
      @your_backlogs = @account.active_backlogs_grouped_by_company
      @archive_exists = !@account.backlogs.archived.empty?
    end
  end

  def edit
    @account = Account.find(params[:id])
  end

  def update
    @account = Account.find(params[:id])
    @account.update_attributes(params[:account])
    if @account.save
      flash[:notice] = "Account for #{@account.name} updated successfully"
      redirect_to account_path(@account)
    else
      render :action => 'edit'
    end
  end

  def new
    @account = Account.new
  end

  def create
    @account = Account.new(params[:account])
    if @account.save
      @account.add_first_user current_user
      flash[:notice] = 'Account was successfully created.'
      redirect_to(@account)
    else
      if (@account.errors[:locale].present?)
        @account.errors.add(:locale_id, @account.errors[:locale].join(', '))
        @account.errors.delete(:locale)
      end
      render :action => "new"
    end
  end

  def name_available
    account_name = (params[:account] || {})[:name] || ''
    if Account.where('UPPER(name) like ?', account_name.upcase).empty?
      render :text => 'true'
    else
      render :text => 'false'
    end
  end
end