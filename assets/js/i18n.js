/**
 * 多言語対応システム
 * 対応言語: 日本語、英語、中国語、ヒンディー語、スペイン語、フランス語
 */

const translations = {
    ja: {
        nav: {
            games: 'ゲーム一覧',
            ranking: '人気ランキング',
            contact: 'お問い合わせ'
        },
        hero: {
            title: '遊びたいゲームが、<br>ここにある。',
            subtitle: 'ダウンロード不要、今すぐ遊べる無料ゲーム',
            cta: 'ゲームを始める'
        },
        common: {
            backHome: '← ホームに戻る',
            howToPlay: '遊び方・ルール',
            reset: 'リセット',
            close: '閉じる',
            playAgain: 'もう一度',
            gameOver: 'ゲーム終了'
        },
        othello: {
            pageTitle: 'オセロ - ゲームサイト',
            title: '⚫⚪ オセロ',
            selectMode: 'ゲームモードを選択',
            pvp: 'プレイヤー vs プレイヤー',
            pvc: 'プレイヤー vs CPU',
            selectLevel: 'CPUレベルを選択',
            level1: 'レベル1 (ランダム)',
            level2: 'レベル2 (最大裏返し)',
            level3: 'レベル3 (評価関数)',
            rule1: '<strong>目的：</strong>相手より多くの石を盤面に置くことを目指します',
            rule2: '<strong>石の置き方：</strong>相手の石を挟むように自分の石を置きます',
            rule3: '<strong>裏返し：</strong>挟んだ相手の石はすべて自分の色に変わります',
            rule4: '<strong>ターン：</strong>黒と白が交互に石を置きます（黒が先手）',
            rule5: '<strong>パス：</strong>置ける場所がない場合は自動的にパスされます',
            rule6: '<strong>終了：</strong>両者ともパスになった時点でゲーム終了です',
            rule7: '<strong>勝敗：</strong>盤面の石が多い方が勝ちです',
            backToMode: 'モード選択に戻る',
            blackScore: '⚫ 黒: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ 白: <span id="finalWhiteScore"></span>',
            blackTurn: '黒の番',
            whiteTurn: '白の番',
            whiteThinking: '白のターン（思考中...）'
        },
        ludo: {
            pageTitle: 'ルドー - ゲームサイト',
            title: '🎲 ルドー',
            gameSettings: 'ゲーム設定',
            playerCount: 'プレイヤー数',
            twoPlayers: '2人',
            threePlayers: '3人',
            fourPlayers: '4人',
            playerSettings: 'プレイヤー設定',
            gameRules: 'ゲームルール',
            requireSix: 'ベースから出るのに6が必要',
            extraTurn: '6が出たら追加ターン',
            exactRoll: 'ゴールに正確な目が必要',
            showThinking: 'CPUの思考時間を表示',
            rule1: '<strong>目的：</strong>4個のコマを全てゴールに入れることを目指します',
            rule2: '<strong>スタート：</strong>6を出すとベースからコマを出せます',
            rule3: '<strong>移動：</strong>サイコロの目の数だけコマを進めます',
            rule4: '<strong>捕獲：</strong>相手のコマと同じマスに止まると相手はベースに戻ります',
            rule5: '<strong>追加ターン：</strong>6が出ると追加でサイコロを振れます',
            rule6: '<strong>勝利：</strong>最初に全コマをゴールに入れた人が勝ちです',
            startGame: 'ゲーム開始',
            rollDice: 'サイコロを振る',
            backToSettings: '設定に戻る',
            gameLog: 'ゲームログ',
            gameFinished: '🎉 ゲーム終了！'
        },
        chess: {
            pageTitle: 'チェス - ゲームサイト',
            title: '♔♕ チェス',
            selectMode: 'ゲームモードを選択',
            pvp: 'プレイヤー vs プレイヤー',
            pvc: 'プレイヤー vs CPU',
            selectLevel: 'CPUレベルを選択',
            level1: 'レベル1 (ランダム)',
            level2: 'レベル2 (駒価値)',
            level3: 'レベル3 (ミニマックス)',
            rule1: '<strong>目的：</strong>相手のキングをチェックメイトにすることを目指します',
            rule2: '<strong>移動：</strong>各駒は決まった動き方で移動できます',
            rule3: '<strong>ターン：</strong>白と黒が交互に駒を動かします（白が先手）',
            rule4: '<strong>チェック：</strong>キングが攻撃されている状態です',
            rule5: '<strong>チェックメイト：</strong>チェックから逃れられない時、ゲーム終了です',
            rule6: '<strong>特殊な動き：</strong>キャスリング、アンパッサン、プロモーションがあります',
            rule7: '<strong>引き分け：</strong>ステイルメイトや同一局面の繰り返しで引き分けになります',
            backToMode: 'モード選択に戻る',
            whiteTurn: '白の番',
            blackTurn: '黒の番',
            capturedWhite: '取った白駒:',
            capturedBlack: '取った黒駒:',
            moveHistory: '棋譜',
            promotion: 'ポーン昇格',
            selectPromotion: '昇格する駒を選択してください'
        },
        gomoku: {
            pageTitle: '五目並べ - ゲームサイト',
            title: '🎯 五目並べ',
            selectMode: 'ゲームモードを選択',
            pvp: 'プレイヤー vs プレイヤー',
            pvc: 'プレイヤー vs CPU',
            selectLevel: 'CPUレベルを選択',
            level1: 'レベル1 (ランダム)',
            level2: 'レベル2 (評価関数)',
            level3: 'レベル3 (ミニマックス)',
            rule1: '<strong>目的：</strong>縦・横・斜めのいずれかに5つ並べることを目指します',
            rule2: '<strong>配置：</strong>交互に石を置きます（黒が先手）',
            rule3: '<strong>勝利：</strong>先に5つ並べた方が勝ちです',
            rule4: '<strong>ターン：</strong>黒と白が交互に打ちます',
            rule5: '<strong>引き分け：</strong>盤面が埋まっても勝者がいない場合',
            blackTurn: '黒の番',
            whiteTurn: '白の番',
            moveCount: '手数:',
            backToMode: 'モード選択に戻る'
        },
        memory: {
            pageTitle: '神経衰弱 - ゲームサイト',
            title: '🃏 神経衰弱',
            selectMode: 'ゲームモードを選択',
            onePlayer: '1人プレイ',
            twoPlayers: '2人対戦',
            selectDifficulty: '難易度を選択',
            easy: 'Easy (4×4)',
            normal: 'Normal (32枚)',
            hard: 'Hard (52枚)',
            rule1: '<strong>目的：</strong>全てのカードのペアを見つける',
            rule2: '<strong>めくり方：</strong>1ターンに2枚のカードをめくる',
            rule3: '<strong>一致：</strong>同じ絵柄ならカードは開いたまま',
            rule4: '<strong>不一致：</strong>違う絵柄なら裏返される',
            rule5: '<strong>勝利：</strong>全ペアを見つけたらクリア',
            timer: '時間:',
            moves: '手数:',
            pairs: 'ペア:',
            player1: 'プレイヤー1',
            player2: 'プレイヤー2',
            turn: 'のターン',
            backToMode: 'モード選択に戻る',
            congratulations: 'おめでとうございます！',
            clearTime: 'クリアタイム:',
            totalMoves: '総手数:',
            rank: 'ランク:',
            winner: '勝者:',
            draw: '引き分け',
            score: 'スコア:'
        },
        games: {
            title: 'ゲーム一覧',
            subtitle: '思考を深め、戦略を楽しむ、クラシックゲームの世界へようこそ',
            othello: {
                tag: '戦略ゲーム',
                title: 'オセロ',
                description: '白と黒の石を使った戦略ゲーム。シンプルなルールながら奥深い戦略性を持つ、世界中で愛されるボードゲーム。相手の石を挟んでひっくり返し、盤面を支配しよう。',
                players: '👥 2プレイヤー',
                duration: '⏱️ 15-30分'
            },
            ludo: {
                tag: 'ボードゲーム',
                title: 'ルドー',
                description: 'サイコロを振ってコマを進める、運と戦略のボードゲーム。4人まで対戦可能で、家族や友人と盛り上がれます。シンプルながら予測不可能な展開が魅力です。',
                players: '👥 2-4プレイヤー',
                duration: '⏱️ 20-40分'
            },
            chess: {
                tag: '戦略ゲーム',
                title: 'チェス',
                description: '世界で最も有名な戦略ボードゲーム。キング、クイーン、ルークなど6種類の駒を使い、相手のキングをチェックメイトに追い込む知的な戦いを楽しめます。',
                players: '👥 2プレイヤー',
                duration: '⏱️ 30-60分'
            },
            gomoku: {
                tag: '戦略ゲーム',
                title: '五目並べ',
                description: '15×15の盤面で5つ並べることを目指す戦略ゲーム。シンプルながら奥深く、先を読む力が試されます。初心者から上級者まで楽しめる伝統的なボードゲームです。',
                players: '👥 2プレイヤー',
                duration: '⏱️ 10-20分'
            },
            memory: {
                tag: '記憶ゲーム',
                title: '神経衰弱',
                description: 'カードをめくってペアを見つける記憶力ゲーム。集中力と記憶力を鍛える楽しいゲームです。1人プレイと2人対戦の両方が楽しめます。',
                players: '👥 1-2プレイヤー',
                duration: '⏱️ 5-15分'
            },
            stopwatch: {
                tag: 'タイミングゲーム',
                title: 'ストップウォッチチャレンジ',
                description: '目標時間ぴったりでストップウォッチを止めるタイミングゲーム。3ターン制で誤差の少なさを競います。集中力と感覚が試される短時間プレイ可能な挑戦ゲームです。',
                players: '👥 1プレイヤー',
                duration: '⏱️ 1分'
            },
            playBtn: 'プレイする →'
        },
        stopwatch: {
            title: '⏱️ ストップウォッチチャレンジ',
            subtitle: '目標時間ぴったりで止めろ!',
            selectMode: 'モード選択',
            normalMode: 'ノーマルモード',
            normalModeDesc: '経過時間表示あり',
            blindMode: 'ブラインドモード',
            blindModeDesc: '経過時間非表示',
            rulesTitle: 'ルール説明',
            rule1: '3ターン制（3秒・5秒・10秒）',
            rule2: 'スタートボタンで計測開始',
            rule3: '目標時間で停止ボタンを押す',
            rule4: '誤差が少ないほど高ランク',
            rule5: '合計誤差で総合評価',
            startGame: 'ゲーム開始',
            turn: 'ターン',
            target: '目標',
            elapsed: '記録時間',
            seconds: '秒',
            start: 'スタート',
            stop: 'ストップ',
            reset: 'リセット',
            nextTurn: '次のターンへ',
            result: '結果',
            error: '誤差',
            rank: 'ランク',
            totalError: '合計誤差',
            finalRank: '総合ランク',
            finalResultTitle: '最終結果',
            playAgain: 'もう一度プレイ',
            backHome: 'ホームに戻る',
            waiting: '待機中',
            measuring: '計測中',
            stopped: '停止',
            rankSSS: '神業!',
            rankSS: '超人的!',
            rankS: '達人級!',
            rankA: '優秀!',
            rankB: '良好!',
            rankC: '普通',
            rankD: '要練習',
            rankE: 'ネタレベル'
        },
        contact: {
            title: 'お問い合わせ',
            subtitle: 'ご質問やご要望がございましたら、お気軽にお問い合わせください',
            email: 'メール',
            support: 'サポート',
            hours: '平日 9:00-18:00',
            optional: '（任意）',
            required: '（必須）',
            form: {
                name: 'ニックネーム',
                email: 'メールアドレス',
                subject: '件名',
                message: 'メッセージ',
                namePlaceholder: '山田 太郎',
                emailPlaceholder: 'example@email.com',
                subjectPlaceholder: 'お問い合わせ内容の件名',
                messagePlaceholder: 'お問い合わせ内容をご記入ください（必須）',
                submit: '送信する',
                success: 'お問い合わせを送信しました。ありがとうございます！',
                error: '送信に失敗しました。もう一度お試しください。'
            }
        },
        footer: {
            tagline: '遊びを通じて新しい体験を創造する',
            games: 'ゲーム',
            info: '情報',
            privacy: 'プライバシーポリシー',
            copyright: '© 2025 GAME PORTAL. All rights reserved.'
        },
        privacy: {
            title: 'プライバシーポリシー',
            intro: '「GAME PORTAL」（以下、「当サイト」といいます。）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。',
            section1: {
                title: '1. 個人情報の収集と利用目的',
                content: '当サイトでは、ユーザーからの個人情報の収集は行っておりません。お問い合わせフォームにご入力いただいた情報（お名前、メールアドレス、お問い合わせ内容）は、お問い合わせへの対応および今後のサービス改善のためにのみ使用いたします。'
            },
            section2: {
                title: '2. 個人情報の第三者提供',
                content: '当サイトは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。'
            },
            section3: {
                title: '3. Cookie（クッキー）について',
                content: '当サイトでは、ユーザーエクスペリエンスの向上のため、Cookie を使用する場合があります。Cookie は、ユーザーのブラウザに保存される小さなデータファイルで、サイトの利用状況の分析に使用されます。ユーザーは、ブラウザの設定により Cookie の受け取りを拒否することができますが、一部の機能が制限される場合があります。'
            },
            section4: {
                title: '4. ローカルストレージについて',
                content: '当サイトでは、ゲームの進行状況や統計情報、言語設定を保存するためにブラウザのローカルストレージを使用しています。これらの情報はお使いのブラウザ内にのみ保存され、外部のサーバーに送信されることはありません。ローカルストレージに保存された情報は、ブラウザの設定からいつでも削除することができます。'
            },
            section5: {
                title: '5. アクセス解析ツールについて',
                content: '当サイトでは、サイトの利用状況を把握するため、Google Analytics などのアクセス解析ツールを使用する場合があります。これらのツールは Cookie を使用して情報を収集しますが、個人を特定する情報は含まれません。詳細については、各ツールのプライバシーポリシーをご確認ください。'
            },
            section6: {
                title: '6. 免責事項',
                content: '当サイトのコンテンツ・情報について、可能な限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。また、当サイトからリンクやバナーなどによって他のサイトに移動した場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。'
            },
            section7: {
                title: '7. 著作権・肖像権',
                content: '当サイトで掲載している文章や画像などにつきましては、無断転載することを禁止します。当サイトは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。迅速に対応いたします。'
            },
            section8: {
                title: '8. プライバシーポリシーの変更',
                content: '当サイトは、法令の変更や必要に応じて、本ポリシーを予告なく変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。'
            },
            section9: {
                title: '9. お問い合わせ',
                content: '本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。'
            },
            established: '制定日：2025年11月26日',
            updated: '最終更新日：2025年11月26日',
            backHome: '← ホームに戻る'
        }
    },
    en: {
        nav: {
            games: 'Games',
            ranking: 'Popular Ranking',
            contact: 'Contact'
        },
        hero: {
            title: 'The Games You Want,<br>Right Here.',
            subtitle: 'No Download Required, Play Free Games Now',
            cta: 'Start Playing'
        },
        common: {
            backHome: '← Back to Home',
            howToPlay: 'How to Play · Rules',
            reset: 'Reset',
            close: 'Close',
            playAgain: 'Play Again',
            gameOver: 'Game Over'
        },
        othello: {
            pageTitle: 'Othello - Game Portal',
            title: '⚫⚪ Othello',
            selectMode: 'Select Game Mode',
            pvp: 'Player vs Player',
            pvc: 'Player vs CPU',
            selectLevel: 'Select CPU Level',
            level1: 'Level 1 (Random)',
            level2: 'Level 2 (Max Flip)',
            level3: 'Level 3 (Evaluation)',
            rule1: '<strong>Goal:</strong> Get more stones on the board than your opponent',
            rule2: '<strong>Placement:</strong> Place your stone to sandwich opponent\'s stones',
            rule3: '<strong>Flipping:</strong> All sandwiched opponent stones become yours',
            rule4: '<strong>Turns:</strong> Black and white take turns (black goes first)',
            rule5: '<strong>Pass:</strong> Automatically pass if no valid moves',
            rule6: '<strong>End:</strong> Game ends when both players pass',
            rule7: '<strong>Winner:</strong> Player with more stones wins',
            backToMode: 'Back to Mode Selection',
            blackScore: '⚫ Black: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ White: <span id="finalWhiteScore"></span>',
            blackTurn: "Black's Turn",
            whiteTurn: "White's Turn",
            whiteThinking: "White's Turn (Thinking...)"
        },
        ludo: {
            pageTitle: 'Ludo - Game Portal',
            title: '🎲 Ludo',
            gameSettings: 'Game Settings',
            playerCount: 'Number of Players',
            twoPlayers: '2 Players',
            threePlayers: '3 Players',
            fourPlayers: '4 Players',
            playerSettings: 'Player Settings',
            gameRules: 'Game Rules',
            requireSix: 'Need 6 to start from base',
            extraTurn: 'Extra turn on rolling 6',
            exactRoll: 'Exact roll needed to finish',
            showThinking: 'Show CPU thinking time',
            rule1: '<strong>Goal:</strong> Get all 4 tokens to the finish',
            rule2: '<strong>Start:</strong> Roll a 6 to move token from base',
            rule3: '<strong>Move:</strong> Advance token by dice number',
            rule4: '<strong>Capture:</strong> Land on opponent token sends it back to base',
            rule5: '<strong>Extra Turn:</strong> Roll 6 to get another turn',
            rule6: '<strong>Victory:</strong> First to get all tokens to finish wins',
            startGame: 'Start Game',
            rollDice: 'Roll Dice',
            backToSettings: 'Back to Settings',
            gameLog: 'Game Log',
            gameFinished: '🎉 Game Finished!'
        },
        gomoku: {
            pageTitle: 'Gomoku - Game Portal',
            title: '🎯 Gomoku',
            selectMode: 'Select Game Mode',
            pvp: 'Player vs Player',
            pvc: 'Player vs CPU',
            selectLevel: 'Select CPU Level',
            level1: 'Level 1 (Random)',
            level2: 'Level 2 (Evaluation)',
            level3: 'Level 3 (Minimax)',
            rule1: '<strong>Objective:</strong> Line up 5 stones vertically, horizontally, or diagonally',
            rule2: '<strong>Placement:</strong> Take turns placing stones (Black goes first)',
            rule3: '<strong>Victory:</strong> First to line up 5 stones wins',
            rule4: '<strong>Turns:</strong> Black and white alternate',
            rule5: '<strong>Draw:</strong> If the board fills with no winner',
            blackTurn: 'Black\'s Turn',
            whiteTurn: 'White\'s Turn',
            moveCount: 'Moves:',
            backToMode: 'Back to Mode Selection'
        },
        memory: {
            pageTitle: 'Memory Card Game - Game Portal',
            title: '🃏 Memory Card Game',
            selectMode: 'Select Game Mode',
            onePlayer: '1 Player',
            twoPlayers: '2 Players',
            selectDifficulty: 'Select Difficulty',
            easy: 'Easy (4×4)',
            normal: 'Normal (32 cards)',
            hard: 'Hard (52 cards)',
            rule1: '<strong>Objective:</strong> Find all matching card pairs',
            rule2: '<strong>How to Play:</strong> Flip 2 cards per turn',
            rule3: '<strong>Match:</strong> Matching cards stay face up',
            rule4: '<strong>Mismatch:</strong> Non-matching cards flip back',
            rule5: '<strong>Victory:</strong> Clear by finding all pairs',
            timer: 'Time:',
            moves: 'Moves:',
            pairs: 'Pairs:',
            player1: 'Player 1',
            player2: 'Player 2',
            turn: '\'s Turn',
            backToMode: 'Back to Mode Selection',
            congratulations: 'Congratulations!',
            clearTime: 'Clear Time:',
            totalMoves: 'Total Moves:',
            rank: 'Rank:',
            winner: 'Winner:',
            draw: 'Draw',
            score: 'Score:'
        },
        games: {
            title: 'Our Games',
            subtitle: 'Welcome to the world of classic games where you can deepen your thinking and enjoy strategy',
            othello: {
                tag: 'Strategy Game',
                title: 'Othello',
                description: 'A strategic game using black and white stones. A beloved board game worldwide with simple rules but deep strategic gameplay. Sandwich opponent\'s stones to flip them and dominate the board.',
                players: '👥 2 Players',
                duration: '⏱️ 15-30 min'
            },
            ludo: {
                tag: 'Board Game',
                title: 'Ludo',
                description: 'Roll the dice and move your pieces in this game of luck and strategy. Play with up to 4 players and have fun with family and friends. Simple yet unpredictable gameplay is its charm.',
                players: '👥 2-4 Players',
                duration: '⏱️ 20-40 min'
            },
            chess: {
                tag: 'Strategy Game',
                title: 'Chess',
                description: 'The world\'s most famous strategic board game. Use 6 types of pieces including King, Queen, and Rook to checkmate the opponent\'s King in this intellectual battle.',
                players: '👥 2 Players',
                duration: '⏱️ 30-60 min'
            },
            gomoku: {
                tag: 'Strategy Game',
                title: 'Gomoku',
                description: 'A strategic game on a 15×15 board where you aim to line up 5 stones. Simple yet deep, it tests your ability to read ahead. A traditional board game enjoyable for beginners and experts alike.',
                players: '👥 2 Players',
                duration: '⏱️ 10-20 min'
            },
            memory: {
                tag: 'Memory Game',
                title: 'Memory Card Game',
                description: 'A memory game where you flip cards to find matching pairs. A fun game that trains concentration and memory. Enjoy both single-player and two-player modes.',
                players: '👥 1-2 Players',
                duration: '⏱️ 5-15 min'
            },
            stopwatch: {
                tag: 'Timing Game',
                title: 'Stopwatch Challenge',
                description: 'A timing game where you stop the stopwatch at the exact target time. Compete for the smallest error over 3 turns. A short-play challenge game that tests concentration and timing.',
                players: '👥 1 Player',
                duration: '⏱️ 1 min'
            },
            playBtn: 'Play Now →'
        },
        stopwatch: {
            title: '⏱️ Stopwatch Challenge',
            subtitle: 'Hit the exact target time!',
            selectMode: 'Select Mode',
            normalMode: 'Normal Mode',
            normalModeDesc: 'Time visible',
            blindMode: 'Blind Mode',
            blindModeDesc: 'Time hidden',
            rulesTitle: 'Game Rules',
            rule1: '3 turns (3 sec, 5 sec, 10 sec)',
            rule2: 'Press Start to begin timing',
            rule3: 'Press Stop at the target time',
            rule4: 'Smaller error = higher rank',
            rule5: 'Final rank based on total error',
            startGame: 'Start Game',
            turn: 'Turn',
            target: 'Target',
            elapsed: 'Elapsed',
            seconds: 'sec',
            start: 'Start',
            stop: 'Stop',
            reset: 'Reset',
            nextTurn: 'Next Turn',
            result: 'Result',
            error: 'Error',
            rank: 'Rank',
            totalError: 'Total Error',
            finalRank: 'Final Rank',
            finalResultTitle: 'Final Result',
            playAgain: 'Play Again',
            backHome: 'Back to Home',
            waiting: 'Waiting',
            measuring: 'Measuring',
            stopped: 'Stopped',
            rankSSS: 'Godlike!',
            rankSS: 'Superhuman!',
            rankS: 'Master!',
            rankA: 'Excellent!',
            rankB: 'Good!',
            rankC: 'Average',
            rankD: 'Needs Practice',
            rankE: 'Epic Fail'
        },
        contact: {
            title: 'Contact Us',
            subtitle: 'Feel free to contact us if you have any questions or requests',
            email: 'Email',
            support: 'Support',
            hours: 'Weekdays 9:00-18:00',
            optional: '(Optional)',
            required: '(Required)',
            form: {
                name: 'Nickname',
                email: 'Email Address',
                subject: 'Subject',
                message: 'Message',
                namePlaceholder: 'John Doe',
                emailPlaceholder: 'example@email.com',
                subjectPlaceholder: 'Subject of your inquiry',
                messagePlaceholder: 'Please enter your message (required)',
                submit: 'Send Message',
                success: 'Your message has been sent successfully. Thank you!',
                error: 'Failed to send message. Please try again.'
            }
        },
        footer: {
            tagline: 'Creating new experiences through play',
            games: 'Games',
            info: 'Information',
            privacy: 'Privacy Policy',
            copyright: '© 2025 GAME PORTAL. All rights reserved.'
        },
        privacy: {
            title: 'Privacy Policy',
            intro: 'GAME PORTAL (hereinafter referred to as "this site") establishes the following Privacy Policy (hereinafter referred to as "this policy") regarding the handling of users\' personal information.',
            section1: {
                title: '1. Collection and Purpose of Personal Information',
                content: 'This site does not collect personal information from users. Information entered in the contact form (name, email address, and inquiry content) will be used only for responding to inquiries and improving our services in the future.'
            },
            section2: {
                title: '2. Provision of Personal Information to Third Parties',
                content: 'This site will not provide users\' personal information to third parties except when required by law.'
            },
            section3: {
                title: '3. About Cookies',
                content: 'This site may use cookies to improve user experience. Cookies are small data files stored in your browser and are used to analyze site usage. Users can refuse to accept cookies through browser settings, but some features may be limited.'
            },
            section4: {
                title: '4. About Local Storage',
                content: 'This site uses browser local storage to save game progress, statistics, and language settings. This information is stored only in your browser and is never sent to external servers. Information stored in local storage can be deleted at any time from your browser settings.'
            },
            section5: {
                title: '5. About Analytics Tools',
                content: 'This site may use analytics tools such as Google Analytics to understand site usage. These tools collect information using cookies but do not include personally identifiable information. For details, please refer to each tool\'s privacy policy.'
            },
            section6: {
                title: '6. Disclaimer',
                content: 'We strive to provide accurate information on this site\'s content, but we do not guarantee its accuracy or safety. We cannot be held responsible for any damages caused by the content posted on this site. Additionally, we are not responsible for information or services provided by sites accessed via links or banners from this site.'
            },
            section7: {
                title: '7. Copyright and Portrait Rights',
                content: 'Unauthorized reproduction of text and images posted on this site is prohibited. This site does not intend to infringe on copyrights or portrait rights. If there are any issues regarding copyrights or portrait rights, please contact us via the contact form. We will respond promptly.'
            },
            section8: {
                title: '8. Changes to Privacy Policy',
                content: 'This site may change this policy without notice as required by law or necessity. The revised privacy policy will take effect from the time it is posted on this site.'
            },
            section9: {
                title: '9. Contact',
                content: 'For inquiries regarding this policy, please contact us via the contact form on this site.'
            },
            established: 'Established: November 26, 2025',
            updated: 'Last Updated: November 26, 2025',
            backHome: '← Back to Home'
        }
    },
    zh: {
        nav: {
            games: '游戏列表',
            ranking: '热门排行',
            contact: '联系我们'
        },
        hero: {
            title: '你想玩的游戏，<br>就在这里。',
            subtitle: '无需下载，立即免费畅玩游戏',
            cta: '开始游戏'
        },
        common: {
            backHome: '← 返回主页',
            howToPlay: '玩法·规则',
            reset: '重置',
            close: '关闭',
            playAgain: '再来一次',
            gameOver: '游戏结束'
        },
        othello: {
            pageTitle: '黑白棋 - 游戏门户',
            title: '⚫⚪ 黑白棋',
            selectMode: '选择游戏模式',
            pvp: '玩家 vs 玩家',
            pvc: '玩家 vs 电脑',
            selectLevel: '选择电脑难度',
            level1: '难度1（随机）',
            level2: '难度2（最大翻转）',
            level3: '难度3（评估函数）',
            rule1: '<strong>目标：</strong>在棋盘上放置比对手更多的棋子',
            rule2: '<strong>放置：</strong>放置棋子以夹住对手的棋子',
            rule3: '<strong>翻转：</strong>所有被夹住的对手棋子都变成你的颜色',
            rule4: '<strong>回合：</strong>黑白交替放置棋子（黑棋先手）',
            rule5: '<strong>跳过：</strong>没有有效位置时自动跳过',
            rule6: '<strong>结束：</strong>双方都跳过时游戏结束',
            rule7: '<strong>胜负：</strong>棋子多的一方获胜',
            backToMode: '返回模式选择',
            blackScore: '⚫ 黑: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ 白: <span id="finalWhiteScore"></span>',
            blackTurn: '黑方回合',
            whiteTurn: '白方回合',
            whiteThinking: '白方回合（思考中...）'
        },
        ludo: {
            pageTitle: '飞行棋 - 游戏门户',
            title: '🎲 飞行棋',
            gameSettings: '游戏设置',
            playerCount: '玩家数量',
            twoPlayers: '2人',
            threePlayers: '3人',
            fourPlayers: '4人',
            playerSettings: '玩家设置',
            gameRules: '游戏规则',
            requireSix: '需要6才能从基地出发',
            extraTurn: '掷出6获得额外回合',
            exactRoll: '到达终点需要精确点数',
            showThinking: '显示电脑思考时间',
            rule1: '<strong>目标：</strong>将所有4个棋子送入终点',
            rule2: '<strong>开始：</strong>掷出6才能将棋子移出基地',
            rule3: '<strong>移动：</strong>按骰子点数移动棋子',
            rule4: '<strong>捕获：</strong>落在对手棋子上将其送回基地',
            rule5: '<strong>额外回合：</strong>掷出6可以再掷一次',
            rule6: '<strong>胜利：</strong>最先将所有棋子送入终点者获胜',
            startGame: '开始游戏',
            rollDice: '掷骰子',
            backToSettings: '返回设置',
            gameLog: '游戏日志',
            gameFinished: '🎉 游戏结束！'
        },
        chess: {
            pageTitle: '国际象棋 - 游戏门户',
            title: '♔♕ 国际象棋',
            selectMode: '选择游戏模式',
            pvp: '玩家 vs 玩家',
            pvc: '玩家 vs 电脑',
            selectLevel: '选择电脑难度',
            level1: '难度1（随机）',
            level2: '难度2（棋子价值）',
            level3: '难度3（极小极大）',
            rule1: '<strong>目标：</strong>将对手的国王将死',
            rule2: '<strong>移动：</strong>每个棋子有固定的移动方式',
            rule3: '<strong>回合：</strong>白棋和黑棋交替移动（白棋先手）',
            rule4: '<strong>将军：</strong>国王被攻击的状态',
            rule5: '<strong>将死：</strong>无法逃离将军时游戏结束',
            rule6: '<strong>特殊移动：</strong>王车易位、吃过路兵、升变',
            rule7: '<strong>和棋：</strong>僵局或同一局面重复会导致和棋',
            backToMode: '返回模式选择',
            whiteTurn: '白棋回合',
            blackTurn: '黑棋回合',
            capturedWhite: '吃掉的白棋:',
            capturedBlack: '吃掉的黑棋:',
            moveHistory: '棋谱',
            promotion: '兵升变',
            selectPromotion: '选择升变的棋子'
        },
        gomoku: {
            pageTitle: '五子棋 - 游戏门户',
            title: '🎯 五子棋',
            selectMode: '选择游戏模式',
            pvp: '玩家 vs 玩家',
            pvc: '玩家 vs CPU',
            selectLevel: '选择CPU难度',
            level1: '等级1 (随机)',
            level2: '等级2 (评估函数)',
            level3: '等级3 (极小极大)',
            rule1: '<strong>目标：</strong>纵、横、斜任意一方向排列五个棋子',
            rule2: '<strong>放置：</strong>轮流放置棋子（黑子先手）',
            rule3: '<strong>胜利：</strong>先排列五个棋子的一方胜利',
            rule4: '<strong>回合：</strong>黑白交替下棋',
            rule5: '<strong>平局：</strong>棋盘下满但没有胜者',
            blackTurn: '黑子回合',
            whiteTurn: '白子回合',
            moveCount: '手数:',
            backToMode: '返回模式选择'
        },
        memory: {
            pageTitle: '记忆纸牌 - 游戏门户',
            title: '🃏 记忆纸牌',
            selectMode: '选择游戏模式',
            onePlayer: '单人游戏',
            twoPlayers: '双人对战',
            selectDifficulty: '选择难度',
            easy: '简单 (4×4)',
            normal: '普通 (32张)',
            hard: '困难 (52张)',
            rule1: '<strong>目标：</strong>找到所有配对的卡牌',
            rule2: '<strong>玩法：</strong>每回合翻开2张卡牌',
            rule3: '<strong>匹配：</strong>相同图案的卡牌保持翻开',
            rule4: '<strong>不匹配：</strong>不同图案的卡牌翻回',
            rule5: '<strong>胜利：</strong>找到所有配对即可过关',
            timer: '时间:',
            moves: '步数:',
            pairs: '配对:',
            player1: '玩家1',
            player2: '玩家2',
            turn: '的回合',
            backToMode: '返回模式选择',
            congratulations: '恭喜！',
            clearTime: '通关时间:',
            totalMoves: '总步数:',
            rank: '评级:',
            winner: '获胜者:',
            draw: '平局',
            score: '得分:'
        },
        games: {
            title: '游戏列表',
            subtitle: '欢迎来到经典游戏的世界，在这里深化思考，享受策略',
            othello: {
                tag: '策略游戏',
                title: '黑白棋',
                description: '使用黑白棋子的策略游戏。规则简单但具有深厚的战略性，是世界各地都喜爱的棋盘游戏。夹住对手的棋子将其翻转，支配棋盘。',
                players: '👥 2名玩家',
                duration: '⏱️ 15-30分钟'
            },
            ludo: {
                tag: '棋盘游戏',
                title: '飞行棋',
                description: '摔骰子移动棋子，这是一款运气与策略的棋盘游戏。最多可4人对战，与家人朋友一起享受乐趣。简单却充满不可预测的展开是其魅力所在。',
                players: '👥 2-4名玩家',
                duration: '⏱️ 20-40分钟'
            },
            chess: {
                tag: '策略游戏',
                title: '国际象棋',
                description: '世界上最著名的策略棋盘游戏。使用王、后、车等6种棋子，将对手的王将死，享受智力对抗。',
                players: '👥 2名玩家',
                duration: '⏱️ 30-60分钟'
            },
            gomoku: {
                tag: '策略游戏',
                title: '五子棋',
                description: '在15×15棋盘上目标是排列5个棋子的策略游戏。简单却深奥，考验前瞻能力。从初学者到高手都能享受的传统棋盘游戏。',
                players: '👥 2名玩家',
                duration: '⏱️ 10-20分钟'
            },
            memory: {
                tag: '记忆游戏',
                title: '记忆卡片',
                description: '翻牌找到配对的记忆力游戏。这是一个训练专注力和记忆力的有趣游戏。可以享受单人和双人对战模式。',
                players: '👥 1-2名玩家',
                duration: '⏱️ 5-15分钟'
            },
            stopwatch: {
                tag: '计时游戏',
                title: '秒表挑战',
                description: '精准停在目标时间的计时游戏。3个回合比拼误差最小。测试集中力与感觉的短时挑战游戏。',
                players: '👥 1名玩家',
                duration: '⏱️ 1分钟'
            },
            playBtn: '开始游戏 →'
        },
        stopwatch: {
            title: '⏱️ 秒表挑战',
            subtitle: '精准停在目标时间！',
            selectMode: '选择模式',
            normalMode: '普通模式',
            normalModeDesc: '显示经过时间',
            blindMode: '盲打模式',
            blindModeDesc: '隐藏经过时间',
            rulesTitle: '规则说明',
            rule1: '3回合制（3秒・5秒・10秒）',
            rule2: '按开始按钮开始计时',
            rule3: '在目标时间按停止按钮',
            rule4: '误差越小排名越高',
            rule5: '根据总误差综合评价',
            startGame: '开始游戏',
            turn: '回合',
            target: '目标',
            elapsed: '记录时间',
            seconds: '秒',
            start: '开始',
            stop: '停止',
            reset: '重置',
            nextTurn: '下一回合',
            result: '结果',
            error: '误差',
            rank: '等级',
            totalError: '总误差',
            finalRank: '综合等级',
            finalResultTitle: '最终结果',
            playAgain: '再玩一次',
            backHome: '返回首页',
            waiting: '等待中',
            measuring: '计时中',
            stopped: '已停止',
            rankSSS: '神技！',
            rankSS: '超人！',
            rankS: '达人！',
            rankA: '优秀！',
            rankB: '良好！',
            rankC: '普通',
            rankD: '需练习',
            rankE: '搞笑级'
        },
        contact: {
            title: '联系我们',
            subtitle: '如有任何问题或要求，请随时联系我们',
            email: '电子邮件',
            support: '支持',
            hours: '工作日 9:00-18:00',
            optional: '（可选）',
            required: '（必填）',
            form: {
                name: '昵称',
                email: '电子邮件地址',
                subject: '主题',
                message: '消息',
                namePlaceholder: '张三',
                emailPlaceholder: 'example@email.com',
                subjectPlaceholder: '咨询内容的主题',
                messagePlaceholder: '请输入您的咨询内容（必填）',
                submit: '发送消息',
                success: '您的消息已成功发送。谢谢！',
                error: '发送消息失败。请重试。'
            }
        },
        footer: {
            tagline: '通过游戏创造新体验',
            games: '游戏',
            info: '信息',
            privacy: '隐私政策',
            copyright: '© 2025 GAME PORTAL. 版权所有。'
        },
        privacy: {
            title: '隐私政策',
            intro: 'GAME PORTAL（以下简称"本站"）就用户个人信息的处理制定以下隐私政策（以下简称"本政策"）。',
            section1: {
                title: '1. 个人信息的收集和使用目的',
                content: '本站不收集用户的个人信息。在联系表单中输入的信息（姓名、电子邮件地址、咨询内容）仅用于回复咨询和改进未来的服务。'
            },
            section2: {
                title: '2. 向第三方提供个人信息',
                content: '除法律规定的情况外，本站不会向第三方提供用户的个人信息。'
            },
            section3: {
                title: '3. 关于Cookie（小型文本文件）',
                content: '本站可能使用Cookie来改善用户体验。Cookie是存储在用户浏览器中的小型数据文件，用于分析网站使用情况。用户可以通过浏览器设置拒绝接受Cookie，但某些功能可能会受到限制。'
            },
            section4: {
                title: '4. 关于本地存储',
                content: '本站使用浏览器的本地存储来保存游戏进度、统计信息和语言设置。这些信息仅存储在您的浏览器中，不会发送到外部服务器。可以随时从浏览器设置中删除本地存储中保存的信息。'
            },
            section5: {
                title: '5. 关于访问分析工具',
                content: '本站可能使用Google Analytics等访问分析工具来了解网站使用情况。这些工具使用Cookie收集信息，但不包含可识别个人身份的信息。有关详细信息，请参阅各工具的隐私政策。'
            },
            section6: {
                title: '6. 免责声明',
                content: '我们努力在本站的内容中提供尽可能准确的信息，但不保证其准确性或安全性。对于本站发布的内容造成的任何损害，我们概不负责。此外，对于通过本站的链接或横幅移动到其他网站后提供的信息和服务，我们不承担任何责任。'
            },
            section7: {
                title: '7. 版权和肖像权',
                content: '禁止未经授权转载本站发布的文字和图像。本站无意侵犯版权或肖像权。如有版权或肖像权问题，请通过联系表单与我们联系。我们将迅速处理。'
            },
            section8: {
                title: '8. 隐私政策的更改',
                content: '本站可能会根据法律变更或必要性在不事先通知的情况下更改本政策。修订后的隐私政策自在本站发布之时起生效。'
            },
            section9: {
                title: '9. 联系我们',
                content: '有关本政策的咨询，请通过本站的联系表单与我们联系。'
            },
            established: '制定日期：2025年11月26日',
            updated: '最后更新日期：2025年11月26日',
            backHome: '← 返回主页'
        }
    },
    hi: {
        nav: {
            games: 'खेल सूची',
            ranking: 'लोकप्रिय रैंकिंग',
            contact: 'संपर्क करें'
        },
        hero: {
            title: 'आपके पसंदीदा गेम,<br>यहाँ हैं।',
            subtitle: 'डाउनलोड की आवश्यकता नहीं, अभी मुफ्त गेम खेलें',
            cta: 'खेलना शुरू करें'
        },
        common: {
            backHome: '← होम पर वापस जाएं',
            howToPlay: 'कैसे खेलें · नियम',
            reset: 'रीसेट',
            close: 'बंद करें',
            playAgain: 'फिर से खेलें',
            gameOver: 'खेल समाप्त'
        },
        othello: {
            pageTitle: 'ओथेलो - गेम पोर्टल',
            title: '⚫⚪ ओथेलो',
            selectMode: 'गेम मोड चुनें',
            pvp: 'खिलाड़ी vs खिलाड़ी',
            pvc: 'खिलाड़ी vs कंप्यूटर',
            selectLevel: 'कंप्यूटर स्तर चुनें',
            level1: 'स्तर 1 (यादृच्छिक)',
            level2: 'स्तर 2 (अधिकतम पलटना)',
            level3: 'स्तर 3 (मूल्यांकन)',
            rule1: '<strong>लक्ष्य:</strong> विरोधी से अधिक पत्थर बोर्ड पर रखें',
            rule2: '<strong>स्थापना:</strong> विरोधी के पत्थरों को सैंडविच करने के लिए अपना पत्थर रखें',
            rule3: '<strong>पलटना:</strong> सभी सैंडविच किए गए विरोधी पत्थर आपके बन जाते हैं',
            rule4: '<strong>बारी:</strong> काला और सफेद बारी-बारी से चलते हैं (काला पहले)',
            rule5: '<strong>पास:</strong> कोई वैध चाल न होने पर स्वचालित रूप से पास',
            rule6: '<strong>समाप्ति:</strong> दोनों खिलाड़ी पास होने पर खेल समाप्त',
            rule7: '<strong>विजेता:</strong> अधिक पत्थर वाला खिलाड़ी जीतता है',
            backToMode: 'मोड चयन पर वापस जाएं',
            blackScore: '⚫ काला: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ सफेद: <span id="finalWhiteScore"></span>',
            blackTurn: 'काले की बारी',
            whiteTurn: 'सफेद की बारी',
            whiteThinking: 'सफेद की बारी (सोच रहा है...)'
        },
        ludo: {
            pageTitle: 'लूडो - गेम पोर्टल',
            title: '🎲 लूडो',
            gameSettings: 'गेम सेटिंग्स',
            playerCount: 'खिलाड़ियों की संख्या',
            twoPlayers: '2 खिलाड़ी',
            threePlayers: '3 खिलाड़ी',
            fourPlayers: '4 खिलाड़ी',
            playerSettings: 'खिलाड़ी सेटिंग्स',
            gameRules: 'गेम नियम',
            requireSix: 'आधार से शुरू करने के लिए 6 चाहिए',
            extraTurn: '6 आने पर अतिरिक्त बारी',
            exactRoll: 'समाप्त करने के लिए सटीक संख्या चाहिए',
            showThinking: 'कंप्यूटर सोच का समय दिखाएं',
            rule1: '<strong>लक्ष्य:</strong> सभी 4 मोहरों को फिनिश तक पहुंचाएं',
            rule2: '<strong>शुरुआत:</strong> आधार से मोहरा निकालने के लिए 6 फेंकें',
            rule3: '<strong>चाल:</strong> पासे की संख्या से मोहरा आगे बढ़ाएं',
            rule4: '<strong>कैप्चर:</strong> विरोधी के मोहरे पर उतरने से वह आधार पर वापस जाता है',
            rule5: '<strong>अतिरिक्त बारी:</strong> 6 आने पर दूसरी बारी मिलती है',
            rule6: '<strong>जीत:</strong> सभी मोहरों को पहले फिनिश तक पहुंचाने वाला जीतता है',
            startGame: 'खेल शुरू करें',
            rollDice: 'पासा फेंकें',
            backToSettings: 'सेटिंग्स पर वापस जाएं',
            gameLog: 'गेम लॉग',
            gameFinished: '🎉 खेल समाप्त!'
        },
        chess: {
            pageTitle: 'शतरंज - गेम पोर्टल',
            title: '♔♕ शतरंज',
            selectMode: 'गेम मोड चुनें',
            pvp: 'खिलाड़ी vs खिलाड़ी',
            pvc: 'खिलाड़ी vs कंप्यूटर',
            selectLevel: 'कंप्यूटर स्तर चुनें',
            level1: 'स्तर 1 (यादृच्छिक)',
            level2: 'स्तर 2 (मोहरा मूल्य)',
            level3: 'स्तर 3 (मिनीमैक्स)',
            rule1: '<strong>लक्ष्य:</strong> विरोधी के राजा को चेकमेट करें',
            rule2: '<strong>चाल:</strong> प्रत्येक मोहरे की निश्चित चाल होती है',
            rule3: '<strong>बारी:</strong> सफेद और काला बारी-बारी से चलते हैं (सफेद पहले)',
            rule4: '<strong>चेक:</strong> राजा पर हमला होने की स्थिति',
            rule5: '<strong>चेकमेट:</strong> चेक से बच न सकें तो खेल समाप्त',
            rule6: '<strong>विशेष चालें:</strong> कैसलिंग, एन पासां, प्रमोशन',
            rule7: '<strong>ड्रा:</strong> स्टेलमेट या समान स्थिति की पुनरावृत्ति से ड्रा',
            backToMode: 'मोड चयन पर वापस',
            whiteTurn: 'सफेद की बारी',
            blackTurn: 'काले की बारी',
            capturedWhite: 'पकड़े सफेद मोहरे:',
            capturedBlack: 'पकड़े काले मोहरे:',
            moveHistory: 'चालों का इतिहास',
            promotion: 'प्यादा प्रमोशन',
            selectPromotion: 'प्रमोशन के लिए मोहरा चुनें'
        },
        gomoku: {
            pageTitle: 'गोमोकु - गेम पोर्टल',
            title: '🎯 गोमोकु',
            selectMode: 'खेल मोड चुनें',
            pvp: 'खिलाड़ी vs खिलाड़ी',
            pvc: 'खिलाड़ी vs CPU',
            selectLevel: 'CPU स्तर चुनें',
            level1: 'स्तर 1 (यादृच्छिक)',
            level2: 'स्तर 2 (मूल्यांकन)',
            level3: 'स्तर 3 (मिनीमैक्स)',
            rule1: '<strong>उद्देश्य:</strong> खड़ा, आड़ा या तिरछा 5 पत्थर लगातार लगाएं',
            rule2: '<strong>रखना:</strong> बारी-बारी से पत्थर रखें (काला पहले)',
            rule3: '<strong>जीत:</strong> जो पहले 5 पत्थर लगातार लगाए',
            rule4: '<strong>मोड़:</strong> काला और सफेद बारी-बारी से',
            rule5: '<strong>बराबरी:</strong> बोर्ड भर जाए लेकिन कोई जीता न हो',
            blackTurn: 'काले की बारी',
            whiteTurn: 'सफेद की बारी',
            moveCount: 'चालें:',
            backToMode: 'मोड चयन पर वापस'
        },
        memory: {
            pageTitle: 'मेमोरी कार्ड गेम - गेम पोर्टल',
            title: '🃏 मेमोरी कार्ड गेम',
            selectMode: 'गेम मोड चुनें',
            onePlayer: '1 खिलाड़ी',
            twoPlayers: '2 खिलाड़ी',
            selectDifficulty: 'कठिनाई चुनें',
            easy: 'आसान (4×4)',
            normal: 'सामान्य (32 कार्ड)',
            hard: 'कठिन (52 कार्ड)',
            rule1: '<strong>उद्देश्य:</strong> सभी मेल खाते कार्ड जोड़े खोजें',
            rule2: '<strong>कैसे खेलें:</strong> प्रति बारी 2 कार्ड पलटें',
            rule3: '<strong>मिलान:</strong> मिलते कार्ड खुले रहते हैं',
            rule4: '<strong>बेमेल:</strong> न मिलते कार्ड वापस पलट जाते हैं',
            rule5: '<strong>विजय:</strong> सभी जोड़े खोजकर क्लियर करें',
            timer: 'समय:',
            moves: 'चालें:',
            pairs: 'जोड़े:',
            player1: 'खिलाड़ी 1',
            player2: 'खिलाड़ी 2',
            turn: 'की बारी',
            backToMode: 'मोड चयन पर वापस',
            congratulations: 'बधाई हो!',
            clearTime: 'क्लियर समय:',
            totalMoves: 'कुल चालें:',
            rank: 'रैंक:',
            winner: 'विजेता:',
            draw: 'ड्रा',
            score: 'स्कोर:'
        },
        games: {
            title: 'हमारे खेल',
            subtitle: 'क्लासिक गेम्स की दुनिया में आपका स्वागत है जहाँ आप सोच को गहरा कर सकते हैं और रणनीति का आनंद ले सकते हैं',
            othello: {
                tag: 'रणनीति खेल',
                title: 'ओथेलो',
                description: 'काले और सफेद पत्थरों का उपयोग करके एक रणनीतिक खेल। सरल नियमों के साथ लेकिन गहरी रणनीतिक गेमप्ले। विरोधी के पत्थरों को पलटने के लिए उन्हें सैंडविच करें और बोर्ड पर हावी हों।',
                players: '👥 2 खिलाड़ी',
                duration: '⏱️ 15-30 मिनट'
            },
            ludo: {
                tag: 'बोर्ड गेम',
                title: 'लूडो',
                description: 'पासा फेंकें और अपने मोहरों को बढ़ाएं, यह भाग्य और रणनीति का खेल है। 4 खिलाड़ियों तक खेल सकते हैं और परिवार और दोस्तों के साथ मज़ा कर सकते हैं।',
                players: '👥 2-4 खिलाड़ी',
                duration: '⏱️ 20-40 मिनट'
            },
            chess: {
                tag: 'रणनीति खेल',
                title: 'शतरंज',
                description: 'दुनिया का सबसे प्रसिद्ध रणनीतिक बोर्ड गेम। राजा, रानी, रथ समेत 6 प्रकार के मोहरों का उपयोग करके विरोधी के राजा को चेकमेट करें।',
                players: '👥 2 खिलाड़ी',
                duration: '⏱️ 30-60 मिनट'
            },
            gomoku: {
                tag: 'रणनीति खेल',
                title: 'गोमोकु',
                description: '15×15 बोर्ड पर 5 पत्थर लगातार लगाने का लक्ष्य रणनीतिक खेल। सरल लेकिन गहरा, यह आगे सोचने की क्षमता का परीक्षण करता है।',
                players: '👥 2 खिलाड़ी',
                duration: '⏱️ 10-20 मिनट'
            },
            memory: {
                tag: 'स्मृति खेल',
                title: 'मेमोरी कार्ड',
                description: 'कार्ड पलटें और मिलान जोड़ियाँ ढूंढें। एक मजेदार खेल जो ध्यान और स्मृति को प्रशिक्षित करता है। एकल और दो खिलाड़ियों के मोड का आनंद लें।',
                players: '👥 1-2 खिलाड़ी',
                duration: '⏱️ 5-15 मिनट'
            },
            stopwatch: {
                tag: 'समय खेल',
                title: 'स्टॉपवॉच चुनौती',
                description: 'सटीक लक्ष्य समय पर स्टॉपवॉच रोकने का समय खेल। 3 राउंड में न्यूनतम त्रुटि के लिए प्रतिस्पर्धा करें। एकाग्रता और समय का परीक्षण करने वाला छोटा चुनौती खेल।',
                players: '👥 1 खिलाड़ी',
                duration: '⏱️ 1 मिनट'
            },
            playBtn: 'अभी खेलें →'
        },
        stopwatch: {
            title: '⏱️ स्टॉपवॉच चुनौती',
            subtitle: 'सटीक लक्ष्य समय पर रोकें!',
            selectMode: 'मोड चुनें',
            normalMode: 'सामान्य मोड',
            normalModeDesc: 'समय दिखाई देता है',
            blindMode: 'ब्लाइंड मोड',
            blindModeDesc: 'समय छिपा हुआ',
            rulesTitle: 'नियम',
            rule1: '3 राउंड (3 सेकंड, 5 सेकंड, 10 सेकंड)',
            rule2: 'समय शुरू करने के लिए स्टार्ट दबाएं',
            rule3: 'लक्ष्य समय पर स्टॉप दबाएं',
            rule4: 'कम त्रुटि = उच्च रैंक',
            rule5: 'कुल त्रुटि पर अंतिम रैंक',
            startGame: 'खेल शुरू करें',
            turn: 'राउंड',
            target: 'लक्ष्य',
            elapsed: 'रिकॉर्ड समय',
            seconds: 'सेकंड',
            start: 'शुरू',
            stop: 'रोकें',
            reset: 'रीसेट',
            nextTurn: 'अगला राउंड',
            result: 'परिणाम',
            error: 'त्रुटि',
            rank: 'रैंक',
            totalError: 'कुल त्रुटि',
            finalRank: 'अंतिम रैंक',
            finalResultTitle: 'अंतिम परिणाम',
            playAgain: 'फिर से खेलें',
            backHome: 'होम पर वापस',
            waiting: 'प्रतीक्षा',
            measuring: 'माप रहा है',
            stopped: 'रुका हुआ',
            rankSSS: 'दिव्य!',
            rankSS: 'अलौकिक!',
            rankS: 'मास्टर!',
            rankA: 'उत्कृष्ट!',
            rankB: 'अच्छा!',
            rankC: 'औसत',
            rankD: 'अभ्यास चाहिए',
            rankE: 'महाविफलता'
        },
        contact: {
            title: 'संपर्क करें',
            subtitle: 'यदि आपके कोई प्रश्न या अनुरोध हैं तो बेझिझक हमसे संपर्क करें',
            email: 'ईमेल',
            support: 'सहायता',
            hours: 'सप्ताह के दिन 9:00-18:00',
            optional: '(वैकल्पिक)',
            required: '(आवश्यक)',
            form: {
                name: 'उपनाम',
                email: 'ईमेल पता',
                subject: 'विषय',
                message: 'संदेश',
                namePlaceholder: 'राज कुमार',
                emailPlaceholder: 'example@email.com',
                subjectPlaceholder: 'पूछताछ का विषय',
                messagePlaceholder: 'कृपया अपना संदेश दर्ज करें (आवश्यक)',
                submit: 'संदेश भेजें',
                success: 'आपका संदेश सफलतापूर्वक भेज दिया गया है। धन्यवाद!',
                error: 'संदेश भेजने में विफल। कृपया पुनः प्रयास करें।'
            }
        },
        footer: {
            tagline: 'खेल के माध्यम से नए अनुभव बनाना',
            games: 'खेल',
            info: 'जानकारी',
            privacy: 'गोपनीयता नीति',
            copyright: '© 2025 GAME PORTAL. सर्वाधिकार सुरक्षित।'
        },
        privacy: {
            title: 'गोपनीयता नीति',
            intro: 'GAME PORTAL (इसके बाद "इस साइट" के रूप में संदर्भित) उपयोगकर्ताओं की व्यक्तिगत जानकारी के प्रबंधन के संबंध में निम्नलिखित गोपनीयता नीति (इसके बाद "इस नीति" के रूप में संदर्भित) स्थापित करता है।',
            section1: {
                title: '1. व्यक्तिगत जानकारी का संग्रह और उपयोग का उद्देश्य',
                content: 'यह साइट उपयोगकर्ताओं से व्यक्तिगत जानकारी एकत्र नहीं करती है। संपर्क फॉर्म में दर्ज की गई जानकारी (नाम, ईमेल पता, और पूछताछ की सामग्री) का उपयोग केवल पूछताछ का जवाब देने और भविष्य में हमारी सेवाओं में सुधार के लिए किया जाएगा।'
            },
            section2: {
                title: '2. तीसरे पक्ष को व्यक्तिगत जानकारी का प्रावधान',
                content: 'यह साइट कानून द्वारा आवश्यक होने के अलावा उपयोगकर्ताओं की व्यक्तिगत जानकारी तीसरे पक्ष को प्रदान नहीं करेगी।'
            },
            section3: {
                title: '3. कुकीज़ के बारे में',
                content: 'यह साइट उपयोगकर्ता अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग कर सकती है। कुकीज़ छोटी डेटा फाइलें हैं जो आपके ब्राउज़र में संग्रहीत होती हैं और साइट के उपयोग का विश्लेषण करने के लिए उपयोग की जाती हैं। उपयोगकर्ता ब्राउज़र सेटिंग्स के माध्यम से कुकीज़ को स्वीकार करने से इनकार कर सकते हैं, लेकिन कुछ सुविधाएं सीमित हो सकती हैं।'
            },
            section4: {
                title: '4. स्थानीय भंडारण के बारे में',
                content: 'यह साइट खेल की प्रगति, आंकड़े और भाषा सेटिंग्स को सहेजने के लिए ब्राउज़र के स्थानीय भंडारण का उपयोग करती है। यह जानकारी केवल आपके ब्राउज़र में संग्रहीत होती है और कभी भी बाहरी सर्वर को नहीं भेजी जाती है। स्थानीय भंडारण में संग्रहीत जानकारी को आपकी ब्राउज़र सेटिंग्स से किसी भी समय हटाया जा सकता है।'
            },
            section5: {
                title: '5. विश्लेषण उपकरणों के बारे में',
                content: 'यह साइट साइट के उपयोग को समझने के लिए Google Analytics जैसे विश्लेषण उपकरणों का उपयोग कर सकती है। ये उपकरण कुकीज़ का उपयोग करके जानकारी एकत्र करते हैं लेकिन व्यक्तिगत रूप से पहचान योग्य जानकारी शामिल नहीं करते हैं। विवरण के लिए, कृपया प्रत्येक उपकरण की गोपनीयता नीति देखें।'
            },
            section6: {
                title: '6. अस्वीकरण',
                content: 'हम इस साइट की सामग्री में यथासंभव सटीक जानकारी प्रदान करने का प्रयास करते हैं, लेकिन हम इसकी सटीकता या सुरक्षा की गारंटी नहीं देते हैं। इस साइट पर पोस्ट की गई सामग्री के कारण होने वाले किसी भी नुकसान के लिए हम जिम्मेदार नहीं हैं। इसके अतिरिक्त, हम इस साइट से लिंक या बैनर के माध्यम से एक्सेस की गई साइटों द्वारा प्रदान की गई जानकारी या सेवाओं के लिए जिम्मेदार नहीं हैं।'
            },
            section7: {
                title: '7. कॉपीराइट और चित्र अधिकार',
                content: 'इस साइट पर पोस्ट किए गए पाठ और छवियों का अनधिकृत पुनरुत्पादन निषिद्ध है। यह साइट कॉपीराइट या चित्र अधिकारों का उल्लंघन करने का इरादा नहीं रखती है। यदि कॉपीराइट या चित्र अधिकारों के संबंध में कोई समस्या है, तो कृपया संपर्क फॉर्म के माध्यम से हमसे संपर्क करें। हम तुरंत प्रतिक्रिया देंगे।'
            },
            section8: {
                title: '8. गोपनीयता नीति में परिवर्तन',
                content: 'यह साइट कानून में बदलाव या आवश्यकता के अनुसार बिना किसी पूर्व सूचना के इस नीति को बदल सकती है। संशोधित गोपनीयता नीति इस साइट पर पोस्ट किए जाने के समय से प्रभावी हो जाएगी।'
            },
            section9: {
                title: '9. संपर्क करें',
                content: 'इस नीति के बारे में पूछताछ के लिए, कृपया इस साइट पर संपर्क फॉर्म के माध्यम से हमसे संपर्क करें।'
            },
            established: 'स्थापित: 26 नवंबर, 2025',
            updated: 'अंतिम अपडेट: 26 नवंबर, 2025',
            backHome: '← होम पर वापस जाएं'
        }
    },
    es: {
        nav: {
            games: 'Juegos',
            ranking: 'Ranking Popular',
            contact: 'Contacto'
        },
        hero: {
            title: 'Los Juegos que Quieres,<br>Aquí Están.',
            subtitle: 'Sin Descarga, Juega Gratis Ahora',
            cta: 'Comenzar a Jugar'
        },
        common: {
            backHome: '← Volver al Inicio',
            howToPlay: 'Cómo Jugar · Reglas',
            reset: 'Reiniciar',
            close: 'Cerrar',
            playAgain: 'Jugar de Nuevo',
            gameOver: 'Juego Terminado'
        },
        othello: {
            pageTitle: 'Othello - Portal de Juegos',
            title: '⚫⚪ Othello',
            selectMode: 'Seleccionar Modo de Juego',
            pvp: 'Jugador vs Jugador',
            pvc: 'Jugador vs Computadora',
            selectLevel: 'Seleccionar Nivel de CPU',
            level1: 'Nivel 1 (Aleatorio)',
            level2: 'Nivel 2 (Máximo Volteo)',
            level3: 'Nivel 3 (Evaluación)',
            rule1: '<strong>Objetivo:</strong> Conseguir más fichas en el tablero que tu oponente',
            rule2: '<strong>Colocación:</strong> Coloca tu ficha para atrapar las fichas del oponente',
            rule3: '<strong>Volteo:</strong> Todas las fichas atrapadas del oponente se vuelven tuyas',
            rule4: '<strong>Turnos:</strong> Negro y blanco se turnan (negro va primero)',
            rule5: '<strong>Pasar:</strong> Pasa automáticamente si no hay movimientos válidos',
            rule6: '<strong>Fin:</strong> El juego termina cuando ambos jugadores pasan',
            rule7: '<strong>Ganador:</strong> El jugador con más fichas gana',
            backToMode: 'Volver a Selección de Modo',
            blackScore: '⚫ Negro: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ Blanco: <span id="finalWhiteScore"></span>',
            blackTurn: 'Turno de las Negras',
            whiteTurn: 'Turno de las Blancas',
            whiteThinking: 'Turno de las Blancas (Pensando...)'
        },
        ludo: {
            pageTitle: 'Ludo - Portal de Juegos',
            title: '🎲 Ludo',
            gameSettings: 'Configuración del Juego',
            playerCount: 'Número de Jugadores',
            twoPlayers: '2 Jugadores',
            threePlayers: '3 Jugadores',
            fourPlayers: '4 Jugadores',
            playerSettings: 'Configuración de Jugadores',
            gameRules: 'Reglas del Juego',
            requireSix: 'Necesita 6 para salir de la base',
            extraTurn: 'Turno extra al sacar 6',
            exactRoll: 'Número exacto necesario para terminar',
            showThinking: 'Mostrar tiempo de pensamiento de CPU',
            rule1: '<strong>Objetivo:</strong> Llevar las 4 fichas a la meta',
            rule2: '<strong>Inicio:</strong> Saca un 6 para mover ficha desde la base',
            rule3: '<strong>Movimiento:</strong> Avanza la ficha según el número del dado',
            rule4: '<strong>Captura:</strong> Caer en ficha del oponente la envía de vuelta a la base',
            rule5: '<strong>Turno Extra:</strong> Sacar 6 da otro turno',
            rule6: '<strong>Victoria:</strong> El primero en llevar todas las fichas a la meta gana',
            startGame: 'Comenzar Juego',
            rollDice: 'Lanzar Dados',
            backToSettings: 'Volver a Configuración',
            gameLog: 'Registro del Juego',
            gameFinished: '🎉 ¡Juego terminado!'
        },
        chess: {
            pageTitle: 'Ajedrez - Portal de Juegos',
            title: '♔♕ Ajedrez',
            selectMode: 'Seleccionar Modo de Juego',
            pvp: 'Jugador vs Jugador',
            pvc: 'Jugador vs Computadora',
            selectLevel: 'Seleccionar Nivel de CPU',
            level1: 'Nivel 1 (Aleatorio)',
            level2: 'Nivel 2 (Valor de Pieza)',
            level3: 'Nivel 3 (Minimax)',
            rule1: '<strong>Objetivo:</strong> Hacer jaque mate al rey del oponente',
            rule2: '<strong>Movimiento:</strong> Cada pieza tiene su forma específica de moverse',
            rule3: '<strong>Turnos:</strong> Blancas y negras se turnan (blancas primero)',
            rule4: '<strong>Jaque:</strong> Estado en que el rey está siendo atacado',
            rule5: '<strong>Jaque Mate:</strong> Cuando no se puede escapar del jaque, el juego termina',
            rule6: '<strong>Movimientos Especiales:</strong> Enroque, captura al paso, promoción',
            rule7: '<strong>Empate:</strong> Tablas por ahogado o repetición de posiciones',
            backToMode: 'Volver a Selección de Modo',
            whiteTurn: 'Turno de Blancas',
            blackTurn: 'Turno de Negras',
            capturedWhite: 'Piezas blancas capturadas:',
            capturedBlack: 'Piezas negras capturadas:',
            moveHistory: 'Historial de Movimientos',
            promotion: 'Promoción de Peón',
            selectPromotion: 'Selecciona la pieza para promoción'
        },
        gomoku: {
            pageTitle: 'Gomoku - Portal de Juegos',
            title: '🎯 Gomoku',
            selectMode: 'Seleccionar Modo de Juego',
            pvp: 'Jugador vs Jugador',
            pvc: 'Jugador vs CPU',
            selectLevel: 'Seleccionar Nivel de CPU',
            level1: 'Nivel 1 (Aleatorio)',
            level2: 'Nivel 2 (Evaluación)',
            level3: 'Nivel 3 (Minimax)',
            rule1: '<strong>Objetivo:</strong> Alinea 5 piedras vertical, horizontal o diagonalmente',
            rule2: '<strong>Colocación:</strong> Coloca piedras por turnos (Negras primero)',
            rule3: '<strong>Victoria:</strong> El primero en alinear 5 piedras gana',
            rule4: '<strong>Turnos:</strong> Negras y blancas alternan',
            rule5: '<strong>Empate:</strong> Si el tablero se llena sin ganador',
            blackTurn: 'Turno de Negras',
            whiteTurn: 'Turno de Blancas',
            moveCount: 'Movimientos:',
            backToMode: 'Volver a Selección de Modo'
        },
        memory: {
            pageTitle: 'Juego de Memoria - Portal de Juegos',
            title: '🃏 Juego de Memoria',
            selectMode: 'Seleccionar Modo de Juego',
            onePlayer: '1 Jugador',
            twoPlayers: '2 Jugadores',
            selectDifficulty: 'Seleccionar Dificultad',
            easy: 'Fácil (4×4)',
            normal: 'Normal (32 cartas)',
            hard: 'Difícil (52 cartas)',
            rule1: '<strong>Objetivo:</strong> Encontrar todos los pares de cartas',
            rule2: '<strong>Cómo Jugar:</strong> Voltear 2 cartas por turno',
            rule3: '<strong>Coincidencia:</strong> Las cartas que coinciden permanecen visibles',
            rule4: '<strong>No Coinciden:</strong> Las cartas que no coinciden se voltean',
            rule5: '<strong>Victoria:</strong> Completar encontrando todos los pares',
            timer: 'Tiempo:',
            moves: 'Movimientos:',
            pairs: 'Pares:',
            player1: 'Jugador 1',
            player2: 'Jugador 2',
            turn: ' Turno',
            backToMode: 'Volver a Selección de Modo',
            congratulations: '¡Felicitaciones!',
            clearTime: 'Tiempo de Finalización:',
            totalMoves: 'Movimientos Totales:',
            rank: 'Rango:',
            winner: 'Ganador:',
            draw: 'Empate',
            score: 'Puntuación:'
        },
        games: {
            title: 'Nuestros Juegos',
            subtitle: 'Bienvenido al mundo de los juegos clásicos donde puedes profundizar tu pensamiento y disfrutar de la estrategia',
            othello: {
                tag: 'Juego de Estrategia',
                title: 'Othello',
                description: 'Un juego estratégico usando fichas blancas y negras. Un juego de mesa amado en todo el mundo con reglas simples pero jugabilidad estratégica profunda. Atrapa las fichas del oponente para voltearlas y dominar el tablero.',
                players: '👥 2 Jugadores',
                duration: '⏱️ 15-30 min'
            },
            ludo: {
                tag: 'Juego de Mesa',
                title: 'Ludo',
                description: 'Tira el dado y mueve tus fichas en este juego de suerte y estrategia. Juega con hasta 4 jugadores y diviértete con familia y amigos. El juego simple pero impredecible es su encanto.',
                players: '👥 2-4 Jugadores',
                duration: '⏱️ 20-40 min'
            },
            chess: {
                tag: 'Juego de Estrategia',
                title: 'Ajedrez',
                description: 'El juego de mesa estratégico más famoso del mundo. Usa 6 tipos de piezas como Rey, Reina y Torre para hacer jaque mate al Rey oponente en esta batalla intelectual.',
                players: '👥 2 Jugadores',
                duration: '⏱️ 30-60 min'
            },
            gomoku: {
                tag: 'Juego de Estrategia',
                title: 'Gomoku',
                description: 'Un juego estratégico en un tablero 15×15 donde el objetivo es alinear 5 piedras. Simple pero profundo, pone a prueba tu capacidad de anticipación. Un juego de mesa tradicional agradable para principiantes y expertos.',
                players: '👥 2 Jugadores',
                duration: '⏱️ 10-20 min'
            },
            memory: {
                tag: 'Juego de Memoria',
                title: 'Juego de Memoria',
                description: 'Un juego de memoria donde volteas cartas para encontrar pares coincidentes. Un juego divertido que entrena la concentración y la memoria. Disfruta de los modos para un jugador y dos jugadores.',
                players: '👥 1-2 Jugadores',
                duration: '⏱️ 5-15 min'
            },
            stopwatch: {
                tag: 'Juego de Tiempo',
                title: 'Desafío de Cronómetro',
                description: 'Juego de tiempo donde detienes el cronómetro en el tiempo objetivo exacto. Compite por el menor error en 3 rondas. Un juego de desafío corto que prueba concentración y sensación.',
                players: '👥 1 Jugador',
                duration: '⏱️ 1 min'
            },
            playBtn: 'Jugar Ahora →'
        },
        stopwatch: {
            title: '⏱️ Desafío de Cronómetro',
            subtitle: '¡Detén en el tiempo objetivo exacto!',
            selectMode: 'Seleccionar Modo',
            normalMode: 'Modo Normal',
            normalModeDesc: 'Tiempo visible',
            blindMode: 'Modo Ciego',
            blindModeDesc: 'Tiempo oculto',
            rulesTitle: 'Reglas',
            rule1: '3 rondas (3 seg, 5 seg, 10 seg)',
            rule2: 'Presiona Iniciar para comenzar el tiempo',
            rule3: 'Presiona Detener en el tiempo objetivo',
            rule4: 'Menor error = mayor rango',
            rule5: 'Rango final basado en error total',
            startGame: 'Iniciar Juego',
            turn: 'Ronda',
            target: 'Objetivo',
            elapsed: 'Tiempo Registrado',
            seconds: 'seg',
            start: 'Iniciar',
            stop: 'Detener',
            reset: 'Reiniciar',
            nextTurn: 'Siguiente Ronda',
            result: 'Resultado',
            error: 'Error',
            rank: 'Rango',
            totalError: 'Error Total',
            finalRank: 'Rango Final',
            finalResultTitle: 'Resultado Final',
            playAgain: 'Jugar de Nuevo',
            backHome: 'Volver al Inicio',
            waiting: 'Esperando',
            measuring: 'Midiendo',
            stopped: 'Detenido',
            rankSSS: '¡Divino!',
            rankSS: '¡Sobrehumano!',
            rankS: '¡Maestro!',
            rankA: '¡Excelente!',
            rankB: '¡Bueno!',
            rankC: 'Promedio',
            rankD: 'Necesita Práctica',
            rankE: 'Fallo Épico'
        },
        contact: {
            title: 'Contáctanos',
            subtitle: 'No dudes en contactarnos si tienes alguna pregunta o solicitud',
            email: 'Correo Electrónico',
            support: 'Soporte',
            hours: 'Días laborables 9:00-18:00',
            optional: '(Opcional)',
            required: '(Requerido)',
            form: {
                name: 'Apodo',
                email: 'Dirección de Correo Electrónico',
                subject: 'Asunto',
                message: 'Mensaje',
                namePlaceholder: 'Juan Pérez',
                emailPlaceholder: 'ejemplo@email.com',
                subjectPlaceholder: 'Asunto de su consulta',
                messagePlaceholder: 'Por favor, ingrese su mensaje (requerido)',
                submit: 'Enviar Mensaje',
                success: '¡Tu mensaje ha sido enviado exitosamente. Gracias!',
                error: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
            }
        },
        footer: {
            tagline: 'Creando nuevas experiencias a través del juego',
            games: 'Juegos',
            info: 'Información',
            privacy: 'Política de Privacidad',
            copyright: '© 2025 GAME PORTAL. Todos los derechos reservados.'
        },
        privacy: {
            title: 'Política de Privacidad',
            intro: 'GAME PORTAL (en adelante, "este sitio") establece la siguiente Política de Privacidad (en adelante, "esta política") con respecto al manejo de la información personal de los usuarios.',
            section1: {
                title: '1. Recopilación y Propósito de la Información Personal',
                content: 'Este sitio no recopila información personal de los usuarios. La información ingresada en el formulario de contacto (nombre, dirección de correo electrónico y contenido de la consulta) se utilizará únicamente para responder a las consultas y mejorar nuestros servicios en el futuro.'
            },
            section2: {
                title: '2. Provisión de Información Personal a Terceros',
                content: 'Este sitio no proporcionará información personal de los usuarios a terceros, excepto cuando sea requerido por ley.'
            },
            section3: {
                title: '3. Acerca de las Cookies',
                content: 'Este sitio puede usar cookies para mejorar la experiencia del usuario. Las cookies son pequeños archivos de datos almacenados en su navegador y se utilizan para analizar el uso del sitio. Los usuarios pueden rechazar la aceptación de cookies a través de la configuración del navegador, pero algunas funciones pueden estar limitadas.'
            },
            section4: {
                title: '4. Acerca del Almacenamiento Local',
                content: 'Este sitio utiliza el almacenamiento local del navegador para guardar el progreso del juego, estadísticas y configuración de idioma. Esta información se almacena solo en su navegador y nunca se envía a servidores externos. La información almacenada en el almacenamiento local se puede eliminar en cualquier momento desde la configuración de su navegador.'
            },
            section5: {
                title: '5. Acerca de las Herramientas de Análisis',
                content: 'Este sitio puede usar herramientas de análisis como Google Analytics para comprender el uso del sitio. Estas herramientas recopilan información mediante cookies pero no incluyen información de identificación personal. Para obtener más detalles, consulte la política de privacidad de cada herramienta.'
            },
            section6: {
                title: '6. Descargo de Responsabilidad',
                content: 'Nos esforzamos por proporcionar información precisa en el contenido de este sitio, pero no garantizamos su exactitud o seguridad. No podemos ser responsables de ningún daño causado por el contenido publicado en este sitio. Además, no somos responsables de la información o servicios proporcionados por sitios accedidos a través de enlaces o banners desde este sitio.'
            },
            section7: {
                title: '7. Derechos de Autor y Derechos de Retrato',
                content: 'La reproducción no autorizada del texto y las imágenes publicadas en este sitio está prohibida. Este sitio no tiene la intención de infringir los derechos de autor o los derechos de retrato. Si hay algún problema con respecto a los derechos de autor o los derechos de retrato, póngase en contacto con nosotros a través del formulario de contacto. Responderemos de inmediato.'
            },
            section8: {
                title: '8. Cambios en la Política de Privacidad',
                content: 'Este sitio puede cambiar esta política sin previo aviso según lo requiera la ley o la necesidad. La política de privacidad revisada entrará en vigencia desde el momento en que se publique en este sitio.'
            },
            section9: {
                title: '9. Contacto',
                content: 'Para consultas sobre esta política, póngase en contacto con nosotros a través del formulario de contacto en este sitio.'
            },
            established: 'Establecido: 26 de noviembre de 2025',
            updated: 'Última actualización: 26 de noviembre de 2025',
            backHome: '← Volver al Inicio'
        }
    },
    fr: {
        nav: {
            games: 'Jeux',
            ranking: 'Classement Populaire',
            contact: 'Contact'
        },
        hero: {
            title: 'Les Jeux que Vous Voulez,<br>Sont Ici.',
            subtitle: 'Aucun Téléchargement Requis, Jouez Gratuitement Maintenant',
            cta: 'Commencer à Jouer'
        },
        common: {
            backHome: '← Retour à l\'Accueil',
            howToPlay: 'Comment Jouer · Règles',
            reset: 'Réinitialiser',
            close: 'Fermer',
            playAgain: 'Rejouer',
            gameOver: 'Jeu Terminé'
        },
        othello: {
            pageTitle: 'Othello - Portail de Jeux',
            title: '⚫⚪ Othello',
            selectMode: 'Sélectionner le Mode de Jeu',
            pvp: 'Joueur vs Joueur',
            pvc: 'Joueur vs Ordinateur',
            selectLevel: 'Sélectionner le Niveau CPU',
            level1: 'Niveau 1 (Aléatoire)',
            level2: 'Niveau 2 (Retournement Max)',
            level3: 'Niveau 3 (Évaluation)',
            rule1: '<strong>Objectif:</strong> Obtenir plus de pions sur le plateau que votre adversaire',
            rule2: '<strong>Placement:</strong> Placez votre pion pour encadrer les pions adverses',
            rule3: '<strong>Retournement:</strong> Tous les pions adverses encadrés deviennent vôtres',
            rule4: '<strong>Tours:</strong> Noir et blanc jouent à tour de rôle (noir commence)',
            rule5: '<strong>Passer:</strong> Passe automatiquement si aucun mouvement valide',
            rule6: '<strong>Fin:</strong> Le jeu se termine quand les deux joueurs passent',
            rule7: '<strong>Gagnant:</strong> Le joueur avec le plus de pions gagne',
            backToMode: 'Retour à la Sélection de Mode',
            blackScore: '⚫ Noir: <span id="finalBlackScore"></span>',
            whiteScore: '⚪ Blanc: <span id="finalWhiteScore"></span>',
            blackTurn: 'Tour des Noirs',
            whiteTurn: 'Tour des Blancs',
            whiteThinking: 'Tour des Blancs (Réflexion...)'
        },
        ludo: {
            pageTitle: 'Ludo - Portail de Jeux',
            title: '🎲 Ludo',
            gameSettings: 'Paramètres du Jeu',
            playerCount: 'Nombre de Joueurs',
            twoPlayers: '2 Joueurs',
            threePlayers: '3 Joueurs',
            fourPlayers: '4 Joueurs',
            playerSettings: 'Paramètres des Joueurs',
            gameRules: 'Règles du Jeu',
            requireSix: 'Besoin de 6 pour partir de la base',
            extraTurn: 'Tour supplémentaire en obtenant 6',
            exactRoll: 'Nombre exact nécessaire pour finir',
            showThinking: 'Afficher le temps de réflexion CPU',
            rule1: '<strong>Objectif:</strong> Amener les 4 pions à l\'arrivée',
            rule2: '<strong>Début:</strong> Obtenir un 6 pour sortir un pion de la base',
            rule3: '<strong>Mouvement:</strong> Avancer le pion du nombre du dé',
            rule4: '<strong>Capture:</strong> Atterrir sur un pion adverse le renvoie à la base',
            rule5: '<strong>Tour Extra:</strong> Obtenir 6 donne un autre tour',
            rule6: '<strong>Victoire:</strong> Le premier à amener tous les pions à l\'arrivée gagne',
            startGame: 'Commencer le Jeu',
            rollDice: 'Lancer les Dés',
            backToSettings: 'Retour aux Paramètres',
            gameLog: 'Journal du Jeu',
            gameFinished: '🎉 Jeu terminé!'
        },
        chess: {
            pageTitle: 'Échecs - Portail de Jeux',
            title: '♔♕ Échecs',
            selectMode: 'Sélectionner le Mode de Jeu',
            pvp: 'Joueur vs Joueur',
            pvc: 'Joueur vs Ordinateur',
            selectLevel: 'Sélectionner le Niveau CPU',
            level1: 'Niveau 1 (Aléatoire)',
            level2: 'Niveau 2 (Valeur des Pièces)',
            level3: 'Niveau 3 (Minimax)',
            rule1: '<strong>Objectif:</strong> Faire échec et mat au roi adverse',
            rule2: '<strong>Mouvement:</strong> Chaque pièce a sa manière spécifique de se déplacer',
            rule3: '<strong>Tours:</strong> Blanc et noir jouent à tour de rôle (blanc commence)',
            rule4: '<strong>Échec:</strong> État où le roi est attaqué',
            rule5: '<strong>Échec et Mat:</strong> Impossible d\'échapper à l\'échec, la partie est terminée',
            rule6: '<strong>Mouvements Spéciaux:</strong> Roque, prise en passant, promotion',
            rule7: '<strong>Match Nul:</strong> Pat ou répétition de positions',
            backToMode: 'Retour à la Sélection de Mode',
            whiteTurn: 'Tour des Blancs',
            blackTurn: 'Tour des Noirs',
            capturedWhite: 'Pièces blanches capturées:',
            capturedBlack: 'Pièces noires capturées:',
            moveHistory: 'Historique des Coups',
            promotion: 'Promotion du Pion',
            selectPromotion: 'Sélectionnez la pièce pour la promotion'
        },
        gomoku: {
            pageTitle: 'Gomoku - Portail de Jeux',
            title: '🎯 Gomoku',
            selectMode: 'Sélectionner le Mode de Jeu',
            pvp: 'Joueur vs Joueur',
            pvc: 'Joueur vs CPU',
            selectLevel: 'Sélectionner le Niveau CPU',
            level1: 'Niveau 1 (Aléatoire)',
            level2: 'Niveau 2 (Évaluation)',
            level3: 'Niveau 3 (Minimax)',
            rule1: '<strong>Objectif:</strong> Alignez 5 pierres verticalement, horizontalement ou en diagonale',
            rule2: '<strong>Placement:</strong> Placez les pierres à tour de rôle (Noir en premier)',
            rule3: '<strong>Victoire:</strong> Le premier à aligner 5 pierres gagne',
            rule4: '<strong>Tours:</strong> Noir et blanc alternent',
            rule5: '<strong>Match nul:</strong> Si le plateau se remplit sans gagnant',
            blackTurn: 'Tour des Noirs',
            whiteTurn: 'Tour des Blancs',
            moveCount: 'Coups:',
            backToMode: 'Retour à la Sélection du Mode'
        },
        memory: {
            pageTitle: 'Jeu de Mémoire - Portail de Jeux',
            title: '🃏 Jeu de Mémoire',
            selectMode: 'Sélectionner le Mode de Jeu',
            onePlayer: '1 Joueur',
            twoPlayers: '2 Joueurs',
            selectDifficulty: 'Sélectionner la Difficulté',
            easy: 'Facile (4×4)',
            normal: 'Normal (32 cartes)',
            hard: 'Difficile (52 cartes)',
            rule1: '<strong>Objectif :</strong> Trouver toutes les paires de cartes',
            rule2: '<strong>Comment Jouer :</strong> Retourner 2 cartes par tour',
            rule3: '<strong>Correspondance :</strong> Les cartes correspondantes restent visibles',
            rule4: '<strong>Non-correspondance :</strong> Les cartes non correspondantes se retournent',
            rule5: '<strong>Victoire :</strong> Terminer en trouvant toutes les paires',
            timer: 'Temps :',
            moves: 'Coups :',
            pairs: 'Paires :',
            player1: 'Joueur 1',
            player2: 'Joueur 2',
            turn: ' Tour de',
            backToMode: 'Retour à la Sélection du Mode',
            congratulations: 'Félicitations !',
            clearTime: 'Temps de Réussite :',
            totalMoves: 'Coups Totaux :',
            rank: 'Rang :',
            winner: 'Gagnant :',
            draw: 'Égalité',
            score: 'Score :'
        },
        games: {
            title: 'Nos Jeux',
            subtitle: 'Bienvenue dans le monde des jeux classiques où vous pouvez approfondir votre réflexion et profiter de la stratégie',
            othello: {
                tag: 'Jeu de Stratégie',
                title: 'Othello',
                description: 'Un jeu stratégique utilisant des pions noirs et blancs. Un jeu de société aimé dans le monde entier avec des règles simples mais un gameplay stratégique profond. Encadrez les pions adverses pour les retourner et dominer le plateau.',
                players: '👥 2 Joueurs',
                duration: '⏱️ 15-30 min'
            },
            ludo: {
                tag: 'Jeu de Plateau',
                title: 'Ludo',
                description: 'Lancez le dé et déplacez vos pièces dans ce jeu de chance et de stratégie. Jouez jusqu\'a 4 joueurs et amusez-vous en famille et entre amis. Le gameplay simple mais imprévisible est son charme.',
                players: '👥 2-4 Joueurs',
                duration: '⏱️ 20-40 min'
            },
            chess: {
                tag: 'Jeu de Stratégie',
                title: 'Échecs',
                description: 'Le jeu de société stratégique le plus célèbre au monde. Utilisez 6 types de pièces dont le Roi, la Reine et la Tour pour faire échec et mat au Roi adverse dans cette bataille intellectuelle.',
                players: '👥 2 Joueurs',
                duration: '⏱️ 30-60 min'
            },
            gomoku: {
                tag: 'Jeu de Stratégie',
                title: 'Gomoku',
                description: 'Un jeu stratégique sur un plateau 15×15 où le but est d’aligner 5 pierres. Simple mais profond, il teste votre capacité d’anticipation. Un jeu de plateau traditionnel agréable pour les débutants et les experts.',
                players: '👥 2 Joueurs',
                duration: '⏱️ 10-20 min'
            },
            memory: {
                tag: 'Jeu de Mémoire',
                title: 'Jeu de Mémoire',
                description: 'Un jeu de mémoire où vous retournez des cartes pour trouver des paires correspondantes. Un jeu amusant qui entraîne la concentration et la mémoire. Profitez des modes solo et deux joueurs.',
                players: '👥 1-2 Joueurs',
                duration: '⏱️ 5-15 min'
            },
            stopwatch: {
                tag: 'Jeu de Timing',
                title: 'Défi Chronomètre',
                description: 'Jeu de timing où vous arrêtez le chronomètre au temps cible exact. Concourez pour l\'erreur la plus petite en 3 tours. Un jeu de défi court qui teste concentration et sensation.',
                players: '👥 1 Joueur',
                duration: '⏱️ 1 min'
            },
            playBtn: 'Jouer Maintenant →'
        },
        stopwatch: {
            title: '⏱️ Défi Chronomètre',
            subtitle: 'Arrêtez au temps cible exact!',
            selectMode: 'Sélectionner le Mode',
            normalMode: 'Mode Normal',
            normalModeDesc: 'Temps visible',
            blindMode: 'Mode Aveugle',
            blindModeDesc: 'Temps caché',
            rulesTitle: 'Règles',
            rule1: '3 tours (3 sec, 5 sec, 10 sec)',
            rule2: 'Appuyez sur Démarrer pour commencer le chronométrage',
            rule3: 'Appuyez sur Arrêter au temps cible',
            rule4: 'Moins d\'erreur = rang plus élevé',
            rule5: 'Rang final basé sur l\'erreur totale',
            startGame: 'Commencer le Jeu',
            turn: 'Tour',
            target: 'Cible',
            elapsed: 'Temps Enregistré',
            seconds: 'sec',
            start: 'Démarrer',
            stop: 'Arrêter',
            reset: 'Réinitialiser',
            nextTurn: 'Tour Suivant',
            result: 'Résultat',
            error: 'Erreur',
            rank: 'Rang',
            totalError: 'Erreur Totale',
            finalRank: 'Rang Final',
            finalResultTitle: 'Résultat Final',
            playAgain: 'Rejouer',
            backHome: 'Retour à l\'Accueil',
            waiting: 'En Attente',
            measuring: 'En Mesure',
            stopped: 'Arrêté',
            rankSSS: 'Divin!',
            rankSS: 'Surhumain!',
            rankS: 'Maître!',
            rankA: 'Excellent!',
            rankB: 'Bien!',
            rankC: 'Moyen',
            rankD: 'Besoin de Pratique',
            rankE: 'Échec Épique'
        },
        contact: {
            title: 'Contactez-nous',
            subtitle: 'N\'hésitez pas à nous contacter si vous avez des questions ou des demandes',
            email: 'Email',
            support: 'Support',
            hours: 'Jours ouvrables 9:00-18:00',
            optional: '(Facultatif)',
            required: '(Requis)',
            form: {
                name: 'Pseudo',
                email: 'Adresse Email',
                subject: 'Sujet',
                message: 'Message',
                namePlaceholder: 'Jean Dupont',
                emailPlaceholder: 'exemple@email.com',
                subjectPlaceholder: 'Sujet de votre demande',
                messagePlaceholder: 'Veuillez saisir votre message (requis)',
                submit: 'Envoyer le Message',
                success: 'Votre message a été envoyé avec succès. Merci!',
                error: 'Échec de l\'envoi du message. Veuillez réessayer.'
            }
        },
        footer: {
            tagline: 'Créer de nouvelles expériences par le jeu',
            games: 'Jeux',
            info: 'Information',
            privacy: 'Politique de Confidentialité',
            copyright: '© 2025 GAME PORTAL. Tous droits réservés.'
        },
        privacy: {
            title: 'Politique de Confidentialité',
            intro: 'GAME PORTAL (ci-après dénommé "ce site") établit la Politique de Confidentialité suivante (ci-après dénommée "cette politique") concernant le traitement des informations personnelles des utilisateurs.',
            section1: {
                title: '1. Collecte et Objectif des Informations Personnelles',
                content: 'Ce site ne collecte pas d\'informations personnelles auprès des utilisateurs. Les informations saisies dans le formulaire de contact (nom, adresse e-mail et contenu de la demande) seront utilisées uniquement pour répondre aux demandes et améliorer nos services à l\'avenir.'
            },
            section2: {
                title: '2. Fourniture d\'Informations Personnelles à des Tiers',
                content: 'Ce site ne fournira pas les informations personnelles des utilisateurs à des tiers, sauf si la loi l\'exige.'
            },
            section3: {
                title: '3. À Propos des Cookies',
                content: 'Ce site peut utiliser des cookies pour améliorer l\'expérience utilisateur. Les cookies sont de petits fichiers de données stockés dans votre navigateur et utilisés pour analyser l\'utilisation du site. Les utilisateurs peuvent refuser l\'acceptation des cookies via les paramètres du navigateur, mais certaines fonctionnalités peuvent être limitées.'
            },
            section4: {
                title: '4. À Propos du Stockage Local',
                content: 'Ce site utilise le stockage local du navigateur pour enregistrer la progression du jeu, les statistiques et les paramètres de langue. Ces informations sont stockées uniquement dans votre navigateur et ne sont jamais envoyées à des serveurs externes. Les informations stockées dans le stockage local peuvent être supprimées à tout moment depuis les paramètres de votre navigateur.'
            },
            section5: {
                title: '5. À Propos des Outils d\'Analyse',
                content: 'Ce site peut utiliser des outils d\'analyse tels que Google Analytics pour comprendre l\'utilisation du site. Ces outils collectent des informations à l\'aide de cookies mais n\'incluent pas d\'informations personnellement identifiables. Pour plus de détails, veuillez consulter la politique de confidentialité de chaque outil.'
            },
            section6: {
                title: '6. Clause de Non-Responsabilité',
                content: 'Nous nous efforçons de fournir des informations précises dans le contenu de ce site, mais nous ne garantissons pas son exactitude ou sa sécurité. Nous ne pouvons être tenus responsables de tout dommage causé par le contenu publié sur ce site. De plus, nous ne sommes pas responsables des informations ou services fournis par les sites accessibles via des liens ou des bannières depuis ce site.'
            },
            section7: {
                title: '7. Droits d\'Auteur et Droits à l\'Image',
                content: 'La reproduction non autorisée du texte et des images publiés sur ce site est interdite. Ce site n\'a pas l\'intention de porter atteinte aux droits d\'auteur ou aux droits à l\'image. S\'il y a des problèmes concernant les droits d\'auteur ou les droits à l\'image, veuillez nous contacter via le formulaire de contact. Nous répondrons rapidement.'
            },
            section8: {
                title: '8. Modifications de la Politique de Confidentialité',
                content: 'Ce site peut modifier cette politique sans préavis selon les exigences de la loi ou la nécessité. La politique de confidentialité révisée entrera en vigueur au moment de sa publication sur ce site.'
            },
            section9: {
                title: '9. Contact',
                content: 'Pour toute question concernant cette politique, veuillez nous contacter via le formulaire de contact sur ce site.'
            },
            established: 'Établi : 26 novembre 2025',
            updated: 'Dernière mise à jour : 26 novembre 2025',
            backHome: '← Retour à l\'Accueil'
        }
    }
};

// 現在の言語を取得（デフォルトは日本語）
let currentLanguage = localStorage.getItem('language') || 'ja';

// ページ読み込み時に言語を適用
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLanguage);
    updateLanguageButton();
    
    // 言語ボタンのクリックイベント
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        
        // ドロップダウン外をクリックしたら閉じる
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });
    }
});

// 言語を変更する関数
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    updateLanguageButton();
    
    // ランキング表示を更新
    if (typeof renderRankingSection === 'function') {
        renderRankingSection();
    }
    
    // ハンバーガーメニューを閉じる
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// 言語を適用する関数
function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // プレースホルダー専用の翻訳を適用
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations[lang], key);
        
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // HTML lang属性を更新
    document.documentElement.lang = lang;
}

// ネストされた翻訳を取得
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// 言語ボタンのテキストを更新
function updateLanguageButton() {
    const langBtn = document.getElementById('langBtn');
    if (!langBtn) return;
    
    const langNames = {
        ja: '🌐 日本語',
        en: '🌐 English',
        zh: '🌐 中文',
        hi: '🌐 हिन्दी',
        es: '🌐 Español',
        fr: '🌐 Français'
    };
    
    langBtn.textContent = langNames[currentLanguage] || '🌐 日本語';
}
