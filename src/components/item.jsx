export default function(props) {
    console.log(props.rating)
    return (
        <div className='item' category={props.category}>
            <div className="image">
                <img src={props.image} alt="image"/>
            </div>
            <div className="info">
                <span>{String(props.title).slice(0,40)} {String(props.title).length > 40 ? "..." : ""}</span>
                <span className="price">{props.price}$</span>
            </div>
        </div>
    )
}