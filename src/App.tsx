import { Routes, Route } from 'react-router-dom'
import StartScreen from './pages/StartScreen'
import QuizScreen from './pages/QuizScreen'
import ProcessingScreen from './pages/ProcessingScreen'
import ResultScreen from './pages/ResultScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/quiz" element={<QuizScreen />} />
      <Route path="/processing" element={<ProcessingScreen />} />
      <Route path="/result" element={<ResultScreen />} />
    </Routes>
  )
}
