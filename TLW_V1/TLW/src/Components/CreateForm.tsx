//import type { CreateFormProps } from '../types/game';
import { Questions } from "./QuestionList.ts"
import type { Question } from "../types/game.ts"

//export default function CreateForm({questionInput, index }: CreateFormProps) {
export default function CreateForm() {

    //const displayArray = [true, true, true]

    function displayQuestion (questionTest: Question) {
        return (
        <>
            <h3>{questionTest.question}</h3>
            <p>{questionTest.choices}</p>
            <p>{questionTest.answer}</p>
        </>
    )
    }

    return (
        <>
            {/*{displayArray.map((_: boolean, index: number) => displayQuestion(Questions[index]))}*/}
            {Questions.map((question: Question) => displayQuestion(question))}

        </>
    )

    {/*
    return (
        <>
            <h2>Question {index+1}</h2>
            <p>image {index+1}</p>
            <input type="number"/>
            {displayArray.map((_, index) => displayQuestion(Questions[index]))
            }
        </>
    )
    */}
}