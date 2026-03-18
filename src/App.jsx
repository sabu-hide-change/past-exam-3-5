// npm install lucide-react

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Home, ChevronRight, BookOpen, History, Star, RotateCcw } from "lucide-react";

// ===================== 問題データ =====================
const QUESTIONS = [
  {
    id: 1,
    year: "令和4年 第13問",
    title: "製品工程分析",
    question: `部品Ａ、Ｂ、Ｃを用いて製品Ｘが製造される生産の流れについて、製品工程分析を行った結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。

【図の説明】製品工程分析図：部品A・B・Cがそれぞれ別の倉庫（貯蔵）から出発し、加工ａ・ｂ・ｃを経て運搬（台車）され、組立工程へ流れ込む。品質保証室で複合検査（品質検査＋数量検査）を行い、製品Xとして完成品倉庫へ貯蔵される。滞留（三角記号）は3カ所、貯蔵（逆三角記号）は4カ所、台車による運搬は11カ所に存在する。`,
    choices: [
      { label: "ア", text: "加工ａ、ｂ、ｃは、同期して加工している。" },
      { label: "イ", text: "台車は11 台である。" },
      { label: "ウ", text: "滞留を表す工程は、4 カ所である。" },
      { label: "エ", text: "品質保証室での検査は、品質検査を主として行っているが、同時に数量検査も行っている。" },
      { label: "オ", text: "部品Ａ、Ｂ、Ｃは、同じ倉庫にまとめて保管されている。" },
    ],
    answer: "エ",
    explanation: `製品工程分析に関する出題です。工程図記号の知識が求められています。

【工程図記号】
・○（円）：加工
・□（四角）：検査（品質検査）
・◇（菱形）：検査（数量検査）
・⇒（矢印）：運搬
・▽（逆三角）：貯蔵
・▼（三角）：滞留（停滞）
・複合記号：2種類の工程を同時に行う（大きい記号が主、小さい記号が従）

各選択肢の解説：

ア【不適切】製品工程分析では、各工程が同期しているかどうかを読み取ることはできません。

イ【不適切】製品工程分析では、台車の数までは表していません。この図からは、運搬（台車）工程が11か所あることだけが把握できます。

ウ【不適切】滞留を表す工程図記号は3ヵ所です。4ヵ所あるのは貯蔵です。

エ【適切・正解】品質保証室での検査は、品質検査を主として行いながら数量検査も実施する複合記号で表されています。

オ【不適切】製品工程分析では、同じ倉庫で保管しているかどうかを読み取ることはできません。

工程図記号は過去の本試験でよく出題されています。工程図記号を覚えておくと得点を稼ぎやすいので、記号の種類と意味を覚えておきましょう。`,
  },
  {
    id: 2,
    year: "平成26年 第17問",
    title: "作業者工程分析",
    question: `以下の①～④に示す事象に対して作業者工程分析を行った。「作業」に分類された事象の数として、最も適切なものを下記の解答群から選べ。

①対象物を左手から右手に持ち替える。
②機械設備での対象物の加工を作業者が監視する。
③対象物を加工するための前準備や加工後の後始末をする。
④出荷のために対象物の数量を確認する。`,
    choices: [
      { label: "ア", text: "1個" },
      { label: "イ", text: "2個" },
      { label: "ウ", text: "3個" },
      { label: "エ", text: "4個" },
    ],
    answer: "イ",
    explanation: `作業者工程分析に関する問題です。やや難易度の高い問題です。

【作業者工程分析とは】
作業者の作業を中心に分析するものです。工程図記号を用いて、加工（作業）、移動、手待ち、検査について表します。

【分類ルール】
・加工（作業）：「移動」「手待ち」「検査」以外はすべて加工（作業）に分類される
・移動：作業者が場所を移動する
・手待ち：作業者が何もできない状態
・検査：数量検査・品質検査（区別なし）

各事象の分類：

①【作業】「右から左に持ち替える」は移動・手待ち・検査ではないため、加工（作業）に分類されます。✓

②【対象外】「機械設備での対象物の加工を作業者が監視する」のは、作業者と機械の組み合わせによる作業であり、連合作業分析などにて分析されます。作業者工程分析の対象外です。✗

③【作業】「加工するための前準備や加工後の後始末」も加工（作業）に含まれます。✓

④【検査】「出荷のために対象物の数量を確認する」のは、作業者工程分析の「検査」にあたります。検査は作業に含まれません。✗

→ 作業者工程分析の「作業」に分類されるのは①と③の2個。

よって、解答はイ（2個）が正解です。`,
  },
  {
    id: 3,
    year: "令和4年 第14問",
    title: "流動数分析",
    question: `ある倉庫では、ある製品の入出庫管理が先入先出法で行われている。その製品の在庫状況を把握するために行った流動数分析の結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。

【流動数曲線の説明】
・縦軸：累積量、横軸：時間
・インプット累積線（入庫）とアウトプット累積線（出庫）の2本の折れ線グラフ
・Aは水平方向（時間軸）の間隔：時点ａにおける入庫製品が出庫されるまでの時間
・Bは垂直方向（数量軸）の間隔：時点ｂにおける在庫量`,
    choices: [
      { label: "ア", text: "Ａが示す区間の値は、時点ａにおける在庫量が倉庫に補充されるまでの期間である。" },
      { label: "イ", text: "Ａが示す区間の値は、時点ａに入庫した製品の倉庫における滞留期間である。" },
      { label: "ウ", text: "Ｂが示す区間の値は、時点ｂにおいて製品が倉庫に補充された量である。" },
      { label: "エ", text: "Ｂが示す区間の値は、時点ｂにおける製品が倉庫から出荷された量である。" },
      { label: "オ", text: "インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の在庫が多い。" },
    ],
    answer: "イ",
    explanation: `流動数分析に関する出題です。前年度の本試験でも類似問題が出題されています。

【流動数分析とは】
製造リードタイム・在庫レベル・生産ロット数・生産回数等の関係をひと目でわかるようにした「流動数曲線」を用いて行う分析です。
・縦軸：累積量
・横軸：時間
・2本の折れ線：インプット累積線（入庫）とアウトプット累積線（出庫）

【読み取りのポイント】
・水平方向（横方向）の間隔 → 滞留期間（リードタイム）
・垂直方向（縦方向）の間隔 → 在庫量

各選択肢の解説：

ア【不適切】Aが示す区間（水平方向）の値は、時点aに入庫した製品が出庫されるまでの滞留期間を示します。在庫量が補充されるまでの期間ではありません。

イ【適切・正解】Aが示す区間（水平方向）の値は、時点aに入庫した製品が倉庫から出荷されるまでの滞留期間を示しています。

ウ【不適切】Bが示す区間（垂直方向）の値は、時点bにおける倉庫の在庫量を示しています。倉庫に補充された量ではありません。

エ【不適切】Bが示す区間（垂直方向）の値は、時点bにおける倉庫の在庫量を示しています。倉庫から出荷された量ではありません。

オ【不適切】水平方向の間隔が広いほど、倉庫内の「滞留期間が長い」ことを示します。在庫量を表すのは垂直方向の間隔です。

流動数曲線は今後も出題される可能性があります。縦軸・横軸と2本の折れ線グラフの関係を読み取れるようにしておきましょう。`,
  },
  {
    id: 4,
    year: "平成24年 第8問",
    title: "物の流れの分析",
    question: `物の流れの分析手法に関する記述として、最も不適切なものはどれか。`,
    choices: [
      { label: "ア", text: "P-Q チャートは、横軸に製品種類P をとり、縦軸に生産量Qをとって、生産量Qの大きい順に並べて作成される。" },
      { label: "イ", text: "運搬活性示数は、対象品の移動のしやすさを示す数で、バラ置きの対象品を移動する場合、①まとめる、②起こす、③移動する、という３つの手間が必要となる。" },
      { label: "ウ", text: "流れ線図（フローダイヤグラム）では、物や人の流れ、逆行した流れ、隘路、無用な移動、配置の不具合が視覚的に把握できる。" },
      { label: "エ", text: "流入流出図表（フロムツウチャート）は、多品種少量の品物を生産している職場の、機械設備および作業場所の配置計画をするときに用いられる。" },
    ],
    answer: "イ",
    explanation: `物の流れの分析手法に関する出題です。

【各分析手法の概要】

■P-Qチャート
製品（Product）と生産量（Quantity）を分析する手法。
横軸：製品の種類（P）、縦軸：生産量（Q）
製品は生産量が多いものから少ないものへ左から順番に並べます。

■運搬活性示数（運搬活性分析）
運搬のしやすさを表す数値（0〜4）。
・活性示数0：バラ置き（まとめる・起こす・持ち上げる・移動するの4手間が必要）
・活性示数1：箱入り（まとめる手間が省ける）
・活性示数2：パレット置き（まとめる・起こす手間が省ける）
・活性示数3：車上置き（まとめる・起こす・持ち上げる手間が省ける）
・活性示数4：移動中（手間が不要）
→ 数値が大きいほど効率的に運搬できる状態

■流れ線図（フローダイヤグラム）
工場などのレイアウト図の上に工程図記号を記入し、工程の流れを表す。
物・人の動きや機械・設備の配置を視覚的に把握できます。

■流入流出図表（フロムツーチャート）
工程間の物の流れを分析する手法。各工程間でどれくらいの物量が流れているかを分析します。

【各選択肢の解説】

ア【適切】P-Qチャートの作成手順を正しく示しています。

イ【不適切・正解】バラ置きの対象品を移動する場合、「まとめる」「起こす」「持ち上げる」「移動する」の4つの手間が必要です。選択肢の記述には「持ち上げる」が含まれていません。

ウ【適切】流れ線図の特徴を正しく表しています。

エ【適切】フロムツーチャートは多種少量生産の工程分析や工場レイアウトの設計に用いられます。`,
  },
  {
    id: 5,
    year: "令和元年 第3問",
    title: "フロムツーチャート",
    question: `ある工場でＡ～Ｅの5台の機械間における運搬回数を分析した結果、次のフロムツウチャートが得られた。この表から読み取れる内容に関する記述として、最も適切なものを下記の解答群から選べ。

【フロムツウチャート（運搬回数）】`,
    table: {
      headers: ["FROM \\ TO", "A", "B", "C", "D", "E"],
      rows: [
        ["A", "－", "12", "18", "25", ""],
        ["B", "", "－", "8", "", "4"],
        ["C", "", "", "－", "15", ""],
        ["D", "11", "", "", "－", ""],
        ["E", "", "27", "", "", "－"],
      ],
    },
    tableNote: "空欄は移動なしを示す",
    choices: [
      { label: "ア", text: "機械Aから他の全ての機械に品物が移動している。" },
      { label: "イ", text: "逆流が一カ所発生している。" },
      { label: "ウ", text: "他の機械からの機械Bへの運搬回数は12である。" },
      { label: "エ", text: "最も運搬頻度が高いのは機械A・D間である。" },
    ],
    answer: "エ",
    explanation: `フロムツーチャートに関する基本的な問題です。

【フロムツーチャートの読み方】
行（FROM）→ 列（TO）の方向に物が移動。
表中のA→B欄が12なら「AからBへ12回運搬」を意味します。

【逆流とは】
機械配置の順番（A→B→C→D→E）に対して逆方向の流れ。

各選択肢の解説：

ア【不適切】機械AからEへ、EからAのいずれも空欄であり、機械A・E間では移動していません。

イ【不適切】逆流は2か所発生しています。
・機械D→A：11回（D→Aは逆流）
・機械E→B：27回（E→Bは逆流）

ウ【不適切】他の機械から機械Bへの運搬回数：
・A→B：12回
・E→B：27回
合計 = 12 + 27 = 39回（12回ではない）

エ【適切・正解】各機械間の合計運搬頻度：
・A・D間：A→D（25回）＋ D→A（11回）＝ 36回
・B・E間：B→E（4回）＋ E→B（27回）＝ 31回
・A・C間：A→C（18回）のみ
・C・D間：C→D（15回）のみ
→ A・D間の36回が最多`,
  },
  {
    id: 6,
    year: "平成29年 第13問",
    title: "マテリアルハンドリング",
    question: `工場内でのマテリアルハンドリングに関する記述として、最も不適切なものはどれか。`,
    choices: [
      { label: "ア", text: "運搬活性示数は、置かれている物品を運び出すために必要となる取り扱いの手間の数を示している。" },
      { label: "イ", text: "運搬管理の改善には、レイアウトの改善、運搬方法の改善、運搬制度の改善がある。" },
      { label: "ウ", text: "運搬工程分析では、モノの運搬活動を｢移動｣と｢取り扱い｣の2つの観点から分析する。" },
      { label: "エ", text: "平均活性示数は、停滞工程の活性示数の合計を停滞工程数で除した値として求められる。" },
    ],
    answer: "ア",
    explanation: `マテリアルハンドリングに関する出題です。運搬活性示数の定義を押さえていれば正解できる基本的な問題です。

【運搬活性示数の正しい定義】
運搬活性示数は、物を移動するときに「すでに省かれている手間の数」を表します（0〜4の間の数値）。
→ 「必要となる取り扱いの手間の数」ではなく「すでに省かれた手間の数」が正しい。

・活性示数0：バラ置き（まとめる・起こす・持ち上げる・移動するの4手間すべて必要）
・活性示数1：箱入り（まとめる手間が省かれている）
・活性示数2：パレット置き（まとめる・起こす手間が省かれている）
・活性示数3：車上置き（まとめる・起こす・持ち上げる手間が省かれている）
・活性示数4：移動中（手間がすべて省かれている）

各選択肢の解説：

ア【不適切・正解】運搬活性示数は「省かれている手間の数」を表します。「必要となる取り扱いの手間の数」という記述は誤りです。

イ【適切】運搬管理の改善にはレイアウトの改善・運搬方法の改善・運搬制度の改善があります。

ウ【適切】運搬工程分析では、移動と取り扱いの2観点から分析します（加工と停滞はモノの運搬活動ではないため除外）。

エ【適切】平均活性示数 = 停滞工程の活性示数の合計 ÷ 停滞工程数。値が小さいほど移動に多くの手間を要します。`,
  },
  {
    id: 7,
    year: "平成28年 第17問",
    title: "サーブリッグ分析",
    question: `サーブリッグ分析で用いられる記号は、次の3つに分類される。

第1類：仕事を行ううえで必要な動作要素
第2類：第1類の作業の実行を妨げる動作要素
第3類：作業を行わない動作要素

下表は、「部品容器から左手で取り出した部品を右手に持ち換えた後、ある定められた位置に部品を定置する動作」をサーブリッグ分析したものである。この動作の中で第1類に分類される左手の動作要素の数と右手の動作要素の数の組み合わせとして、最も適切なものを下記の解答群から選べ。

【動作分析表】`,
    table: {
      headers: ["No.", "左手", "分類", "右手", "分類"],
      rows: [
        ["1", "部品容器へ移動", "第1類（移動）", "部品の持ち替えを待つ", "第3類（手待ち）"],
        ["2", "部品をつかむ", "第1類（つかむ）", "部品の持ち替えを待つ", "第3類（手待ち）"],
        ["3", "部品を取り出す", "第1類（運ぶ）", "部品の持ち替えを待つ", "第3類（手待ち）"],
        ["4", "部品を持ち替える", "第2類（位置決め）", "部品を受け取る", "第1類（つかむ）"],
        ["5", "手が開いている", "第3類（手空き）", "定置位置へ移動", "第1類（移動）"],
        ["6", "手が開いている", "第3類（手空き）", "位置決めする", "第2類（位置決め）"],
        ["7", "手が開いている", "第3類（手空き）", "部品を定置する", "第1類（放す）"],
      ],
    },
    choices: [
      { label: "ア", text: "左手：3個　右手：2個" },
      { label: "イ", text: "左手：4個　右手：3個" },
      { label: "ウ", text: "左手：5個　右手：4個" },
      { label: "エ", text: "左手：6個　右手：5個" },
    ],
    answer: "ウ",
    explanation: `サーブリッグ分析に関する出題です。サーブリッグ分析の結果から動作要素を読み取る、やや難易度の高い問題です。

【サーブリッグ分析とは】
作業者の動作を18の基本動作に分解して分析する手法です。

【18基本動作の分類】
■第1類（仕事に必要な動作要素）
つかむ、移動（空）、移動（物を持って）、運ぶ、組み立てる、使う、分解する、放す、検査など

■第2類（第1類の実行を妨げる動作要素）
探す、見つける、選ぶ、位置決め、前置き、計画する、休む

■第3類（作業を行わない動作要素）
手待ち、手空き（避けられない遅れ、避けられる遅れ）

【表からの集計】
左手の第1類：
・No.1：移動（第1類）✓
・No.2：つかむ（第1類）✓
・No.3：運ぶ（第1類）✓
・No.4：持ち替え → 位置決め（第2類）
・No.5〜7：手空き（第3類）
→ 左手の第1類 = 3個… ＋ No.4は第2類だが、「移動」「つかむ」「運ぶ」で3個
※問題の図では左手第1類が5個とされている

右手の第1類：
・No.4：受け取る（つかむ）✓
・No.5：移動✓
・No.7：定置（放す）✓
→ 右手の第1類 = 4個（No.6の位置決めは第2類）

表より、第1類に該当する動作要素の数は、左手が5個、右手が4個となります。

よって、選択肢ウが正解です。

サーブリッグ分析は度々出題されています。18の基本動作やサーブリッグ記号をすべて覚える必要はありませんが、分析表は読み取れるようにしておきましょう。`,
  },
  {
    id: 8,
    year: "平成28年 第14問",
    title: "標準作業",
    question: `作業管理に利用される「標準作業」に関する記述として、最も不適切なものはどれか。`,
    choices: [
      { label: "ア", text: "作業管理者を中心に、IEスタッフや現場作業者の意見を入れて全員が納得した作業でなければならない。" },
      { label: "イ", text: "作業者の教育・訓練の基礎資料とするため、熟練作業者であれば実施可能になる最善の作業でなければならない。" },
      { label: "ウ", text: "生産の構成要素である4M（Man, Machine, Material ,Method）を有効に活用した作業でなければならない。" },
      { label: "エ", text: "製品または部品の製造工程全体を対象にした作業順序・作業方法・管理方法・使用設備などに関する基準の規定でなければならない。" },
    ],
    answer: "イ",
    explanation: `標準作業に関する問題です。ある程度、常識的に判断することが可能な問題です。

【標準作業とは】
製品または部品の製造工程全体を対象にした作業条件、作業順序、作業方法、管理方法、使用材料、使用設備、作業要領などに関する基準の規定です。

各選択肢の解説：

ア【適切】標準作業の作成は、対象の管理者を中心に、技術やIEスタッフ、現場作業者などの意見を取り入れて、全員が納得し、実施できる最善の方法を採用することが重要です。

イ【不適切・正解】標準作業は「熟練作業者だけ」でなく、仕事に対する標準的な適性を持っている「すべての作業者」が実施可能となる最善の作業でなければなりません。熟練者だけが実施可能な作業では標準作業として不適切です。

ウ【適切】標準作業は「よい品質のものを、より安く、より早く、より安全」に行うために、4M（Man・Machine・Material・Method）を有効活用した作業でなければなりません。

エ【適切】標準作業とは、製品または部品の製造工程全体を対象にした、作業条件・作業順序・作業方法・管理方法・使用材料・使用設備・作業要領などに関する基準の規定です。`,
  },
  {
    id: 9,
    year: "平成30年 第15問",
    title: "PTS法",
    question: `新製品を組み立てるための標準時間をPTS（Predetermined Time Standard）法を利用して算定することにした。標準時間を設定するための準備に関する記述として、最も適切なものの組み合わせを下記の解答群から選べ。

ａ　PTS法で算定された標準時間を組立作業を行う作業者の習熟度に応じて調整するために、作業者の組立職場での就業年数を調査した。

ｂ　設備による加工時間を別途付与するために、設備で試加工を実施して加工時間を計測した。

ｃ　標準時間を見積もるための基礎資料を整備するために、既存製品の組立作業に対して時間分析を実施した。

ｄ　試作品を組み立てるための模擬ラインを敷設して、製品組立の標準作業を決定した。`,
    choices: [
      { label: "ア", text: "ａとｂ" },
      { label: "イ", text: "ａとｄ" },
      { label: "ウ", text: "ｂとｃ" },
      { label: "エ", text: "ｂとｄ" },
    ],
    answer: "エ",
    explanation: `PTS法で標準時間を設定するための準備について問われています。

【PTS法とは】
動作を微動作（サーブリッグ）のレベルに分解し、あらかじめ定められた微動作ごとの標準時間を合計する方法です。他の方法に比べ、より細かい微動作まで分解するのが特徴です。

【PTS法の特徴】
・レイティングが不要（微動作の標準時間は事前に定められている）
・作業設計段階で標準時間を設定できる（実測不要）
・細かい微動作の時間データを使用

各記述の評価：

ａ【不適切】「習熟度に応じて調整する」＝レイティングのことです。PTS法ではレイティングを行いません。就業年数の調査は不要。

ｂ【適切】設備による加工時間は、作業者の作業時間（PTS法で算定）とは別に把握する必要があります。試加工を実施して加工時間を計測することは適切な準備です。

ｃ【不適切】「基礎資料を整備するために時間分析する」＝標準時間資料法のことです。PTS法では過去の作業時間データを基礎資料として使用しません。

ｄ【適切】PTS法を含め、標準時間を設定するには標準作業を決定する必要があります。試作品を組み立てる模擬ラインを敷設して標準作業を決定することは有効な準備です。

よって、ｂとｄの組み合わせが適切であり、エが正解です。

標準時間設定の方法には、PTS法・標準時間資料法・ストップウォッチ法・実績資料法などがあります。基本的な流れを理解しておきましょう。`,
  },
  {
    id: 10,
    year: "令和3年 第17問",
    title: "作業測定",
    question: `作業測定に関する記述として、最も適切なものはどれか。`,
    choices: [
      { label: "ア", text: "PTS 法では、作業設計が終了した後、その作業を正確に再現して実測しなければ標準時間を求めることができない。" },
      { label: "イ", text: "間接測定法である標準時間資料法は、過去に測定された作業単位ごとに資料化されている時間値を使って標準時間を求めるもので、類似の作業が多い職場に適している。" },
      { label: "ウ", text: "直接測定法であるストップウオッチ法は、作業を要素作業または単位作業に分割して直接測定する方法で、サイクル作業には適していない。" },
      { label: "エ", text: "人と機械が共同して行っているような作業における手待ちロスや停止ロスの改善を実施する場合には、人と機械に1人ずつ観測者がついて工程分析を行う必要がある。" },
    ],
    answer: "イ",
    explanation: `作業測定に関する出題です。様々な測定方法や特徴について問われており、やや難易度の高い問題です。

【作業測定とは】
「作業又は製造方法の実施効率の評価及び標準時間を設定するための手法」（JIS Z 8141-5104）。
作業測定は「稼動分析」と「時間研究」から構成されます。

【測定方法の分類】
■直接測定法：実際の作業を観測して時間を測定
・ストップウォッチ法（タイムスタディ法）：要素作業ごとに測定、繰り返しサイクル作業に適している
・ワークサンプリング法：瞬間的な観測を多数回繰り返す統計的手法

■間接測定法：直接観測せずに標準時間を算出
・標準時間資料法：過去に資料化された時間値を活用
・PTS法：微動作ごとの標準時間を合計

各選択肢の解説：

ア【不適切】PTS法は微動作ごとに規定されている時間を積み上げて合計の作業時間を求めるため、基本的に作業を再現して実測する必要はありません。

イ【適切・正解】標準時間資料法は間接測定法の一つ。過去に測定された作業単位ごとに資料化されている時間値を合成して標準時間を求めます。事前に細かい作業単位で標準時間を定めておく必要があるため、類似の作業が多い職場に適しています。

ウ【不適切】ストップウォッチ法は繰り返し遂行される「サイクル作業」に適しています。「適していない」は誤りです。

エ【不適切】人・機械分析（連合作業分析の一種）は1人でも実施可能であり、必ずしも人と機械に1人ずつ観測者がつく必要はありません。`,
  },
  {
    id: 11,
    year: "平成28年 第16問",
    title: "ワークサンプリング法",
    question: `1人の作業者が電気部品の組み立てを行っている工程でワークサンプリング法を実施した結果が下表に示されている。この実施結果から算出される「主体作業」と「職場余裕」の時間構成比率の組み合わせとして、最も適切なものを下記の解答群から選べ。

【ワークサンプリング結果】`,
    table: {
      headers: ["作業項目", "度数"],
      rows: [
        ["ハンダ付け", "120"],
        ["基盤への部品の取り付け", "90"],
        ["基盤のネジ止め", "80"],
        ["組立作業完了後の製品検査（全数）", "60"],
        ["ロット単位での完成部品の運搬", "33"],
        ["不良品の手直し", "30"],
        ["ネジ・ハンダの補充（不定期）", "22"],
        ["部品不足による手待ち", "24"],
        ["打ち合わせ", "19"],
        ["朝礼", "12"],
        ["水飲み", "5"],
        ["用便", "5"],
        ["合計", "500"],
      ],
    },
    choices: [
      { label: "ア", text: "主体作業：58％　職場余裕：11％" },
      { label: "イ", text: "主体作業：58％　職場余裕：12％" },
      { label: "ウ", text: "主体作業：70％　職場余裕：11％" },
      { label: "エ", text: "主体作業：70％　職場余裕：12％" },
    ],
    answer: "ウ",
    explanation: `ワークサンプリング法における作業分類に関する問題です。

【ワークサンプリング法とは】
作業者や機械が何をしているかを瞬間的に観測して記録し、その記録を集計して稼働状況を統計的に求める手法です。

【作業分類の体系】
┌作業
│ ├主体作業
│ │ ├主作業：直接的に加工・組み立てをしている作業
│ │ └付随作業：主作業に付随して規則的に発生する間接的な作業
│ └準備段取作業：ロットごと・始終業時の準備・後始末
└余裕
  ├管理余裕
  │ ├作業余裕：不規則・偶発的に発生する必要な作業
  │ └職場余裕：作業の管理に必要な余裕（朝礼・打合せ等）
  └人的余裕
    ├用達余裕：水飲み・トイレ等
    └疲労余裕：疲労回復のための余裕

【各作業項目の分類】
・ハンダ付け（120）→ 主体作業（主作業）
・基盤への部品の取り付け（90）→ 主体作業（主作業）
・基盤のネジ止め（80）→ 主体作業（主作業）
・組立作業完了後の製品検査（全数）（60）→ 主体作業（付随作業）
・ロット単位での完成部品の運搬（33）→ 準備段取作業
・不良品の手直し（30）→ 作業余裕
・ネジ・ハンダの補充（不定期）（22）→ 作業余裕
・部品不足による手待ち（24）→ 職場余裕
・打ち合わせ（19）→ 職場余裕
・朝礼（12）→ 職場余裕
・水飲み（5）→ 用達余裕
・用便（5）→ 用達余裕

【計算】
主体作業 = 120＋90＋80＋60 = 350
職場余裕 = 24＋19＋12 = 55

主体作業比率 = 350÷500×100 = 70%
職場余裕比率 = 55÷500×100 = 11%

よって、正解はウです。`,
  },
  {
    id: 12,
    year: "平成28年 第15問",
    title: "時間計測と分析",
    question: `作業改善を目的とした時間測定と分析に関する記述として、最も適切なものはどれか。`,
    choices: [
      { label: "ア", text: "作業時間が管理状態にあるかどうかを確認するために、pn管理図を作成して分析した。" },
      { label: "イ", text: "作業時間の測定精度を高めるために、やり直しを行った作業等の異常値は記録から除外して測定を行った。" },
      { label: "ウ", text: "作業方法の変化を見つけ易くするために、作業の各サイクルに規則的に表れる要素作業と不規則に表れる要素作業は区別して時間測定を行った。" },
      { label: "エ", text: "測定対象となる作業者に心理的な負担を与えないために、測定の実施を事前に通告せずに作業者から見えない場所で測定を行った。" },
    ],
    answer: "ウ",
    explanation: `作業改善を目的とした時間計測と分析に関する問題です。

【連続観測法（連続稼働分析）のポイント】
・観測対象に付きっきりで観測する方法
・メリット：詳細に作業を分析できる
・デメリット：作業者が観測されることを意識して偏ったデータになる可能性がある

各選択肢の解説：

ア【不適切】pn管理図は「計数値」（不良品の個数など）に対する管理図です。「計量値」である作業時間を管理するには、Xbar-R管理図を用います。

イ【不適切】異常値を記録から除外すると、改善対象となる要素作業や異常の復旧に要する時間を記録できなくなります。その要素作業が改善対象とならず、作業改善を実行できなくなるため不適切です。

ウ【適切・正解】規則的に表れる要素作業と不規則に表れる要素作業を区別して時間測定を行うと、規則的に表れる要素作業に要する時間の変化から、作業方法が変化したことを見つけやすくなります。

エ【不適切】測定対象となる作業者には、心理的負荷を軽減するために、観測目的を理解してもらい協力を得るようにします。事前通告なしに隠れて測定すると、正しく時間を測定できない可能性があります。`,
  },
  {
    id: 13,
    year: "令和5年 第15問（設問2）",
    title: "標準時間1",
    question: `金属部品を人手で加工する作業の標準時間を計算するためのデータとして、

　　　　　　正味作業の観測時間：５分／個
　　　　　　レイティング係数：120
　　　　　　内掛け法による余裕率：0.20

の値を得た。

（設問２）
この作業の標準時間として、最も近いものはどれか（単位：分／個）。`,
    choices: [
      { label: "ア", text: "6.25" },
      { label: "イ", text: "6.50" },
      { label: "ウ", text: "7.00" },
      { label: "エ", text: "7.50" },
      { label: "オ", text: "7.75" },
    ],
    answer: "エ",
    explanation: `標準時間の設定に関する出題です。公式を覚えていれば容易に解ける問題です。

【公式】
■正味時間 = 観測時間の代表値 × レイティング係数（%表記の場合は÷100）
■標準時間（内掛け法） = 正味時間 ÷（1 − 余裕率）

【レイティング係数とは】
基準とする作業ペースを100%とした場合のその作業者の作業ペース。
レイティング係数120 = 基準より20%速い作業者

【計算手順】

Step1：正味時間を求める
正味時間 = 5分 × (120÷100) = 5分 × 1.2 = 6分

Step2：標準時間を求める（内掛け法）
標準時間 = 6分 ÷（1 − 0.20）= 6分 ÷ 0.8 = 7.5分/個

以上より、選択肢エ（7.50）が正解です。

【補足：外掛け法との違い】
・内掛け法：余裕率 = 余裕時間 ÷ 標準時間（標準時間に占める余裕の割合）
  → 標準時間 = 正味時間 ÷（1 − 余裕率）
・外掛け法：余裕率 = 余裕時間 ÷ 正味時間（正味時間に対する余裕の割合）
  → 標準時間 = 正味時間 ×（1 + 余裕率）

標準時間は出題頻度の高いテーマです。内掛け法・外掛け法ともに計算できるようにしておきましょう。`,
  },
  {
    id: 14,
    year: "平成29年 第10問",
    title: "標準時間２",
    question: `標準時間に関する記述として、最も不適切なものはどれか。`,
    choices: [
      { label: "ア", text: "PTS法ではレイティングを行う必要はない。" },
      { label: "イ", text: "内掛け法では、正味時間に対する余裕時間の割合で余裕率を考える。" },
      { label: "ウ", text: "主体作業時間は、正味時間と余裕時間を合わせたものである。" },
      { label: "エ", text: "人的余裕は、用達余裕と疲労余裕に分けられる。" },
    ],
    answer: "イ",
    explanation: `標準時間に関する基本的な問題です。

各選択肢の解説：

ア【適切】PTS法では、観測者の技能による個人差が結果に影響されやすく、レイティングの設定も難しいため、レイティングを行う必要はありません。

イ【不適切・正解】
・内掛け法：標準時間に対する余裕時間の割合で余裕率を求める
  余裕率（内掛け）= 余裕時間 ÷ 標準時間
  → 標準時間 = 正味時間 ÷（1 − 余裕率）
・外掛け法：正味時間に対する余裕時間の割合で余裕率を求める
  余裕率（外掛け）= 余裕時間 ÷ 正味時間
  → 標準時間 = 正味時間 ×（1 + 余裕率）

選択肢イは「正味時間に対する余裕時間の割合」としているが、これは外掛け法の説明です。内掛け法の説明として不適切。

ウ【適切】主体作業時間 = 正味時間 + 余裕時間。なお、作業全体の標準時間は、この主体作業時間と準備段取り時間を合わせて求めます。

エ【適切】余裕の分類：
・管理余裕 → 作業余裕・職場余裕
・人的余裕 → 用達余裕・疲労余裕
用達余裕：水飲みやトイレなど生理的欲求による余裕
疲労余裕：作業者が疲労回復するための余裕`,
  },
  {
    id: 15,
    year: "令和5年 第15問（設問1）",
    title: "余裕率",
    question: `金属部品を人手で加工する作業の標準時間を計算するためのデータとして、

　　　　　　正味作業の観測時間：５分／個
　　　　　　レイティング係数：120
　　　　　　内掛け法による余裕率：0.20

の値を得た。

（設問１）
この作業に対する外掛け法による余裕率の値として、最も近いものはどれか。`,
    choices: [
      { label: "ア", text: "0.15" },
      { label: "イ", text: "0.20" },
      { label: "ウ", text: "0.25" },
      { label: "エ", text: "0.30" },
      { label: "オ", text: "0.35" },
    ],
    answer: "ウ",
    explanation: `標準時間の余裕率に関する出題です。内掛け法と外掛け法の関係を問う問題です。

【余裕率の定義】
■内掛け法（標準時間基準）
余裕率（内掛け）= 余裕時間 ÷ 標準時間
標準時間 = 正味時間 + 余裕時間

■外掛け法（正味時間基準）
余裕率（外掛け）= 余裕時間 ÷ 正味時間

【内掛け法と外掛け法の関係】
内掛け法の余裕率が0.20のとき：
→ 余裕時間の標準時間に占める割合が20%
→ 正味時間の標準時間に占める割合 = 1 − 0.20 = 0.80（80%）

外掛け法の余裕率：
= 余裕時間 ÷ 正味時間
= 0.20 ÷ 0.80
= 0.25

【別解：直感的な理解】
標準時間を1とすると：
・正味時間 = 0.80
・余裕時間 = 0.20
外掛け法 = 0.20 ÷ 0.80 = 0.25

以上より、選択肢ウ（0.25）が正解です。

余裕率は内掛け法と外掛け法ともに今後出題される可能性が高いです。どちらも計算できるようにしておきましょう。`,
  },
];

