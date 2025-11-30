// ポーカーゲーム

class PokerGame {
    constructor() {
        this.deck = [];
        this.players = [];
        this.pot = 0;
        this.currentBet = 0;
        this.ante = 10;
        this.numPlayers = 4;
        this.difficulty = 'normal';
        this.round = 0; // 0: 初期, 1: 第1ベット, 2: ドロー, 3: 第2ベット, 4: ショーダウン
        this.currentPlayerIndex = 0;
        this.dealerIndex = 0;
        this.stats = this.loadStats();
        this.gameInProgress = false;
    }

    // 統計データの読み込み
    loadStats() {
        const saved = localStorage.getItem('pokerStats');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            totalGames: 0,
            wins: 0,
            losses: 0,
            maxChips: 0,
            bestHand: '',
            handCounts: {}
        };
    }

    // 統計データの保存
    saveStats() {
        localStorage.setItem('pokerStats', JSON.stringify(this.stats));
    }

    // デッキの作成
    createDeck() {
        const suits = ['spade', 'heart', 'diamond', 'club'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const rankValues = {
            'A': 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
            '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
        };

        this.deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push({
                    suit,
                    rank,
                    value: rankValues[rank],
                    image: `assets/img/playing_cards/${suit}_${rank}.png`
                });
            }
        }
    }

    // デッキをシャッフル
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // カードを配る
    dealCard() {
        return this.deck.pop();
    }

    // プレイヤーの初期化
    initializePlayers(numPlayers, initialChips) {
        this.players = [];
        
        // 人間プレイヤー
        this.players.push({
            name: 'YOU',
            chips: initialChips,
            hand: [],
            bet: 0,
            folded: false,
            isHuman: true
        });

        // CPUプレイヤー
        const cpuNames = ['CPU_A', 'CPU_B', 'CPU_C'];
        for (let i = 1; i < numPlayers; i++) {
            this.players.push({
                name: cpuNames[i - 1],
                chips: initialChips,
                hand: [],
                bet: 0,
                folded: false,
                isHuman: false
            });
        }
    }

    // ゲーム開始
    startGame(numPlayers, difficulty, initialChips, ante) {
        this.numPlayers = numPlayers;
        this.difficulty = difficulty;
        this.ante = ante;
        
        this.initializePlayers(numPlayers, initialChips);
        this.dealerIndex = 0;
        this.gameInProgress = true;
        
        this.startRound();
    }

    // ラウンド開始
    startRound() {
        this.round = 1;
        this.pot = 0;
        this.currentBet = 0;
        this.createDeck();
        this.shuffleDeck();

        // 全プレイヤーをリセット
        this.players.forEach(player => {
            player.hand = [];
            player.bet = 0;
            player.folded = false;
        });

        // アンティを集める
        this.collectAnte();

        // カードを配る
        this.dealInitialCards();

        // ディーラーの次から開始
        this.currentPlayerIndex = (this.dealerIndex + 1) % this.players.length;
        
        this.updateDisplay();
        this.nextAction();
    }

    // アンティを集める
    collectAnte() {
        this.players.forEach(player => {
            if (player.chips >= this.ante) {
                player.chips -= this.ante;
                this.pot += this.ante;
            }
        });
    }

    // 初期カードを配る
    dealInitialCards() {
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                player.hand.push(this.dealCard());
            });
        }
    }

    // 次のアクション
    nextAction() {
        if (this.round === 4) {
            this.showdown();
            return;
        }

        // アクティブなプレイヤーを見つける
        let activePlayers = this.players.filter(p => !p.folded);
        
        if (activePlayers.length === 1) {
            this.endRoundEarly(activePlayers[0]);
            return;
        }

        // ベットラウンドが終了したかチェック
        if (this.isBettingRoundComplete()) {
            if (this.round === 1) {
                this.round = 2; // ドローフェーズへ
                this.currentPlayerIndex = (this.dealerIndex + 1) % this.players.length;
                this.currentBet = 0;
                this.players.forEach(p => p.bet = 0);
            } else if (this.round === 3) {
                this.round = 4; // ショーダウンへ
                this.showdown();
                return;
            }
        }

        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.folded) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            this.nextAction();
            return;
        }

        this.updateDisplay();

        if (this.round === 2) {
            // ドローフェーズ
            if (currentPlayer.isHuman) {
                this.showDrawUI();
            } else {
                setTimeout(() => this.cpuDraw(), 1000);
            }
        } else {
            // ベットフェーズ
            if (currentPlayer.isHuman) {
                this.showBettingUI();
            } else {
                setTimeout(() => this.cpuBet(), 1000);
            }
        }
    }

    // ベットラウンドが完了したか
    isBettingRoundComplete() {
        const activePlayers = this.players.filter(p => !p.folded);
        
        if (activePlayers.length === 0) return true;
        
        const maxBet = Math.max(...activePlayers.map(p => p.bet));
        return activePlayers.every(p => p.bet === maxBet);
    }

    // ベットUIを表示
    showBettingUI() {
        const actionArea = document.getElementById('actionArea');
        const actionButtons = document.getElementById('actionButtons');
        const betSlider = document.getElementById('betSliderContainer');
        const drawArea = document.getElementById('drawArea');
        
        actionButtons.style.display = 'flex';
        betSlider.style.display = 'none';
        drawArea.style.display = 'none';

        const checkBtn = document.getElementById('checkBtn');
        const betBtn = document.getElementById('betBtn');
        const callBtn = document.getElementById('callBtn');
        const raiseBtn = document.getElementById('raiseBtn');
        const foldBtn = document.getElementById('foldBtn');

        const player = this.players[0];
        const callAmount = this.currentBet - player.bet;

        // ボタンの有効/無効を設定
        checkBtn.disabled = this.currentBet > player.bet;
        betBtn.disabled = this.currentBet > 0;
        callBtn.disabled = callAmount <= 0 || player.chips < callAmount;
        raiseBtn.disabled = player.chips <= callAmount;
        foldBtn.disabled = false;

        // イベントリスナーをクリア
        const newCheckBtn = checkBtn.cloneNode(true);
        const newBetBtn = betBtn.cloneNode(true);
        const newCallBtn = callBtn.cloneNode(true);
        const newRaiseBtn = raiseBtn.cloneNode(true);
        const newFoldBtn = foldBtn.cloneNode(true);

        checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);
        betBtn.parentNode.replaceChild(newBetBtn, betBtn);
        callBtn.parentNode.replaceChild(newCallBtn, callBtn);
        raiseBtn.parentNode.replaceChild(newRaiseBtn, raiseBtn);
        foldBtn.parentNode.replaceChild(newFoldBtn, foldBtn);

        // 新しいイベントリスナーを追加
        document.getElementById('checkBtn').addEventListener('click', () => this.playerCheck());
        document.getElementById('betBtn').addEventListener('click', () => this.showBetSlider('bet'));
        document.getElementById('callBtn').addEventListener('click', () => this.playerCall());
        document.getElementById('raiseBtn').addEventListener('click', () => this.showBetSlider('raise'));
        document.getElementById('foldBtn').addEventListener('click', () => this.playerFold());
    }

    // ベットスライダーを表示
    showBetSlider(type) {
        const betSlider = document.getElementById('betSliderContainer');
        const slider = document.getElementById('betSlider');
        const sliderValue = document.getElementById('betSliderValue');
        const confirmBtn = document.getElementById('confirmBetBtn');

        const player = this.players[0];
        const minBet = type === 'bet' ? this.ante : this.currentBet - player.bet + this.ante;
        const maxBet = player.chips;

        slider.min = minBet;
        slider.max = maxBet;
        slider.value = minBet;
        slider.step = this.ante;
        sliderValue.textContent = minBet;

        betSlider.style.display = 'block';
        document.getElementById('actionButtons').style.display = 'none';

        slider.oninput = () => {
            sliderValue.textContent = slider.value;
        };

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        document.getElementById('confirmBetBtn').addEventListener('click', () => {
            const amount = parseInt(slider.value);
            if (type === 'bet') {
                this.playerBet(amount);
            } else {
                this.playerRaise(amount);
            }
        });
    }

    // プレイヤーアクション: チェック
    playerCheck() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.nextAction();
    }

    // プレイヤーアクション: ベット
    playerBet(amount) {
        const player = this.players[0];
        player.chips -= amount;
        player.bet += amount;
        this.pot += amount;
        this.currentBet = player.bet;

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.nextAction();
    }

    // プレイヤーアクション: コール
    playerCall() {
        const player = this.players[0];
        const callAmount = this.currentBet - player.bet;
        
        player.chips -= callAmount;
        player.bet += callAmount;
        this.pot += callAmount;

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.nextAction();
    }

    // プレイヤーアクション: レイズ
    playerRaise(amount) {
        const player = this.players[0];
        const callAmount = this.currentBet - player.bet;
        const totalAmount = callAmount + amount;

        player.chips -= totalAmount;
        player.bet += totalAmount;
        this.pot += totalAmount;
        this.currentBet = player.bet;

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.nextAction();
    }

    // プレイヤーアクション: フォールド
    playerFold() {
        this.players[0].folded = true;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.nextAction();
    }

    // ドローUIを表示
    showDrawUI() {
        const actionButtons = document.getElementById('actionButtons');
        const betSlider = document.getElementById('betSliderContainer');
        const drawArea = document.getElementById('drawArea');

        actionButtons.style.display = 'none';
        betSlider.style.display = 'none';
        drawArea.style.display = 'block';

        const drawBtn = document.getElementById('drawBtn');
        const standBtn = document.getElementById('standBtn');

        const newDrawBtn = drawBtn.cloneNode(true);
        const newStandBtn = standBtn.cloneNode(true);

        drawBtn.parentNode.replaceChild(newDrawBtn, drawBtn);
        standBtn.parentNode.replaceChild(newStandBtn, standBtn);

        document.getElementById('drawBtn').addEventListener('click', () => this.playerDraw());
        document.getElementById('standBtn').addEventListener('click', () => this.playerStand());

        // カード選択可能に
        this.enableCardSelection();
    }

    // カード選択を有効化
    enableCardSelection() {
        const cards = document.querySelectorAll('.player-area .card');
        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.onclick = () => {
                card.classList.toggle('selected');
            };
        });
    }

    // プレイヤードロー
    playerDraw() {
        const selectedCards = document.querySelectorAll('.player-area .card.selected');
        const player = this.players[0];

        // 選択されたカードを削除して新しいカードを配る
        selectedCards.forEach(cardEl => {
            const index = parseInt(cardEl.dataset.index);
            player.hand.splice(index, 1);
        });

        while (player.hand.length < 5) {
            player.hand.push(this.dealCard());
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        // ドローフェーズが終わったら第2ベットへ
        if (this.currentPlayerIndex === (this.dealerIndex + 1) % this.players.length) {
            this.round = 3;
            this.currentBet = 0;
            this.players.forEach(p => p.bet = 0);
        }

        this.nextAction();
    }

    // プレイヤースタンド
    playerStand() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        // ドローフェーズが終わったら第2ベットへ
        if (this.currentPlayerIndex === (this.dealerIndex + 1) % this.players.length) {
            this.round = 3;
            this.currentBet = 0;
            this.players.forEach(p => p.bet = 0);
        }

        this.nextAction();
    }

    // CPU のベット判断
    cpuBet() {
        const player = this.players[this.currentPlayerIndex];
        const handRank = this.evaluateHand(player.hand);
        const callAmount = this.currentBet - player.bet;

        let action = 'fold';

        // 難易度に応じた判断
        if (this.difficulty === 'easy') {
            if (handRank.rank >= 2) action = 'call';
            if (handRank.rank >= 4) action = 'raise';
        } else if (this.difficulty === 'normal') {
            if (handRank.rank >= 1 && handRank.highCard >= 11) action = 'call';
            if (handRank.rank >= 3) action = 'raise';
        } else { // hard
            if (handRank.rank >= 1) action = 'call';
            if (handRank.rank >= 2) action = 'raise';
        }

        // チップが足りない場合
        if (player.chips < callAmount) {
            action = 'fold';
        }

        // アクション実行
        if (action === 'fold') {
            player.folded = true;
            this.showCpuAction(player.name, 'フォールド');
        } else if (action === 'call') {
            if (callAmount === 0) {
                this.showCpuAction(player.name, 'チェック');
            } else {
                player.chips -= callAmount;
                player.bet += callAmount;
                this.pot += callAmount;
                this.showCpuAction(player.name, `コール (${callAmount})`);
            }
        } else if (action === 'raise') {
            const raiseAmount = this.ante * (Math.floor(Math.random() * 3) + 1);
            const totalAmount = callAmount + raiseAmount;
            
            if (player.chips >= totalAmount) {
                player.chips -= totalAmount;
                player.bet += totalAmount;
                this.pot += totalAmount;
                this.currentBet = player.bet;
                this.showCpuAction(player.name, `レイズ (${totalAmount})`);
            } else {
                player.chips -= callAmount;
                player.bet += callAmount;
                this.pot += callAmount;
                this.showCpuAction(player.name, `コール (${callAmount})`);
            }
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        setTimeout(() => {
            this.nextAction();
        }, 1000);
    }

    // CPU のドロー判断
    cpuDraw() {
        const player = this.players[this.currentPlayerIndex];
        const handRank = this.evaluateHand(player.hand);

        let numDraw = 0;

        // 役に応じてドロー枚数を決定
        if (handRank.rank === 0) {
            numDraw = 3; // ハイカード: 3枚交換
        } else if (handRank.rank === 1) {
            numDraw = 3; // ワンペア: 3枚交換
        } else if (handRank.rank === 2) {
            numDraw = 1; // ツーペア: 1枚交換
        } else {
            numDraw = 0; // それ以上: 交換しない
        }

        // ランダムでドロー
        const keepCards = [];
        const discardIndexes = [];

        if (numDraw > 0) {
            // 保持するカードを選ぶ
            const sortedHand = [...player.hand].sort((a, b) => b.value - a.value);
            for (let i = 0; i < 5 - numDraw; i++) {
                keepCards.push(sortedHand[i]);
            }

            player.hand = keepCards;
            while (player.hand.length < 5) {
                player.hand.push(this.dealCard());
            }
        }

        this.showCpuAction(player.name, `${numDraw}枚交換`);

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // ドローフェーズが終わったら第2ベットへ
        if (this.currentPlayerIndex === (this.dealerIndex + 1) % this.players.length) {
            this.round = 3;
            this.currentBet = 0;
            this.players.forEach(p => p.bet = 0);
        }

        setTimeout(() => {
            this.nextAction();
        }, 1000);
    }

    // CPUアクションを表示
    showCpuAction(name, action) {
        const opponent = document.querySelector(`.opponent[data-player="${name}"]`);
        if (opponent) {
            const status = opponent.querySelector('.opponent-status');
            status.textContent = action;
        }
    }

    // 早期終了（全員フォールド）
    endRoundEarly(winner) {
        winner.chips += this.pot;
        this.showdown();
    }

    // ショーダウン
    showdown() {
        this.round = 4;
        this.stats.totalGames++;

        const activePlayers = this.players.filter(p => !p.folded);
        
        // 全員の役を評価
        activePlayers.forEach(player => {
            player.handRank = this.evaluateHand(player.hand);
        });

        // 勝者を決定
        activePlayers.sort((a, b) => {
            if (a.handRank.rank !== b.handRank.rank) {
                return b.handRank.rank - a.handRank.rank;
            }
            return b.handRank.score - a.handRank.score;
        });

        const winner = activePlayers[0];
        const winAmount = this.pot;
        winner.chips += winAmount;

        // 統計更新
        if (winner.isHuman) {
            this.stats.wins++;
        } else {
            this.stats.losses++;
        }

        if (this.players[0].chips > this.stats.maxChips) {
            this.stats.maxChips = this.players[0].chips;
        }

        const playerHandRank = this.evaluateHand(this.players[0].hand);
        if (!this.stats.bestHand || this.compareHandNames(playerHandRank.name, this.stats.bestHand) > 0) {
            this.stats.bestHand = playerHandRank.name;
        }

        this.saveStats();

        // ショーダウン画面を表示
        this.displayShowdown(winner, winAmount);
    }

    // 役名の比較
    compareHandNames(hand1, hand2) {
        const ranks = [
            'ハイカード', 'ワンペア', 'ツーペア', 'スリーカード',
            'ストレート', 'フラッシュ', 'フルハウス', 'フォーカード',
            'ストレートフラッシュ', 'ロイヤルストレートフラッシュ'
        ];
        return ranks.indexOf(hand1) - ranks.indexOf(hand2);
    }

    // 手札を評価
    evaluateHand(hand) {
        const suits = hand.map(c => c.suit);
        const values = hand.map(c => c.value).sort((a, b) => b - a);
        
        const isFlush = suits.every(s => s === suits[0]);
        const isStraight = this.checkStraight(values);
        const counts = this.countValues(values);

        // ロイヤルストレートフラッシュ
        if (isFlush && isStraight && values[0] === 14) {
            return { rank: 9, name: 'ロイヤルストレートフラッシュ', score: 900 + values[0], highCard: values[0] };
        }

        // ストレートフラッシュ
        if (isFlush && isStraight) {
            return { rank: 8, name: 'ストレートフラッシュ', score: 800 + values[0], highCard: values[0] };
        }

        // フォーカード
        if (counts[0].count === 4) {
            return { rank: 7, name: 'フォーカード', score: 700 + counts[0].value, highCard: counts[0].value };
        }

        // フルハウス
        if (counts[0].count === 3 && counts[1].count === 2) {
            return { rank: 6, name: 'フルハウス', score: 600 + counts[0].value, highCard: counts[0].value };
        }

        // フラッシュ
        if (isFlush) {
            return { rank: 5, name: 'フラッシュ', score: 500 + values[0], highCard: values[0] };
        }

        // ストレート
        if (isStraight) {
            return { rank: 4, name: 'ストレート', score: 400 + values[0], highCard: values[0] };
        }

        // スリーカード
        if (counts[0].count === 3) {
            return { rank: 3, name: 'スリーカード', score: 300 + counts[0].value, highCard: counts[0].value };
        }

        // ツーペア
        if (counts[0].count === 2 && counts[1].count === 2) {
            return { rank: 2, name: 'ツーペア', score: 200 + counts[0].value, highCard: counts[0].value };
        }

        // ワンペア
        if (counts[0].count === 2) {
            return { rank: 1, name: 'ワンペア', score: 100 + counts[0].value, highCard: counts[0].value };
        }

        // ハイカード
        return { rank: 0, name: 'ハイカード', score: values[0], highCard: values[0] };
    }

    // ストレートチェック
    checkStraight(values) {
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) {
                // A-2-3-4-5 のストレートもチェック
                if (i === 0 && values[0] === 14 && values[1] === 5) {
                    continue;
                }
                return false;
            }
        }
        return true;
    }

    // 数値のカウント
    countValues(values) {
        const counts = {};
        values.forEach(v => {
            counts[v] = (counts[v] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([value, count]) => ({ value: parseInt(value), count }))
            .sort((a, b) => {
                if (a.count !== b.count) return b.count - a.count;
                return b.value - a.value;
            });
    }

    // ショーダウン表示
    displayShowdown(winner, winAmount) {
        const showdownScreen = document.getElementById('showdownScreen');
        const gameScreen = document.getElementById('gameScreen');
        const showdownResults = document.getElementById('showdownResults');

        gameScreen.classList.remove('active');
        showdownScreen.style.display = 'flex';

        showdownResults.innerHTML = '';

        this.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'showdown-player';
            if (player === winner) playerDiv.classList.add('winner');
            if (player.folded) playerDiv.classList.add('folded');

            const handRank = player.folded ? null : this.evaluateHand(player.hand);

            playerDiv.innerHTML = `
                <div class="showdown-player-info">
                    <span class="showdown-player-name ${player === winner ? 'winner' : ''}">${player.name}</span>
                    <span class="showdown-chips">💰 ${player.chips}</span>
                </div>
                ${!player.folded ? `
                    <div class="showdown-cards">
                        ${player.hand.map(card => `
                            <div class="card">
                                <img src="${card.image}" alt="${card.rank} of ${card.suit}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="showdown-hand">
                        <span class="showdown-hand-name">${handRank.name}</span>
                    </div>
                ` : `
                    <div class="showdown-hand">フォールド</div>
                `}
                ${player === winner ? `
                    <div class="chips-change positive">+${winAmount}💰</div>
                ` : ''}
            `;

            showdownResults.appendChild(playerDiv);
        });

        // 次のゲームボタン
        const nextGameBtn = document.getElementById('nextGameBtn');
        const quitBtn = document.getElementById('quitBtn');

        const newNextBtn = nextGameBtn.cloneNode(true);
        const newQuitBtn = quitBtn.cloneNode(true);

        nextGameBtn.parentNode.replaceChild(newNextBtn, nextGameBtn);
        quitBtn.parentNode.replaceChild(newQuitBtn, quitBtn);

        document.getElementById('nextGameBtn').addEventListener('click', () => {
            // 破産チェック
            if (this.players[0].chips <= 0) {
                this.gameOver();
                return;
            }

            // CPUの破産チェック
            this.players = this.players.filter(p => p.chips > 0);
            
            if (this.players.length < 2) {
                this.gameOver();
                return;
            }

            showdownScreen.style.display = 'none';
            document.getElementById('gameScreen').classList.add('active');

            this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
            this.startRound();
        });

        document.getElementById('quitBtn').addEventListener('click', () => {
            this.backToStart();
        });
    }

    // ゲームオーバー
    gameOver() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const showdownScreen = document.getElementById('showdownScreen');
        const finalStats = document.getElementById('finalStats');

        showdownScreen.style.display = 'none';
        gameOverScreen.style.display = 'flex';

        finalStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">総ゲーム数:</span>
                <span class="stat-value">${this.stats.totalGames}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">勝利:</span>
                <span class="stat-value">${this.stats.wins}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">敗北:</span>
                <span class="stat-value">${this.stats.losses}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">最高チップ:</span>
                <span class="stat-value">${this.stats.maxChips}</span>
            </div>
        `;

        const restartBtn = document.getElementById('restartBtn');
        const backToMenuBtn = document.getElementById('backToMenuBtn');

        const newRestartBtn = restartBtn.cloneNode(true);
        const newBackBtn = backToMenuBtn.cloneNode(true);

        restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
        backToMenuBtn.parentNode.replaceChild(newBackBtn, backToMenuBtn);

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.backToStart();
        });

        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // スタート画面に戻る
    backToStart() {
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('showdownScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        this.updateStatsDisplay();
    }

    // 画面更新
    updateDisplay() {
        // POT表示
        document.getElementById('potAmount').textContent = this.pot;

        // ラウンド表示
        const roundNames = ['', '第1ベット', 'ドロー', '第2ベット', 'ショーダウン'];
        document.getElementById('roundDisplay').textContent = roundNames[this.round];

        // プレイヤー情報
        const player = this.players[0];
        document.getElementById('playerChips').textContent = player.chips;
        document.getElementById('playerBet').textContent = player.bet;

        // プレイヤーの手札
        this.displayPlayerHand();

        // 対戦相手
        this.displayOpponents();
    }

    // プレイヤーの手札を表示
    displayPlayerHand() {
        const playerHand = document.getElementById('playerHand');
        const player = this.players[0];

        playerHand.innerHTML = player.hand.map((card, index) => `
            <div class="card dealing" data-index="${index}">
                <img src="${card.image}" alt="${card.rank} of ${card.suit}">
            </div>
        `).join('');

        // 現在の役を表示
        const handRank = this.evaluateHand(player.hand);
        document.getElementById('currentHandName').textContent = handRank.name;
    }

    // 対戦相手を表示
    displayOpponents() {
        const opponentsArea = document.getElementById('opponentsArea');
        opponentsArea.innerHTML = '';

        for (let i = 1; i < this.players.length; i++) {
            const opponent = this.players[i];
            const isActive = i === this.currentPlayerIndex;

            const opponentDiv = document.createElement('div');
            opponentDiv.className = 'opponent';
            opponentDiv.dataset.player = opponent.name;
            
            if (isActive) opponentDiv.classList.add('active');
            if (opponent.folded) opponentDiv.classList.add('folded');

            opponentDiv.innerHTML = `
                <div class="opponent-info">
                    <span class="opponent-name">${opponent.name}</span>
                    <span class="opponent-chips">💰 ${opponent.chips}</span>
                </div>
                <div class="opponent-cards">
                    ${opponent.hand.map(() => `
                        <div class="card card-back" style="width: 50px; height: 70px;">
                            <img src="assets/img/playing_cards/card_back.png" alt="card back">
                        </div>
                    `).join('')}
                </div>
                <div class="opponent-bet">Bet: ${opponent.bet}</div>
                <div class="opponent-status"></div>
            `;

            opponentsArea.appendChild(opponentDiv);
        }
    }

    // 統計表示を更新
    updateStatsDisplay() {
        document.getElementById('totalGames').textContent = this.stats.totalGames;
        const winRate = this.stats.totalGames > 0 
            ? ((this.stats.wins / this.stats.totalGames) * 100).toFixed(1)
            : 0;
        document.getElementById('winRate').textContent = winRate + '%';
        document.getElementById('maxChips').textContent = this.stats.maxChips;
        document.getElementById('bestHand').textContent = this.stats.bestHand || 'なし';
    }
}

// ゲーム初期化
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new PokerGame();
    game.updateStatsDisplay();

    // プレイ回数をカウント
    if (typeof GameStats !== 'undefined') {
        GameStats.incrementPlayCount('poker');
    }

    // ハンバーガーメニュー
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 言語ドロップダウン
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', () => {
            langDropdown.style.display = 'none';
        });
    }

    // 設定ボタン
    document.querySelectorAll('.setting-btn[data-players]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.setting-btn[data-players]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.querySelectorAll('.setting-btn[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.setting-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // スタートボタン
    document.getElementById('startBtn').addEventListener('click', () => {
        const numPlayers = parseInt(document.querySelector('.setting-btn[data-players].active').dataset.players);
        const difficulty = document.querySelector('.setting-btn[data-difficulty].active').dataset.difficulty;
        const initialChips = parseInt(document.getElementById('initialChips').value);
        const ante = parseInt(document.getElementById('ante').value);

        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').classList.add('active');

        game.startGame(numPlayers, difficulty, initialChips, ante);
    });
});
