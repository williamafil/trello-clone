class Ticket < ApplicationRecord
  belongs_to :column
  acts_as_list scope: :column

  validates_presence_of :name, on: [:create, :update], message: "不可以空白"
end
