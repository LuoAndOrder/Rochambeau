class AddComputerUserToUser < ActiveRecord::Migration
  def self.up
    user = User.new
    user.id = 1
    user.login = "computer"
    user.total = 0
    user.streak = 0
    user.crypted_password = "funkytown"
    user.save_with_validation(false)
  end

  def self.down
    user = User.first(:conditions => "login = 'computer'")
    User.delete(user.id)
  end
end
