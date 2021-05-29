class ColumnsController < ApplicationController
  before_action :set_column, only: %i[drag show edit update destroy]

  def drag
    @column.insert_at(params[:position].to_i)
    params = JSON.parse(@column.kanban.columns.to_json)
    ActionCable.server.broadcast('column', { commit: 'REPOSITION_COLUMN', payload: params })
    render 'show.json'
  end

  # GET /columns or /columns.json
  def index
    @kanban = Kanban.find(params[:kanban_id])
    @columns = @kanban.columns
  end

  # GET /columns/1 or /columns/1.json
  def show; end

  # GET /columns/new
  def new
    @column = Column.new
  end

  # GET /columns/1/edit
  def edit; end

  # POST /columns or /columns.json
  def create
    @column = Column.new(column_params)
    if @column.save
      column = JSON.parse(@column.to_json)
        ActionCable.server.broadcast('column',
                                    { commit: 'ADD_COLUMN', payload: column })
      render json: @column, status: :ok
    else
      render json: @column.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /columns/1 or /columns/1.json
  def update
    respond_to do |format|
      if @column.update(column_params)
        format.html { redirect_to @column, notice: 'Column was successfully updated.' }
        format.json { render :show, status: :ok, location: @column }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @column.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /columns/1 or /columns/1.json
  def destroy
    @column.destroy
    respond_to do |format|
      format.html { redirect_to columns_url, notice: 'Column was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_column
    @column = Column.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def column_params
    params.require(:column).permit(:name, :kanban_id, :position)
  end
end
