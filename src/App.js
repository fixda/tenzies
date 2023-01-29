import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [round, setRound] = React.useState(1)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        // const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === round)
        if (allHeld && allSameValue) {
            setRound(oldRound => oldRound = oldRound + 1)
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(round == 7 && tenzies){
          setRound(oldRound => oldRound = 1)
          setDice(allNewDice())
          setTenzies(false)
        }
        else if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    // function displayButton(){
    //     if(round=6 && tenzies){
    //      return "New Game"
    //     }else if(tenzies){
    //      return "Next Round" 
    //     } else{
    //       return "Roll"
    //     }
    // }
    
    return (
        <main>
            {tenzies && round == 7 && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">{ 
                round == 7 ? "You Won!" : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls." }</p>
            <p className="instructions">{
                round == 7 ? "" : `Round ${round}, Collect all ${round}'s` }</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
              {tenzies && round==7 ? "New Game" 
              : tenzies ? "Next Round" : "Roll"}
            </button>
        </main>
    )
}