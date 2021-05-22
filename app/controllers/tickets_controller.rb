class TicketsController < ApplicationController
  before_action :set_ticket, only: %i[drag show edit update destroy]

  def drag
    # @ticket = Ticket.find(params[:id])
    # kanban_id = params[:kanban_id]
    # column_id = params[:column_id]
    # position = params[:position]

    if @ticket.update(ticket_params)
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
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tickets/1 or /tickets/1.json
  def update
    if @ticket.update(ticket_params)
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tickets/1 or /tickets/1.json
  def destroy
    if @ticket.destroy
      render json: { head: :no_content }, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end

    # @ticket.destroy
    # respond_to do |format|
    #   format.html { redirect_to tickets_url, notice: 'Ticket was successfully destroyed.' }
    #   format.json { head :no_content }
    # end
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
