ActionController::Routing::Routes.draw do |map|


  # The priority is based upon order of creation: first created -> highest priority.
  map.root :controller => 'welcome', :action => 'index'
  map.rules 'rules', :controller => 'welcome', :action => 'rules'
  map.matches 'matches/', :controller => 'matches', :action => 'index', :conditions => { :method => :get }
  map.new_match 'matches/new', :controller => 'matches', :action => 'new', :conditions => { :method => :get }
  map.connect 'matches', :controller => 'matches', :action => 'create', :conditions => { :method => :post }
  map.connect 'matches/:id', :controller => 'matches', :action => 'show'
  map.queries 'query/:id', :controller => 'matches', :action => 'query', :conditions => { :method => :get }
  map.check_death 'query/check_death/:id/:salt', :controller => 'matches', :action => 'check_death', :conditions => { :method => :get }
  map.ready_to_start 'query/ready_to_start/:id/:salt', :controller => 'matches', :action => 'ready_to_start', :conditions => { :method => :get }
  map.get_opponent 'query/get_opponent/:id/:player_id/:salt', :controller => 'matches', :action => 'get_opponent', :conditions => { :method => :get }
  map.ready_to_play 'query/ready_to_play/:id', :controller => 'matches', :action => 'ready_to_play', :conditions => { :method => :get }
  map.get_opponent_choice 'query/ready_to_rumble/:id/:player_id/:salt', :controller => 'matches', :action => 'get_opponent_choice', :conditions => { :method => :get }
  map.who_won 'query/who_won/:id/:player_id/:salt', :controller => 'matches', :action => 'who_won', :conditions => { :method => :get }
  map.player_ready 'query/player_ready/:id/:player_id', :controller => 'matches', :action => 'player_ready', :conditions => { :method => :get }
  map.save 'query/save/:id/:player_id/:choice/:salt', :controller => 'matches', :action => 'save', :conditions => { :method => :get }
  map.kill 'query/kill/:id', :controller => 'matches', :action => 'kill', :conditions => { :method => :get }
  map.setup_kill 'query/setup_kill/:id', :controller => 'matches', :action => 'setup_kill', :conditions => { :method => :get }
  map.register_player 'query/register/:id/:player_id', :controller => 'matches', :action => 'register', :conditions => { :method => :get }
  map.unregister_player 'query/unregister/:id/:player_id', :controller => 'matches', :action => 'unregister', :conditions => { :method => :get }
  map.new_account 'accounts/new', :controller => 'accounts', :action => 'new', :conditions => { :method => :get }
  map.connect 'accounts', :controller => 'accounts', :action => 'create', :conditions => { :method => :post }
  map.connect 'accounts/login', :controller => 'accounts', :action => 'login', :conditions => { :method => :post }
  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'users', :action => 'create'
  map.signup '/signup', :controller => 'users', :action => 'new'
  map.resources :users

  map.resource :session
  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
#  map.connect ':controller/:action/:id'
#  map.connect ':controller/:action/:id.:format'
end
