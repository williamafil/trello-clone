class ColumnChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'column'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
