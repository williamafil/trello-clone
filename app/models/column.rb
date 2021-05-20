class Column < ApplicationRecord
  belongs_to :kanban
  has_many :tickets, dependent: :destroy

  validates_presence_of :name, on: [:create, :update], message: "不可以空白"
end
