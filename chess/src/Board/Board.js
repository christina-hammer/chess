import Square, {colors} from "./Square/Square.js";
import { columnToLetter, rowToNumber } from "./SquareNameMap.js";
import { useState } from 'react';
import { InitialPiecePositionMap } from "./InitialPiecePositionMap.js";

export default function Board() {

    const [squares, setSquares] = useState(getNewBoard());

    const selectSquare = (position, piece) => {
        const newSquares = squares.map((row) => 
            row.map((square) => {
                if (square.position === position) {
                    return {...square, selected: !square.selected};
                }
                else if (isPossibleCapture(square, position, piece)) {
                    return {...square, possibleCapture: true};
                }
                else if (isPossibleMove(square, position, piece)) {
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
        let name = getSquarePosition(row, column);

        return {
            id: row*10 + column,
            position: name,
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

    function getSquarePosition(row, column) {
        return columnToLetter[column] + rowToNumber[row]
    }

    function isPossibleCapture(checkSquare, selectedPosition, selectedPiece) {
        return false;
    }

    function isPossibleMove(checkSquare, selectedPosition, selectedPiece) {
        return false;
    }

}