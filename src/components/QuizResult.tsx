import { ChevronRight } from "lucide-react";
import { checkTypedAnswer } from "@/lib/quiz-utils";
import { Question, QuizMode } from "@/types/quiz";

interface QuizResultProps {
  quizMode: QuizMode;
  selectedAnswer: string;
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
}

export const QuizResult = ({
  quizMode,
  selectedAnswer,
  question,
  currentQuestion,
  totalQuestions,
  onNextQuestion,
}: QuizResultProps) => {
  const isCorrect =
    quizMode === "multiple-choice"
      ? selectedAnswer === question.correct
      : checkTypedAnswer(question.correct, selectedAnswer);

  return (
    <div className="text-center">
      <div className="mb-6">
        {isCorrect ? (
          <div className="text-green-600 font-semibold text-lg">
            ✓ Correct! Great job!
          </div>
        ) : (
          <div className="text-red-600 font-semibold text-lg">
            ✗ Incorrect. The correct answer is &quot;{question.correct}&quot;
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Press Space or Enter to continue
      </div>
      <button
        onClick={onNextQuestion}
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        {currentQuestion < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
        <ChevronRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
};
