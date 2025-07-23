import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PencilIcon, TrashIcon, SaveIcon, PlusIcon } from "lucide-react"
import { Question } from "@/types/QuizTypes"

interface Props {
  index: number
  question: Question
  editingIndex: number | null
  setEditingIndex: (i: number | null) => void
  onSave: (q: Question) => void
  onDelete: () => void
}

const optionLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const EditableQuestionCard: React.FC<Props> = ({
  index,
  question,
  editingIndex,
  setEditingIndex,
  onSave,
  onDelete,
}) => {
  const [localQuestion, setLocalQuestion] = useState<Question>(question)

  const isEditing = editingIndex === index

  const handleOptionChange = (value: string, idx: number) => {
    const updated = [...localQuestion.options]
    updated[idx] = value
    setLocalQuestion({ ...localQuestion, options: updated })
  }

  const handleAddOption = () => {
    setLocalQuestion({
      ...localQuestion,
      options: [...localQuestion.options, `Option ${localQuestion.options.length + 1}`],
    })
  }

  const handleSave = () => {
    onSave(localQuestion)
    setEditingIndex(null)
  }

  return (
    <Card className="max-w-xl mx-auto my-8 w-full">
      <CardHeader>
        {isEditing ? (
          <Textarea
            value={localQuestion.text}
            onChange={(e) => setLocalQuestion({ ...localQuestion, text: e.target.value })}
          />
        ) : (
          <CardTitle className="text-base">
            Q{index + 1}: {question.text}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {isEditing ? (
          <>
            {localQuestion.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <span className="w-5 text-sm">{optionLabels[optIdx] || optIdx + 1}.</span>
                <Input
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, optIdx)}
                  className="w-full"
                />
                <input
                  type="radio"
                  checked={localQuestion.correctIndex === optIdx}
                  onChange={() => setLocalQuestion({ ...localQuestion, correctIndex: optIdx })}
                />
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <Button variant="ghost" size="sm" onClick={handleAddOption}>
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Option
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <SaveIcon className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {question.options.map((opt, optIdx) => (
              <p
                key={optIdx}
                className={
                  optIdx === question.correctIndex
                    ? "font-semibold text-green-600"
                    : ""
                }
              >
                {optionLabels[optIdx] || optIdx + 1}. {opt}
              </p>
            ))}
            <div className="flex justify-end gap-2 mt-2">
              <Button size="icon" variant="outline" onClick={() => setEditingIndex(index)}>
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={onDelete}>
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default EditableQuestionCard
