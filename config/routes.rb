Rails.application.routes.draw do
  
  resources :tickets
  resources :kanbans do
    resources :columns, except: [:new, :edit]
  end

  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "pages#index"
  get 'dashboard', to: "pages#dashboard"
end
