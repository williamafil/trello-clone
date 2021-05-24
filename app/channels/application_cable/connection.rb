module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      puts "= = = = request.env['warden'].user = = = ="
      puts request.env['warden'].user
      if current_user = request.env['warden'].user
        puts '= = = = current_user: = = = ='
        puts current_user.name
        current_user
      else
        puts '= = = = 使用者未登入，拒絕連線 = = = ='
        reject_unauthorized_connection
      end
    end
  end
end
