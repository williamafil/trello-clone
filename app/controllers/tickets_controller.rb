class TicketsController < ApplicationController
  before_action :set_ticket, only: %i[drag show edit update destroy]

  def drag
    old_column_id = @ticket.column_id
    if @ticket.update(ticket_params)
      old_col_tickets = Column.find(old_column_id).tickets
      new_ticket = JSON.parse(@ticket.to_json)
      new_col_tickets = JSON.parse(@ticket.column.tickets.to_json)
      case params[:behavior]
      when 'moved'
        # ticket 在原有 column 移動位置
        puts ' 🍙  moved'
        ActionCable.server.broadcast('column',
                                     { commit: 'REORDER_TICKET',
                                       payload: { ticket: new_ticket, newTickets: new_col_tickets } })
      when 'added'
        # 轉移 ticket 至其他 column
        puts ' 🍙  added'
        ActionCable.server.broadcast('column',
                                     { commit: 'TRANSFER_TICKET',
                                       payload: {
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

    if @ticket.save
      ticket = JSON.parse(@ticket.to_json)
      puts "= = = = "
      puts ticket
      puts "= = = = "
      ActionCable.server.broadcast('column',
                                   { commit: 'ADD_TICKET', payload: ticket })
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tickets/1 or /tickets/1.json
  def update
    if @ticket.update(ticket_params)
      ticket = JSON.parse(@ticket.to_json)
      ActionCable.server.broadcast('column',
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
      ActionCable.server.broadcast('column',
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
