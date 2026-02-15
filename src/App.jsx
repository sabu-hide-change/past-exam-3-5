// npm install lucide-react recharts

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, X, Home, RotateCcw, BookOpen, 
  AlertCircle, ChevronRight, BarChart2, 
  Settings, Flag 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, 
  Area, ComposedChart
} from 'recharts';

// -----------------------------------------------------------------------------
// Data & Content (Extracted from the provided document)
// -----------------------------------------------------------------------------

const QUESTION_DATA = [
  {
    id: 1,
    year: "令和4年 第13問",
    category: "IE (Industrial Engineering)",
    title: "製品工程分析",
    text: "部品Ａ、Ｂ、Ｃを用いて製品Ｘが製造される生産の流れについて、製品工程分析を行った結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。",
    diagramType: "process_tree",
    options: [
      "加工ａ、ｂ、ｃは、同期して加工している。",
      "台車は11台である。",
      "滞留を表す工程は、4カ所である。",
      "品質保証室での検査は、品質検査を主として行っているが、同時に数量検査も行っている。",
      "部品Ａ、Ｂ、Ｃは、同じ倉庫にまとめて保管されている。"
    ],
    correctAnswer: 3,
    explanation: "製品工程分析図の記号に関する問題です。\n・ア：図からは同期しているかは読み取れません。\n・イ：〇（運搬）記号はありますが、台車の台数そのものは不明です（1つの台車を使い回す可能性もあるため）。\n・ウ：滞留（Dのような記号）は3カ所です。逆三角形（▽）は「貯蔵」です。\n・エ：正解。菱形の中に四角が入っている記号は、品質検査（菱形）を主とし、数量検査（四角）も兼ねる複合記号です。\n・オ：保管場所が同じかどうかは図からは断定できません（始点が分かれているため）。"
  },
  {
    id: 2,
    year: "平成26年 第17問",
    category: "作業者工程分析",
    title: "作業者工程分析の「作業」分類",
    text: "以下の①～④に示す事象に対して作業者工程分析を行った。「作業（加工）」に分類された事象の数として、最も適切なものを解答群から選べ。\n\n①対象物を左手から右手に持ち替える。\n②機械設備での対象物の加工を作業者が監視する。\n③対象物を加工するための前準備や加工後の後始末をする。\n④出荷のために対象物の数量を確認する。",
    diagramType: "none",
    options: [
      "1個",
      "2個",
      "3個",
      "4個"
    ],
    correctAnswer: 1,
    explanation: "作業者工程分析における「作業（○）」の定義に関する問題です。\n①適切：加工以外の「移動」「手待ち」「検査」以外は「作業」に含まれます。持ち替えも作業に含まれます。\n②不適切：監視は「手待ち」や連合作業分析の範疇になることが多く、純粋な作業者工程分析の「作業」とは異なります（または手待ち）。\n③適切：段取り（前準備・後始末）は作業に含まれます。\n④不適切：数量確認は「検査（□）」です。\nしたがって、①と③の2個が該当します。"
  },
  {
    id: 3,
    year: "令和4年 第14問",
    category: "流動数分析",
    title: "流動数曲線",
    text: "ある倉庫では、ある製品の入出庫管理が先入先出法で行われている。その製品の在庫状況を把握するために行った流動数分析の結果を下図に示す（再現図）。この図から読み取ることができる記述として、最も適切なものを選べ。",
    diagramType: "fluidity_curve",
    options: [
      "Ａが示す区間の値は、時点ａにおける在庫量が倉庫に補充されるまでの期間である。",
      "Ａが示す区間の値は、時点ａに入庫した製品の倉庫における滞留期間である。",
      "Ｂが示す区間の値は、時点ｂにおいて製品が倉庫に補充された量である。",
      "Ｂが示す区間の値は、時点ｂにおける製品が倉庫から出荷された量である。",
      "インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の在庫が多い。"
    ],
    correctAnswer: 1,
    explanation: "流動数分析（流動数曲線）の読み取り問題です。\n・グラフの左側の線が「累積受入（インプット）」、右側が「累積払出（アウトプット）」です。\n・水平方向の距離（A）は「時間」を表し、入ってから出るまでの「滞留期間」を示します。\n・垂直方向の距離（B）は「量」を表し、その時点での「在庫量」を示します。\nよって、選択肢イ（Aは滞留期間）が正解です。"
  },
  {
    id: 4,
    year: "平成24年 第8問",
    category: "物の流れの分析",
    title: "分析手法の定義",
    text: "物の流れの分析手法に関する記述として、最も不適切なものはどれか。",
    diagramType: "none",
    options: [
      "P-Q チャートは、横軸に製品種類P をとり、縦軸に生産量Qをとって、生産量Qの大きい順に並べて作成される。",
      "運搬活性示数は、対象品の移動のしやすさを示す数で、バラ置きの対象品を移動する場合、①まとめる、②起こす、③移動する、という３つの手間が必要となる。",
      "流れ線図（フローダイヤグラム）では、物や人の流れ、逆行した流れ、隘路、無用な移動、配置の不具合が視覚的に把握できる。",
      "流入流出図表（フロムツウチャート）は、多品種少量の品物を生産している職場の、機械設備および作業場所の配置計画をするときに用いられる。"
    ],
    correctAnswer: 1,
    explanation: "選択肢イが不適切です。\n運搬活性示数の説明において、バラ置き（活性示数0）の状態から移動するには、①まとめる、②起こす、③持ち上げる、④移動する（運ぶ）の4つの手間が必要です。選択肢では「持ち上げる」が抜けており3つの手間となっています。"
  },
  {
    id: 5,
    year: "令和元年 第3問",
    category: "フロムツーチャート",
    title: "運搬回数分析",
    text: "ある工場でＡ～Ｅの5台の機械間における運搬回数を分析した結果、下表のフロムツウチャートが得られた。この表から読み取れる内容として、最も適切なものを選べ。",
    diagramType: "from_to_table",
    options: [
      "機械Aから他の全ての機械に品物が移動している。",
      "逆流が一カ所発生している。",
      "他の機械からの機械Bへの運搬回数は12である。",
      "最も運搬頻度が高いのは機械A・D間である。"
    ],
    correctAnswer: 3,
    explanation: "表の読み取り問題です。\n・ア：A→Eは空欄（0回）なので不適切。\n・イ：対角線より左下が「逆流」です。D→A(11)とE→B(27)の2箇所あるので不適切。\n・ウ：Bへの流入（縦のB列）は、A→B(12) + E→B(27) = 39回です。不適切。\n・エ：正解。A・D間の総移動数は、A→D(25) + D→A(11) = 36回。B・E間はB→E(4)+E→B(27)=31回。A・D間が最多です。"
  },
  {
    id: 6,
    year: "平成29年 第13問",
    category: "マテリアルハンドリング",
    title: "マテハンの基本",
    text: "工場内でのマテリアルハンドリングに関する記述として、最も不適切なものはどれか。",
    diagramType: "none",
    options: [
      "運搬活性示数は、置かれている物品を運び出すために必要となる取り扱いの手間の数を示している。",
      "運搬管理の改善には、レイアウトの改善、運搬方法の改善、運搬制度の改善がある。",
      "運搬工程分析では、モノの運搬活動を｢移動｣と｢取り扱い｣の2つの観点から分析する。",
      "平均活性示数は、停滞工程の活性示数の合計を停滞工程数で除した値として求められる。"
    ],
    correctAnswer: 0,
    explanation: "選択肢アが不適切です。\n運搬活性示数は「すでに省かれている手間の数」を示します（0～4）。「必要となる手間の数」ではありません。示数が高いほど、すぐに運べる（手間が少ない）状態を意味します。"
  },
  {
    id: 7,
    year: "平成28年 第17問",
    category: "サーブリッグ分析",
    title: "動作要素の分類",
    text: "部品容器から左手で取り出した部品を右手に持ち換えた後、定置する動作をサーブリッグ分析した。第1類（作業に必要な動作）に分類される左手の動作要素数と右手の動作要素数の組み合わせとして適切なものを選べ。\n\n（分析結果の詳細は解説画面の表を参照）",
    diagramType: "therblig_table",
    options: [
      "左手：3個　右手：2個",
      "左手：4個　右手：3個",
      "左手：5個　右手：4個",
      "左手：6個　右手：5個"
    ],
    correctAnswer: 2,
    explanation: "サーブリッグ分析の第1類は「仕事を行う上で必要な動作（手を伸ばす、つかむ、運ぶ、放す、など）」です。\n\n【左手の第1類】\n1.手を伸ばす(TE)\n2.つかむ(G)\n3.運ぶ(TL)\n4.放す(RL)\n5.元に手を戻す(TE)\n→計5個\n(※「選ぶ」「保持」は第2類・第3類)\n\n【右手の第1類】\n1.つかむ(G)\n2.運ぶ(TL)\n3.放す(RL)\n4.元に手を戻す(TE)\n→計4個\n(※「避け得ぬ遅れ」「保持」「位置決め」は第2類・第3類)\n\nよって「左手：5個、右手：4個」が正解です。"
  },
  {
    id: 8,
    year: "平成28年 第14問",
    category: "標準作業",
    title: "標準作業の定義",
    text: "作業管理に利用される「標準作業」に関する記述として、最も不適切なものはどれか。",
    diagramType: "none",
    options: [
      "作業管理者を中心に、IEスタッフや現場作業者の意見を入れて全員が納得した作業でなければならない。",
      "作業者の教育・訓練の基礎資料とするため、熟練作業者であれば実施可能になる最善の作業でなければならない。",
      "生産の構成要素である4M（Man, Machine, Material ,Method）を有効に活用した作業でなければならない。",
      "製品または部品の製造工程全体を対象にした作業順序・作業方法・管理方法・使用設備などに関する基準の規定でなければならない。"
    ],
    correctAnswer: 1,
    explanation: "選択肢イが不適切です。\n標準作業は「熟練作業者」だけができるものではなく、「標準的な適性を持つ作業者」が無理なく実施できる作業である必要があります。"
  },
  {
    id: 9,
    year: "平成30年 第15問",
    category: "PTS法",
    title: "標準時間設定の準備",
    text: "新製品組立の標準時間をPTS法で算定する際の準備として、最も適切な組み合わせを選べ。\n\na：作業者の習熟度調整のため就業年数を調査した。\nb：設備加工時間を別途計測した。\nc：既存製品の時間分析を実施し基礎資料とした。\nd：試作品の模擬ラインを敷設し標準作業を決定した。",
    diagramType: "none",
    options: [
      "ａとｂ",
      "ａとｄ",
      "ｂとｃ",
      "ｂとｄ"
    ],
    correctAnswer: 3,
    explanation: "PTS法（既定時間標準法）に関する問題です。\n・a：不適切。PTS法は動作ごとの標準時間を使うため、レイティング（習熟度補正）は不要です。\n・b：適切。PTS法は「人の動作」の時間しか算出できないため、機械時間は別途計測が必要です。\n・c：不適切。これは「標準時間資料法」の説明に近いです。PTS法では動作分析から直接時間を求めます。\n・d：適切。標準時間を決める前に、まず「標準作業（手順）」を決める必要があります。\nよって、bとdが適切です。"
  },
  {
    id: 10,
    year: "令和3年 第17問",
    category: "作業測定",
    title: "測定手法の特徴",
    text: "作業測定に関する記述として、最も適切なものはどれか。",
    diagramType: "none",
    options: [
      "PTS法では、作業設計終了後、その作業を正確に再現して実測しなければ標準時間を求められない。",
      "標準時間資料法は、過去に測定・資料化された時間値を使うもので、類似作業が多い職場に適している。",
      "ストップウォッチ法は、作業を要素作業に分割して直接測定する方法で、サイクル作業には適していない。",
      "人・機械分析を行う場合、人と機械に1人ずつ観測者がついて工程分析を行う必要がある。"
    ],
    correctAnswer: 1,
    explanation: "・ア：不適切。PTS法は机上で計算できるため、実測の必要がありません（作業設計段階で見積もりが可能）。\n・イ：適切。標準時間資料法は、過去のデータを合成するため、類似作業が多い場合に効率的です。\n・ウ：不適切。ストップウォッチ法は繰り返しのあるサイクル作業に最も適しています。\n・エ：不適切。人・機械分析は一人でも観測可能です（チャートを用いて分析します）。"
  },
  {
    id: 11,
    year: "平成28年 第16問",
    category: "ワークサンプリング法",
    title: "時間構成比率の計算",
    text: "ある工程でワークサンプリング法を実施した結果（合計500観測）から、「主体作業」と「職場余裕」の時間構成比率を求めよ。\n\n【データ抜粋】\n・ハンダ付け(120), 部品取付(90), ネジ止め(80), 検査(60)\n・運搬(33), 手直し(30), 補充(22)\n・手待ち(24), 打合せ(19), 朝礼(12)\n・水飲み(5), 用便(5)",
    diagramType: "sampling_table",
    options: [
      "主体作業：58％　職場余裕：11％",
      "主体作業：58％　職場余裕：12％",
      "主体作業：70％　職場余裕：11％",
      "主体作業：70％　職場余裕：12％"
    ],
    correctAnswer: 2,
    explanation: "分類を行います。\n【主体作業】主作業＋付随作業\nハンダ(120)+取付(90)+ネジ(80)+検査(60) = 350\n比率 = 350/500 = 70%\n\n【職場余裕】管理上の遅れ\n手待ち(24)+打合せ(19)+朝礼(12) = 55\n比率 = 55/500 = 11%\n\nその他：運搬は準備段取、手直し・補充は作業余裕、水飲み・用便は人的余裕（用達余裕）です。"
  },
  {
    id: 12,
    year: "平成28年 第15問",
    category: "時間計測と分析",
    title: "作業改善の測定",
    text: "作業改善を目的とした時間測定と分析に関する記述として、最も適切なものはどれか。",
    diagramType: "none",
    options: [
      "作業時間が管理状態にあるか確認するために、pn管理図を作成した。",
      "測定精度を高めるため、やり直し等の異常値は記録から除外して測定を行った。",
      "作業方法の変化を見つけ易くするため、規則的な要素作業と不規則な要素作業は区別して測定した。",
      "作業者に心理的負担を与えないため、事前に通告せず隠れて測定を行った。"
    ],
    correctAnswer: 2,
    explanation: "・ア：不適切。時間は計量値なので、pn管理図（不良個数などの計数値用）ではなく、Xbar-R管理図などを使います。\n・イ：不適切。異常値や例外も現状把握には重要なので記録し、分析対象にします。\n・ウ：適切。規則的作業と不規則作業を分けることで、変動要因を特定しやすくなります。\n・エ：不適切。隠れて測定（盗み撮り）は信頼関係を損なうため、IEの原則として禁止されています。"
  },
  {
    id: 13,
    year: "令和5年 第15問（設問2）",
    category: "標準時間",
    title: "標準時間の計算（内掛け法）",
    text: "以下のデータから標準時間を計算せよ。\n\n・正味作業の観測時間：5分/個\n・レイティング係数：120 (1.2)\n・内掛け法による余裕率：0.20",
    diagramType: "none",
    options: [
      "6.25 分/個",
      "6.50 分/個",
      "7.00 分/個",
      "7.50 分/個",
      "7.75 分/個"
    ],
    correctAnswer: 3,
    explanation: "1. まず正味時間を求めます。\n正味時間 = 観測時間 × レイティング\n5分 × 1.2 = 6.0分\n\n2. 内掛け法による標準時間を求めます。\n公式：標準時間 = 正味時間 ÷ (1 - 余裕率)\n標準時間 = 6.0 ÷ (1 - 0.20) = 6.0 ÷ 0.8 = 7.5分\n\nよって、7.50分が正解です。"
  },
  {
    id: 14,
    year: "平成29年 第10問",
    category: "標準時間",
    title: "標準時間の定義・用語",
    text: "標準時間に関する記述として、最も不適切なものはどれか。",
    diagramType: "none",
    options: [
      "PTS法ではレイティングを行う必要はない。",
      "内掛け法では、正味時間に対する余裕時間の割合で余裕率を考える。",
      "主体作業時間は、正味時間と余裕時間を合わせたものである。",
      "人的余裕は、用達余裕と疲労余裕に分けられる。"
    ],
    correctAnswer: 1,
    explanation: "選択肢イが不適切です。\n・内掛け法：【標準時間】に対する余裕時間の割合。\n・外掛け法：【正味時間】に対する余裕時間の割合。\n記述は外掛け法の説明になっています。"
  },
  {
    id: 15,
    year: "令和5年 第15問（設問1）",
    category: "標準時間",
    title: "余裕率の変換",
    text: "内掛け法による余裕率が 0.20 のとき、外掛け法による余裕率の値として最も近いものはどれか。",
    diagramType: "none",
    options: [
      "0.15",
      "0.20",
      "0.25",
      "0.30",
      "0.35"
    ],
    correctAnswer: 2,
    explanation: "内掛け率が0.20ということは、標準時間を1（100%）としたとき、余裕が0.2、正味時間が0.8という構成になります。\n\n外掛け法は「正味時間に対する余裕の割合」なので：\n外掛け率 = 余裕 ÷ 正味時間\n外掛け率 = 0.2 ÷ 0.8 = 0.25\n\nよって0.25が正解です。"
  }
];

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

