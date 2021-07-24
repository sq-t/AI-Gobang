import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }
    render() {
        return (
            <button
                className="square"
                onClick={this.props.onClick}
            >
                {this.props.value}
            </button>
        );
    }
} */

const size = 100;//棋盘大小

//函数组件
function Square(props) {
    return (
        <button
            className={`square ${props.squaresbg} ${props.squarescolor}`}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i}
                squarescolor={this.props.line && this.props.line.includes(i) ? 'color' : ''}
                squaresbg={i === this.props.coordinate ? 'squareCurrent' : ''}
                value={this.props.squares[i]}
                onClick={() => { this.props.onClick(i) }}
            />
        );
    }

    render() {
        let [total, row] = [size, Math.sqrt(size)];
        let outerDiv = [];
        for (let i = 0; i < total; i += row) {
            let squares = [];
            for (let j = i; j < i + row; j++) {
                squares.push(this.renderSquare(j));
            }
            outerDiv.push(
                <div key={i} className="board-row">
                    {squares}
                </div>
            );
        }
        return (
            <div>
                {outerDiv}
            </div>
        )
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(size).fill(null),
                coordinate: null
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice();
        const squares = Object.assign([], history[history.length - 1].squares);
        const coordinate = this.state.history[this.state.history.length - 1].coordinate;
        if (squares[i] || calculeteWinner(squares,coordinate).winner) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinate: i
            }]),
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext
        });
    }

    reset() {
        this.setState({
            history: [{
                squares: Array(size).fill(null),
                coordinate: null
            }],
            stepNumber: 0,
            xIsNext: 'X'
        });
    }

    prevStep() {
        const history = this.state.history.slice();
        history.pop();
        this.setState({
            history: history,
            stepNumber: this.state.stepNumber - 1,
            xIsNext: !this.state.xIsNext
        });
    }

    render() {
        console.log(this.state.history)
        const [squares, coordinate] = [
            this.state.history[this.state.history.length - 1].squares,
            this.state.history[this.state.history.length - 1].coordinate
        ];
        const result = calculeteWinner(squares,coordinate);
        const [winner, line] = [result.winner, result.line];
        let status;
        if (winner) {
            status = `Winner: ${winner}!`;
        } else if (!squares.includes(null) && winner === null) {
            status = `Draw!`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        line={line}
                        coordinate={coordinate}
                        squares={squares}
                        onClick={(i) => { this.handleClick(i) }}
                    />
                </div>
                <div className="game-info">
                    <div>Step: {this.state.stepNumber}</div>
                    <div>{status}</div>
                    <div><button onClick={() => { this.reset() }}>重新开始</button></div>
                    <div>{squares.every((value) => { return value ? false : true; }) ? '' : <button onClick={() => { this.prevStep() }}>悔棋</button>}</div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculeteWinner(squares,coordinate) {
    const row=Math.sqrt(size);
    let count=0;
    do{
        const lines = [
            [coordinate-(count+4),coordinate-(count+3),coordinate-(count+2),coordinate-(count+1),coordinate-count],
            [coordinate-(count+4)*row,coordinate-(count+3)*row,coordinate-(count+2)*row,coordinate-(count+1)*row,coordinate-count*row],
            [coordinate-(count+4)*(row+1),coordinate-(count+3)*(row+1),coordinate-(count+2)*(row+1),coordinate-(count+1)*(row+1),coordinate-count*(row+1)],
            [coordinate-(count+4)*(row-1),coordinate-(count+3)*(row-1),coordinate-(count+2)*(row-1),coordinate-(count+1)*(row-1),coordinate-count*(row-1)]
        ];
        for (const line of lines) {
            const [a, b, c,d,e] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]&& squares[a] === squares[d]&& squares[a] === squares[e]) {
                return { winner: squares[a], line: line };
            }
        }
        count++;
    }while(count<5);
    return { winner: null, line: null };
}