class CreateMatches < ActiveRecord::Migration
  def self.up
    create_table :matches do |t|
      t.column :match_name,       :string
      t.column :player_1,         :int
      t.column :player_2,         :int
      t.column :player_1_choice,  :string
      t.column :player_2_choice,  :string
      t.column :player_1_score,   :int
      t.column :player_2_score,   :int
      t.column :player_1_streak,  :int
      t.column :player_2_streak,  :int
      
      t.timestamps
    end
  end

  def self.down
    drop_table :matches
  end
end
