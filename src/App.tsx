import { useState } from 'react'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display)
    }
  }

  const percentage = () => {
    const value = parseFloat(display) / 100
    setDisplay(String(value))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5 font-apple">
      <div className="bg-black rounded-3xl p-5 shadow-2xl w-80 max-w-full">
        {/* Display */}
        <div className="bg-black px-3 pb-3 mb-4 text-right min-h-20 flex items-end justify-end">
          <div className="text-white text-5xl font-light leading-none max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {display}
          </div>
        </div>
        
        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3 justify-center">
          {/* First Row */}
          <button 
            className="h-16 w-16 rounded-full bg-gray-400 text-black text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-300 active:scale-95 active:bg-gray-500"
            onClick={clear}
          >
            AC
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-400 text-black text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-300 active:scale-95 active:bg-gray-500"
            onClick={toggleSign}
          >
            +/-
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-400 text-black text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-300 active:scale-95 active:bg-gray-500"
            onClick={percentage}
          >
            %
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-orange-400 active:scale-95 active:bg-orange-600"
            onClick={() => performOperation('÷')}
          >
            ÷
          </button>
          
          {/* Second Row */}
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('7')}
          >
            7
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('8')}
          >
            8
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('9')}
          >
            9
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-orange-400 active:scale-95 active:bg-orange-600"
            onClick={() => performOperation('×')}
          >
            ×
          </button>
          
          {/* Third Row */}
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('4')}
          >
            4
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('5')}
          >
            5
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('6')}
          >
            6
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-orange-400 active:scale-95 active:bg-orange-600"
            onClick={() => performOperation('-')}
          >
            -
          </button>
          
          {/* Fourth Row */}
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('1')}
          >
            1
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('2')}
          >
            2
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('3')}
          >
            3
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-orange-400 active:scale-95 active:bg-orange-600"
            onClick={() => performOperation('+')}
          >
            +
          </button>
          
          {/* Fifth Row */}
          <button 
            className="col-span-2 h-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center pl-5 transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={() => inputNumber('0')}
          >
            0
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-gray-700 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-800"
            onClick={inputDecimal}
          >
            .
          </button>
          <button 
            className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-normal flex items-center justify-center transition-all duration-200 hover:bg-orange-400 active:scale-95 active:bg-orange-600"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
