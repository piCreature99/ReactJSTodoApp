import Todo from "./Todo";
import { useState } from "react";
import { useDroppable, DragOverlay } from "@dnd-kit/core";


function TodoContainers(props){
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    // const [isDragOver, setIsDragOver] = useState(false);
    // dont set useState for props.tasks, useState only add props.task once then need the trigger of function to add it again
    // each 
    const taskList = props.tasks?.filter((props.filterMap[props.filterName])).map((task) => 
        <Todo 
        id={task.id} 
        name={task.name}
        isDraggingAndID={props.isDraggingAndID} 
        filterName={props.filterName}
        progress={task.progress}
        key={task.id}
        toggleTaskProgress={props.toggleTaskProgress}
        deleteTask={props.deleteTask}
        editTask={props.editTask}
        isOverlay={false}
        />
    ); 
    // const style = {
    //     color: isOver ? 'green' : undefined,
    // };

    // const handleDragOver = (e) => {
    //     e.preventDefault();
    // };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const itemId = JSON.parse(e.dataTransfer.getData("text/plain"));
    //     if(itemId[1] !== props.filterName){
    //         props.toggleTaskCompleted(itemId[0]);
    //     }
    //     setIsDragOver(false);
    // };

    // const handleDragEnter = () => {
    //     setIsDragOver(true);
    // }

    // function handleDragEnter(){
    //     setIsDragOver(true);
    //     console.log("has entered the container");
    // }

    // function handleDragLeave(e){
    //     if(e.currentTarget.contains(e.relatedTarget)){
    //         console.log("currently hover on child");
    //         return;
    //     }
    //     console.log("has left the container");
    //     setIsDragOver(false);
    // }

    return(
        <div 
            className={props.id === "Active" ? "todo-containers-2" : "todo-containers"}
        >
            <h1>{props.filterName.toUpperCase()}</h1>
            <ul
                // onDragOver={handleDragOver}
                // onDrop={handleDrop}
                // onDragLeave={handleDragLeave}
                // onDragEnter={handleDragEnter}
                ref={setNodeRef} 
                // style={style}
            >
                <div
                    className={/*isDragOver ? 'is-drag-over' :*/'is-not-drag-over'}
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