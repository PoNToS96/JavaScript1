window.onload = function() {
    var canvas = document.getElementById("minCanvas");
    var ctx = canvas.getContext("2d");

    var ballRadius = 10;
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -2;
    var redx = dx;
    var redy = dy;
    var paddleHeight = 17;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 8;
    var brickColumnCount = 5;
    var brickWidth = 60;
    var brickHeight = 20;
    var brickPadding = 6;
    // avstånd från övre och vänstra kanten
    var brickOffsetTop = 30;
    var brickOffsetLeft = 12;

    var score = 0;
    var lives = 3;
    var bricks = [];
    // loopar igenom arrayen och skapar stenarna, status 1 för att de ska ritas när programmet startas
    for(c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    // lägger till eventListeners för tangenttryckningar och musrörelser
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    // om tangent högerpil (39) eller vänsterpil (37) trycks ner sätts right- och left-pressed till true
    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
    }
    // om tangent högerpil (39) eller vänsterpil (37) släpps sätts right- och left-pressed till false
    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }
    }
    // kollar var muspekaren befinner sig och sätter racketens mitt på muspekarens x-position om muspekaren befinner sig på canvasen
    function mouseMoveHandler(e) {
        var relX = e.clientX - canvas.offsetLeft;
        if(relX > 0 && relX < canvas.width) {
            paddleX = relX - paddleWidth/2;
        }
    }
    // stegar igenom arrayen med stenar via två loopar och kollar om bollens yta träffar en sten
    function collisionDetection() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x+ballRadius >= b.x && x-ballRadius <= b.x+brickWidth && y+ballRadius >= b.y && y-ballRadius <= b.y+brickHeight) {
                        // om bollen träffar ovanpå eller under stenen, ändra riktining i y-led, annars i x-led
                        if (y+ballRadius == b.y || y-ballRadius == b.y+brickHeight) {
                            dy = -dy;
                        }
                        else {
                            dx = - dx;
                        }
                        // när stenen blir träffad får den status 0 för att inte ritas igen
                        b.status = 0;
                        // ökar poängen vid varje träff
                        score++;
                        // ökar hastigheten när poängen når 20
                        if (score == 20) {
                            dy++;
                            dx++;
                        }
                        // ökar hastigheten när poängen når 30
                        if (score == 30) {
                            dy++;
                            dx++;
                        }
                        // om poängen = antal stenar (stenar slut) har spelaren vunnit. Dialogruta poppar upp, animationFrame stoppas. 
                        if(score == brickRowCount*brickColumnCount) {
                            $('#vinst').dialog('open');
                            cancelAnimationFrame();
                        }
                    }
                }
            }
        }
    }
    // ritar bollen (cirkel)
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#3e3e28";
        ctx.fill();
        ctx.closePath();
    }
    // ritar racketen (hämtar bild och placerar den på canvasen)
    function drawPaddle() {
        var racket = document.getElementById('racket');
        ctx.drawImage(racket, paddleX, canvas.height-paddleHeight);
    }
    //ritar stenarna på canvasen genom for-loopar som stegar igenom en array
    function drawBricks() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                // stenen ritas om den har status 1
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#3e3e28";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    // ritar och stilsätter poängen på canvasen
    function drawScore() {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#99003d";
        ctx.fillText("Poäng: "+score, 15, 20);
    }
    // ritar och stilsätter liv på canvasen
    function drawLives() {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#99003d";
        ctx.fillText("Liv: "+lives, canvas.width-65, 20);
    }
    // ritar allt på canvasen, håller koll på om spelet tar slut, uppdaterar canvasen
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        // om bollen träffar den högra eller vänstra väggen, ändra riktningen i x-led
        if (x+dx > canvas.width-ballRadius || x+dx < ballRadius) {
            dx = -dx;
        }
        // om bollen träffar den översta väggen, ändra riktningen i y-led
        if (y+dy < ballRadius) {
            dy = -dy;
        }
            // om bollen är ovanför racketen (x-led). Racketens bredd utökas med 5 på varje sida för att bollen inte ska verka "ätas upp" av racketen.
        if (x > paddleX-5 && x < paddleX+paddleWidth+5) {
            // om bollen träffar ovansidan på racketen eller under denna
            if (y+dy > canvas.height-(ballRadius+paddleHeight)) {
                // om bollen är nedanför racketens ovansida
                if (y+dy > canvas.height-(ballRadius+paddleHeight-2)) {
                    dy = dy;
                    // bollen ändrar riktning i x-led om den träffar racketens sida
                    if (x > paddleX && x < paddleX+paddleWidth) {
                        dx = -dx;
                    }
                }
                else {
                    dy = -dy;
                }
            }
        }
        // om bollen åker nedanför den understa väggen, 
        if (y+dy > canvas.height-ballRadius) 
        {
            // dra 1 från lives
            lives--;
            // om lives är mindre än 1, ladda om dokumentet
            if (lives < 1) {
                $('#gameOver').dialog('open');
                cancelAnimationFrame();
            }
            // om lives är minst 1, placerar ut bollen och racketen igen (startar om) och återställer hastigheten till den ursprungliga (redx)
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                // om poängen är minst 30, låt hastigheten vara ett mer än det ursprungliga (redx och redy) 
                if (score > 29) {
                    dx = redx + 1;
                    dy = redy + 1;
                }
                // om poängen är under 30, återställ hastigheten helt och hållet (dx och dy till redx och redy) 
                else {
                    dx = redx;
                    dy = redy;
                }
                paddleX = (canvas.width-paddleWidth)/2;
            }
        } 
        // flyttar racketen 7 pixlar åt höger eller vänster när höger- eller vänster tangent trycks ner så länge den håller sig inom canvasen 
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
        // ändrar x- och y-värdena för bollen så att den rör sig vid varje uppdatering av canvasen
        x += dx;
        y += dy;
        // uppdaterar och skapar animationen
        requestAnimationFrame(draw);
    }
    draw();
}

$(window).ready(function() {

    // skapar dialogruta med OK-knapp. Dokumentet laddas om vid klick på OK.
    $('#gameOver, #vinst').dialog({
            //height: 250,
            autoOpen: false,
            //modal: true,
            buttons: { 
                'OK': function() {
                    document.location.reload();
                    $(this).dialog('close'); 
                }
            } 
    }); // end dialog
}); // end ready    
