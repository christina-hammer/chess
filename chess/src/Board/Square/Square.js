import "../../styles.css";
import Piece from "../Pieces/Piece.js";

export const colors =  {
    BLACK: "black",
    WHITE: "white"
};



export default function Square(sq) {

    const handleClick = () => {
        sq.selectSquare(sq.position, sq.piece);
    };

    return (
        <div onClick={handleClick}>
            <div className = {squareClass(sq)}> 
                {sq.piece && <Piece type={sq.piece.type} color={sq.piece.color}/>}
            </div>
            
        </div>
    );
}

function squareClass(sq) {
        
    const selected = sq.selected ? " selectedSquare" : "";
    
    const possibleMove = (sq.possibleMove && !sq.possibleCapture) ? " possibleMoveSquare" : "";
    const possibleCapture = (sq.possibleCapture) ? " possibleCaptureSquare" : "";
    if (sq.color === colors.BLACK) {
        return "square " + "black" + selected + possibleMove + possibleCapture;
    }
    return "square " + "white" + selected + possibleMove + possibleCapture;
}