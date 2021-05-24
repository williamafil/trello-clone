class PagesController < ApplicationController
  def index
    redirect_to dashboard_path if current_user
  end

  def dashboard
    @kanbans = current_user.kanbans.all
  end
end
