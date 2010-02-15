# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_Rochambeau_session',
  :secret      => '9447f839098caf94f2b147e1579690ff9e17dea18ad0980d88572b9b96d7a5df0951556a58ba2719122f3f9c6f643709dececa9d88375820c7af424cc087b368'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
