class Kanban < ApplicationRecord
  belongs_to :user
  has_many :columns, -> { order(position: :asc) }, dependent: :destroy

  validates_presence_of :name, on: [:create, :update], message: "不可以空白"
end
