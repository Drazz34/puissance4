let board = Array.from(document.querySelectorAll('.cell'));
let currentPlayer = "r";
let gameActive = false;
let players = [];

let winningConditions = {
    horizontal: [],
    vertical: [],
    diagonalRight: [],
    diagonalLeft: []
};

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
        // Horizontal
        if (col < 4) {
            winningConditions.horizontal.push([[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]);
        }

        // Vertical
        if (row < 3) {
            winningConditions.vertical.push([[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]);
        }

        // Diagonal to the right
        if (col < 4 && row < 3) {
            winningConditions.diagonalRight.push([[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]);
        }

        // Diagonal to the left
        if (col > 2 && row < 3) {
            winningConditions.diagonalLeft.push([[row, col], [row + 1, col - 1], [row + 2, col - 2], [row + 3, col - 3]]);
        }
    }
}

document.getElementById('play').addEventListener('click', function () {
    resetGame();

    let player1 = '';
    while (!player1) {
        player1 = prompt("Prénom du joueur 1 : ");
    }

    let player2 = '';
    while (!player2) {
        player2 = prompt("Prénom du joueur 2 : ");
    }

    while (player1 == player2) {
        player2 = prompt("Prénom déjà pris, veuillez en choisir un autre : ");
    }

    players = [player1, player2];

    // Met à jour les noms des joueurs
    document.getElementById('player1').textContent = "Joueur 1 : " + players[0];
    document.getElementById('player2').textContent = "Joueur 2 : " + players[1];

    gameActive = true;
});

// function handleCellClick(clickedCellEvent) {
//     const clickedCell = clickedCellEvent.target;

//     if (clickedCell.classList.contains('r') || clickedCell.classList.contains('y') || !gameActive) {
//         return;
//     }

//     clickedCell.classList.add(currentPlayer);

//     updateGameState();
// }

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;

    // Ignore le click si la cellule est déjà remplie ou si le jeu n'est pas actif
    if (!gameActive) {
        return;
    }

    // Obtiens l'index de la colonne sur laquelle le joueur a cliqué
    let column = clickedCell.cellIndex;

    // Parcours les cellules de cette colonne, de bas en haut
    for (let row = 5; row >= 0; row--) {
        const cell = board[row * 7 + column];

        // Si la cellule est vide, ajoute le jeton du joueur courant
        if (!cell.classList.contains('r') && !cell.classList.contains('y')) {
            cell.classList.add(currentPlayer);

            // Met à jour l'état du jeu après avoir ajouté le jeton
            updateGameState();

            // Change le tour du joueur seulement si le jeu est toujours en cours
            if (gameActive) {
                currentPlayer = currentPlayer === 'r' ? 'y' : 'r';
            }

            return; // Un jeton a été placé, on sort de la fonction
        }
    }

    // Si la fonction atteint ce point, aucune cellule n'a été remplie dans la colonne cliquée
}

function updateGameState() {
    let roundWon = false;

    // Convertir le tableau board en matrice 2D pour faciliter l'accès par coordonnées
    let boardMatrix = [];
    for (let i = 0; i < 6; i++) {
        boardMatrix.push(board.slice(i * 7, (i + 1) * 7));
    }

    for (let direction in winningConditions) {

        for (let condition of winningConditions[direction]) {
            const [x1, y1] = condition[0];
            const [x2, y2] = condition[1];
            const [x3, y3] = condition[2];
            const [x4, y4] = condition[3];

            const a = boardMatrix[x1][y1].classList.contains(currentPlayer);
            const b = boardMatrix[x2][y2].classList.contains(currentPlayer);
            const c = boardMatrix[x3][y3].classList.contains(currentPlayer);
            const d = boardMatrix[x4][y4].classList.contains(currentPlayer);

            if (a && a === b && a === c && a === d) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            setTimeout(function () {
                alert(currentPlayer === 'r' ? players[0] + " a gagné !" : players[1] + " a gagné !");
            }, 100);
            return;
        }

        // Vérifie si toutes les cellules ont été remplies
        let roundDraw = true;
        for (let cell of board) {
            if (!cell.classList.contains('r') && !cell.classList.contains('y')) {
                roundDraw = false;
                break;
            }
        }

        // Si toutes les cellules sont remplies et qu'aucun joueur n'a gagné, c'est une égalité
        if (roundDraw) {
            gameActive = false;
            setTimeout(function () {
                alert("Égalité !");
            }, 100);
            return;
        }
    }

    // // Si aucune cellule n'a été remplie, ne pas changer le joueur
    // if (!handleCellClick(clickedCellEvent)) {
    //     return;
    // }

    // currentPlayer = currentPlayer === 'r' ? 'y' : 'r';
}

board.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('reset').addEventListener('click', resetGame);

function resetGame() {
    currentPlayer = 'r';
    board.forEach(cell => {
        cell.classList.remove('r', 'y');
    });
    gameActive = players.length === 2;
}