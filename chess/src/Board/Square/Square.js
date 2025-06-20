import "../../styles.css";

export const colors =  {
    BLACK: "black",
    WHITE: "white"
};

export default function Square(color, name, piece) {
    return (
        <div className = {squareClass()}>
            {name}
        </div>
    );


    function squareClass() {
        return "square " + color;
    }


}