const ProcessDiagram = () => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 w-full max-w-md mx-auto">
    <div className="text-sm font-bold mb-4 text-gray-700">製品工程分析図（再現）</div>
    <div className="flex justify-between w-full text-xs gap-2">
      {/* Column A */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="font-bold">部品A</div>
        <div className="w-6 h-6 border-b-2 border-gray-800 mb-1">▽</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="text-[10px] text-gray-500">台車</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">加工a</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-6 rounded-t-none rounded-b-full border-2 border-gray-800 flex items-center justify-center text-[10px]">D</div>
        <div className="text-[10px] text-gray-500">仮置</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
      </div>

      {/* Column B */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="font-bold">部品B</div>
        <div className="w-6 h-6 border-b-2 border-gray-800 mb-1">▽</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">加工b</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-6 rounded-t-none rounded-b-full border-2 border-gray-800 flex items-center justify-center text-[10px]">D</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
      </div>

      {/* Column C */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="font-bold">部品C</div>
        <div className="w-6 h-6 border-b-2 border-gray-800 mb-1">▽</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">加工c</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-8 h-6 rounded-t-none rounded-b-full border-2 border-gray-800 flex items-center justify-center text-[10px]">D</div>
        <div className="w-0.5 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
      </div>
    </div>

    {/* Merge */}
    <div className="w-full border-t-2 border-gray-300 mt-2"></div>
    <div className="w-0.5 h-4 bg-gray-400"></div>
    <div className="w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center bg-white z-10 text-xs text-center">
      組立
    </div>
    <div className="w-0.5 h-4 bg-gray-400"></div>
    <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
    <div className="w-0.5 h-4 bg-gray-400"></div>
    {/* Complex Inspection Symbol */}
    <div className="w-10 h-10 border-2 border-gray-800 transform rotate-45 flex items-center justify-center mb-2">
       <div className="w-5 h-5 border border-gray-800 transform -rotate-45"></div>
    </div>
    <div className="text-xs text-gray-600 -mt-2 mb-2">品質+数量検査</div>
    <div className="w-0.5 h-4 bg-gray-400"></div>
    <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">○</div>
    <div className="w-0.5 h-4 bg-gray-400"></div>
    <div className="w-8 h-8 border-b-2 border-gray-800 flex items-center justify-center">▽</div>
    <div className="text-xs text-gray-500">保管</div>
  </div>
);

const FluidityChart = () => {
  const data = [
    { t: 0, in: 10, out: 0 },
    { t: 1, in: 20, out: 2 },
    { t: 2, in: 40, out: 8 },
    { t: 3, in: 65, out: 20 },
    { t: 4, in: 80, out: 35 },
    { t: 5, in: 85, out: 55 },
    { t: 6, in: 90, out: 80 },
    { t: 7, in: 100, out: 95 },
  ];

  return (
    <div className="h-64 w-full bg-white p-2 rounded border border-gray-200">
      <div className="text-center text-xs font-bold mb-2">流動数曲線（イメージ）</div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" label={{ value: '時間', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: '累積量', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Line type="monotone" dataKey="in" stroke="#8884d8" name="インプット累積" strokeWidth={2} dot={false}/>
          <Line type="monotone" dataKey="out" stroke="#82ca9d" name="アウトプット累積" strokeWidth={2} dot={false}/>
          {/* Annotations */}
          <ReferenceLine x={3} stroke="red" strokeDasharray="3 3" label="a" />
          <ReferenceLine x={5} stroke="red" strokeDasharray="3 3" label="b" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const FromToTable = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 bg-gray-100 p-2">From \ To</th>
          <th className="border border-gray-300 p-2">A</th>
          <th className="border border-gray-300 p-2">B</th>
          <th className="border border-gray-300 p-2">C</th>
          <th className="border border-gray-300 p-2">D</th>
          <th className="border border-gray-300 p-2">E</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300 bg-gray-50 font-bold p-2">A</td>
          <td className="border border-gray-300 bg-gray-200 p-2"></td>
          <td className="border border-gray-300 p-2 text-center">12</td>
          <td className="border border-gray-300 p-2 text-center">5</td>
          <td className="border border-gray-300 p-2 text-center font-bold text-blue-600">25</td>
          <td className="border border-gray-300 p-2 text-center"></td>
        </tr>
        <tr>
          <td className="border border-gray-300 bg-gray-50 font-bold p-2">B</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 bg-gray-200 p-2"></td>
          <td className="border border-gray-300 p-2 text-center">11</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 p-2 text-center">4</td>
        </tr>
        <tr>
          <td className="border border-gray-300 bg-gray-50 font-bold p-2">C</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 bg-gray-200 p-2"></td>
          <td className="border border-gray-300 p-2 text-center">2</td>
          <td className="border border-gray-300 p-2"></td>
        </tr>
        <tr>
          <td className="border border-gray-300 bg-gray-50 font-bold p-2">D</td>
          <td className="border border-gray-300 p-2 text-center font-bold text-red-500">11</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 bg-gray-200 p-2"></td>
          <td className="border border-gray-300 p-2"></td>
        </tr>
        <tr>
          <td className="border border-gray-300 bg-gray-50 font-bold p-2">E</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 p-2 text-center font-bold text-red-500">27</td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 p-2"></td>
          <td className="border border-gray-300 bg-gray-200 p-2"></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TherbligTable = () => (
  <div className="overflow-x-auto text-xs">
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-1" colSpan="2">左手</th>
          <th className="border p-1" colSpan="2">右手</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="border p-1">部品に手を伸ばす</td><td className="border p-1 text-center font-mono">TE</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1">避け得ぬ遅れ</td></tr>
        <tr><td className="border p-1">部品を選ぶ</td><td className="border p-1 text-center font-mono">ST</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1">避け得ぬ遅れ</td></tr>
        <tr><td className="border p-1">部品をつかむ</td><td className="border p-1 text-center font-mono">G</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1">避け得ぬ遅れ</td></tr>
        <tr><td className="border p-1">部品を運ぶ</td><td className="border p-1 text-center font-mono">TL</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1">避け得ぬ遅れ</td></tr>
        <tr><td className="border p-1">部品を保持する</td><td className="border p-1 text-center font-mono">H</td><td className="border p-1 text-center font-mono">G</td><td className="border p-1">部品をつかむ</td></tr>
        <tr><td className="border p-1">部品をはなす</td><td className="border p-1 text-center font-mono">RL</td><td className="border p-1 text-center font-mono">H</td><td className="border p-1">部品を保持する</td></tr>
        <tr><td className="border p-1">手元に手を戻す</td><td className="border p-1 text-center font-mono">TE</td><td className="border p-1 text-center font-mono">TL</td><td className="border p-1">部品を運ぶ</td></tr>
        <tr><td className="border p-1">避け得ぬ遅れ</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1 text-center font-mono">P</td><td className="border p-1">部品を位置決めする</td></tr>
        <tr><td className="border p-1">避け得ぬ遅れ</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1 text-center font-mono">RL</td><td className="border p-1">部品をはなす</td></tr>
        <tr><td className="border p-1">避け得ぬ遅れ</td><td className="border p-1 text-center font-mono">UD</td><td className="border p-1 text-center font-mono">TE</td><td className="border p-1">手元に手を戻す</td></tr>
      </tbody>
    </table>
  </div>
);

const SamplingTable = () => (
  <div className="overflow-x-auto text-sm">
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">作業項目</th>
          <th className="border p-2 text-right">度数</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="border p-2">ハンダ付け</td><td className="border p-2 text-right">120</td></tr>
        <tr><td className="border p-2">基盤への部品の取り付け</td><td className="border p-2 text-right">90</td></tr>
        <tr><td className="border p-2">基盤のネジ止め</td><td className="border p-2 text-right">80</td></tr>
        <tr><td className="border p-2">組立作業完了後の製品検査(全数)</td><td className="border p-2 text-right">60</td></tr>
        <tr><td className="border p-2 text-gray-500">ロット単位での完成部品の運搬</td><td className="border p-2 text-right text-gray-500">33</td></tr>
        <tr><td className="border p-2 text-gray-500">不良品の手直し</td><td className="border p-2 text-right text-gray-500">30</td></tr>
        <tr><td className="border p-2 text-gray-500">ネジ・ハンダの補充(不定期)</td><td className="border p-2 text-right text-gray-500">22</td></tr>
        <tr><td className="border p-2 text-red-500">部品不足による手待ち</td><td className="border p-2 text-right text-red-500">24</td></tr>
        <tr><td className="border p-2 text-red-500">打ち合わせ</td><td className="border p-2 text-right text-red-500">19</td></tr>
        <tr><td className="border p-2 text-red-500">朝礼</td><td className="border p-2 text-right text-red-500">12</td></tr>
        <tr><td className="border p-2 text-gray-500">水飲み</td><td className="border p-2 text-right text-gray-500">5</td></tr>
        <tr><td className="border p-2 text-gray-500">用便</td><td className="border p-2 text-right text-gray-500">5</td></tr>
        <tr className="bg-gray-50 font-bold"><td className="border p-2 text-right">合計</td><td className="border p-2 text-right">500</td></tr>
      </tbody>
    </table>
  </div>
);

// -----------------------------------------------------------------------------
// Main Application Component
// -----------------------------------------------------------------------------

export default function App() {
  // State
  const [currentMode, setCurrentMode] = useState('menu'); // menu, quiz, result, history
  const [filterType, setFilterType] = useState('all'); // all, wrong, review
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Persistent State
  const [history, setHistory] = useState([]); // Array of { id, correct: bool, date }
  const [reviewFlags, setReviewFlags] = useState({}); // Object { id: bool }

  // Load Data
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ie_quiz_history');
      const savedFlags = localStorage.getItem('ie_quiz_flags');
      
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedFlags) setReviewFlags(JSON.parse(savedFlags));
      
      console.log("Data loaded successfully.");
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      // Fallback to empty if corrupted
      setHistory([]);
      setReviewFlags({});
    }
  }, []);

  // Save Data
  useEffect(() => {
    try {
      localStorage.setItem('ie_quiz_history', JSON.stringify(history));
      localStorage.setItem('ie_quiz_flags', JSON.stringify(reviewFlags));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }, [history, reviewFlags]);

  // Start Quiz Logic
  const startQuiz = (type) => {
    setFilterType(type);
    let filtered = [];

    if (type === 'all') {
      filtered = [...QUESTION_DATA];
    } else if (type === 'wrong') {
      // Find IDs that were answered incorrectly at least once recently or in general
      const wrongIds = new Set(history.filter(h => !h.correct).map(h => h.id));
      filtered = QUESTION_DATA.filter(q => wrongIds.has(q.id));
    } else if (type === 'review') {
      filtered = QUESTION_DATA.filter(q => reviewFlags[q.id]);
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    // Shuffle questions slightly for variety? No, keep order for study flow usually.
    // Let's keep original order for now to match document flow.
    setQuizQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentMode('quiz');
    console.log(`Quiz started: ${type} mode, ${filtered.length} questions.`);
  };

  // Answer Handling
  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    const currentQ = quizQuestions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) setScore(prev => prev + 1);

    // Update History
    setHistory(prev => {
      // Remove old entry for this question to keep history clean (or keep log)
      // Let's keep a log but maybe limit it? For this simple app, append is fine.
      const newEntry = { id: currentQ.id, correct: isCorrect, date: new Date().toISOString() };
      return [...prev, newEntry];
    });
  };

  // Navigation
  const nextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCurrentMode('result');
    }
  };

  const toggleReview = (id) => {
    setReviewFlags(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ---------------------------------------------------------------------------
  // Screens
  // ---------------------------------------------------------------------------

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">IE (Industrial Engineering)</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">過去問セレクト演習</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => startQuiz('all')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow flex items-center justify-between transition"
          >
            <span>すべての問題に取り組む</span>
            <span className="bg-blue-500 px-2 py-1 rounded text-xs">{QUESTION_DATA.length}問</span>
          </button>

          <button 
            onClick={() => startQuiz('wrong')}
            className="w-full py-4 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow flex items-center justify-between transition"
          >
            <span>前回間違えた問題</span>
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={() => startQuiz('review')}
            className="w-full py-4 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium shadow flex items-center justify-between transition"
          >
            <span>要復習の問題</span>
            <Flag size={20} />
          </button>

          <button 
            onClick={() => setCurrentMode('history')}
            className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 mt-4"
          >
            <BarChart2 size={20} />
            <span>学習履歴を見る</span>
          </button>
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-400">
        Compatible with Gemini 3 Pro Environment
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = quizQuestions[currentIndex];
    if (!question) return <div>Loading...</div>;

    const isReviewing = reviewFlags[question.id];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentMode('menu')} className="text-gray-500">
            <Home size={24} />
          </button>
          <div className="font-semibold text-gray-700">
            問 {currentIndex + 1} / {quizQuestions.length}
          </div>
          <button 
            onClick={() => toggleReview(question.id)} 
            className={`${isReviewing ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          >
            <Flag size={24} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
          <div className="mb-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-bold">
              {question.year}
            </span>
            <span className="text-xs text-gray-500">{question.category}</span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-4">{question.title}</h2>
          
          <div className="whitespace-pre-wrap text-gray-700 mb-6 leading-relaxed">
            {question.text}
          </div>

          {/* Diagrams */}
          <div className="mb-6 w-full flex justify-center">
            {question.diagramType === 'process_tree' && <ProcessDiagram />}
            {question.diagramType === 'fluidity_curve' && <FluidityChart />}
            {question.diagramType === 'from_to_table' && <FromToTable />}
            {question.diagramType === 'therblig_table' && <TherbligTable />}
            {question.diagramType === 'sampling_table' && <SamplingTable />}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full p-4 text-left rounded-lg border-2 transition relative ";
              if (selectedOption === null) {
                btnClass += "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50";
              } else {
                if (idx === question.correctAnswer) {
                  btnClass += "border-green-500 bg-green-50 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-200 bg-gray-100 text-gray-400";
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => !showExplanation && handleAnswer(idx)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <span className="font-bold mr-2">{['ア','イ','ウ','エ','オ'][idx]}.</span>
                  {opt}
                  {showExplanation && idx === question.correctAnswer && (
                    <Check className="absolute right-4 top-4 text-green-600" />
                  )}
                  {showExplanation && idx === selectedOption && idx !== question.correctAnswer && (
                    <X className="absolute right-4 top-4 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100 animate-fade-in">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <BookOpen size={20} /> 解説
              </h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {question.explanation}
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!isReviewing} 
                    onChange={() => toggleReview(question.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">後で復習する（チェック）</span>
                </label>
                <button 
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
                >
                  次へ <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  const renderResult = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">結果発表</h2>
        <div className="text-6xl font-black text-blue-600 mb-2">
          {score} <span className="text-2xl text-gray-400">/ {quizQuestions.length}</span>
        </div>
        <p className="text-gray-500 mb-8">正答率: {Math.round((score / quizQuestions.length) * 100)}%</p>

        <div className="space-y-3">
          <button 
            onClick={() => setCurrentMode('menu')}
            className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold"
          >
            メニューに戻る
          </button>
          <button 
            onClick={() => startQuiz(filterType)}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
          >
            もう一度同じ条件で
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    // Group history by Question ID to find latest status
    const list = QUESTION_DATA.map(q => {
      const qHistory = history.filter(h => h.id === q.id);
      const lastAttempt = qHistory[qHistory.length - 1];
      const isWrong = lastAttempt && !lastAttempt.correct;
      const isReview = reviewFlags[q.id];
      return { ...q, lastAttempt, isWrong, isReview };
    });

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b px-4 py-3 flex items-center shadow-sm sticky top-0">
          <button onClick={() => setCurrentMode('menu')} className="text-gray-500 mr-4">
            <Home size={24} />
          </button>
          <h1 className="font-bold text-gray-800">問題一覧・学習履歴</h1>
        </header>
        <div className="p-4 max-w-3xl mx-auto w-full space-y-2">
          {list.map(q => (
            <div key={q.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-100 px-2 rounded text-gray-600">{q.year}</span>
                  {q.isWrong && <span className="text-xs bg-red-100 text-red-600 px-2 rounded">前回不正解</span>}
                  {q.isReview && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 rounded flex items-center gap-1"><Flag size={10}/>要復習</span>}
                </div>
                <div className="text-sm font-bold text-gray-800">{q.title}</div>
              </div>
              <button 
                onClick={() => toggleReview(q.id)} 
                className={`p-2 rounded-full ${q.isReview ? 'bg-yellow-50 text-yellow-500' : 'text-gray-300 hover:bg-gray-100'}`}
              >
                <Flag size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-900">
      {currentMode === 'menu' && renderMenu()}
      {currentMode === 'quiz' && renderQuiz()}
      {currentMode === 'result' && renderResult()}
      {currentMode === 'history' && renderHistory()}
    </div>
  );
}