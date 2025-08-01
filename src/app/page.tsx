"use client";

import React, { useState } from "react";
import { TopicSelector } from "@/components/TopicSelector";
import { FoodSubtopicSelector } from "@/components/FoodSubtopicSelector";
import { QuizGame } from "@/components/QuizGame";
import { QuizComplete } from "@/components/QuizComplete";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useQuizState } from "@/hooks/useQuizState";
import { topics } from "@/data/topics";

const FrenchVocabularyQuiz = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>("");
  const [showFoodSubtopics, setShowFoodSubtopics] = useState(false);
  
  const { vocabulary, loading } = useVocabulary(selectedTopic, selectedFoodCategory);
  const {
    quizState,
    settings,
    showTopicSelector,
    handleAnswerSelect,
    handleTypedSubmit,
    nextQuestion,
    resetQuiz,
    startQuiz,
    updateTypedAnswer,
    updateTranslationDirection,
  } = useQuizState(vocabulary, selectedTopic);

  // Load translation direction from localStorage and update settings
  React.useEffect(() => {
    const savedDirection = localStorage.getItem("translationDirection") as
      | "french-to-english"
      | "english-to-french";
    if (savedDirection && savedDirection !== settings.translationDirection) {
      updateTranslationDirection(savedDirection);
    }
  }, [settings.translationDirection, updateTranslationDirection]);

  // Handle topic selection
  const handleStartQuiz = (topic: string) => {
    if (topic === "food") {
      setSelectedTopic(topic);
      setShowFoodSubtopics(true);
    } else {
      setSelectedTopic(topic);
      setSelectedFoodCategory("");
      startQuiz(topic);
    }
  };

  // Handle food subtopic selection
  const handleFoodSubtopicSelect = (category: string) => {
    setSelectedFoodCategory(category);
    setShowFoodSubtopics(false);
    startQuiz("food");
  };

  // Handle back from food subtopics
  const handleBackFromFoodSubtopics = () => {
    setShowFoodSubtopics(false);
    setSelectedTopic("");
    setSelectedFoodCategory("");
  };

  const handleResetQuiz = () => {
    setSelectedTopic("");
    setSelectedFoodCategory("");
    setShowFoodSubtopics(false);
    resetQuiz();
  };

  if (loading && selectedTopic) {
    const topicName = selectedTopic === "food" && selectedFoodCategory 
      ? `${selectedFoodCategory} (Food)` 
      : topics.find((t) => t.id === selectedTopic)?.name.toLowerCase();
      
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading {topicName}...
          </p>
        </div>
      </div>
    );
  }

  if (showFoodSubtopics) {
    return (
      <FoodSubtopicSelector
        questionCount={settings.questionCount}
        translationDirection={settings.translationDirection}
        onSelectSubtopic={handleFoodSubtopicSelect}
        onBack={handleBackFromFoodSubtopics}
      />
    );
  }

  if (showTopicSelector) {
    return (
      <TopicSelector
        topics={topics}
        questionCount={settings.questionCount}
        translationDirection={settings.translationDirection}
        onStartQuiz={handleStartQuiz}
      />
    );
  }

  if (quizState.quizComplete) {
    return (
      <QuizComplete
        score={quizState.score}
        totalQuestions={quizState.questions.length}
        maxStreak={quizState.maxStreak}
        selectedTopic={settings.selectedTopic}
        topics={topics}
        onResetQuiz={handleResetQuiz}
      />
    );
  }

  return (
    <QuizGame
      quizState={quizState}
      settings={settings}
      topics={topics}
      onAnswerSelect={handleAnswerSelect}
      onTypedSubmit={handleTypedSubmit}
      onNextQuestion={nextQuestion}
      onResetQuiz={handleResetQuiz}
      onUpdateTypedAnswer={updateTypedAnswer}
    />
  );
};

export default FrenchVocabularyQuiz;
