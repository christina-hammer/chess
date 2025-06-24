import "../../styles.css";

export const colors =  {
    BLACK: "black",
    WHITE: "white"
};

export default function Square(sq) {
    return (
        <div>
            <div className = {squareClass(sq)}> 
                {sq.name}
            </div>
            
        </div>
    );


    function squareClass(sq) {
        
        if (sq.color === colors.BLACK) {
            return "square " + "black"
        }
        return "square " + "white";
    }


}