class PagesController < ApplicationController
  def index
    if current_user
      redirect_to dashboard_path
    end 
  end

  def dashboard
    @kanbans = current_user.kanbans.all
  end
end