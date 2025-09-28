import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import Form from "./components/Form";
import TodoContainers from "./components/TodoContainers";
import CountDown from "./components/CountDown";
import backgroundVid from "./assets/fractal.mp4";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay, // <-- NEW: Import DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { collection, doc, query, orderBy, getDocs, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import { db } from './firebaseConfig.js';

const FILTER_MAP = {
  All: () => true, //implicit return
  Active: (task) => task.progress === 0,
  Completed: (task) => task.progress === 2,
  inProgress: (task) => task.progress === 1,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [currentProgress, setCurrentProgress] = useState("Active");
  const [defaultProgress, setDefaultProgress] = useState("Active");

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
      isDraggingAndID={[isDragging, activeId]}
      id={name}
      isActive={filter} 
      key={name}
      filterName={name} 
      tasks={tasks} 
      filterMap={FILTER_MAP}
      toggleTaskProgress={toggleTaskProgress}
      deleteTask={deleteTask}
      editTask={editTask}
      />
    }
  });
  // You should always pass a unique key to anything you render with iteration.
  // the useState only keep values across re-render of the component it's declared in
  function toggleTaskProgress(id, progress){ // we need to synchronize the browser with our data because the completed value still stay true
    progress = (progress + 1) % 3;
    const updatedTasks = tasks.map((task) => {
      if(id === task.id){
        return {...task, progress: progress}; // the right completed overites the completed value in the ...task
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
  const taskLength = tasks?.filter(FILTER_MAP[filter]).length;
  const tasksNoun = taskLength !== 1 ? "tasks" : "task";
  const headingText = `${taskLength} ${tasksNoun} remaining`;
  function addTask(name){
    const newTask = {id: `todo-${nanoid()}`, name, progress: 0}
    setTasks([...tasks, newTask]);
  }

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
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
  
  const progressList = ["Active", "inProgress", "Completed"]

  function handleDragEnd(event){
    const { active, over } = event;
      
    // const currentData = active.data.current;
    if(over){
      const progress = currentProgress === "Active" ? 0 :
      currentProgress === "inProgress" ? 1 : 2;  
      toggleTaskProgress(active.id, progress - 1);
    }
    // console.log(progress);

    if (over && active.id !== over.id) {
      setTasks((currentTasks) => {
        const oldIndex = currentTasks.findIndex(task => task.id === active.id);
        const newIndex = currentTasks.findIndex(task => task.id === over.id);
        return arrayMove(currentTasks, oldIndex, newIndex);
      });
    }
    // console.log(over.id);
    // console.log(active.id);
    setCurrentTodo(null);
    setActiveId(null);
    setIsDragging(false);
  } 

  function handleDragStart(event){
    setActiveId(event.active.id);
    setIsDragging(true);
    const container = tasks.find(task => task.id === event.active.id);
    setDefaultProgress(progressList[container.progress]);
    setCurrentProgress(progressList[container.progress]);
    // Find the complete task data object for the active item
    const activeTask = tasks.find(task => task.id === event.active.id);
    // console.log(event);
  // If the task is found, set the currentTodo state with its full data
    if (activeTask) {
      setCurrentTodo(
        <Todo
          id={activeTask.id}
          name={activeTask.name}
          progress={activeTask.progress}
          // Pass any other necessary props
          isOverlay={true}// Pass custom props if needed
        />
      );
    }
  }

  function handleDragCancel(){
    console.log("drag cancel");
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragOver(event){
    if(event.over && progressList.includes(event.over.id)){
      setCurrentProgress(event.over.id);
      // console.log(event.over);
    }
  }
  
  //compare a number to an unidentified value always return false
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={(pointerWithin)}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="todoMain">
          <div className="todoapp stack-large">
            <h1>TodoMatic</h1>
              <Form onSubmit={addTask} /> 
            <div className="filters stack-exception">
              {filterList}
            </div>
            <CountDown />
          </div>
          {filterContainer}
        </div>
      </SortableContext>
      <DragOverlay>
          {currentTodo ? (
            currentTodo) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;

// Detect whether or not the item is in the container, when
// inside the container allow normal array sorting, outside of
// the container allows dropping, and sorting when re-enter a 
// container

// At beginning, ignore the id if it's the progress id, save the
// last item's over.id, update the item's over id only when
// the pointer is moved to another item within that container
// on container leave