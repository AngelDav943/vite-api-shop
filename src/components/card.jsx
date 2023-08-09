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
        <div className="card" id={props.name} category={props.category} onClick={spin}>
            <div className="face front">
                <div className="image">
                    <img src={props.src} alt="IMAGE" />
                </div>
                <div className="data">
                    <p>{props.name}</p>
                    <p>${props.price}</p>
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