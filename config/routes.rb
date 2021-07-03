Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  
  # resources :tickets
  resources :kanbans do
    resources :columns, except: [:new, :edit] do
      member do
        put 'drag'
      end
    end
    resources :tickets, only: [:create, :update, :destroy] do
      member do
        put 'drag'
      end
    end
  end

  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "pages#index"
  get 'dashboard', to: "pages#dashboard"
end
