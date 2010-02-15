class AddChoiceSaltsToMatch < ActiveRecord::Migration
  def self.up
    add_column :matches, :player_1_salt, :string
    add_column :matches, :player_2_salt, :string
  end

  def self.down
    remove_column :matches, :player_2_salt
    remove_column :matches, :player_1_salt
  end
end
