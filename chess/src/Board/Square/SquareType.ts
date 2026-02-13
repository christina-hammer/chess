import {Piece} from "../Pieces/PieceType";
import { Position } from "../Board";

export type SquareType = {
    id: number;
    piece: Piece | null;
    color: string;
    name: string;
    position: Position;
}