require 'builder'
require "digest"

class MatchesController < ApplicationController
  
  # Displays list of matches
  def index
    @matches = Match.find(:all)
  end
  
  # Displays form for creating a match
  def new
    @match = Match.new
    @name = "";
  end
  
  # Show the match (the game screen)
  def show
    @match = Match.find(params[:id])
    if @match.player_2 == nil
      @match.player_2 = "Computer"
    end
  end
  
  # Function to create the match
  def create
    @match = Match.new(params[:match])
    @user = User.find(current_user).id
    @match.player_1 = @user
    if @match.save
      redirect_to :action => 'show', :id => @match.id
    else
      render :action => 'new'
    end
  end
  
  # Returns an XML document of the match entry
    # currently not used
  def query
    @match = Match.find(params[:id])
    @xml = Builder::XmlMarkup.new
    render :layout => false
  end
  
  # Returns if the match is flagged for death
  def check_death
    @match = Match.find(params[:id])
    if @match.death
      render :text => "yes"
    else
      render :text => "no"
    end
  end
  
  # Determines if there are two players and if they are both ready
  def ready_to_start
    @match = Match.find(params[:id])
    @ready_1 = @match.player_1_ready
    @ready_2 = @match.player_2_ready
    
    if @match.player_2 == 0
      render :text => "left"
      return
    end
    
    if @ready_1 and @ready_2
      render :text => "yes"
    else
      render :text => "no"
    end
  end
  
  # Return the opponent's name
  def get_opponent
    @match = Match.find(params[:id])
    @user = params[:player_id]
    if @user.to_i == @match.player_1.to_i
      render :text => User.find(@match.player_2).login
    else
      render :text => User.find(@match.player_1).login
    end
  end
  
  # If the player did not make a choice, make a random choice for them
  def ready_to_play
    Match.update(params[:id], {:player_1_ready => 0, :player_2_ready => 0})
    @match = Match.find(params[:id])
    
    if @match.player_1_choice == nil or @match.player_1_choice == "0"
      rand_num = 1 + rand(3)
      str = ""
      if rand_num == 1
        str = "0Rock"
      elsif rand_num == 2
        str = "0Paper"
      else
        str = "0Scissor"
      end
      @match.player_1_choice = Digest::MD5.hexdigest(str)
      Match.update(params[:id], {:player_1_choice => @match.player_1_choice, :player_1_salt => "0"})
    end
    
    if @match.player_2_choice == nil or @match.player_2_choice == "0"
      rand_num = 1 + rand(3)
      str = ""
      if rand_num == 1
        str = "0Rock"
      elsif rand_num == 2
        str = "0Paper"
      else
        str = "0Scissor"
      end
      @match.player_2_choice = Digest::MD5.hexdigest(str)
      Match.update(params[:id], {:player_2_choice => @match.player_2_choice, :player_2_salt => "0"})
    end
    
    render :text => "yes"
  end
  
  # Returns the player's choice (mostly useful for if their choice was randomized)
  def get_player_choice
    @match = Match.find(params[:id])
    @user = params[:player_id]
    @choice
    @salt
    if @user.to_i == @match.player_1.to_i
      @choice = @match.player_1_choice
      @salt = @match.player_1_salt
    else
      @choice = @match.player_2_choice
      @salt = @match.player_2_salt
    end
    
    if @choice == Digest::MD5.hexdigest(@salt + "Rock")
      render :text => "rock"
    elsif @choice == Digest::MD5.hexdigest(@salt + "Paper")
      render :text => "paper"
    else
      render :text => "scissors"
    end
  end
  
  # Returns the opponent's choice
  def get_opponent_choice
    @match = Match.find(params[:id])
    @user = params[:player_id]
    @choice
    @salt
    if @user.to_i == @match.player_1.to_i
      @choice = @match.player_2_choice
      @salt = @match.player_2_salt
    else
      @choice = @match.player_1_choice
      @salt = @match.player_1_salt
    end
    
    if @choice == Digest::MD5.hexdigest(@salt + "Rock")
      render :text => "rock"
    elsif @choice == Digest::MD5.hexdigest(@salt + "Paper")
      render :text => "paper"
    else
      render :text => "scissors"
    end
  end
  
  # Returns the winner relative to the querying client
  # Updates user total's and streaks
  def who_won
    @match = Match.find(params[:id])
    @user = params[:player_id]
    if @user.to_i == @match.player_1.to_i
      @player = 1
    else
      @player = 2
    end
    @choice_1_md5 = @match.player_1_choice
    @salt_1 = @match.player_1_salt
    @choice_2_md5 = @match.player_2_choice
    @salt_2 = @match.player_2_salt
    
    if @choice_1_md5 == Digest::MD5.hexdigest(@salt_1 + "Rock")
      @choice_1 = "rock"
    elsif @choice_1_md5 == Digest::MD5.hexdigest(@salt_1 + "Paper")
      @choice_1 = "paper"
    else
      @choice_1 = "scissor"
    end
    
    if @choice_2_md5 == Digest::MD5.hexdigest(@salt_2 + "Rock")
      @choice_2 = "rock"
    elsif @choice_2_md5 == Digest::MD5.hexdigest(@salt_2 + "Paper")
      @choice_2 = "paper"
    else
      @choice_2 = "scissor"
    end
    
    str = ""
    
    if (@choice_1 == "rock" and @choice_2 == "paper") or (@choice_1 == "scissor" and @choice_2 == "rock") or (@choice_1 == "paper" and @choice_2 == "scissor")
      if @player == 1
        Match.update(params[:id], {:player_1_streak => 0})
        str = "opponent"
      else
        Match.update_counters(params[:id], :player_2_total => 1, :player_2_streak => 1)
        User.update_counters(@user.to_s, {:total => 1})
        str = "player"
      end
    elsif (@choice_1 == "rock" and @choice_2 == "scissor") or (@choice_1 == "scissor" and @choice_2 == "paper") or (@choice_1 == "paper" and @choice_2 == "rock")
      if @player == 1
        Match.update_counters(params[:id], {:player_1_total => 1, :player_1_streak => 1})
        User.update_counters(@user.to_s, {:total => 1})
        str = "player"
      else
        Match.update(params[:id], {:player_2_streak => 0})
        str = "opponent"
      end
    else
      str = "draw"
    end
    
    @match = Match.find(params[:id])
    streak_1 = @match.player_1_streak.to_i
    streak_2 = @match.player_2_streak.to_i
    if @player == 1
      if streak_1.to_i > User.find(@user).streak.to_i
        User.update(@user.to_s, {:streak => streak_1})
      end
    else
      if streak_2.to_i > User.find(@user).streak.to_i
        User.update(@user.to_s, {:streak => streak_2})
      end
    end    
    
    render :text => str
    
  end
  
  # Flag the player ready and clean the choices
  def player_ready
    @match = Match.find(params[:id])
    @user = params[:player_id]
    
    if @user.to_i == @match.player_1.to_i
      Match.update(params[:id], {:player_1_ready => 1, :player_1_choice => "0", :player_1_salt => 0})
    else
      Match.update(params[:id], {:player_2_ready => 1, :player_2_choice => "0", :player_2_salt => 0})
    end
    
    render :text => "OK";
  end
  
  # Register the player with the server
  # If the match is full, let the client know
  def register
    @match = Match.find(params[:id])
    @user = params[:player_id]
    if @user.to_i == @match.player_1.to_i
      Match.update(params[:id], {:player_1_ready => 1})
      render :text => "OK"
    elsif @match.player_2.to_i == "0".to_i
      Match.update(params[:id], {:player_2 => @user, :player_2_ready => 1});
      render :text => "OK"
    else
      render :text => "FAIL"
    end
  end
  
  # Free up a slot and kill the match if the host leaves
  def unregister
    @match = Match.find(params[:id])
    @user = params[:player_id]
    if @user.to_i == @match.player_1.to_i and (@match.player_2.to_i == "0".to_i or @match.player_2.to_i == -1)
      render :text => "kill"
    elsif @user.to_i == @match.player_1.to_i and @match.player_2.to_i != "0".to_i
      render :text => "slow_kill"
    elsif @user.to_i == @match.player_2.to_i
      Match.update(params[:id], {:player_2 => 0, :player_2_choice => 0, :player_2_salt => 0, :player_2_total => 0, :player_2_streak => 0, :player_2_ready => 0})
      render :text => "OK"
    else
      render :text => "FAIL"
    end
  end
  
  # Kill the match
  def kill
    Match.delete(params[:id]);
    
    render :text => "OK"
  end
  
  # Flag the match to die
  def setup_kill
    Match.update(params[:id], {:death => 1})
    render :text => "OK"
  end
  
  # Save the querying player's choice in the server
  def save
    @user = params[:player_id]
    @match = Match.find(params[:id])
    
    if @user.to_i == @match.player_1.to_i
      Match.update(params[:id], {:player_1_choice => params[:choice], :player_1_salt => params[:salt]})
    else
      Match.update(params[:id], {:player_2_choice => params[:choice], :player_2_salt => params[:salt]})
    end
    
    render :text => "OK"
  end

  
  
end
