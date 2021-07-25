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

const size = 400;//棋盘大小

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
        if (squares[i] || calculeteWinner(squares, coordinate).winner) {
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
        // console.log(this.state.history)
        const [squares, coordinate] = [
            this.state.history[this.state.history.length - 1].squares,
            this.state.history[this.state.history.length - 1].coordinate
        ];
        const result = calculeteWinner(squares, coordinate);
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


function calculeteWinner(squares, coordinate) {
    const row = Math.sqrt(size);
    let count = 0;
    do {
        const lines = [
            [coordinate - (4 - count), coordinate - (3 - count), coordinate - (2 - count), coordinate - (1 - count), coordinate + count],
            [coordinate - (4 - count) * row, coordinate - (3 - count) * row, coordinate - (2 - count) * row, coordinate - (1 - count) * row, coordinate + count * row],
            [coordinate - (4 - count) * (row + 1), coordinate - (3 - count) * (row + 1), coordinate - (2 - count) * (row + 1), coordinate - (1 - count) * (row + 1), coordinate + count * (row + 1)],
            [coordinate - (4 - count) * (row - 1), coordinate - (3 - count) * (row - 1), coordinate - (2 - count) * (row - 1), coordinate - (1 - count) * (row - 1), coordinate + count * (row - 1)]
        ];
        for (const line of lines) {
            const [a, b, c, d, e] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
                const [a1, b1, c1, d1, e1] = [Math.floor(a / row), Math.floor(b / row), Math.floor(c / row), Math.floor(d / row), Math.floor(e / row)];
                const [a2, b2, c2, d2, e2] = [Math.floor(a / row), Math.floor(b / row) - 1, Math.floor(c / row) - 2, Math.floor(d / row) - 3, Math.floor(e / row) - 4];
                if ((a1 === b1 && a1 === c1 && a1 === d1 && a1 === e1) || (a2 === b2 && a2 === c2 && a2 === d2 && a2 === e2)) {
                    return { winner: squares[a], line: line };
                }
            }
        }
        count++;
    } while (count < 5);
    return { winner: null, line: null };
}