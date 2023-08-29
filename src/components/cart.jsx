import React, {useState} from 'react';
import { useId } from 'react';


export default function(props) {
    var num = 1
    const current = useId()

    const click = function(event) {
        if (props.onClick) props.onClick({...props, amount: num})
    }

    return (
        <div className="cart show">
            <img className="image" src={props.src} alt="IMAGE" />
            <div className="data">
                <p className='title'>{String(props.name).slice(0,54) + (String(props.name).length > 56 ? "..." : "") }</p>
                <span>{props.amount}</span>
                <span>${props.price * props.amount}</span>
            </div>
            <button className='image' onClick={click}>
                <img src='src/assets/images/unchecked.png'></img>
            </button>
        </div>
    )
}