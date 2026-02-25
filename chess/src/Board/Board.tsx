import Square, {colors} from "./Square/Square";
import { columnToLetter, rowToNumber } from "./SquareNameMap";
import { useState } from 'react';
import { InitialPiecePositionMap } from "./InitialPiecePositionMap";
import { PieceType, Piece } from "./Pieces/PieceType";
import { PieceColor } from "./Pieces/Piece";
import  PieceSelector  from "./PieceSelector";
import { SquareType } from "./Square/SquareType";
import "../styles.css";

/*
TODO:
-start new game/reset button
-pawn reaching the end behavior
-enforcing turns (can only move player's color on their turn)
-castle behavior
-check behavior
    -when your king is in check, only allow moves that break check
    -visual indiciation of when you're in check
    -checkmate == winner/end the game
-timer
-piece graveyard
-fix square highlighting to not just be the top corner
-Host online and allow two people across the internet play the same game
*/ 

export type Position = {
    row: number;
    column: number;
};

const moveDirection = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
};

type PossibleMoves = {
    moves: Set<string>;
    captures: Set<string>;
}

type PossibleDirectionMoves = {
    moves: Set<string>;
    capture: string;
};

export default function Board() {

    const [squares, setSquares] = useState<SquareType[][]>(getNewBoard());
    const [possibleMoves, setPossibleMoves] = useState(new Set<string>());
    const [possibleCaptures, setPossibleCaptures] = useState(new Set<string>());
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [showPieceSelector, setShowPieceSelector] = useState(false);
    const [pieceSelectorColor, setPieceSelectorColor,] = useState("");

    const selectSquare = (square: SquareType) => {

        
        if ((!selectedSquare || selectedSquare.name !== square.name)
            && square.piece 
            && !possibleMoves.has(square.name) && !possibleCaptures.has(square.name)
        ) {
            setSelectedSquare(square);
            setPossibleMovesAndCaptures(square.position, square.piece);
        }
        else if (selectedSquare && selectedSquare.name === square.name) {
            deselectSquare();
        }
        else if (selectedSquare && (possibleCaptures.has(square.name)
                || possibleMoves.has(square.name))) {
            
            const newSquares = squares;
            const selectedPiece: Piece | null = selectedSquare.piece;

            newSquares[square.position.row][square.position.column].piece = selectedSquare.piece;
            newSquares[selectedSquare.position.row][selectedSquare.position.column].piece = null;
            

            setSquares(newSquares);

            if (selectedPiece && isPawnTransformationMove(selectedPiece, square)) {
                setShowPieceSelector(true);
                setPieceSelectorColor(selectedPiece.color)
            }
            else {
                deselectSquare();
            }

            
        }
    }

    const transformPawn = (pieceType: string, pieceColor: string) => {
        
        if (selectedSquare) {
            let newSquares = squares;

            newSquares[selectedSquare.position.row][selectedSquare.position.column].piece = {
                type: pieceType,
                color: pieceColor
            };

            setSquares(newSquares);
        }
        
    }

    const newGameClick = () => {
        let newBoard = getNewBoard();
        setSquares(newBoard);
    }

    return (
        <div>
            {showPieceSelector 
            && <PieceSelector 
                pieceColor={pieceSelectorColor}
                selectPiece={transformPawn}/>}
            {squares.map((row, idx)=> (
                <div className="d-flex" key={`row-div-${idx}`}>
                    {row.map((square) => (
                        <Square 
                            key={square.name}
                            selected = {selectedSquare ? square.name === selectedSquare.name : false}
                            square={square}
                            possibleMove = {possibleMoves.has(square.name)}
                            possibleCapture = {possibleCaptures.has(square.name)}
                            selectSquare={selectSquare}/>
                    ))}
                </div>
            ))}

            <div className="controlsContainer">
                <button onClick={newGameClick}>
                    New Game
                </button>
            </div>
        </div>
    );


    function getNewBoard(): SquareType[][] {
        const squares: SquareType[][] = [];

        for (let i = 0; i < 8; i++) {
            const tempArr: SquareType[] = [];
            for (let j = 0; j < 8; j++) {
                tempArr.push(getNewSquare(i, j));
            }
            squares[i] = tempArr;
        }

        return squares;
    }

    function deselectSquare() {
        setSelectedSquare(null);
        setPossibleMoves(new Set<string>());
        setPossibleCaptures(new Set<string>());
    }

    function getNewSquare(row: number, column: number): SquareType {

        const color = getSquareColor(row, column);
        const name = getSquarePositionName(row, column);

        return {
            id: row*10 + column,
            name: name,
            position: {
                row: row,
                column: column
            },
            color: color,
            piece: InitialPiecePositionMap[name as keyof typeof InitialPiecePositionMap] || null
        };
    }

    function getSquareColor(row: number, column:number): string {
        if (row%2 === 0) {
            return column%2 === 0 ? colors.WHITE : colors.BLACK;
        }
        else {
            return column%2 === 0 ? colors.BLACK : colors.WHITE;
        }
    }

    function getSquarePositionName(row: number, column: number): string {
        return columnToLetter[column as keyof typeof columnToLetter] + rowToNumber[row as keyof typeof rowToNumber];
    }

    function setPossibleMovesAndCaptures(selectedPosition: Position, selectedPiece: Piece) {
        
        let movesAndCaptures = {moves: new Set<string>(), captures: new Set<string>()};

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

                movesAndCaptures = getPossiblePawnMoves(selectedPosition, selectedPiece.color, isFirstMove);
                break;
            case PieceType.KNIGHT:
                movesAndCaptures = getPossibleKnightMoves(selectedPosition, selectedPiece.color);
                break;
            case PieceType.BISHOP:
                movesAndCaptures = getPossibleBishopMoves(selectedPosition, selectedPiece.color);
                break;
            case PieceType.ROOK:
                movesAndCaptures = getPossibleRookMoves(selectedPosition, selectedPiece.color);
                break;
            case PieceType.QUEEN:
                movesAndCaptures = getPossibleQueenMoves(selectedPosition, selectedPiece.color);
                break;
            case PieceType.KING:
                movesAndCaptures = getPossibleKingMoves(selectedPosition, selectedPiece.color);
                break;
            default:
                return
        }

        setPossibleMoves(movesAndCaptures.moves);
        setPossibleCaptures(movesAndCaptures.captures);
    }

    function getPossiblePawnMoves(position: Position, pieceColor: string, isFirstMove: boolean): PossibleMoves {
    
        let moves = new Set<string>();
        let captures = new Set<string>();
        
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
                    && squares[position.row - 1][position.column - 1].piece?.color !== pieceColor)
                {
                    let name = squares[position.row-1][position.column-1].name;
                    captures.add(name);
                }
            }
            if (position.column !== 7) {
                if (squares[position.row-1][position.column+1].piece 
                    && squares[position.row-1][position.column+1].piece?.color !== pieceColor
                ) {
                    let name = squares[position.row-1][position.column+1].name;
                    captures.add(name);
                }
            }
        }
        else {
            if (squares[position.row+1][position.column].piece === null) {
                moves.add(squares[position.row+1][position.column].name);
                if (isFirstMove && squares[position.row+2][position.column].piece === null) {
                    moves.add(squares[position.row+2][position.column].name);
                }
            }
            if (position.column !== 0) {
                if (squares[position.row +1][position.column - 1].piece !== null
                    && squares[position.row+1][position.column - 1].piece?.color !== pieceColor
                ) {
                    let name = squares[position.row+1][position.column - 1].name;
                    captures.add(name);
                }
            }
            if (position.column !== 7) {
                if (squares[position.row+1][position.column+1].piece 
                    && squares[position.row+1][position.column+1].piece?.color !== pieceColor
                ) {
                    let name = squares[position.row+1][position.column+1].name;
                    captures.add(name);
                }
            }
        }
        
        return { moves: moves, captures: captures };
    }

    function getPossibleKnightMoves(position: Position, pieceColor: string): PossibleMoves {
        
        let reachablePositions = [
            {row: position.row - 2, column: position.column - 1},
            {row: position.row - 2, column: position.column + 1},
            {row: position.row - 1, column: position.column + 2},
            {row: position.row + 1, column: position.column + 2},
            {row: position.row + 2, column: position.column + 1},
            {row: position.row + 2, column: position.column - 1},
            {row: position.row + 1, column: position.column - 2},
            {row: position.row - 1, column: position.column - 2}
        ];

        let moves = new Set<string>();
        let captures = new Set<string>();

        for (let pos of reachablePositions) {
            if (pos.row < 0 || pos.row > 7 || pos.column < 0 || pos.column > 7) {
                continue;
            }

            if (squares[pos.row][pos.column].piece
                && squares[pos.row][pos.column].piece?.color !== pieceColor
            ) {
                captures.add(squares[pos.row][pos.column].name);
            }
            else if (!squares[pos.row][pos.column].piece){
                moves.add(squares[pos.row][pos.column].name);
            }
        }

        return { moves: moves, captures: captures };
        
    }

    function getPossibleBishopMoves(position: Position, pieceColor: string): PossibleMoves {


        let upRight = bishopMoveHelper(position, pieceColor, true, true);
        let upLeft = bishopMoveHelper(position, pieceColor, true, false);
        let downRight = bishopMoveHelper(position, pieceColor, false, true);
        let downLeft = bishopMoveHelper(position, pieceColor, false, false);

         let captures = new Set<string>();

        if (upRight.capture !== "") {
            captures.add(upRight.capture);
        }
        if (upLeft.capture !== "") {
            captures.add(upLeft.capture);
        }
        if (downRight.capture !== "") {
            captures.add(downRight.capture);
        }
        if (downLeft.capture !== "") {
            captures.add(downLeft.capture);
        }

        const moves = new Set([...upRight.moves, ...upLeft.moves, ...downRight.moves, ...downLeft.moves])

        return { moves: moves, captures: captures };

    }

    function bishopMoveHelper(position: Position, pieceColor: string, goingUp: boolean, goingRight: boolean): PossibleDirectionMoves {
        let moves = new Set<string>();
        let capture = "";

        let i = 1;
        let r = goingUp ? position.row - i : position.row + i;
        let c = goingRight ? position.column + i : position.column - i;

        while (isOnBoard(r, c) && !squares[r][c].piece) {
            moves.add(squares[r][c].name);
            i++;
            r = goingUp ? position.row - i : position.row + i;
            c = goingRight ? position.column + i : position.column - i;
        }

        if (hasCapture(r, c, pieceColor)) {
            capture = squares[r][c].name;
        }


        return {moves: moves, capture: capture}
    }

    function getPossibleRookMoves(position: Position, pieceColor: string): PossibleMoves {
        
        let up = rookMoveHelper(position, pieceColor, moveDirection.UP);
        let down = rookMoveHelper(position, pieceColor,moveDirection.DOWN);
        let left = rookMoveHelper(position, pieceColor, moveDirection.LEFT);
        let right = rookMoveHelper(position, pieceColor, moveDirection.RIGHT);

        let moves = new Set<string>([...up.moves, ...down.moves, ...left.moves, ...right.moves]);
        let captures = new Set<string>();

        if (up.capture !== "") {
            captures.add(up.capture);
        }
        if (down.capture !== "") {
            captures.add(down.capture);
        }
        if (left.capture !== "") {
            captures.add(left.capture);
        }
        if (right.capture !== "") {
            captures.add(right.capture);
        }

        return { moves: moves, captures: captures };
    }

    function rookMoveHelper(position: Position, pieceColor: string, direction: string): PossibleDirectionMoves {

        let moves = new Set<string>();
        let capture = "";

        let checkPosition = {
            row: position.row,
            column: position.column
        };

        checkPosition = moveInDirection(checkPosition, direction);

        while (isOnBoard(checkPosition.row, checkPosition.column)
            && !squares[checkPosition.row][checkPosition.column].piece) {
                moves.add(squares[checkPosition.row][checkPosition.column].name);
                checkPosition = moveInDirection(checkPosition, direction);
        }

        if (hasCapture(checkPosition.row, checkPosition.column, pieceColor)) {
            capture = squares[checkPosition.row][checkPosition.column].name;
        }


        return { moves: moves, capture: capture}
    }

    function moveInDirection(position: Position, direction: string): Position {
        switch(direction) {
            case moveDirection.UP:
                position.row--;
                break;
            case moveDirection.DOWN:
                position.row++;
                break;
            case moveDirection.LEFT:
                position.column--;
                break;
            case moveDirection.RIGHT:
                position.column++;
                break;
            default:
                break;
        }

        return position;
    }

    function getPossibleQueenMoves(position: Position, pieceColor: string): PossibleMoves {
        
        const diagonalMoves: PossibleMoves = getPossibleBishopMoves(position, pieceColor);
        const vertandHorizMoves: PossibleMoves = getPossibleRookMoves(position, pieceColor);

        return { moves: diagonalMoves.moves.union(vertandHorizMoves.moves),
                 captures: diagonalMoves.captures.union(vertandHorizMoves.captures)
                };

    }

    function getPossibleKingMoves(position: Position, pieceColor: string): PossibleMoves {

         let reachablePositions = [
            {row: position.row - 1, column: position.column - 1},
            {row: position.row - 1, column: position.column},
            {row: position.row - 1, column: position.column + 1},
            {row: position.row, column: position.column - 1},
            {row: position.row, column: position.column + 1},
            {row: position.row + 1, column: position.column - 1},
            {row: position.row + 1, column: position.column},
            {row: position.row + 1, column: position.column + 1}
        ];

        let moves = new Set<string>();
        let captures = new Set<string>();

        for (let pos of reachablePositions) {
            if (!isOnBoard(pos.row, pos.column)) {
                continue;
            }

            if (squares[pos.row][pos.column].piece
                && squares[pos.row][pos.column].piece?.color !== pieceColor
            ) {
                captures.add(squares[pos.row][pos.column].name);
            }
            else if (!squares[pos.row][pos.column].piece){
                moves.add(squares[pos.row][pos.column].name);
            }
        }

        return {moves: moves, captures: captures};
    }

    function isOnBoard(r: number, c:number): boolean {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    function hasCapture(r: number, c: number, pieceColor: string): boolean {
        return isOnBoard(r, c) && Boolean(squares[r][c].piece) && squares[r][c].piece?.color !== pieceColor;
    }

    function isPawnTransformationMove(selectedPiece: Piece, targetSquare: SquareType): boolean {
        if (!selectedPiece) {
            return false;
        }
        
        if (selectedPiece.type === PieceType.PAWN) {
            if (selectedPiece.color === PieceColor.BLACK
                && targetSquare.position.row === 7) {
                    return true;
                }

            if (selectedPiece.color === PieceColor.WHITE
                && targetSquare.position.row === 0) {
                    return true;
                }
        }

        return false;
    }

}


