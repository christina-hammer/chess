import '../../styles.css';
import { PieceType, getPiece } from './PieceType.js';

export const PieceColor = {
    WHITE: "white",
    BLACK: "black"
};

interface PieceProps {
    color: string;
    type: string;
}

export default function Piece(props: PieceProps) {

    return (
        <div className={getClass(props.color)}>
            {getPiece(props.type, props.color)}
        </div>
    );
}

function getClass(color: string) {
    if (color === PieceColor.WHITE) {
        return "piece pieceWhite";
    }
    return "piece pieceBlack";
}



