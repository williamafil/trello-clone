class TicketsController < ApplicationController
  before_action :set_ticket, only: %i[drag show edit update destroy]

  def drag
    kanban_id = @ticket.column.kanban_id
    old_column_id = @ticket.column_id
    if @ticket.update(ticket_params)
      old_col_tickets = Column.find(old_column_id).tickets
      new_ticket = JSON.parse(@ticket.to_json)
      new_col_tickets = JSON.parse(@ticket.column.tickets.to_json)
      case params[:behavior]
      when 'moved'
        ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: 'A ticket being shifted' } })
        ActionCable.server.broadcast("column", { commit: 'REORDER_TICKET', payload: { kanbanId: kanban_id, ticket: new_ticket, newTickets: new_col_tickets } })
      when 'added'
        # 轉移 ticket 至其他 column
        ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: 'A ticket being transfered to another card' } })
        ActionCable.server.broadcast("column",
                                     { commit: 'TRANSFER_TICKET',
                                       payload: {
                                        kanbanId: kanban_id,
                                         old_column_id: old_column_id,
                                         ticket: new_ticket,
                                         oldTickets: old_col_tickets,
                                         newTickets: new_col_tickets
                                       } })
      end
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # GET /tickets or /tickets.json
  def index
    @tickets = Ticket.all
  end

  # GET /tickets/1 or /tickets/1.json
  def show; end

  # GET /tickets/new
  def new
    @ticket = Ticket.new
  end

  # GET /tickets/1/edit
  def edit; end

  # POST /tickets or /tickets.json
  def create
    @ticket = Ticket.new(ticket_params)
    kanban_id = @ticket.column.kanban_id

    if @ticket.save
      ticket = JSON.parse(@ticket.to_json)
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: 'A ticket being created' } })
      ActionCable.server.broadcast("column",
                                   { commit: 'ADD_TICKET', payload: ticket })
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tickets/1 or /tickets/1.json
  def update
    if @ticket.update(ticket_params)
      kanban_id = @ticket.column.kanban_id
      ticket = JSON.parse(@ticket.to_json)
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'warning', message: 'A ticket being updated' } })
      ActionCable.server.broadcast("column",
                                   { commit: 'EDIT_TICKET', payload: ticket })
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tickets/1 or /tickets/1.json
  def destroy
    ticket = JSON.parse(@ticket.to_json)
    if @ticket.destroy
      kanban_id = @ticket.column.kanban_id
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'error', message: 'A ticket being deleted' } })
      ActionCable.server.broadcast("column",
                                   { commit: 'DELETE_TICKET', payload: ticket })
      render json: { head: :no_content }, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_ticket
    @ticket = Ticket.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def ticket_params
    params.require(:ticket).permit(:name, :column_id, :position)
  end
end
