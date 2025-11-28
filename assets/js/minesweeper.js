/**
 * マインスイーパーゲーム
 * 地雷除去ゲーム - クラシックなパズルゲーム実装
 */

class Minesweeper {
    constructor() {
        this.width = 9;
        this.height = 9;
        this.minesCount = 10;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameStarted = false;
        this.gameOver = false;
        this.firstClick = true;
        this.difficulty = 'beginner';
    }

    // 新しいゲームを初期化
    init(width, height, minesCount, difficulty = 'beginner') {
        this.width = width;
        this.height = height;
        this.minesCount = minesCount;
        this.difficulty = difficulty;
        this.gameStarted = false;
        this.gameOver = false;
        this.firstClick = true;

        // ボード初期化
        this.board = Array(height).fill(null).map(() => Array(width).fill(0));
        this.revealed = Array(height).fill(null).map(() => Array(width).fill(false));
        this.flagged = Array(height).fill(null).map(() => Array(width).fill(false));
    }

    // 地雷を配置（最初のクリック位置を避ける）
    placeMines(firstRow, firstCol) {
        let minesPlaced = 0;
        const excludePositions = this.getAdjacentCells(firstRow, firstCol);
        excludePositions.push([firstRow, firstCol]);

        while (minesPlaced < this.minesCount) {
            const row = Math.floor(Math.random() * this.height);
            const col = Math.floor(Math.random() * this.width);

            // 最初のクリック位置とその周辺を除外
            const isExcluded = excludePositions.some(([r, c]) => r === row && c === col);
            
            if (this.board[row][col] !== -1 && !isExcluded) {
                this.board[row][col] = -1;
                minesPlaced++;
            }
        }

        // 各セルの周囲の地雷数を計算
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.board[row][col] !== -1) {
                    this.board[row][col] = this.countAdjacentMines(row, col);
                }
            }
        }
    }

    // 隣接セルを取得
    getAdjacentCells(row, col) {
        const adjacent = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol)) {
                    adjacent.push([newRow, newCol]);
                }
            }
        }
        return adjacent;
    }

    // 隣接する地雷数をカウント
    countAdjacentMines(row, col) {
        let count = 0;
        const adjacent = this.getAdjacentCells(row, col);
        
        for (const [r, c] of adjacent) {
            if (this.board[r][c] === -1) {
                count++;
            }
        }
        return count;
    }

    // 有効なセルかチェック
    isValidCell(row, col) {
        return row >= 0 && row < this.height && col >= 0 && col < this.width;
    }

    // セルを開く
    revealCell(row, col) {
        if (!this.isValidCell(row, col)) return false;
        if (this.revealed[row][col] || this.flagged[row][col]) return false;

        // 最初のクリックの場合、地雷を配置
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.gameStarted = true;
        }

        this.revealed[row][col] = true;

        // 地雷を踏んだ
        if (this.board[row][col] === -1) {
            this.gameOver = true;
            return 'mine';
        }

        // 周囲に地雷がない場合、連鎖的に開く
        if (this.board[row][col] === 0) {
            const adjacent = this.getAdjacentCells(row, col);
            for (const [r, c] of adjacent) {
                if (!this.revealed[r][c] && !this.flagged[r][c]) {
                    this.revealCell(r, c);
                }
            }
        }

        return 'safe';
    }

    // 旗を立てる/外す
    toggleFlag(row, col) {
        if (!this.isValidCell(row, col)) return false;
        if (this.revealed[row][col]) return false;

        this.flagged[row][col] = !this.flagged[row][col];
        return true;
    }

    // 残りの地雷数
    getRemainingMines() {
        let flagCount = 0;
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.flagged[row][col]) flagCount++;
            }
        }
        return this.minesCount - flagCount;
    }

    // 勝利判定
    checkWin() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                // 地雷以外のセルが全て開かれているかチェック
                if (this.board[row][col] !== -1 && !this.revealed[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // 全ての地雷を表示
    revealAllMines() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.board[row][col] === -1) {
                    this.revealed[row][col] = true;
                }
            }
        }
    }
}

class MinesweeperUI {
    constructor() {
        this.game = new Minesweeper();
        this.timer = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.currentDifficulty = 'beginner';

        this.initElements();
        this.initEventListeners();
        this.loadBestTimes();
        this.updateLanguage();
    }

    initElements() {
        // 画面
        this.startScreen = document.getElementById('startScreen');
        this.customScreen = document.getElementById('customScreen');
        this.gameScreen = document.getElementById('gameScreen');

        // ゲームボード
        this.gameBoardElement = document.getElementById('gameBoard');
        this.minesCountElement = document.getElementById('minesCount');
        this.timerElement = document.getElementById('timer');
        this.resetBtn = document.getElementById('resetBtn');

        // ボタン
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.menuBtn = document.getElementById('menuBtn');

        // カスタム設定
        this.customWidthInput = document.getElementById('customWidth');
        this.customHeightInput = document.getElementById('customHeight');
        this.customMinesInput = document.getElementById('customMines');
        this.densityDisplay = document.getElementById('densityDisplay');
        this.startCustomBtn = document.getElementById('startCustomBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');

        // モーダル
        this.completeModal = document.getElementById('completeModal');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.backToStartBtn = document.getElementById('backToStartBtn');
    }