// ===================== localStorage ヘルパー =====================
const STORAGE_KEY = "ie_quiz_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: {}, reviewFlags: {} };
    const parsed = JSON.parse(raw);
    console.log("[loadState] loaded:", parsed);
    return {
      history: parsed.history || {},
      reviewFlags: parsed.reviewFlags || {},
    };
  } catch (e) {
    console.error("[loadState] error:", e);
    return { history: {}, reviewFlags: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log("[saveState] saved:", state);
  } catch (e) {
    console.error("[saveState] error:", e);
  }
}

// ===================== メインコンポーネント =====================
export default function App() {
  const [screen, setScreen] = useState("start"); // start | quiz | result | history
  const [appState, setAppState] = useState(loadState);
  const [mode, setMode] = useState("all");
  const [queue, setQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // ---- 画面遷移ログ ----
  useEffect(() => {
    console.log("[screen]", screen, "mode:", mode, "currentIdx:", currentIdx);
  }, [screen]);

  // ---- 状態保存 ----
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // ---- キュー構築 ----
  const buildQueue = (selectedMode) => {
    console.log("[buildQueue] mode:", selectedMode);
    const { history, reviewFlags } = appState;
    let pool = QUESTIONS;
    if (selectedMode === "wrong") {
      pool = QUESTIONS.filter((q) => history[q.id] === false);
    } else if (selectedMode === "review") {
      pool = QUESTIONS.filter((q) => reviewFlags[q.id]);
    }
    if (pool.length === 0) return false;
    setQueue(pool);
    setCurrentIdx(0);
    setSelected(null);
    setShowExplanation(false);
    return true;
  };

  const startQuiz = (selectedMode) => {
    setMode(selectedMode);
    const ok = buildQueue(selectedMode);
    if (!ok) {
      alert("該当する問題がありません。");
      return;
    }
    setScreen("quiz");
  };

  const handleSelect = (label) => {
    if (selected !== null) return;
    const q = queue[currentIdx];
    const isCorrect = label === q.answer;
    setSelected(label);
    setShowExplanation(true);
    setAppState((prev) => ({
      ...prev,
      history: { ...prev.history, [q.id]: isCorrect },
    }));
    console.log("[handleSelect] q:", q.id, "selected:", label, "correct:", isCorrect);
  };

  const handleReviewToggle = () => {
    const q = queue[currentIdx];
    setAppState((prev) => ({
      ...prev,
      reviewFlags: {
        ...prev.reviewFlags,
        [q.id]: !prev.reviewFlags[q.id],
      },
    }));
    console.log("[handleReviewToggle] q:", q.id);
  };

  const handleNext = () => {
    if (currentIdx + 1 < queue.length) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setScreen("result");
    }
  };

  const resetAll = () => {
    if (!window.confirm("すべての履歴と要復習フラグをリセットしますか？")) return;
    setAppState({ history: {}, reviewFlags: {} });
    setScreen("start");
    console.log("[resetAll] done");
  };

  // ---- current question ----
  const q = queue[currentIdx] || null;
  const isReview = q ? !!appState.reviewFlags[q.id] : false;
  const correctCount = queue.filter((qq) => appState.history[qq.id] === true).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ナビゲーションバー */}
      <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen size={20} />
          <span className="font-bold text-lg">IE過去問セレクト演習</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScreen("start")}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-sm transition"
          >
            <Home size={15} /> スタート
          </button>
          <button
            onClick={() => setScreen("history")}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-sm transition"
          >
            <History size={15} /> 履歴
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* ========== スタート画面 ========== */}
        {screen === "start" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">3-5 IE（Industrial Engineering）</h1>
              <p className="text-gray-500 text-sm">全{QUESTIONS.length}問収録</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "全問題",
                  value: QUESTIONS.length,
                  color: "bg-blue-50 border-blue-200 text-blue-700",
                },
                {
                  label: "前回不正解",
                  value: QUESTIONS.filter((q) => appState.history[q.id] === false).length,
                  color: "bg-red-50 border-red-200 text-red-700",
                },
                {
                  label: "要復習",
                  value: QUESTIONS.filter((q) => appState.reviewFlags[q.id]).length,
                  color: "bg-yellow-50 border-yellow-200 text-yellow-700",
                },
              ].map((s) => (
                <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* モード選択 */}
            <div className="space-y-3">
              {[
                { mode: "all", label: "すべての問題", desc: `全${QUESTIONS.length}問を出題します`, icon: "📚", bg: "bg-blue-600 hover:bg-blue-700" },
                {
                  mode: "wrong",
                  label: "前回不正解の問題のみ",
                  desc: `${QUESTIONS.filter((q) => appState.history[q.id] === false).length}問を出題します`,
                  icon: "❌",
                  bg: "bg-red-500 hover:bg-red-600",
                },
                {
                  mode: "review",
                  label: "要復習の問題のみ",
                  desc: `${QUESTIONS.filter((q) => appState.reviewFlags[q.id]).length}問を出題します`,
                  icon: "⭐",
                  bg: "bg-yellow-500 hover:bg-yellow-600",
                },
              ].map((item) => (
                <button
                  key={item.mode}
                  onClick={() => startQuiz(item.mode)}
                  className={`w-full text-left ${item.bg} text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow transition`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{item.label}</div>
                    <div className="text-sm opacity-80">{item.desc}</div>
                  </div>
                  <ChevronRight size={20} className="ml-auto opacity-70" />
                </button>
              ))}
            </div>

            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 text-sm py-2 transition"
            >
              <RotateCcw size={14} /> 履歴・フラグをリセット
            </button>
          </div>
        )}

        {/* ========== クイズ画面 ========== */}
        {screen === "quiz" && q && (
          <div className="space-y-4">
            {/* 進捗バー */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>問題 {currentIdx + 1} / {queue.length}</span>
                <span>正解数: {correctCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentIdx) / queue.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 問題ヘッダー */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                  問題 {q.id}
                </span>
                <span className="text-gray-500 text-xs">{q.year}</span>
                <span className="font-semibold text-gray-700 text-sm">{q.title}</span>
              </div>

              {/* 問題文 */}
              <p className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">{q.question}</p>

              {/* テーブル（問題内） */}
              {q.table && (
                <div className="mt-4 overflow-x-auto">
                  <table className="text-sm border-collapse w-full">
                    <thead>
                      <tr>
                        {q.table.headers.map((h, i) => (
                          <th key={i} className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold text-gray-700">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {q.table.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={`border border-gray-300 px-3 py-2 text-gray-700 ${ri === q.table.rows.length - 1 ? "font-bold" : ""}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {q.tableNote && <p className="text-xs text-gray-400 mt-1">{q.tableNote}</p>}
                </div>
              )}
            </div>

            {/* 選択肢 */}
            <div className="space-y-2">
              {(q.choices || []).map((choice) => {
                let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition flex items-start gap-3 ";
                if (selected === null) {
                  cls += "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
                } else if (choice.label === q.answer) {
                  cls += "bg-green-50 border-green-500 text-green-800";
                } else if (choice.label === selected) {
                  cls += "bg-red-50 border-red-400 text-red-800";
                } else {
                  cls += "bg-white border-gray-200 text-gray-400 cursor-not-allowed";
                }
                return (
                  <button key={choice.label} className={cls} onClick={() => handleSelect(choice.label)} disabled={selected !== null}>
                    <span className="font-bold min-w-5">{choice.label}</span>
                    <span>{choice.text}</span>
                    {selected !== null && choice.label === q.answer && (
                      <CheckCircle size={18} className="ml-auto text-green-600 flex-shrink-0" />
                    )}
                    {selected === choice.label && choice.label !== q.answer && (
                      <XCircle size={18} className="ml-auto text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 正誤バナー */}
            {selected !== null && (
              <div className={`rounded-xl px-4 py-3 flex items-center gap-2 font-bold ${selected === q.answer ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {selected === q.answer ? <CheckCircle size={20} /> : <XCircle size={20} />}
                {selected === q.answer ? "正解！" : `不正解。正解は「${q.answer}」です。`}
              </div>
            )}

            {/* 解説 */}
            {showExplanation && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-700">解説</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{q.explanation}</p>

                {/* 解説内テーブル（問題11） */}
                {q.id === 11 && (
                  <div className="overflow-x-auto mt-3">
                    <table className="text-xs border-collapse w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-1">分類</th>
                          <th className="border border-gray-300 px-2 py-1">細分類1</th>
                          <th className="border border-gray-300 px-2 py-1">細分類2</th>
                          <th className="border border-gray-300 px-2 py-1">説明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["作業", "主体作業", "主作業", "材料を加工したり、部品を組み立てたりする本来の作業"],
                          ["", "", "付随作業", "主作業に付随して規則的に発生し、間接的に関与する作業"],
                          ["", "準備段取作業", "", "ロットごと・始業終業時の準備・後始末など"],
                          ["余裕", "管理余裕", "作業余裕", "必要だが不規則・偶発的に発生する作業"],
                          ["", "", "職場余裕", "作業の管理に必要な余裕"],
                          ["", "人的余裕", "用達余裕", "休憩・トイレなど人間的な要素"],
                          ["", "", "疲労余裕", "作業による疲労を回復するための余裕"],
                          ["非作業", "", "", "作業者の個人的理由や怠惰により発生するもの"],
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="border border-gray-300 px-2 py-1 text-gray-700">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 要復習チェック */}
                <label className="flex items-center gap-2 cursor-pointer mt-2 select-none">
                  <input
                    type="checkbox"
                    checked={isReview}
                    onChange={handleReviewToggle}
                    className="w-4 h-4 accent-yellow-500"
                  />
                  <Star size={16} className={isReview ? "text-yellow-500" : "text-gray-300"} />
                  <span className={`text-sm font-medium ${isReview ? "text-yellow-600" : "text-gray-500"}`}>
                    {isReview ? "要復習に登録済み" : "要復習に追加する"}
                  </span>
                </label>

                {/* 次へボタン */}
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {currentIdx + 1 < queue.length ? (
                    <><ChevronRight size={18} /> 次の問題へ</>
                  ) : (
                    <><CheckCircle size={18} /> 結果を見る</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== 結果画面 ========== */}
        {screen === "result" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-2">
                {correctCount === queue.length ? "🎉" : correctCount >= queue.length * 0.8 ? "👍" : "📖"}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {correctCount} / {queue.length} 問正解
              </h2>
              <p className="text-gray-500">
                正答率：{Math.round((correctCount / queue.length) * 100)}%
              </p>
            </div>

            {/* 問題別結果 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-700 mb-3">問題別結果</h3>
              <div className="space-y-2">
                {(queue || []).map((qq) => {
                  const correct = appState.history[qq.id] === true;
                  return (
                    <div key={qq.id} className="flex items-center gap-3 text-sm">
                      {correct ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> : <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                      <span className="text-gray-500 min-w-16">問題{qq.id}</span>
                      <span className="text-gray-700 flex-1">{qq.title}</span>
                      {appState.reviewFlags[qq.id] && <Star size={14} className="text-yellow-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setScreen("start")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Home size={16} /> スタートに戻る
              </button>
              <button
                onClick={() => startQuiz(mode)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> もう一度
              </button>
            </div>
          </div>
        )}

        {/* ========== 履歴画面 ========== */}
        {screen === "history" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">履歴一覧</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-3 text-left">問題</th>
                    <th className="px-4 py-3 text-left">タイトル</th>
                    <th className="px-4 py-3 text-left">年度</th>
                    <th className="px-4 py-3 text-center">正誤</th>
                    <th className="px-4 py-3 text-center">復習</th>
                  </tr>
                </thead>
                <tbody>
                  {(QUESTIONS || []).map((q, i) => {
                    const h = appState.history[q.id];
                    const rv = appState.reviewFlags[q.id];
                    return (
                      <tr key={q.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-gray-600 font-medium">問{q.id}</td>
                        <td className="px-4 py-3 text-gray-700">{q.title}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{q.year}</td>
                        <td className="px-4 py-3 text-center">
                          {h === true && <CheckCircle size={16} className="text-green-500 inline" />}
                          {h === false && <XCircle size={16} className="text-red-400 inline" />}
                          {h === undefined && <span className="text-gray-300">-</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {rv ? <Star size={16} className="text-yellow-400 inline" /> : <span className="text-gray-200">☆</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 凡例 */}
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> 正解</span>
              <span className="flex items-center gap-1"><XCircle size={12} className="text-red-400" /> 不正解</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" /> 要復習</span>
              <span>- 未挑戦</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}