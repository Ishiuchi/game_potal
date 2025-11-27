/**
 * 数独ゲーム
 * パズル生成、入力管理、エラーチェック、タイマー機能を実装
 */

class SudokuGame {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.initial = Array(9).fill(null).map(() => Array(9).fill(false));
        this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
        this.history = [];
        this.difficulty = 'normal';
        this.selectedCell = null;
        this.notesMode = false;
        this.hintsRemaining = 3;
        this.hintsUsed = 0;
    }

    // 完全な数独を生成（バックトラッキング）
    generateComplete() {
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        
        const isValid = (row, col, num) => {
            // 行チェック
            for (let x = 0; x < 9; x++) {
                if (this.solution[row][x] === num) return false;
            }
            
            // 列チェック
            for (let x = 0; x < 9; x++) {
                if (this.solution[x][col] === num) return false;
            }
            
            // 3×3ブロックチェック
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.solution[startRow + i][startCol + j] === num) return false;
                }
            }
            
            return true;
        };

        const solve = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (this.solution[row][col] === 0) {
                        const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                        for (let num of numbers) {
                            if (isValid(row, col, num)) {
                                this.solution[row][col] = num;
                                if (solve()) return true;
                                this.solution[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        solve();
    }

    // 配列をシャッフル
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // パズルを生成（難易度に応じて数字を削除）
    generatePuzzle(difficulty) {
        this.difficulty = difficulty;
        this.generateComplete();
        
        // 難易度別の削除数
        const removeCount = {
            easy: 40,      // 41個残す
            normal: 50,    // 31個残す
            hard: 55,      // 26個残す
            expert: 60     // 21個残す
        };

        // グリッドを解答でコピー
        this.grid = this.solution.map(row => [...row]);
        this.initial = Array(9).fill(null).map(() => Array(9).fill(false));

        // ランダムに数字を削除
        let removed = 0;
        const positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j]);
            }
        }
        
        const shuffledPositions = this.shuffle(positions);
        
        while (removed < removeCount[difficulty]) {
            const [row, col] = shuffledPositions[removed];
            this.grid[row][col] = 0;
            removed++;
        }

        // 初期配置をマーク
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] !== 0) {
                    this.initial[i][j] = true;
                }
            }
        }

        // ヒント数を設定
        const hintCounts = { easy: 5, normal: 3, hard: 2, expert: 1 };
        this.hintsRemaining = hintCounts[difficulty];
        this.hintsUsed = 0;
        
        // メモと履歴をクリア
        this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
        this.history = [];
    }

    // セルに数字を設定
    setCell(row, col, value) {
        if (this.initial[row][col]) return false;
        
        // 履歴に追加
        this.history.push({
            row,
            col,
            oldValue: this.grid[row][col],
            oldNotes: new Set(this.notes[row][col])
        });

        // 履歴は最大30手
        if (this.history.length > 30) {
            this.history.shift();
        }

        this.grid[row][col] = value;
        
        // 数字を入力したらメモをクリア
        if (value !== 0) {
            this.notes[row][col].clear();
        }

        return true;
    }

    // メモを追加/削除
    toggleNote(row, col, num) {
        if (this.initial[row][col] || this.grid[row][col] !== 0) return false;

        if (this.notes[row][col].has(num)) {
            this.notes[row][col].delete(num);
        } else {
            this.notes[row][col].add(num);
        }
        return true;
    }

    // 取り消し
    undo() {
        if (this.history.length === 0) return false;

        const last = this.history.pop();
        this.grid[last.row][last.col] = last.oldValue;
        this.notes[last.row][last.col] = last.oldNotes;
        
        return true;
    }

    // ヒントを表示
    getHint() {
        if (this.hintsRemaining <= 0) return null;

        // 空のセルを探す
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push([i, j]);
                }
            }
        }

        if (emptyCells.length === 0) return null;

        // ランダムに1つ選択
        const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = this.solution[row][col];

        this.setCell(row, col, value);
        this.hintsRemaining--;
        this.hintsUsed++;

        return { row, col, value };
    }

    // エラーチェック
    checkErrors() {
        const errors = [];

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] !== 0 && this.grid[i][j] !== this.solution[i][j]) {
                    errors.push([i, j]);
                }
            }
        }

        return errors;
    }

    // 完成チェック
    isComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // セルが有効かチェック
    isValidMove(row, col, num) {
        // 同じ行に同じ数字があるか
        for (let x = 0; x < 9; x++) {
            if (x !== col && this.grid[row][x] === num) return false;
        }
        
        // 同じ列に同じ数字があるか
        for (let x = 0; x < 9; x++) {
            if (x !== row && this.grid[x][col] === num) return false;
        }
        
        // 同じ3×3ブロックに同じ数字があるか
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const r = startRow + i;
                const c = startCol + j;
                if ((r !== row || c !== col) && this.grid[r][c] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
}

class SudokuUI {
    constructor() {
        this.game = new SudokuGame();
        this.timer = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.currentDifficulty = 'normal';
        
        this.initElements();
        this.initEventListeners();
        this.loadBestTimes();
        this.updateLanguage();
    }

    initElements() {
        // 画面
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        
        // グリッド
        this.gridElement = document.getElementById('sudokuGrid');
        
        // ボタン
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.numBtns = document.querySelectorAll('.num-btn');
        this.notesBtn = document.getElementById('notesBtn');
        this.eraseBtn = document.getElementById('eraseBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        
        // 情報表示
        this.timerDisplay = document.getElementById('timer');
        this.hintsCountDisplay = document.getElementById('hintsCount');
        this.currentDifficultyDisplay = document.getElementById('currentDifficulty');
        
        // モーダル
        this.completeModal = document.getElementById('completeModal');
        this.pauseModal = document.getElementById('pauseModal');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.quitBtn = document.getElementById('quitBtn');
    }

    initEventListeners() {
        // 難易度選択
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.startGame(difficulty);
            });
        });

        // 数字ボタン
        this.numBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.number);
                this.handleNumberInput(num);
            });
        });

        // アクションボタン
        this.notesBtn.addEventListener('click', () => this.toggleNotesMode());
        this.eraseBtn.addEventListener('click', () => this.eraseCell());
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.newGameBtn.addEventListener('click', () => this.confirmNewGame());
        this.pauseBtn.addEventListener('click', () => this.pauseGame());

        // モーダルボタン
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.backToMenuBtn.addEventListener('click', () => this.backToMenu());
        this.resumeBtn.addEventListener('click', () => this.resumeGame());
        this.quitBtn.addEventListener('click', () => this.backToMenu());

        // キーボード入力
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame(difficulty) {
        this.currentDifficulty = difficulty;
        this.game.generatePuzzle(difficulty);
        
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        
        this.renderGrid();
        this.updateUI();
        this.startTimer();
        
        // 難易度表示を更新
        const difficultyNames = {
            easy: translations[currentLanguage]?.sudoku?.difficulty?.easy || '簡単',
            normal: translations[currentLanguage]?.sudoku?.difficulty?.normal || '普通',
            hard: translations[currentLanguage]?.sudoku?.difficulty?.hard || '難しい',
            expert: translations[currentLanguage]?.sudoku?.difficulty?.expert || '超難問'
        };
        this.currentDifficultyDisplay.textContent = difficultyNames[difficulty];
    }

    renderGrid() {
        this.gridElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.game.initial[i][j]) {
                    cell.classList.add('fixed');
                }
                
                cell.addEventListener('click', () => this.selectCell(i, j));
                
                this.gridElement.appendChild(cell);
            }
        }
        
        this.updateGrid();
    }

    updateGrid() {
        const cells = this.gridElement.querySelectorAll('.sudoku-cell');
        const errors = this.game.checkErrors();
        
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.game.grid[row][col];
            
            // エラー状態をリセット
            cell.classList.remove('error', 'user-input', 'same-number');
            
            if (value !== 0) {
                cell.textContent = value;
                if (!this.game.initial[row][col]) {
                    cell.classList.add('user-input');
                }
                
                // エラーチェック
                if (errors.some(([r, c]) => r === row && c === col)) {
                    cell.classList.add('error');
                }
                
                // 同じ数字をハイライト
                if (this.game.selectedCell && 
                    this.game.grid[this.game.selectedCell[0]][this.game.selectedCell[1]] === value) {
                    cell.classList.add('same-number');
                }
            } else {
                cell.textContent = '';
                
                // メモを表示
                if (this.game.notes[row][col].size > 0) {
                    const notesDiv = document.createElement('div');
                    notesDiv.className = 'notes';
                    
                    for (let i = 1; i <= 9; i++) {
                        const span = document.createElement('span');
                        span.textContent = this.game.notes[row][col].has(i) ? i : '';
                        notesDiv.appendChild(span);
                    }
                    
                    cell.appendChild(notesDiv);
                }
            }
        });
        
        // 選択状態を更新
        if (this.game.selectedCell) {
            const [row, col] = this.game.selectedCell;
            const index = row * 9 + col;
            cells[index].classList.add('selected');
            
            // 同じ行・列・ブロックをハイライト
            cells.forEach((c, i) => {
                const r = Math.floor(i / 9);
                const co = i % 9;
                
                if (r === row || co === col || 
                    (Math.floor(r / 3) === Math.floor(row / 3) && 
                     Math.floor(co / 3) === Math.floor(col / 3))) {
                    c.classList.add('highlighted');
                }
            });
        }
    }

    selectCell(row, col) {
        this.game.selectedCell = [row, col];
        this.updateGrid();
    }

    handleNumberInput(num) {
        if (!this.game.selectedCell) return;
        
        const [row, col] = this.game.selectedCell;
        
        if (this.game.notesMode) {
            this.game.toggleNote(row, col, num);
        } else {
            if (this.game.setCell(row, col, num)) {
                // 完成チェック
                if (this.game.isComplete()) {
                    this.gameComplete();
                }
            }
        }
        
        this.updateGrid();
        this.updateUI();
    }

    eraseCell() {
        if (!this.game.selectedCell) return;
        
        const [row, col] = this.game.selectedCell;
        
        if (this.game.grid[row][col] !== 0) {
            this.game.setCell(row, col, 0);
        } else {
            this.game.notes[row][col].clear();
        }
        
        this.updateGrid();
    }

    toggleNotesMode() {
        this.game.notesMode = !this.game.notesMode;
        
        if (this.game.notesMode) {
            this.notesBtn.classList.add('active');
        } else {
            this.notesBtn.classList.remove('active');
        }
    }

    useHint() {
        if (this.game.hintsRemaining <= 0) {
            alert(translations[currentLanguage]?.sudoku?.messages?.noHints || 'ヒントがありません');
            return;
        }
        
        const hint = this.game.getHint();
        if (hint) {
            this.game.selectedCell = [hint.row, hint.col];
            this.updateGrid();
            this.updateUI();
            
            if (this.game.isComplete()) {
                this.gameComplete();
            }
        }
    }

    undoMove() {
        if (this.game.undo()) {
            this.updateGrid();
        }
    }

    handleKeyPress(e) {
        if (this.isPaused || !this.gameScreen.classList.contains('active')) return;
        
        // 数字キー
        if (e.key >= '1' && e.key <= '9') {
            this.handleNumberInput(parseInt(e.key));
        }
        
        // 削除キー
        if (e.key === 'Backspace' || e.key === 'Delete') {
            this.eraseCell();
        }
        
        // 矢印キー
        if (this.game.selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            let [row, col] = this.game.selectedCell;
            
            if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
            if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
            if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
            if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
            
            this.selectCell(row, col);
        }
    }

    updateUI() {
        this.hintsCountDisplay.textContent = this.game.hintsRemaining;
    }

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        this.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    pauseGame() {
        this.isPaused = true;
        this.pauseModal.classList.add('active');
    }

    resumeGame() {
        this.isPaused = false;
        this.pauseModal.classList.remove('active');
        this.startTime = Date.now() - (this.elapsedTime * 1000);
    }

    confirmNewGame() {
        if (confirm(translations[currentLanguage]?.sudoku?.messages?.confirmNew || '新しいゲームを始めますか？')) {
            this.stopTimer();
            this.startGame(this.currentDifficulty);
        }
    }

    gameComplete() {
        this.stopTimer();
        
        // ベストタイム更新チェック
        const bestTimes = this.loadBestTimes();
        const currentTime = this.elapsedTime;
        let isNewRecord = false;
        
        if (!bestTimes[this.currentDifficulty] || currentTime < bestTimes[this.currentDifficulty]) {
            bestTimes[this.currentDifficulty] = currentTime;
            localStorage.setItem('sudoku_bestTimes', JSON.stringify(bestTimes));
            isNewRecord = true;
        }
        
        // 完了モーダルを表示
        document.getElementById('finalTime').textContent = this.timerDisplay.textContent;
        
        const difficultyNames = {
            easy: translations[currentLanguage]?.sudoku?.difficulty?.easy || '簡単',
            normal: translations[currentLanguage]?.sudoku?.difficulty?.normal || '普通',
            hard: translations[currentLanguage]?.sudoku?.difficulty?.hard || '難しい',
            expert: translations[currentLanguage]?.sudoku?.difficulty?.expert || '超難問'
        };
        document.getElementById('finalDifficulty').textContent = difficultyNames[this.currentDifficulty];
        document.getElementById('finalHints').textContent = this.game.hintsUsed;
        
        const newRecordMsg = document.getElementById('newRecordMsg');
        if (isNewRecord) {
            newRecordMsg.style.display = 'block';
        } else {
            newRecordMsg.style.display = 'none';
        }
        
        this.completeModal.classList.add('active');
    }

    playAgain() {
        this.completeModal.classList.remove('active');
        this.startGame(this.currentDifficulty);
    }

    backToMenu() {
        this.stopTimer();
        this.completeModal.classList.remove('active');
        this.pauseModal.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.startScreen.classList.add('active');
        this.loadBestTimes();
    }

    loadBestTimes() {
        const saved = localStorage.getItem('sudoku_bestTimes');
        const bestTimes = saved ? JSON.parse(saved) : {};
        
        // 表示を更新
        const formatTime = (seconds) => {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        document.getElementById('bestEasy').textContent = formatTime(bestTimes.easy);
        document.getElementById('bestNormal').textContent = formatTime(bestTimes.normal);
        document.getElementById('bestHard').textContent = formatTime(bestTimes.hard);
        document.getElementById('bestExpert').textContent = formatTime(bestTimes.expert);
        
        return bestTimes;
    }

    updateLanguage() {
        // 言語切り替え時に難易度表示を更新
        if (this.gameScreen.classList.contains('active')) {
            const difficultyNames = {
                easy: translations[currentLanguage]?.sudoku?.difficulty?.easy || '簡単',
                normal: translations[currentLanguage]?.sudoku?.difficulty?.normal || '普通',
                hard: translations[currentLanguage]?.sudoku?.difficulty?.hard || '難しい',
                expert: translations[currentLanguage]?.sudoku?.difficulty?.expert || '超難問'
            };
            this.currentDifficultyDisplay.textContent = difficultyNames[this.currentDifficulty];
        }
    }
}

// ゲーム初期化
let sudokuUI;
document.addEventListener('DOMContentLoaded', () => {
    sudokuUI = new SudokuUI();
});

// 言語切り替え時にUI更新
const originalChangeLanguage = window.changeLanguage;
window.changeLanguage = function(lang) {
    originalChangeLanguage(lang);
    if (sudokuUI) {
        sudokuUI.updateLanguage();
    }
};
