import { useEffect, useRef, useState } from 'react';
import { useDraggable, DragOverlay} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  // const {attributes, listeners, setNodeRef, transform, active} = useDraggable({
  //       id: props.id,
  //   });
  // const [currentProgress, setCurrentProgress] = useState(1);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id});
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);
  // console.log(props.isDraggingAndID[0]);

    const style = {
    // We only apply the transform and transition to the overlay or if not dragging
    transform: !props.isOverlay ? CSS.Transform.toString(transform) : undefined, 
    transition: !props.CSSisOverlay ? transition : undefined,
    position: 'relative',
    // <-- NEW: The original item becomes transparent when being dragged
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 10 : 0,
    // The overlay should be fixed to the mouse pointer with a high z-index
    // The original item should just disappear when dragging starts
    // backgroundColor: 'white',
    boxShadow: isDragging ? '0px 10px 30px rgba(0, 0, 0, 0.2)' : '0px 5px 15px rgba(0, 0, 0, 0.1)',
    cursor: isDragging ? 'grabbing' : 'grab',
  };
  // console.log(wasEditing);
  // function handleDragStart(e){
  //   const selectedIds = [props.id, props.filterName];
  //   e.dataTransfer.setData("text/plain", JSON.stringify(selectedIds));
  //   // console.log(props.name);
  // };
  // function handleDragEnd(){
  //   console.log("drag end fired")
  // }
  // console.log(editFieldRef.current);
  useEffect(() => { // run after the main render
    // console.log("side effect");
    // clicking on edit button set isEditing to true, also set was Editing to true after the page load
    // clicking on cancel set isEditing to false keep wasEditing as true and set focus on the edit button before the page 
    // loaded and set wasEditing back to false
    if (!wasEditing && isEditing){
      editFieldRef.current.focus();
    }
    else if (wasEditing && !isEditing){
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);
  function usePrevious(value){
    const ref = useRef(); // useRef() value persist every run until you assign it a new one using ref.current
    useEffect(() => {
      ref.current = value;
    })
    return ref.current;
  }
  // console.log("main render");
  function handleChange(e){
    setNewName(e.target.value);
  }
  function handleSubmit(e){
    e.preventDefault();
    if(newName === ""){
      alert("Name can't be empty");
    }
    else{
      props.editTask(props.id, newName);
      setNewName("");
      setEditing(false);
    }
  }

  // useState and useRef() reset across remounting, in this case the child is remounted through parent, so the value reset
  function handleToggle(){
    props.toggleTaskProgress(props.id, props.progress);
  }
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form=group">
        <label className="todo-label" htmlFor="{props.id}">
          New name for {props.name}
        </label>
        <input id={props.id} className="todo-text" type="text" onChange={handleChange} value={newName} ref={editFieldRef}/>
      </div>
      <div className="btn-group">
        <button type="button" className="btn todo-cancel" onClick={() =>
          setEditing(false)
        } >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate= (
    <div className="stack-small">
      <div className="c-cb">
        <input 
        id={props.id}
        type="checkbox"
        defaultChecked={props.progress === 0 ? false : props.progress === 1 ? false : true}
        // onChange={() => props.toggleTaskProgress(props.id)} 
        onChange={handleToggle}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => 
          setEditing(true)
        }
        ref={editButtonRef}
        >
          Edit <span className="visually-hidden">
            {props.name}
          </span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick = {() => {
            props.deleteTask(props.id)
          }}
        >
          Delete <span className="visually-hidden">
            {props.name}
          </span>
        </button>
      </div>
    </div>
  );
  // console.log(props.isDraggingAndID[1]);
  // console.log(props.isDraggingAndID[0]);
  // const className = (props.isDraggingAndID[0] === true && props.isDraggingAndID[1] === props.id ? 'todo' : 'todo');
  // console.log(props.isDraggingAndID[0]);
  return (
          <li
      // disable pointer when on drag start, making sure the drag leave not fired when hover above child element
      className={'todo'}
      style={style} 
      ref={setNodeRef} 

      /* //  draggable={true}
      //  onDragStart={handleDragStart}
      //  onDragEnd={handleDragEnd} */
      >
        {isEditing ? editingTemplate : viewTemplate}
        <div className='todo-drag-handle'
        {...listeners} 
        {...attributes}
        ></div> 
      </li>
  );
}

export default Todo;