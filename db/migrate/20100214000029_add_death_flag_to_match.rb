class AddDeathFlagToMatch < ActiveRecord::Migration
  def self.up
    add_column :matches, :death, :boolean
  end

  def self.down
    remove_column :matches, :death
  end
end
