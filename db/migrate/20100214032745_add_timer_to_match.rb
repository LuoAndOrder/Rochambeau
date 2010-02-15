class AddTimerToMatch < ActiveRecord::Migration
  def self.up
    add_column :matches, :timer, :int
    add_column :matches, :next_time, :real
  end

  def self.down
    remove_column :matches, :next_time
    remove_column :matches, :timer
  end
end
