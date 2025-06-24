import Square, {colors} from "./Square/Square.js";
import { columnToLetter, rowToNumber } from "./SquareNameMap.js";
import { useState } from 'react';

export default function Board() {

    const [squares, setSquares] = useState(getNewBoard());

    return (
        <div>
            {squares.map((row)=> (
                <div className="d-flex">
                    {row.map((square) => (
                        <Square 
                            color = {square.color}
                            name = {square.name}
                            piece = {square.piece} />
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
        let name = getSquareName(row, column);

        return {
            id: row*10 + column,
            name: name,
            color: color,
            piece: null
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

    function getSquareName(row, column) {
        return columnToLetter[column] + rowToNumber[row]
    }

}