import { useState, useEffect, useRef } from 'react'

function App() {
  const [display, setDisplay] = useState('0')
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const displayRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to show the latest input
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth
    }
  }, [display])

  const inputNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num)
    setWaitingForNewValue(false)
  }

  const inputDecimal = () => {
    if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
    setWaitingForNewValue(false)
  }

  const clear = () => {
    setDisplay('0')
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const performOperation = (nextOperation: string) => {
    // If same operation is clicked multiple times, do nothing
    if (operation === nextOperation && waitingForNewValue) {
      return
    }

    // If there's already an operation pending (user is changing their mind)
    if (operation && waitingForNewValue) {
      // Replace the previous operation in the display
      const currentDisplay = display.trim()
      if (currentDisplay.endsWith(` ${operation}`)) {
        const newDisplay = currentDisplay.slice(0, -operation.length) + nextOperation + ' '
        setDisplay(newDisplay)
        setOperation(nextOperation)
        return
      }
    }

    // Append the operation to the display
    setDisplay(display + ` ${nextOperation} `)
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

  const evaluateExpression = (expression: string): number => {
    // Split the expression into tokens (numbers and operators)
    const tokens = expression.split(' ').filter(token => token.trim() !== '')
    
    if (tokens.length < 3) {
      // Simple number, convert percentage if needed
      const token = tokens[0]
      if (token.includes('%')) {
        return parseFloat(token.replace('%', '')) / 100
      }
      return parseFloat(token) || 0
    }
    
    // Start with the first number (convert percentage if needed)
    const firstToken = tokens[0]
    let result = firstToken.includes('%') 
      ? parseFloat(firstToken.replace('%', '')) / 100 
      : parseFloat(firstToken)
    
    // Process pairs of operator and number
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i]
      const nextToken = tokens[i + 1]
      
      if (nextToken) {
        let nextNumber
        
        if (nextToken.includes('%')) {
          // For percentage operations, calculate percentage of the current result
          const percentValue = parseFloat(nextToken.replace('%', ''))
          if (operator === '+' || operator === '-') {
            // For + and -, percentage is applied to the current result
            nextNumber = (result * percentValue) / 100
          } else {
            // For × and ÷, just convert percentage to decimal
            nextNumber = percentValue / 100
          }
        } else {
          nextNumber = parseFloat(nextToken)
        }
        
        if (!isNaN(nextNumber)) {
          result = calculate(result, nextNumber, operator)
        }
      }
    }
    
    return result
  }

  const handleEquals = () => {
    if (display.trim() !== '' && display !== '0') {
      const result = evaluateExpression(display)
      setDisplay(String(result))
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const toggleSign = () => {
    // Split the display into tokens and filter out empty strings
    const tokens = display.split(' ').filter(token => token.trim() !== '')
    
    // If we're in the middle of entering a number (no pending operation)
    if (tokens.length === 1) {
      // Simple case: just one number, toggle its sign
      const num = tokens[0]
      if (num !== '0') {
        setDisplay(num.charAt(0) === '-' ? num.slice(1) : '-' + num)
      }
    } else if (tokens.length >= 3 && tokens.length % 2 === 1) {
      // Complex case: we have complete number-operator-number pattern(s)
      // Only toggle if we have an odd number of tokens (ending with a number)
      const lastToken = tokens[tokens.length - 1]
      
      // Only toggle if the last token is a number (not an operator)
      if (lastToken && !isNaN(parseFloat(lastToken))) {
        const newLastToken = lastToken.charAt(0) === '-' ? lastToken.slice(1) : '-' + lastToken
        tokens[tokens.length - 1] = newLastToken
        setDisplay(tokens.join(' '))
      }
    }
    // If we have even number of tokens (like ["5", "+"]), do nothing
  }

  const percentage = () => {
    // Split the display into tokens and filter out empty strings
    const tokens = display.split(' ').filter(token => token.trim() !== '')
    
    if (tokens.length === 1) {
      // Simple case: just one number, append %
      const num = tokens[0]
      if (num !== '0' && !num.includes('%')) {
        setDisplay(num + '%')
      }
    } else if (tokens.length >= 3 && tokens.length % 2 === 1) {
      // Complex case: we have complete number-operator-number pattern(s)
      const lastToken = tokens[tokens.length - 1]
      
      // Only add % if the last token is a number and doesn't already have %
      if (lastToken && !isNaN(parseFloat(lastToken)) && !lastToken.includes('%')) {
        tokens[tokens.length - 1] = lastToken + '%'
        setDisplay(tokens.join(' '))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5 font-apple">
      <div className="bg-black rounded-3xl p-5 shadow-2xl w-80 max-w-full">
        {/* Display */}
        <div className="bg-black px-3 pb-3 mb-4 text-right min-h-20 flex items-end justify-end">
          <div 
            ref={displayRef}
            className="text-white text-5xl font-light leading-none whitespace-nowrap overflow-x-auto max-w-full hide-scrollbar"
            style={{
              textAlign: 'left',
              direction: 'ltr'
            }}
          >
            <div style={{ display: 'inline-block' }}>
              {display}
            </div>
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
