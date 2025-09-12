import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const DATA = [
  { id: "todo-0", name:"Eat", name2: "all", completed: true},
  { id: "todo-1", name:"Sleep", name2: "active", completed: false},
  { id: "todo-2", name:"Repeat", name2: "completed", completed: false},
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App tasks={DATA}/>
  </StrictMode>,
)
