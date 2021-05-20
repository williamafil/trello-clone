class Column < ApplicationRecord
  belongs_to :kanban
  act_as_list scope: :kanban

  has_many :tickets, -> { order(position: :asc) }, dependent: :destroy
  

  validates_presence_of :name, on: [:create, :update], message: "不可以空白"
end
