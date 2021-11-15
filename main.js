(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }
    self.Board.prototype = {
        get elements() {
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
}());

(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        board.ball = this;
        this.kind = "circle";
    }
}());

(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.speed = 10;
        this.board.bars.push(this);
        this.kind = "rectangle";
    }

    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "x: " + this.x + " y: " + this.y;
        }
    }

}());


(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function () {
            this.context.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];
                draw(this.context, el);
            }
        },
        play: function () {
            this.clean();
            this.draw();
        }
    }

    function draw(contexto, element) {

        switch (element.kind) {
            case "rectangle":
                contexto.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                contexto.beginPath();
                contexto.arc(element.x, element.y, element.radius, 0, 7);
                contexto.fill();
                contexto.closePath();
                break;
        }

    }
}());

var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar_2 = new Bar(700, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);
//console.log(ball);

window.requestAnimationFrame(controller);

document.addEventListener("keydown", function (ev) {
    ev.preventDefault();
    if (ev.keyCode == 38) {
        bar.up();
        board_view.draw();
    } else if (ev.keyCode == 40) {
        bar.down();
        board_view.draw();
    } else if (ev.keyCode == 87) {
        bar_2.up();
        board_view.draw();
    } else if (ev.keyCode == 83) {
        bar_2.down();
        board_view.draw();
    }
});

window.addEventListener("load", controller);

function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}