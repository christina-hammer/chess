import Board from "../Board/Board.js"
import "../styles.css";


export default function Page() {

    return (
        <div>
            <div className="boardContainer">
                <Board/>
            </div>
        </div>
    );
}