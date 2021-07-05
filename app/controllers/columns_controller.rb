class ColumnsController < ApplicationController
  before_action :set_column, only: %i[drag show edit update destroy]

  def drag
    @column.insert_at(params[:position].to_i)
    kanban_id = @column.kanban_id
    params = JSON.parse(@column.kanban.columns.to_json)
    ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: '移動了一個看板' } })
    ActionCable.server.broadcast("column", { commit: 'REPOSITION_COLUMN', payload: params })
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
      kanban_id = @column.kanban_id
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: '新增一個看板' } })
      ActionCable.server.broadcast("column", { commit: 'ADD_COLUMN', payload: column })
      render json: @column, status: :ok
    else
      render json: @column.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /columns/1 or /columns/1.json
  def update
    if @column.update(column_params)
      column = JSON.parse(@column.to_json)
      kanban_id = @column.kanban_id
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'success', message: '更新一個看板' } })
      ActionCable.server.broadcast("column", { commit: 'UPDATE_COLUMN', payload: column })
      render json: @column, status: :ok
    else
      render json: @column.errors, status: :unprocessable_entity
    end
  end

  # DELETE /columns/1 or /columns/1.json
  def destroy
    column = JSON.parse(@column.to_json)
    if @column.destroy
      kanban_id = @column.kanban_id
      string = "『#{Kanban.find(kanban_id).name}』看板的 #{@column.name} 卡片被移除了！ "
      ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'error', message: "#{string}" } })
      # ActionCable.server.broadcast("flash:#{current_user.id}", { commit: 'PUSH_NOTICE', payload: { type: 'error', message: '移除一個看板' } })
      ActionCable.server.broadcast("column", { commit: 'DELETE_COLUMN', payload: column })
      render json: { head: :no_content }, status: :ok
    else
      render json: @column.errors, status: :unprocessable_entity
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
