import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto p-4">
      <div className="hero bg-base-200 rounded-lg p-6 mb-6">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">Schedule Share</h1>
            <p className="py-4">Moderná aplikácia na tvorbu a zdieľanie rozvrhov.</p>
            <button className="btn btn-primary">Začať</button>
          </div>
        </div>
      </div>
      
      
      <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title">DaisyUI Test</h2>
          <p>Počítadlo: {count}</p>
          <div className="card-actions justify-center mt-4">
            <button onClick={() => setCount((count) => count + 1)} className="btn btn-accent">
              Zvýšiť počet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
