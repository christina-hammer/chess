import "../styles.css";
import {PieceType, getPiece} from "./Pieces/PieceType";
import {PieceColor} from "./Pieces/Piece";

interface PieceSelectorProps {
    pieceColor: string;
    selectPiece: (pieceType: string, pieceColor: string) => void;
}

export default function PieceSelector(props: PieceSelectorProps) {

    const handleClick = (pieceType: string) => {
        props.selectPiece(pieceType, props.pieceColor);
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

    function getClass(): string {
        if (props.pieceColor === PieceColor.BLACK) {
            return "pieceSelector black-bg";
        }
        else {
            return "pieceSelector white-bg";
        }

    }
}
