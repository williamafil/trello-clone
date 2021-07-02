# config valid for current version and patch releases of Capistrano
lock "~> 3.16.0"

set :application, "trello_clone"
set :repo_url, "git@github.com:williamafil/trello-clone.git"

set :user, 'deploy'
set :rails_env, "production"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, 'main'

# Default value for keep_releases is 5
set :keep_releases, 5

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"
set :deploy_to, "/home/#{fetch(:user)}/#{fetch(:application)}"

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"
append :linked_files, "config/master.key"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
append :linked_dirs, "log", "storage", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "public/packs", ".bundle", "node_modules"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

# before "deploy:assets:precompile", "deploy:yarn_install"

namespace :deploy do
  # desc "Run rake yarn install"
  # task :yarn_install do
  #   on roles(:web) do
  #     within release_path do
  #       execute("cd #{release_path} && yarn install --silent --no-progress --no-audit --no-optional")
  #     end
  #   end
  # end

  desc "reload the database with seed data"
  task :seed do
    on roles(:app) do
      within current_path do
        execute :bundle, :exec, 'rails', 'db:seed', 'RAILS_ENV=production'
      end
    end
  end

  desc 'Migrate database'
  task :migrate_db do
    on roles(:app) do
      within current_path do
        execute :bundle, :exec, 'rails', 'db:migrate', 'RAILS_ENV=production'
      end
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # invoke 'puma:restart'
      invoke 'puma:stop'
      invoke 'puma:start'
    end
  end

  desc 'Upload public folder'
  task :upload_public do
    on roles(:app) do
      upload! 'public/', "#{shared_path}/public/", recursive: true
      
    end
  end

  namespace :check do
    before :linked_files, :set_master_key do
      on roles(:app), in: :sequence, wait: 10 do
        unless test("[ -f #{shared_path}/config/master.key ]")
          upload! 'config/master.key', "#{shared_path}/config/master.key"
        end
      end
    end
  end
end

after :deploy, "puma:start"

namespace :nginx do
  desc 'Setup symlink to nginx'
  task :config do
    on roles(:app), in: :sequence, wait: 10 do
      unless test("[ -f /etc/nginx/sites-enabled/#{fetch(:application)} ]")
        execute :sudo, :ln, '-nfs', 
          "/home/#{fetch(:user)}/#{fetch(:application)}/current/config/nginx.conf", 
          "/etc/nginx/sites-enabled/#{fetch(:application)}"
      end
    end
  end

  [:start, :stop, :restart, :reload, :status].each do |nginx_action|
    desc "Nginx #{nginx_action}"
    task nginx_action do
      on roles(:app) do
        execute :sudo, :service, :nginx, nginx_action
      end
    end
  end
end
