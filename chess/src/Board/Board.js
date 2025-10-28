import Square, {colors} from "./Square/Square.js";
import { columnToLetter, rowToNumber } from "./SquareNameMap.js";
import { useState } from 'react';
import { InitialPiecePositionMap } from "./InitialPiecePositionMap.js";
import { PieceType } from "./Pieces/PieceType.js";
import { PieceColor } from "./Pieces.js";

export default function Board() {

    const [squares, setSquares] = useState(getNewBoard());

    const selectSquare = (position, piece) => {

        const possibleMoves = getPossibleMoves(position, piece);
        const possibleCaptures = getPossibleCaptures(position, piece);
        const newSquares = squares.map((row) => 
            row.map((square) => {
                if (square.position === position) {
                    return {...square, selected: !square.selected};
                }
                else if (possibleMoves.has(square.position)) {
                    return {...square, possibleCapture: true};
                }
                else if (possibleCaptures.has(square.position)) {
                    return {...square, possibleMove: true};
                }
                return {...square, selected: false};
            })
        );
        setSquares(newSquares);
    }

    return (
        <div>
            {squares.map((row)=> (
                <div className="d-flex">
                    {row.map((square) => (
                        <Square 
                            color = {square.color}
                            position = {square.position}
                            selected = {square.selected}
                            piece = {square.piece} 
                            possibleMove = {square.possibleMove}
                            possibleCapture = {square.possibleCapture}
                            selectSquare={selectSquare}/>
                    ))}
                </div>
            ))}
        </div>
    );


    function getNewBoard() {
        const squares = [];

        for (let i = 0; i < 8; i++) {
            squares[i] = [];
            for (let j = 0; j < 8; j++) {
                squares[i].push(getNewSquare(i, j));
            }
        }

        return squares;
    }

    function getNewSquare(row, column) {

        let color = getSquareColor(row, column);
        let name = getSquarePositionName(row, column);

        return {
            id: row*10 + column,
            name: name,
            position: {
                row: row,
                column: column
            },
            color: color,
            selected: false,
            possibleMove: false,
            possibleCapture: false,
            piece: InitialPiecePositionMap[name] || null
        };
    }

    function getSquareColor(row, column) {
        if (row%2 === 0) {
            return column%2 === 0 ? colors.WHITE : colors.BLACK;
        }
        else {
            return column%2 === 0 ? colors.BLACK : colors.WHITE;
        }
    }

    function getSquarePositionName(row, column) {
        return columnToLetter[column] + rowToNumber[row]
    }

    function getPossibleCaptures(checkSquare, possibleMoves, selectedPieceColor) {
        return possibleMoves.has(checkSquare.position) && checkSquare.piece && checkSquare.piece.color !== selectedPieceColor;
        
    }

    function getPossibleMoves(selectedPosition, selectedPiece, squares) {
        
        switch(selectedPiece) {
            case PieceType.PAWN:
                let isFirstMove = false;

                if (selectedPiece.color === pieceColor.WHITE
                    && selectedPosition.row === 6) {
                    isFirstMove == true;
                }
                else if (selectedPosition.row === 1) {
                    isFirstMove = true;
                }

                return getPossiblePawnMoves(selectedPosition, selectedPiece.color, squares, isFirstMove);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(selectedPosition, selectedPiece.color, squares);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(selectedPosition, selectedPiece.color, squares);
            case PieceType.ROOK:
                return getPossibleRookMoves(selectedPosition, selectedPiece.color, squares);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(selectedPosition, selectedPiece.color, squares);
            case PieceType.KING:
                return getPossibleKingMoves(selectedPosition, selectedPiece.color, squares);
            default:
                return new Set();
        }
    }

}

function getPossiblePawnMoves(position, pieceColor, squares, isFirstMove) {
    
    let moves = new Set();
    
    if (pieceColor == PieceColor.WHITE) {

        if (squares[position.row - 1][position.column].piece === null) {
            moves.add(squares[row-1][col]);
            if (isFirstMove 
                && squares[position.row - 2][position.column].piece === null) {
                    moves.add(squares[position.row - 2][column]);
            }
        }

        if (position.column !== 0) {
            if (squares[position.row - 1][position.column - 1].piece
                && squares[position.row - 1][position.column - 1].piece.color !== pieceColor)
             {
                moves.add(squares[position.row-1][position.column-1]);
             }
        }
        if (position.column !== 7) {
            if (squares[position.row-1][position.column+1].piece 
                && squares[position.row-1][position.column+1].piece.color != pieceColor
            ) {
                moves.add(squares[position.row-1][position.column+1]);
            }
        }
    }
    else {
        if (squares[position.row+1][position.column].piece === null) {
            moves.add(squares[position.row+1][position.column]);
            if (isFirstMove && squares[position.row+2][position.column].piece === null) {
                moves.add(squares[position.row+2][position.column]);
            }
        }
    }
    
    return moves;
}
function getPossibleKnightMoves(position, pieceColor, squares) {
    return new Set();
}

function getPossibleBishopMoves(position, pieceColor, squares) {
    return new Set();
}

function getPossibleRookMoves(position, pieceColor, squares) {
    return new Set();
}

function getPossibleQueenMoves(position, pieceColor, squares) {
    return new Set();
}

function getPossibleKingMoves(position, pieceColor, squares) {
    return new Set();
}