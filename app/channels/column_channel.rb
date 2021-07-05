class ColumnChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'column'
    # stream_from "kanban:#{params[:kanban_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
