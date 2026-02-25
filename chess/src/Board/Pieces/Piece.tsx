import '../../styles.css';
import { getPiece } from './PieceType';

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

function getClass(color: string): string {
    if (color === PieceColor.WHITE) {
        return "piece pieceWhite";
    }
    return "piece pieceBlack";
}



