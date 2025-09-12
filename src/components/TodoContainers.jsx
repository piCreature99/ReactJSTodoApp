import Todo from "./Todo";
import { useState } from "react";

function TodoContainers(props){
    const [isDragOver, setIsDragOver] = useState(false);
    // dont set useState for props.tasks, useState only add props.task once then need the trigger of function to add it again
    const taskList = props.tasks?.filter(props.filterMap[props.filterName]).map((task) => 
    <Todo 
    pointerState={props.pointerState}
    setPointerStateAll={props.setPointerStateAll}
    id={task.id} 
    name={task.name} 
    filterName={props.filterName}
    completed={task.completed}
    key={task.id}
    toggleTaskCompleted={props.toggleTaskCompleted}
    deleteTask={props.deleteTask}
    editTask={props.editTask}
    />); 

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const itemId = JSON.parse(e.dataTransfer.getData("text/plain"));
        if(itemId[1] !== props.filterName){
            props.toggleTaskCompleted(itemId[0]);
        }
        setIsDragOver(false);
        props.setPointerStateAll(false);
    };

    // const handleDragEnter = () => {
    //     setIsDragOver(true);
    // }

    function handleDragEnter(){
        setIsDragOver(true);
    }

    return(
        <div 
            className="todo-containers"
        >
            <h1>{props.filterName.toUpperCase()}</h1>
            <ul
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={() => setIsDragOver(false)}
                onDragEnter={handleDragEnter}
            >
                <div
                    className={isDragOver ? 'is-drag-over' : 'is-not-drag-over'}
                >
                    <svg  viewBox="0 0 100 100">
                        <polygon points="50,25 50,75 50,50, 25,50 50,50 75,50 50,50"></polygon>
                    </svg>
                </div>
                {props.isActive === props.filterName ? taskList : props.isActive === "All" ? taskList : null}
            </ul>
        </div>
    );
}

export default TodoContainers;