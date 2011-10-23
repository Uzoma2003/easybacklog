Ibacklog::Application.routes.draw do
  devise_for :users

  resources :accounts, :only => [:index, :show, :new, :create, :edit, :update] do
    resources :backlogs, :only => [:show, :new, :create, :update, :destroy] do
      member do
        match 'duplicate' => 'backlogs#duplicate', :via => [:get, :post], :as => 'duplicate'
        get 'edit' => 'backlogs#edit', :as => 'edit'
        put 'archive' => 'backlogs#archive', :as => 'archive'
        put 'recover-from-archive' => 'backlogs#recover_from_archive', :as => 'recover_from_archive'
        # simply allow a URL such as /backlogs/1/arbitrary-file-name.xls or .pdf so that IE uses a helpful filename
        get ':file_name' => 'backlogs#show', :as => 'download'
      end
      collection do
        get 'name_available' => 'backlogs#name_available'
        get 'compare/:base/:target' => 'snapshots#compare_snapshots', :as => 'compare_snapshots'
      end
      member do
        get 'snapshots/:snapshot_id' => 'backlogs#show_snapshot', :as => 'snapshot'
        post 'snapshots/create' => 'backlogs#create_snapshot', :as => 'create_snapshot'
        delete 'snapshots/:snapshot_id' => 'backlogs#destroy_snapshot', :as => 'delete_snapshot'
        # download for backlogs
        get 'snapshots/:snapshot_id/:file_name' => 'backlogs#show_snapshot', :as => 'download_snapshot'
      end
    end
    resources :users, :controller => 'account_users'
    resources :companies, :only => [:show, :edit, :update]
    resources :invites, :only => [:destroy] do
      member do
        get ':security_code' => 'invites#show', :as => 'show'
      end
    end
    member do
      get 'archives' => 'backlogs#archives_index', :as => 'archives'
    end
    collection do
      get 'name_available' => 'accounts#name_available'
    end
  end

  resources :backlogs, :only => [:show] do
    resources :themes do
      member do
        match 're-number-stories' => 'themes#re_number_stories', :via => [:post]
      end
    end
    resources :sprints
  end
  resources :themes, :only => [:show] do
    resources :stories do
      member do
        match 'move-to-theme/:new_theme_id' => 'stories#move_to_theme', :via => [:post]
      end
    end
  end
  resources :stories, :only => [:show] do
    resources :acceptance_criteria
  end

  get '/sprint-story-statuses' => 'sprint_story_statuses#index'

  resources :beta_signups, :only => [:index, :create, :show]

  get '/users/email_available' => 'devise/users#email_available'
  get '/contact' => 'pages#contact', :as => 'contact'
  get '/browser-support' => 'pages#browser_support', :as => 'browser_support'
  get '/raise-error' => 'pages#raise_error'

  get '/beta/:unique_code' => 'beta_signups#index', :constraints => { :code => /[a-z0-9]{6}/i }, :as => 'beta_signup_referral'

  get '/dashboard' => 'pages#home', :as => 'dashboard'

  root :to => 'beta_signups#index'
end