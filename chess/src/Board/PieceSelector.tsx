import "../styles.css";
import {PieceType, getPiece} from "./Pieces/PieceType.js";
import Piece, {PieceColor} from "./Pieces/Piece.js";

export default function PieceSelector(props) {

    const handleClick = (pieceType) => {
        props.selectPiece(pieceType);
    }

    return (
        <div className={getClass()}>
            Piece Selector
            <div>
                <button onClick={() => handleClick(PieceType.QUEEN)}>
                    {getPiece(PieceType.QUEEN, props.pieceColor)}
                </button>
                <button onClick={() => handleClick(PieceType.ROOK)}>
                    {getPiece(PieceType.ROOK, props.pieceColor)}
                </button>
                <button onClick={() => handleClick(PieceType.BISHOP)}>
                    {getPiece(PieceType.BISHOP, props.pieceColor)}
                </button>
                <button onClick={() => handleClick(PieceType.KNIGHT)}>
                    {getPiece(PieceType.KNIGHT, props.pieceColor)}
                </button>
            </div>
        </div>
    );

    function getClass() {
        if (props.pieceColor === PieceColor.BLACK) {
            return "pieceSelector black-bg";
        }
        else {
            return "pieceSelector white-bg";
        }

    }
}
