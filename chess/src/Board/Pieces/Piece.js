import '../../styles.css';
import { PieceType } from './PieceType.js';

export const PieceColor = {
    WHITE: "white",
    BLACK: "black"
};

export default function Piece(props) {

    return (
        <div className={getClass(props.color)}>
            {getPiece(props.type, props.color)}
        </div>
    );
}

function getClass(color) {
    if (color === PieceColor.WHITE) {
        return "piece pieceWhite";
    }
    return "piece pieceBlack";
}

function getPiece(type, color) {
    switch(type) {
        case PieceType.PAWN:
            return "♙";
        case PieceType.ROOK:
            return color === PieceColor.WHITE ? "♖" : "♜";
        case PieceType.KNIGHT:
            return color === PieceColor.WHITE ? "♘" : "♞";
        case PieceType.BISHOP:
            return color === PieceColor.WHITE ? "♗" : "♝";
        case PieceType.QUEEN:
            return color === PieceColor.WHITE ? "♕" : "♛";
        case PieceType.KING:
            return color === PieceColor.WHITE ? "♔" : "♚";
        default:
            return "";
    }
}

