import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const DATA = [
  { id: "todo-0", name:"Eat", progress: 0},
  { id: "todo-1", name:"Sleep", progress: 0},
  { id: "todo-2", name:"Repeat", progress: 0},
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App tasks={DATA}/>
  </StrictMode>,
)

// add completion stage to data, with 3 stage 0, 1, 2
// stage 0 remove checkmark, stage 1 add hourglass, stage 3 add checkmark
// the onChange of the input runs handleOnchange, this function must
// filter the task into the 3 containers properly based on the filter buttons
// all filter all 3, 0 filter active, 1 filter in progress, 2 filter completed
//