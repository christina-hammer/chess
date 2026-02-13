import "../../styles.css";
import Piece from "../Pieces/Piece.js";
import { SquareType } from "./SquareType.js";

export const colors =  {
    BLACK: "black",
    WHITE: "white"
};

interface SquareProps {
    square: SquareType;
    selectSquare: (selectedSquare: object) => void;
    selected: boolean;
    possibleMove: boolean;
    possibleCapture: boolean;
}


export default function Square(props: SquareProps) {

    const handleClick = () => {
        props.selectSquare(props);
    };

    return (
        <div onClick={handleClick}>
            <div className = {squareClass(props)}> 
                {props.square.piece && <Piece type={props.square.piece.type} color={props.square.piece.color}/>}
            </div>
            
        </div>
    );
}

function squareClass(squareProps: SquareProps) {
        
    const selected = squareProps.selected ? " selectedSquare" : "";
    
    const possibleMove = (squareProps.possibleMove && !squareProps.possibleCapture) ? " possibleMoveSquare" : "";
    const possibleCapture = (squareProps.possibleCapture) ? " possibleCaptureSquare" : "";
    if (squareProps.square.color === colors.BLACK) {
        return "square " + "black" + selected + possibleMove + possibleCapture;
    }
    return "square " + "white" + selected + possibleMove + possibleCapture;
}