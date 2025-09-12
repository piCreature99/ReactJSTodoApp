import { useState } from "react";

function Form(props){
    // This function should prevent the default behavior of the submit event.
    const [name, setName] = useState("");
    // We are defining a name constant with the value "Learn React".
    // We are defining a function whose job it is to modify name, called setName().
    // useState() returns these two things in an array, so we are using array destructuring to capture them both in separate variables.
    // Change learn react into empty string, this is what we want to our initial state
    function handleSubmit(event) {
        event.preventDefault();
        if(name == ""){
            alert("Please enter a task!");
        }
        else{
            props.onSubmit(name);
        }
        setName("");
    }
    function handleChange(event) {
        setName(event.target.value);
    }
    return(
        // trigger submit starts here
        <form onSubmit={handleSubmit}> 
            <h2 className="label-wrapper">
                <label htmlFor="new-todo-input" className="label__lg">
                    What needs to be done?
                </label>
            </h2>
            <input 
            type="text"
            id="new-todo-input"
            className="input input__lg"
            name="text"
            autoComplete="off"
            value={name}
            onChange={handleChange}
            />
            <button type="submit" className="btn btn__primary btn__lg">
                Add
            </button>
        </form>
    );
}

export default Form;