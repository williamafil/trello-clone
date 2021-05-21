class TicketsController < ApplicationController
  before_action :set_ticket, only: %i[ show edit update destroy ]

  def drag
    @ticket = Ticket.find(params[:id])
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
  def show
  end

  # GET /tickets/new
  def new
    @ticket = Ticket.new
  end

  # GET /tickets/1/edit
  def edit
  end

  # POST /tickets or /tickets.json
  def create
    @ticket = Ticket.new(ticket_params)

    # respond_to do |format|
    #   if @ticket.save
    #     # format.html { redirect_to @ticket, notice: "Ticket was successfully created." }
    #     format.json { render :show, status: :created, location: @ticket }
    #   else
    #     # format.html { render :new, status: :unprocessable_entity }
    #     format.json { render json: @ticket.errors, status: :unprocessable_entity }
    #   end
    # end
    if @ticket.save
      render json: @ticket, status: :ok
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
    # render "show.json"
  end

  # PATCH/PUT /tickets/1 or /tickets/1.json
  def update
    respond_to do |format|
      if @ticket.update(ticket_params)
        format.html { redirect_to @ticket, notice: "Ticket was successfully updated." }
        format.json { render :show, status: :ok, location: @ticket }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @ticket.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tickets/1 or /tickets/1.json
  def destroy
    @ticket.destroy
    respond_to do |format|
      format.html { redirect_to tickets_url, notice: "Ticket was successfully destroyed." }
      format.json { head :no_content }
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
