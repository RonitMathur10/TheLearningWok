import { useState } from 'react'
import './App.css'
//import CreateForm from './Components/CreateForm.tsx';
import type { GameState } from './types/game.ts';
import { Questions } from "./Components/QuestionList.ts"
import { saveQuizResult } from './firebase/quizService'

function App() {
  const [inputAge, setInputAge] = useState<number>(0); // see if i can make it <number | null>
  const [inputName, setInputName] = useState<string>("");
  // const [showForm, setShowForm] = useState<boolean>(false);
  //const [questionInput, setQuestionInput] = useState<any>("");
  // const [currentTestState, setCurrentTestState] = useState<GameState>("currently-testing") // set back to sign-in later
  const [currentTestState, setCurrentTestState] = useState<GameState>("sign-in")
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(1);
  const [inputAnswer, setInputAnswer] = useState<number | string>("");
  const [userAnswers, setUserAnswers] = useState<number[][]>([]); // Array of arrays to store question index and answer
  const [userPoints, setUserPoints] = useState<number>(0);
  const [questionPoints, setQuestionPoints] = useState<number>(Questions[currentQuestion].points);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  //const arrayForQuestion = ["one", "two", "three"];
  //change from numbers to true

  //function determineQuestion(age: typeof inputAge)
  function determineQuestion(age: number) { // see how to make the squiggly go away on "age" when using null - error: App.tsx:47 A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info:
    const category = (age < 13) ? "Child" : (age < 20) ? "Teenager" : "Adult";
    console.log(category); // Output: Adult

    // change age to grade
  }

  //const handleSubmit = (inputAge: number, inputName: string, e: React.FormEvent<HTMLFormElement>) => {
  const handleStartSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(""); // Clear previous errors
    
    if (inputAge <= 0 || inputName.trim() === "") {
      setErrorMessage("Please fill in all fields with valid information.");
      return;
    }
    
    if (inputAge > 120) {
      setErrorMessage("Please enter a valid age.");
      return;
    }
    
    console.log("Form submitted");
    setCurrentTestState("currently-testing") // change state of form from sign-in to testing
    determineQuestion(inputAge)
    // setShowForm(true);
  };

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    
    if (inputAnswer === undefined || inputAnswer === "") {
      setErrorMessage("Please provide an answer.");
      return;
    }
    
    handleAnswerEvaluation();
  }

  const handleAnswerEvaluation = () => {
    if (attempts < 3) {
      if (inputAnswer === Questions[currentQuestion].answer) {
        setUserAnswers((prev) => [...prev, [currentQuestion, inputAnswer]]);
        setUserPoints((prev) => (prev + questionPoints))
        handleRenderNextQuestion()
      }
      else {
        setAttempts((prev) => prev + 1)
        setQuestionPoints((prev) => (prev - 1))
      }
    }
    else {
      console.log("Maximum attempts reached.");
      setAttempts(1)
      //setUserAnswers((prev) => [...prev, [currentQuestion, inputAnswer || -1]]); // Store the answer attempt
      handleRenderNextQuestion(); // Move to the next question after max attempts
    }
  }

  const handleRenderNextQuestion = () => {
    if ( currentQuestion < Questions.length - 1 ) {
      setCurrentQuestion((prev) => (prev + 1))
      setQuestionPoints(() => Questions[currentQuestion + 1].points)
      setInputAnswer(""); // Reset the input answer after submission
      setErrorMessage(""); // Clear any error messages
    }
    else {
      console.log("Quiz finished");
      setCurrentTestState("finished");
      handleSaveQuizResult(); // Save results to Firebase
    }
  }

  const handleSaveQuizResult = async () => {
    setIsLoading(true);
    setSaveStatus("");
    
    try {
      const quizData = {
        userName: inputName,
        userAge: inputAge,
        answers: userAnswers,
        totalPoints: userPoints,
        questionsAttempted: Questions.length
      };
      
      const resultId = await saveQuizResult(quizData);
      
      if (resultId) {
        setSaveStatus("Quiz results saved successfully!");
      } else {
        setSaveStatus("Failed to save quiz results. Please try again.");
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      setSaveStatus("Error saving quiz results. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>

      {/* <nav className="topnav">
        <h1>Testing nav</h1>
        <a href="https://thelearningwok.com/" target="_blank">Testing Link</a>
      </nav> */}
      <header>
        {/* Top Info Bar */}
        <div className="top-bar">
          <span>📞 (732) 930-3560</span>
          {/* change logos and add links */}
          <span>✉️ reshma@thelearningwok.com</span>
        </div>

        {/* Main Navigation */}
        <nav className="main-nav">
          <div className="logo">
            <img src="/logo.png" alt="The Learning Wok" />
            <span>THE LEARNING WOK</span>
          </div>
          <ul className="nav-links">
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Programs</a></li>
            <li><a href="#">Schedule</a></li>
            <li><a href="#">Initiatives</a></li>
            <li><a href="#">About</a></li>
            {/* ADD LINKS */}
          </ul>
        </nav>
      </header>



      {/*<Header/>*/}
      {currentTestState === "sign-in" && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Quiz</h1>
              <p className="text-gray-600">Test your knowledge and track your progress</p>
            </div>
            
            <form onSubmit={(e) => handleStartSubmit(e)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={inputName} 
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Age
                </label>
                <input 
                  id="age"
                  type="number" 
                  placeholder="Enter your age" 
                  value={inputAge || ""} 
                  onChange={(e) => setInputAge(Number(e.target.value))}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                />
              </div>
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errorMessage}
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Quiz! 🚀
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Ready to challenge yourself? Let&apos;s begin!</p>
            </div>
          </div>
        </div>
      )}
      {/* Create a StartScreen functions for the code above */}
      {/*}
      <h3>Name: {inputName}</h3>
      <h3>Age: {inputAge}</h3>
      <h3>TestState: {currentTestState}</h3>
      */}

      {/* top left: className="absolute top-0 left-0 size-16" */}

      {currentTestState === "currently-testing" && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Daily Quiz</h1>
                <span className="text-lg font-semibold text-blue-600">Welcome, {inputName}!</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / Questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {Questions.length}</span>
                <span>Score: {userPoints} points</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {Questions[currentQuestion].question}
                </h2>
                <div className="flex justify-center items-center gap-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                    attempts === 1 ? 'bg-green-100 text-green-700' :
                    attempts === 2 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Attempt {attempts}/3
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {questionPoints} points available
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => handleQuestionSubmit(e)} className="space-y-6">
                {/* Answer Choices */}
                <div className="grid grid-cols-2 gap-4">
                  {Questions[currentQuestion].choices.map((choice, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setInputAnswer(choice)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-lg font-semibold ${
                        inputAnswer === choice
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                {/* Custom Answer Input */}
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Or enter a custom answer:</p>
                  <input 
                    type="number" 
                    value={inputAnswer || ""} 
                    onChange={(e) => setInputAnswer(Number(e.target.value))}
                    placeholder="Enter your answer"
                    className="w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg"
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    {errorMessage}
                  </div>
                )}

                <div className="text-center">
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Submit Answer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
      }

      {currentTestState === "finished" && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 Quiz Complete!</h1>
              <p className="text-xl text-gray-600">Great job, {inputName}! Here are your results:</p>
            </div>

            {/* Score Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl font-bold text-blue-600">{userPoints}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Final Score</h2>
                <p className="text-gray-600">Out of {Questions.length * 3} possible points</p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">{Questions.length}</div>
                  <div className="text-sm text-green-700">Questions Attempted</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{userAnswers.length}</div>
                  <div className="text-sm text-blue-700">Questions Answered</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {Math.round((userPoints / (Questions.length * 3)) * 100)}%
                  </div>
                  <div className="text-sm text-purple-700">Success Rate</div>
                </div>
              </div>

              {/* Answer Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Answers:</h3>
                <div className="space-y-3">
                  {userAnswers.map((answer, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Question {answer[0] + 1}</span>
                      <span className="font-semibold text-gray-800">Your answer: {answer[1]}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        answer[1] === Questions[answer[0]].answer 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {answer[1] === Questions[answer[0]].answer ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Status */}
              {isLoading && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Saving your results...
                  </div>
                </div>
              )}

              {saveStatus && (
                <div className={`text-center mb-6 px-4 py-3 rounded-lg ${
                  saveStatus.includes('successfully') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveStatus}
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Take Quiz Again 🔄
                </button>
                
                <div className="text-sm text-gray-500">
                  <p>Want to improve your score? Try again!</p>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">
                  {userPoints >= Questions.length * 2.5 ? "Outstanding! 🌟" :
                   userPoints >= Questions.length * 2 ? "Great job! 👏" :
                   userPoints >= Questions.length ? "Good effort! 💪" :
                   "Keep practicing! 📚"}
                </h3>
                <p className="text-blue-100">
                  {userPoints >= Questions.length * 2.5 ? "You're a quiz master!" :
                   userPoints >= Questions.length * 2 ? "You really know your stuff!" :
                   userPoints >= Questions.length ? "You're on the right track!" :
                   "Every attempt makes you better!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
      }
      
    </>
  )
}

export default App

{/*

  {userAnswers.forEach((innerList, outerIndex) => {
    innerList.forEach((number, innerIndex) => {
      console.log(`Value at [${outerIndex}][${innerIndex}]: ${number}`);
    });
  })};
  <h3>{value}</h3>

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

<div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

*/}

//       create function for checking attempts and answer first, then render next question