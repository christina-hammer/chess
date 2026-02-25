import { PieceColor } from "./Piece";

export type Piece = {
    color: string;
    type: string;
}

export const PieceType = {
    PAWN: "pawn",
    KNIGHT: "knight",
    BISHOP: "bishop",
    ROOK: "rook",
    QUEEN: "queen",
    KING: "king"
};

export function getPiece(type: string, color: string) {
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