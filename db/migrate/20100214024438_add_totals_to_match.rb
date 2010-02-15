class AddTotalsToMatch < ActiveRecord::Migration
  def self.up
    add_column :matches, :player_1_total, :int
    add_column :matches, :player_2_total, :int
  end

  def self.down
    remove_column :matches, :player_2_total
    remove_column :matches, :player_1_total
  end
end
