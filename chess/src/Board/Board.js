import Square, {colors} from "./Square/Square.js";
import { columnToLetter, rowToNumber } from "./SquareNameMap.js";
import { useState } from 'react';
import { InitialPiecePositionMap } from "./InitialPiecePositionMap.js";
import { PieceType } from "./Pieces/PieceType.js";
import { PieceColor } from "./Pieces/Piece.js";

export default function Board() {

    const [squares, setSquares] = useState(getNewBoard());
    const [possibleMoves, setPossibleMoves] = useState(new Set());
    const [possibleCaptures, setPossibleCaptures] = useState(new Set());
    const [selectedSquare, setSelectedSquare] = useState(null);

    const selectSquare = (square) => {

        if ((!selectedSquare || selectedSquare.name !== square.name)
            && square.piece 
            && !possibleMoves.has(square.name) && !possibleCaptures.has(square.name)
        ) {
            setSelectedSquare(square);
            setPossibleMovesAndCaptures(square.position, square.piece);
        }
        else if (selectedSquare.name === square.name) {
            deselectSquare();
        }
        else if (possibleCaptures.has(square.name)
                || possibleMoves.has(square.name)) {
            

            let newSquares = squares;

            for (let i = 0; i < newSquares.length; i++) {
                for (let j = 0; j < newSquares[i].length; j++) {
                    if (newSquares[i][j].name === selectedSquare.name) {
                    newSquares[i][j].piece = null;
                }
                else if (newSquares[i][j].name === square.name) {
                    newSquares[i][j].piece = selectedSquare.piece;
                }
                }
                
            }

            setSquares(newSquares);

            deselectSquare();


        }

        
    }

    return (
        <div>
            {squares.map((row)=> (
                <div className="d-flex">
                    {row.map((square) => (
                        <Square 
                            key={square.name}
                            color = {square.color}
                            name={square.name}
                            position = {square.position}
                            selected = {selectedSquare ? square.name === selectedSquare.name : false}
                            piece = {square.piece} 
                            possibleMove = {possibleMoves.has(square.name)}
                            possibleCapture = {possibleCaptures.has(square.name)}
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

    function deselectSquare() {
        setSelectedSquare(null);
        setPossibleMoves(new Set());
        setPossibleCaptures(new Set());
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

    function setPossibleMovesAndCaptures(selectedPosition, selectedPiece) {
        
        switch(selectedPiece.type) {
            case PieceType.PAWN:
                let isFirstMove = false;

                if (selectedPiece.color === PieceColor.WHITE
                    && selectedPosition.row === 6) {
                    isFirstMove = true;
                }
                else if (selectedPosition.row === 1) {
                    isFirstMove = true;
                }

                setPossiblePawnMoves(selectedPosition, selectedPiece.color, squares, isFirstMove);
                break;
            case PieceType.KNIGHT:
                setPossibleKnightMoves(selectedPosition, selectedPiece.color, squares);
                break;
            case PieceType.BISHOP:
                setPossibleBishopMoves(selectedPosition, selectedPiece.color, squares);
                break;
            case PieceType.ROOK:
                setPossibleRookMoves(selectedPosition, selectedPiece.color, squares);
                break;
            case PieceType.QUEEN:
                setPossibleQueenMoves(selectedPosition, selectedPiece.color, squares);
                break;
            case PieceType.KING:
                setPossibleKingMoves(selectedPosition, selectedPiece.color, squares);
                break;
            default:
                return
        }
    }

    function setPossiblePawnMoves(position, pieceColor, squares, isFirstMove) {
    
        let moves = new Set();
        let captures = new Set();
        
        if (pieceColor === PieceColor.WHITE) {
            let checkSquare = squares[position.row - 1][position.column];
            if (checkSquare.piece === null) {
                moves.add(checkSquare.name);
                if (isFirstMove 
                    && squares[position.row - 2][position.column].piece === null) {
                        moves.add(squares[position.row - 2][position.column].name);
                }
            }

            if (position.column !== 0) {
                if (squares[position.row - 1][position.column - 1].piece
                    && squares[position.row - 1][position.column - 1].piece.color !== pieceColor)
                {
                    let name = squares[position.row-1][position.column-1].name;
                    captures.add(name);
                }
            }
            if (position.column !== 7) {
                if (squares[position.row-1][position.column+1].piece 
                    && squares[position.row-1][position.column+1].piece.color !== pieceColor
                ) {
                    let name = squares[position.row-1][position.column+1].name;
                    captures.add(name);
                }
            }
        }
        else {
            if (squares[position.row+1][position.column].piece === null) {
                moves.add(squares[position.row+1][position.column]);
                if (isFirstMove && squares[position.row+2][position.column].piece === null) {
                    moves.add(squares[position.row+2][position.column].name);
                }
            }
            if (position.column !== 0) {
                if (squares[position.row +1][position.column - 1].piece 
                    && squares[position.row+1][position.column - 1].piece.color !== pieceColor
                ) {
                    let name = squares[position.row+1][position.column - 1];
                    captures.add(name);
                }
            }
            if (position.column !== 7) {
                if (squares[position.row+1][position.column+1].piece 
                    && squares[position.row+1][position.column+1].piece.color !== pieceColor
                ) {
                    let name = squares[position.row+1][position.column+1].name;
                    captures.add(name);
                }
            }
        }
        
        setPossibleMoves(moves);
        setPossibleCaptures(captures);
    }

    function setPossibleKnightMoves(position, pieceColor, squares) {
        return new Set();
    }

    function setPossibleBishopMoves(position, pieceColor, squares) {
        return new Set();
    }

    function setPossibleRookMoves(position, pieceColor, squares) {
        return new Set();
    }

    function setPossibleQueenMoves(position, pieceColor, squares) {
        return new Set();
    }

    function setPossibleKingMoves(position, pieceColor, squares) {
        return new Set();
    }

}


