class AddReadyFlagToMatch < ActiveRecord::Migration
  def self.up
    add_column :matches, :player_1_ready, :boolean
    add_column :matches, :player_2_ready, :boolean
  end

  def self.down
    remove_column :matches, :player_2_ready
    remove_column :matches, :player_1_ready
  end
end
