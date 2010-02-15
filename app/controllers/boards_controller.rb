class BoardsController < ApplicationController
  def index
    @users = User.all(:order => "streak DESC", :limit => 10)
  end
end