    initEventListeners() {
        // 難易度選択
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                if (difficulty === 'custom') {
                    this.showCustomScreen();
                } else {
                    this.startGame(difficulty);
                }
            });
        });

        // カスタム設定
        this.customWidthInput.addEventListener('input', () => this.updateDensity());
        this.customHeightInput.addEventListener('input', () => this.updateDensity());
        this.customMinesInput.addEventListener('input', () => this.updateDensity());
        this.startCustomBtn.addEventListener('click', () => this.startCustomGame());
        this.backToMenuBtn.addEventListener('click', () => this.backToMenu());

        // ゲーム制御
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.newGameBtn.addEventListener('click', () => this.resetGame());
        this.menuBtn.addEventListener('click', () => this.backToMenu());

        // モーダル
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.backToStartBtn.addEventListener('click', () => this.backToMenu());
    }

    showCustomScreen() {
        this.startScreen.classList.remove('active');
        this.customScreen.classList.add('active');
        this.updateDensity();
    }

    updateDensity() {
        const width = parseInt(this.customWidthInput.value);
        const height = parseInt(this.customHeightInput.value);
        const mines = parseInt(this.customMinesInput.value);

        if (width && height && mines) {
            const totalCells = width * height;
            const density = (mines / totalCells * 100).toFixed(1);
            this.densityDisplay.textContent = `${density}%`;

            // 最大地雷数の制限
            const maxMines = Math.floor(totalCells * 0.4);
            if (mines > maxMines) {
                this.customMinesInput.value = maxMines;
            }
        }
    }

    startCustomGame() {
        const width = parseInt(this.customWidthInput.value);
        const height = parseInt(this.customHeightInput.value);
        const mines = parseInt(this.customMinesInput.value);

        if (width < 5 || width > 50 || height < 5 || height > 30) {
            alert(translations[currentLanguage]?.minesweeper?.messages?.invalidSize || 'グリッドサイズが無効です');
            return;
        }

        this.currentDifficulty = 'custom';
        this.game.init(width, height, mines, 'custom');
        this.customScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.renderBoard();
        this.updateUI();
    }

    startGame(difficulty) {
        this.currentDifficulty = difficulty;

        const configs = {
            beginner: { width: 9, height: 9, mines: 10 },
            intermediate: { width: 16, height: 16, mines: 40 },
            expert: { width: 30, height: 16, mines: 99 }
        };

        const config = configs[difficulty];
        this.game.init(config.width, config.height, config.mines, difficulty);

        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');

        this.renderBoard();
        this.updateUI();
    }

    renderBoard() {
        this.gameBoardElement.innerHTML = '';
        this.gameBoardElement.style.gridTemplateColumns = `repeat(${this.game.width}, 30px)`;
        this.gameBoardElement.style.gridTemplateRows = `repeat(${this.game.height}, 30px)`;

        for (let row = 0; row < this.game.height; row++) {
            for (let col = 0; col < this.game.width; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener('click', (e) => this.handleCellClick(e, row, col));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(e, row, col));

                this.gameBoardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(e, row, col) {
        e.preventDefault();
        if (this.game.gameOver) return;

        const result = this.game.revealCell(row, col);

        if (result === 'mine') {
            this.gameOver(false);
        } else if (result === 'safe') {
            if (this.game.gameStarted && !this.timer) {
                this.startTimer();
            }

            this.updateBoard();

            if (this.game.checkWin()) {
                this.gameOver(true);
            }
        }

        this.updateUI();
    }

    handleRightClick(e, row, col) {
        e.preventDefault();
        if (this.game.gameOver) return;

        this.game.toggleFlag(row, col);
        this.updateBoard();
        this.updateUI();
    }

    updateBoard() {
        const cells = this.gameBoardElement.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            const row = Math.floor(index / this.game.width);
            const col = index % this.game.width;

            cell.className = 'cell';

            if (this.game.revealed[row][col]) {
                cell.classList.add('revealed');

                if (this.game.board[row][col] === -1) {
                    cell.classList.add('mine');
                } else if (this.game.board[row][col] > 0) {
                    cell.textContent = this.game.board[row][col];
                    cell.dataset.count = this.game.board[row][col];
                }
            } else if (this.game.flagged[row][col]) {
                cell.classList.add('flagged');
            }
        });

        // ゲームオーバー時の表示
        if (this.game.gameOver) {
            cells.forEach((cell, index) => {
                const row = Math.floor(index / this.game.width);
                const col = index % this.game.width;

                if (this.game.board[row][col] === -1 && !this.game.revealed[row][col]) {
                    cell.classList.add('mine');
                }
                
                if (this.game.flagged[row][col] && this.game.board[row][col] !== -1) {
                    cell.classList.add('wrong-flag');
                }
            });
        }
    }

    updateUI() {
        this.minesCountElement.textContent = this.game.getRemainingMines().toString().padStart(3, '0');
        
        if (this.game.gameOver) {
            this.resetBtn.textContent = '😵';
        } else if (this.game.checkWin()) {
            this.resetBtn.textContent = '😎';
        } else {
            this.resetBtn.textContent = '😊';
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = Math.min(this.elapsedTime, 999).toString().padStart(3, '0');
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetGame() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.timerElement.textContent = '000';
        this.game.init(this.game.width, this.game.height, this.game.minesCount, this.currentDifficulty);
        this.renderBoard();
        this.updateUI();
    }

    gameOver(won) {
        this.stopTimer();
        this.game.gameOver = true;

        if (!won) {
            this.game.revealAllMines();
            this.resetBtn.textContent = '😵';
        } else {
            this.resetBtn.textContent = '😎';
            
            // ベストタイム更新チェック
            if (this.currentDifficulty !== 'custom') {
                const bestTimes = this.loadBestTimes();
                let isNewRecord = false;

                if (!bestTimes[this.currentDifficulty] || this.elapsedTime < bestTimes[this.currentDifficulty]) {
                    bestTimes[this.currentDifficulty] = this.elapsedTime;
                    localStorage.setItem('minesweeper_bestTimes', JSON.stringify(bestTimes));
                    isNewRecord = true;
                }

                // 完了モーダルを表示
                this.showCompleteModal(won, isNewRecord);
            } else {
                this.showCompleteModal(won, false);
            }
        }

        this.updateBoard();
    }

    showCompleteModal(won, isNewRecord) {
        const difficultyNames = {
            beginner: translations[currentLanguage]?.minesweeper?.difficulty?.beginner || '初級',
            intermediate: translations[currentLanguage]?.minesweeper?.difficulty?.intermediate || '中級',
            expert: translations[currentLanguage]?.minesweeper?.difficulty?.expert || '上級',
            custom: translations[currentLanguage]?.minesweeper?.difficulty?.custom || 'カスタム'
        };

        if (won) {
            this.resultTitle.textContent = translations[currentLanguage]?.minesweeper?.messages?.win || '🎉 クリア！';
            this.resultMessage.textContent = translations[currentLanguage]?.minesweeper?.messages?.complete || 'おめでとうございます！';
        } else {
            this.resultTitle.textContent = translations[currentLanguage]?.minesweeper?.messages?.gameOver || '💣 ゲームオーバー';
            this.resultMessage.textContent = translations[currentLanguage]?.minesweeper?.messages?.tryAgain || 'もう一度チャレンジ！';
        }

        document.getElementById('finalTime').textContent = this.elapsedTime;
        document.getElementById('finalDifficulty').textContent = difficultyNames[this.currentDifficulty];

        const newRecordMsg = document.getElementById('newRecordMsg');
        if (isNewRecord && won) {
            newRecordMsg.style.display = 'block';
        } else {
            newRecordMsg.style.display = 'none';
        }

        this.completeModal.classList.add('active');
    }

    playAgain() {
        this.completeModal.classList.remove('active');
        this.resetGame();
    }

    backToMenu() {
        this.stopTimer();
        this.completeModal.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.customScreen.classList.remove('active');
        this.startScreen.classList.add('active');
        this.loadBestTimes();
    }

    loadBestTimes() {
        const saved = localStorage.getItem('minesweeper_bestTimes');
        const bestTimes = saved ? JSON.parse(saved) : {};

        const formatTime = (seconds) => {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        document.getElementById('bestBeginner').textContent = formatTime(bestTimes.beginner);
        document.getElementById('bestIntermediate').textContent = formatTime(bestTimes.intermediate);
        document.getElementById('bestExpert').textContent = formatTime(bestTimes.expert);

        return bestTimes;
    }

    updateLanguage() {
        // 言語切り替え時の処理
        if (this.gameScreen.classList.contains('active')) {
            // 必要に応じてUI更新
        }
    }
}

// ゲーム初期化
let minesweeperUI;
document.addEventListener('DOMContentLoaded', () => {
    minesweeperUI = new MinesweeperUI();
});

// 言語切り替え時にUI更新
const originalChangeLanguage = window.changeLanguage;
window.changeLanguage = function(lang) {
    originalChangeLanguage(lang);
    if (minesweeperUI) {
        minesweeperUI.updateLanguage();
    }
};
