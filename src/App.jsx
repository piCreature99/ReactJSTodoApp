import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import Form from "./components/Form";
import TodoContainers from "./components/TodoContainers";
import CountDown from "./components/CountDown";
import backgroundVid from "./assets/fractal.mp4";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true, //implicit return
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
// Object.keys() method to collect an array of FILTER_NAMES:
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  // First of all, we need to put name into an object that has the 
  // same structure as our existing tasks. Inside of the addTask() function, we will make a newTask object to add to the array.
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [pointerDisabled, setPointerDisabled] = useState(false);

  function setPointerStateAll(state){
    setPointerDisabled(state);
  }

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
    key={name} 
    name={name} 
    isPressed={name === filter}
    setFilter={setFilter}
    />
  ));
  const filterContainer = FILTER_NAMES.map((name) => {
    if(name !== "All"){
      return <TodoContainers
      setPointerStateAll={setPointerStateAll}
      pointerState={pointerDisabled} 
      isActive={filter} 
      filterName={name} 
      tasks={tasks} 
      filterMap={FILTER_MAP}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
      />
    }
  });
  // You should always pass a unique key to anything you render with iteration.
  function toggleTaskCompleted(id){ // we need to synchronize the browser with our data because the completed value still stay true
    const updatedTasks = tasks.map((task) => {
      if(id === task.id){
        return {...task, completed: !task.completed}; // the right completed overites the completed value in the ...task
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName){
    const editedTaskList = tasks.map((task) => {
      if (id === task.id){
        return {
          ...task, name: newName
        };
      }
      return task;
    })
    setTasks(editedTaskList);
  }

  function deleteTask(id){
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }
  // console.log(tasks[0]);
  const taskLength = tasks?.filter(FILTER_MAP[filter]).length;
  const tasksNoun = taskLength !== 1 ? "tasks" : "task";
  const headingText = `${taskLength} ${tasksNoun} remaining`;
  function addTask(name){
    const newTask = {id: `todo-${nanoid()}`, name, completed: false}
    setTasks([...tasks, newTask]);
  }

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength){
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  function usePrevious(value){
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const videoRef = useRef(null);

  useEffect(() => {
    // Create the video element
    const videoElement = document.createElement('video');
    videoElement.src = backgroundVid;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.style.position = "absolute";
    videoElement.style.height = "100%";
    videoElement.style.top = "0";
    videoElement.style.left = "50%";
    videoElement.style.transform = "translateX(-50%)";
    videoElement.style.mixBlendMode = "overlay";
    videoElement.style.opacity = ".1";
    
    // Assign the video element to the ref for later cleanup
    videoRef.current = videoElement;

    // Append the video element to the body
    document.body.prepend(videoElement);

    // Cleanup function to remove the video element
    return () => {
      document.body.removeChild(videoRef.current);
    };
  }, []); 
  //compare a number to an unidentified value always return false
  return (
    <div className="todoMain">
      {/* <video className="fractal-vid-main-bg" src={backgroundVid} autoPlay={true} muted loop></video>    */}
      <div className="todoapp stack-large">
        <h1>TodoMatic</h1>
        <Form onSubmit={addTask} /> 
        {/* naming convention onSubmit. "on" prefix tells us that the prop is a callback function */}
        <div className="filters stack-exception">
        {filterList}
        </div>
        
      </div>
      <div className="todoapp2 stack-large">
          <div className="todoapp2-heading">
          </div>
          <div className="todoapp2-heading2">
            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText.toLocaleUpperCase()}</h2>
          </div>
          <CountDown />
      </div>
      {filterContainer}
      {/* <div className="todoapp3 stack-large">
        <ul
          role="list"
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading">
          {taskList}
        </ul>
      </div> */}
    </div>
  );
}

export default App;