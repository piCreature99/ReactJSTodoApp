import { useState, useEffect, useRef } from "react";
import backgroundVid from '../assets/fractal2.mp4'; // return to src folder then acess the access folter using ../ notation


function CountDown(){
    const [seconds, setSeconds] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [hours, setHours] = useState("00");
    const [getHours, setGetHours] = useState(0);
    const [getSeconds, setGetSeconds] = useState(0);
    // const [time, setTime] = useState(0);
    const [timeNow, setTimeNow] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [pauseBtn, setPauseBtn] = useState("Pause");
    const [isBeginActive, setIsBeginActive] = useState(true);
    const [progress, setProgress] = useState({width: "102%"});
    let currentTime = useRef();
    let counter = useRef();
    let timeCount = useRef(0);
    const inputFocusRef = useRef([]);
    let timeSet = useRef();

    const handleChange = (e) => {
        // is the length > 3 ?
        // if length = 1, add 1 zero, if length = 0, add 2 zeros
        if(Number(e.target.value) > 60){ // if typed number is greater than 60, set input field to 60
            e.target.value = "60";
        }
        if(e.target.value.length > 2){ // if length exceeds 2, slice off 1 starting characters
            e.target.value = e.target.value.slice(1);
        }
        else{
            e.target.value = e.target.value.padStart(2, "0"); // if length = or < than 2, pad two zeros
        }
        const inputValue = e.target.value;
        if(e.target === inputFocusRef.current[0]){ // check if e.target is the instance from a ref array through index
            setHours(inputValue);
        }
        else if(e.target === inputFocusRef.current[1]){
            setMinutes(inputValue);
        }
        else{
            setSeconds(inputValue);
        }
    }

    function handleFocus(e){
        const length = e.target.value.length;
        const inputElement = e.target;

        inputElement.setSelectionRange(length, length); // set caret position
    }

    function begin(){
        timeSet.current = seconds * 1000 + minutes * 60 * 1000 + hours * 3600 * 1000;
        console.log(timeSet.current);
        setIsBeginActive(false);
        clearInterval(counter.current);
        currentTime.current = Date.now();
        counter.current = setInterval(() => {
            const elapsedTimeBase = Date.now() - currentTime.current;
            const elapsedTime = timeSet.current - elapsedTimeBase;
            const seconds = Math.floor(elapsedTime / (1000)) % 60;
            const minutes = Math.floor(elapsedTime / (60 * 1000)) % 60;
            const hours = Math.floor(elapsedTime / (3600 * 1000)) % 60;
            const progress = Number((elapsedTime / timeSet.current).toFixed(3));
            setProgress({width: `${progress * 102}%`});
            console.log(seconds);
            // setTime(milliseconds);
            if(seconds >= 0){
                setTimeNow(elapsedTimeBase);
                setSeconds(String(seconds).padStart(2, "0"));
                setMinutes(String(minutes).padStart(2, "0"));
                setHours(String(hours).padStart(2, "0"));
                // console.log(elapsedTime);
            }
            else{
                clearInterval(counter.current);  
            }
        }, 10);
    };
    function pause(){
        if(!isPaused){
            setPauseBtn("Resume");
            setIsPaused(true);
            clearInterval(counter.current);
            timeCount.current = timeNow;
        }
        else{
            setPauseBtn("Pause");
            setIsPaused(false);
            currentTime.current = Date.now();
            counter.current = setInterval(() => {
                const elapsedTimeBase = Date.now() - currentTime.current + timeNow;
                const elapsedTime = timeSet.current - elapsedTimeBase;
                const seconds = Math.floor(elapsedTime / (1000)) % 60;
                const minutes = Math.floor(elapsedTime / (60 * 1000)) % 60;
                const hours = Math.floor(elapsedTime / (3600 * 1000)) % 60;
                const progress = Number((elapsedTime / timeSet.current).toFixed(3));
                setProgress({width: `${progress * 102}%`});
                console.log(progress);
                // setTime(milliseconds);
                if(seconds >= 0){
                    setTimeNow(elapsedTimeBase);
                    setSeconds(String(seconds).padStart(2, "0"));
                    setMinutes(String(minutes).padStart(2, "0"));
                    setHours(String(hours).padStart(2, "0"));
                    // console.log(elapsedTime);
                }
                else{
                    clearInterval(counter.current);  
                }
            }, 10);
        }
    }
    
    function reset(){
        setIsBeginActive(true);
        clearInterval(counter.current);
        // setTime(0);
        setTimeNow(0);
        setPauseBtn("Pause");
        setIsPaused(false);
        setSeconds("00");
        setMinutes("00");
        setHours("00");
        setProgress({width: `102%`});        
    }
    // useEffect(() => { // useEffect triggers every time the conditional array change
    //     console.log(time);
    // }, [time])

    return(
        <div>
            <div className="progress-bar">
                <div 
                    className="progress"
                    style={progress}
                ></div>
                <video className="fractal-vid-bg" src={backgroundVid} autoPlay={true} muted loop></video>   
            </div>
            <h1 className="count-down">
                <input 
                    className="count-num" 
                    type="text" 
                    // value={String(Math.floor(timeNow /(3600 * 1000)) % 60).padStart(2, "0")}
                    value={hours} 
                    onChange={handleChange} 
                    ref={el => inputFocusRef.current[0] = el}
                    onClick={handleFocus}
                    onFocus={handleFocus}
                    // disabled
                />:
                <input 
                    className="count-num" 
                    type="text" 
                    // value={String(Math.floor(timeNow /(60 * 1000)) % 60).padStart(2, "0")} 
                    value={minutes}
                    onChange={handleChange} 
                    ref={el => inputFocusRef.current[1] = el}
                    onClick={handleFocus}
                    onFocus={handleFocus}
                    // disabled
                />:
                <input 
                    className="count-num" 
                    type="text" 
                    // value={String(Math.floor(timeNow / 1000) % 60).padStart(2, "0")} 
                    value={seconds}
                    onChange={handleChange} 
                    ref={el => inputFocusRef.current[2] = el}
                    onClick={handleFocus}
                    onFocus={handleFocus}
                    // disabled
                />
            </h1>
            <div className="count-down-btn">

                <button onClick={begin} className={isBeginActive ? 'btn-enabled' : 'btn-disabled'}>
                    Begin
                </button>
                <button onClick={pause} className={isBeginActive ? 'btn-disabled' : 'btn-enabled'}>
                    {pauseBtn}
                </button>
                <button onClick={reset} className={isBeginActive ? 'btn-disabled' : 'btn-enabled'}>
                    Reset
                </button>
            </div>
        </div>
    );
}

export default CountDown;