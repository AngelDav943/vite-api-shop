import React, {useState} from 'react';
import { useId } from 'react';

export default function(props) {

    const current = useId()
    var [deg, setDeg] = useState(180)
    const spin = function(event) {
        setDeg(deg + 180)

        var card = document.getElementById(current)

        var front = card.querySelector(".face.front")
        var back = card.querySelector(".face.back")

        card.style.transform = "perspective(600px) rotateY("+deg+"deg)"
    }

    return (
        <div key={current} className="card show" id={current} name={props.name} price={props.price} rating={props.rating.rate} category={props.category} onClick={spin}>
            <div className="face front">
                <div className="image">
                    <img src={props.src} alt="IMAGE" />
                </div>
                <div className="data">
                    <p className='title'>{String(props.name).slice(0,54) + (String(props.name).length > 56 ? "..." : "") }</p>
                    <div className='row'>
                        <span>${props.price}</span>
                        <span> <img src="src/assets/images/star.png" alt="" /> {props.rating.rate} ({props.rating.count})</span>
                    </div>
                </div>
            </div>
            <div className="face back">
                <div className="data">
                    <p>"{props.description}"</p>
                </div>
            </div>
        </div>
    )
}