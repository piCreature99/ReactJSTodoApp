import { useEffect, useRef, useState } from 'react';

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);
  console.log(wasEditing);
  function handleDragStart(e){
    const selectedIds = [props.id, props.filterName];
    e.dataTransfer.setData("text/plain", JSON.stringify(selectedIds));
    setTimeout(() => {
      props.setPointerStateAll(true); // go back to the app to set the pointer state of the container
    }, 1);
    // console.log(props.name);
  };
  function handleDragEnd(){
    props.setPointerStateAll(false);
    console.log("drag end fired")
  }
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
        defaultChecked={props.completed}
        onChange={() => props.toggleTaskCompleted(props.id)} 
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
  return (
     <li 
     // disable pointer when on drag start, making sure the drag leave not fired when hover above child element
     className={`todo ${props.pointerState ? 'pointer-disabled' : 'pointer-enabled'}`}
     draggable={true}
     onDragStart={handleDragStart}
     onDragEnd={handleDragEnd}
     >{isEditing ? editingTemplate : viewTemplate}</li>
  );
}

export default Todo;