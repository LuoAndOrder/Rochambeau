class Match < ActiveRecord::Base
  validates_presence_of :match_name
  validates_length_of   :match_name,  :within => 3..20
end
