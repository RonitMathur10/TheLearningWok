import { useState } from 'react'
import './App.css'
//import CreateForm from './Components/CreateForm.tsx';
import type { GameState } from './types/game.ts';
import { Questions } from "./Components/QuestionList.ts"


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

  //const arrayForQuestion = ["one", "two", "three"];
  //change from numbers to true

  //function determineQuestion(age: typeof inputAge)
  function determineQuestion(age: number) { // see how to make the squiggly go away on "age" when using null - error: App.tsx:47 A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info:
    const category = (age < 13) ? "Child" : (age < 20) ? "Teenager" : "Adult";
    console.log(category); // Output: Adult

    // change age to grade
  }

  //const handleSubmit = (inputAge: number, inputName: string, e: any) => {
  const handleStartSubmit = (e: any) => {
    e.preventDefault()
    if (inputAge != 0 && inputName != "") {
      console.log("Form submitted");
      setCurrentTestState("currently-testing") // change state of form from sign-in to testing
      determineQuestion(inputAge)
      // setShowForm(true);
    } else {
      <p>Please fill in all fields.</p>;// this will not work, need to use state to show error message
    }
  };

  const handleQuestionSubmit = (e: any) => {
    e.preventDefault();
    if (inputAnswer != undefined && inputAnswer != "") {
      handleAnswerEvaluation();
    }
    else {
      console.log("Please provide an answer.");
      <p>Please provide an answer.</p>; // this will not work, need to use state to show error message
    }
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
      setQuestionPoints(() => Questions[currentQuestion].points)
      setInputAnswer(""); // Reset the input answer after submission
    }
    else {
      console.log("Quiz finished");
      setCurrentTestState("finished");
    }
  }


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
        <>
          {/*<form onSubmit={(e) => handleSubmit(inputAge, inputName, e)}>*/}
          <form onSubmit={(e) => handleStartSubmit(e)}>
            <input type="text" placeholder="Name" value={inputName} onChange={(e) => setInputName(e.target.value)}/>
            <input type="number" placeholder="Age" value={inputAge} onChange={(e) => setInputAge(Number(e.target.value))}/>
            {/*<input type="submit" onClick={() => window.location.reload()} />*/}
            <button className = "custom-button" type="submit">Start Quiz!</button>
          </form>
        </>
      )}
      {/* Create a StartScreen functions for the code above */}
      {/*}
      <h3>Name: {inputName}</h3>
      <h3>Age: {inputAge}</h3>
      <h3>TestState: {currentTestState}</h3>
      */}

      {/* top left: className="absolute top-0 left-0 size-16" */}

      {currentTestState === "currently-testing" && (
        // <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <>
          <h1 className="absolute inset-x-0 top-15 h-16 font-[550]">Daily Quiz</h1>
          {/* <h2 className="text-[25px] size-30">Welcome {inputName}!</h2>
          <p className="mb-1 text-xl font-semibold text-slate-900">{currentQuestion}</p> */}
          {/* <p>{userAnswers.map((value, i) => (
            <div key={i}>{value.join(", ")}</div>
          ))}</p> */}

          <form className="grid gap-3" style={{display: "flex", flexDirection: "column", justifyContent: "center"}} onSubmit={(e) => handleQuestionSubmit(e)}>
            <h3 className="text-blue-600/100 dark:text-sky-400/100">Current Question: {currentQuestion + 1}</h3>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
              {/* {/* <p className="ring-1 rounded-lg">Question: {Questions[currentQuestion].question}</p>
              <p className="ring-1 rounded-lg">Answer: {Questions[currentQuestion].answer}</p> */}
              <p className="ring-1 rounded-lg">Attempts: {attempts}</p>
              <input className="ring-1 rounded-lg" type="number" value={inputAnswer} onChange={(e) => setInputAnswer(Number(e.target.value))}/>
              <button className="ring-2 rounded-lg bg-blue-500/100" type="submit">Submit Answer</button>
            </div>
          </form>
                        {/* <button className="ring-2 rounded-lg bg-blue-500/100" onClick={(e) => handleQuestionSubmit(e)}>Submit Question</button> */}
          {/* <form onSubmit={(e) => handleQuestionSubmit(e)}> */}
          {/* <button onClick={(e) => handleQuestionSubmit(e)}>Next Question</button>     ADD AFTER ANSWERED CORRECTLY OR ALL TRIES USED*/}
          {/* Reset answer AND add inputs

          {/*<CreateForm />*/}

          {/*}
          {arrayForQuestion.map((_, index) => {return (
            <CreateForm questionInput={questionInput} index={index} key={index}/>
          )})}
          */}
          {/*add the logic above into the parameter of a generate question (??) function where the map functions returns a dictionary (dict in react, whatever it's called) of each image and its props
          then
          */}
        {/* </div> */}
        </>
      )
      }

      {currentTestState === "finished" && (
        <div>
          <h1>Thank you for taking the quiz!</h1>
          {/* {userAnswers.flat().map((value) => (<span>{value}</span>))} */}
          {userAnswers.map((value, i) => (
            <div key={i}>{value.join(", ")}</div>
          ))}
          {userPoints}
          <button onClick={() => window.location.reload()}>Restart Quiz</button>
          {/* add a button to restart the quiz */}
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