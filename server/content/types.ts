export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_the_blank'
  | 'multiple_select'
  | 'image_quiz'

export interface QuestionOption {
  id: string
  text: string
}

export interface BaseQuestion {
  id: string
  type: QuestionType
  prompt: string
  hint: string
  explanation: string
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice'
  options: QuestionOption[]
  correctAnswer: {
    optionId: string
  }
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false'
  options: [QuestionOption, QuestionOption]
  correctAnswer: {
    value: boolean
  }
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill_in_the_blank'
  correctAnswer: {
    acceptedAnswers: string[]
  }
}

export interface MultipleSelectQuestion extends BaseQuestion {
  type: 'multiple_select'
  options: QuestionOption[]
  correctAnswer: {
    optionIds: string[]
  }
}

export interface ImageQuizQuestion extends BaseQuestion {
  type: 'image_quiz'
  mediaKey: string
  mediaCaption: string
  options: QuestionOption[]
  correctAnswer: {
    optionId: string
  }
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInTheBlankQuestion
  | MultipleSelectQuestion
  | ImageQuizQuestion

export interface LessonContent {
  id: string
  contentVersion: string
  categoryId: string
  unitId: string
  title: string
  description: string
  difficulty: 'easy' | 'medium'
  estimatedMinutes: number
  order: number
  prerequisites: string[]
  xpReward: number
  questions: QuizQuestion[]
}

export interface UnitDefinition {
  id: string
  categoryId: string
  title: string
  description: string
  order: number
}

export interface CategoryDefinition {
  id: string
  title: string
  description: string
  publicMeta: string
  order: number
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  ruleType: 'first_lesson' | 'mastered_lesson' | 'category_complete' | 'lessons_count'
  targetValue: string | number
}

export type SanitizedQuizQuestion = Omit<QuizQuestion, 'correctAnswer'>
