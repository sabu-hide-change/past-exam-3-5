// npm install lucide-react recharts firebase
import React, { useState, useEffect, useRef } from "react";
import { 
  Check, 
  X, 
  Home, 
  ChevronRight, 
  RefreshCw, 
  BarChart2, 
  BookOpen, 
  User, 
  ArrowRight, 
  HelpCircle,
  Clock,
  List,
  AlertCircle,
  Key,
  Database,
  Lock,
  RotateCcw
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// APP ID (データの分離用定数)
const APP_ID = "QuizApp_IE_Past_Exams_3_5";

// Firebase設定の秘匿化
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase初期化 (防衛的初期化)
let app;
let db;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// ==========================================
// サーブリッグ記号を描画する極小SVGコンポーネント
// ==========================================
const TherbligIcon = ({ type }) => {
  switch (type) {
    case "TE": // 手を伸ばす (下に凸の半円)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-sky-400">
          <path d="M 4 8 Q 12 18 20 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "ST": // 選ぶ (右矢印)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-amber-400">
          <path d="M 4 12 L 20 12 M 14 6 L 20 12 L 14 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "G": // つかむ (U字)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-sky-400">
          <path d="M 6 6 L 6 14 A 6 6 0 0 0 18 14 L 18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "TL": // 運搬する (下に凸で右端にループ)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-sky-400">
          <path d="M 4 8 C 8 16, 12 16, 16 10 C 18 7, 21 7, 21 11 C 21 15, 17 15, 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "H": // 保持する (逆U字の下に横棒)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-red-400">
          <path d="M 6 16 L 6 10 A 6 6 0 0 1 18 10 L 18 16 M 3 16 L 21 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "RL": // 放す (丸に下線)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-sky-400">
          <circle cx="12" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 6 18 L 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "UD": // 避け得ぬ遅れ (フック状またはジグザグ)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-red-400">
          <path d="M 6 6 L 14 6 C 18 6, 18 14, 14 14 L 6 14 L 14 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "P": // 位置決め (9字に似た形)
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block text-amber-400">
          <path d="M 12 4 L 12 20 M 12 10 A 4 4 0 1 0 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

// ==========================================
// 各種インラインSVG図表コンポーネント
// ==========================================

// 問題1: 製品工程分析
const ProductProcessSVG = ({ showExplanation }) => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center">
      <svg width="500" height="660" viewBox="0 0 500 660" className="max-w-full text-slate-300 select-none">
        {/* 背景グリッド */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366f1" />
          </marker>
        </defs>
        
        {/* タイトル */}
        <text x="250" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold">製品工程分析図</text>

        {/* 部品Aライン */}
        <g>
          <text x="100" y="55" textAnchor="middle" fill="#818cf8" fontSize="12" fontWeight="bold">部品Ａ</text>
          {/* 貯蔵 ▽ */}
          <polygon points="85,70 115,70 100,95" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="125" y="87" fill="#94a3b8" fontSize="12">部品Ａ保管</text>
          {showExplanation && <text x="195" y="87" fill="#38bdf8" fontSize="12" fontWeight="bold">[貯蔵]</text>}
          
          <line x1="100" y1="95" x2="100" y2="120" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="100" cy="130" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="125" y="134" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="160" y="134" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="100" y1="140" x2="100" y2="165" stroke="#475569" strokeWidth="1.5" />

          {/* 加工 ○ */}
          <circle cx="100" cy="185" r="20" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="135" y="189" fill="#94a3b8" fontSize="12">加工ａ</text>
          {showExplanation && <text x="185" y="189" fill="#38bdf8" fontSize="12" fontWeight="bold">[加工]</text>}

          <line x1="100" y1="205" x2="100" y2="230" stroke="#475569" strokeWidth="1.5" />

          {/* 運搬 o */}
          <circle cx="100" cy="240" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="125" y="244" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="160" y="244" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="100" y1="250" x2="100" y2="275" stroke="#475569" strokeWidth="1.5" />

          {/* 滞留 D */}
          <path d="M 85,285 L 100,285 A 15,15 0 0,1 100,315 L 85,315 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="125" y="304" fill="#94a3b8" fontSize="12">仮置き場</text>
          {showExplanation && <text x="185" y="304" fill="#38bdf8" fontSize="12" fontWeight="bold">[滞留]</text>}

          <line x1="100" y1="315" x2="100" y2="340" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="100" cy="350" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="125" y="354" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="160" y="354" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}
        </g>

        {/* 部品Bライン */}
        <g>
          <text x="250" y="55" textAnchor="middle" fill="#818cf8" fontSize="12" fontWeight="bold">部品Ｂ</text>
          {/* 貯蔵 ▽ */}
          <polygon points="235,70 265,70 250,95" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="87" fill="#94a3b8" fontSize="12">部品Ｂ保管</text>
          {showExplanation && <text x="345" y="87" fill="#38bdf8" fontSize="12" fontWeight="bold">[貯蔵]</text>}
          
          <line x1="250" y1="95" x2="250" y2="120" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="250" cy="130" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="134" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="310" y="134" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="250" y1="140" x2="250" y2="165" stroke="#475569" strokeWidth="1.5" />

          {/* 加工 ○ */}
          <circle cx="250" cy="185" r="20" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="285" y="189" fill="#94a3b8" fontSize="12">加工ｂ</text>
          {showExplanation && <text x="335" y="189" fill="#38bdf8" fontSize="12" fontWeight="bold">[加工]</text>}

          <line x1="250" y1="205" x2="250" y2="230" stroke="#475569" strokeWidth="1.5" />

          {/* 運搬 o */}
          <circle cx="250" cy="240" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="244" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="310" y="244" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="250" y1="250" x2="250" y2="275" stroke="#475569" strokeWidth="1.5" />

          {/* 滞留 D */}
          <path d="M 235,285 L 250,285 A 15,15 0 0,1 250,315 L 235,315 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="304" fill="#94a3b8" fontSize="12">仮置き場</text>
          {showExplanation && <text x="335" y="304" fill="#38bdf8" fontSize="12" fontWeight="bold">[滞留]</text>}

          <line x1="250" y1="315" x2="250" y2="340" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="250" cy="350" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="354" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="310" y="354" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}
        </g>

        {/* 部品Cライン */}
        <g>
          <text x="400" y="55" textAnchor="middle" fill="#818cf8" fontSize="12" fontWeight="bold">部品Ｃ</text>
          {/* 貯蔵 ▽ */}
          <polygon points="385,70 415,70 400,95" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="420" y="87" fill="#94a3b8" fontSize="11">部品Ｃ保管</text>
          {showExplanation && <text x="420" y="103" fill="#38bdf8" fontSize="11" fontWeight="bold">[貯蔵]</text>}
          
          <line x1="400" y1="95" x2="400" y2="120" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="400" cy="130" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="420" y="134" fill="#94a3b8" fontSize="11">台車</text>
          {showExplanation && <text x="420" y="148" fill="#38bdf8" fontSize="11" fontWeight="bold">[運搬]</text>}

          <line x1="400" y1="140" x2="400" y2="165" stroke="#475569" strokeWidth="1.5" />

          {/* 加工 ○ */}
          <circle cx="400" cy="185" r="20" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="425" y="189" fill="#94a3b8" fontSize="11">加工ｃ</text>
          {showExplanation && <text x="425" y="203" fill="#38bdf8" fontSize="11" fontWeight="bold">[加工]</text>}

          <line x1="400" y1="205" x2="400" y2="230" stroke="#475569" strokeWidth="1.5" />

          {/* 運搬 o */}
          <circle cx="400" cy="240" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="420" y="244" fill="#94a3b8" fontSize="11">台車</text>
          {showExplanation && <text x="420" y="258" fill="#38bdf8" fontSize="11" fontWeight="bold">[運搬]</text>}

          <line x1="400" y1="250" x2="400" y2="275" stroke="#475569" strokeWidth="1.5" />

          {/* 滞留 D */}
          <path d="M 385,285 L 400,285 A 15,15 0 0,1 400,315 L 385,315 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="420" y="304" fill="#94a3b8" fontSize="11">仮置き場</text>
          {showExplanation && <text x="420" y="318" fill="#38bdf8" fontSize="11" fontWeight="bold">[滞留]</text>}

          <line x1="400" y1="315" x2="400" y2="340" stroke="#475569" strokeWidth="1.5" />
          
          {/* 運搬 o */}
          <circle cx="400" cy="350" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="420" y="354" fill="#94a3b8" fontSize="11">台車</text>
          {showExplanation && <text x="420" y="368" fill="#38bdf8" fontSize="11" fontWeight="bold">[運搬]</text>}
        </g>

        {/* 合流線 */}
        <path d="M 100,360 L 100,390 L 400,390 L 400,360" fill="none" stroke="#475569" strokeWidth="2" />
        <line x1="250" y1="360" x2="250" y2="410" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 組立 & 下流工程 */}
        <g>
          {/* 加工 (組立) ○ */}
          <circle cx="250" cy="435" r="20" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="285" y="439" fill="#e2e8f0" fontSize="12" fontWeight="bold">部品Ａ、Ｂ、Ｃを組立</text>
          {showExplanation && <text x="415" y="439" fill="#38bdf8" fontSize="12" fontWeight="bold">[加工]</text>}

          <line x1="250" y1="455" x2="250" y2="480" stroke="#475569" strokeWidth="1.5" />

          {/* 運搬 o */}
          <circle cx="250" cy="490" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="494" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="310" y="494" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="250" y1="500" x2="250" y2="525" stroke="#475569" strokeWidth="1.5" />

          {/* 検査（ひし形の中に正方形：品質主・数量従の複合） */}
          {/* ひし形 */}
          <polygon points="250,535 270,555 250,575 230,555" fill="none" stroke="#6366f1" strokeWidth="2" />
          {/* 内側の正方形 */}
          <rect x="240" y="545" width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="1.5" />
          <text x="285" y="559" fill="#e2e8f0" fontSize="12" fontWeight="bold">品質保証室で検査</text>
          {showExplanation && (
            <text x="285" y="575" fill="#38bdf8" fontSize="11" fontWeight="bold">
              [複合検査] 品質検査(主:◇) ＋ 数量検査(従:□)
            </text>
          )}

          <line x1="250" y1="575" x2="250" y2="600" stroke="#475569" strokeWidth="1.5" />

          {/* 運搬 o */}
          <circle cx="250" cy="610" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="614" fill="#94a3b8" fontSize="12">台車</text>
          {showExplanation && <text x="310" y="614" fill="#38bdf8" fontSize="12" fontWeight="bold">[運搬]</text>}

          <line x1="250" y1="620" x2="250" y2="630" stroke="#475569" strokeWidth="1.5" />

          {/* 貯蔵 ▽ */}
          <polygon points="235,630 265,630 250,655" fill="none" stroke="#6366f1" strokeWidth="2" />
          <text x="275" y="647" fill="#e2e8f0" fontSize="12" fontWeight="bold">製品Ｘを倉庫に保管</text>
          {showExplanation && <text x="410" y="647" fill="#38bdf8" fontSize="12" fontWeight="bold">[貯蔵]</text>}
        </g>
      </svg>
    </div>
  );
};

// 問題3: 流動数分析
const FlowAnalysisSVG = ({ showExplanation }) => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center">
      <svg width="480" height="320" viewBox="0 0 480 320" className="max-w-full text-slate-300 select-none">
        <defs>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#38bdf8" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#f87171" />
          </marker>
          <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 軸 */}
        <line x1="50" y1="280" x2="450" y2="280" stroke="#94a3b8" strokeWidth="2" /> {/* 横軸 */}
        <line x1="50" y1="280" x2="50" y2="30" stroke="#94a3b8" strokeWidth="2" /> {/* 縦軸 */}
        
        <text x="450" y="295" textAnchor="end" fill="#94a3b8" fontSize="12">時間</text>
        <text x="35" y="35" textAnchor="middle" fill="#94a3b8" fontSize="12" writingMode="tb">累積量</text>

        {/* インプット累積線（上） */}
        <path d="M 50,220 C 120,200 150,110 250,90 C 320,80 400,60 440,40" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
        <text x="130" y="100" fill="#cbd5e1" fontSize="11" fontWeight="bold">倉庫への</text>
        <text x="130" y="118" fill="#cbd5e1" fontSize="11" fontWeight="bold">インプット累積線</text>

        {/* アウトプット累積線（下） */}
        <path d="M 50,280 C 150,250 250,220 320,160 C 370,120 410,70 440,60" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="1 0" />
        <text x="360" y="170" fill="#94a3b8" fontSize="11" fontWeight="bold">倉庫からの</text>
        <text x="360" y="188" fill="#94a3b8" fontSize="11" fontWeight="bold">アウトプット累積線</text>

        {/* 時点a, b, c の線 */}
        {/* 時点a: インプット上のX=165 */}
        <line x1="165" y1="280" x2="165" y2="152" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="165" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">a</text>

        {/* 時点b: インプット上のX=265 */}
        <line x1="265" y1="280" x2="265" y2="88" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="265" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">b</text>

        {/* 時点c: アウトプット上のX=330 */}
        <line x1="330" y1="280" x2="330" y2="152" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="330" y="295" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">c</text>

        {/* 区間A (水平) */}
        {/* X=165, Y=152 から X=330, Y=152 */}
        <line 
          x1="165" 
          y1="152" 
          x2="330" 
          y2="152" 
          stroke={showExplanation ? "#38bdf8" : "#94a3b8"} 
          strokeWidth={showExplanation ? "2.5" : "2"} 
          markerStart={showExplanation ? "url(#arrow-blue)" : "url(#arrow-gray)"}
          markerEnd={showExplanation ? "url(#arrow-blue)" : "url(#arrow-gray)"}
        />
        <rect x="235" y="138" width="30" height="18" rx="3" fill="#0f172a" stroke={showExplanation ? "#38bdf8" : "#475569"} strokeWidth="1" />
        <text x="250" y="152" textAnchor="middle" fill={showExplanation ? "#38bdf8" : "#e2e8f0"} fontSize="12" fontWeight="bold">A</text>
        {showExplanation && (
          <text x="250" y="125" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">滞留期間</text>
        )}

        {/* 区間B (垂直) */}
        {/* X=265, Y=88(上) から Y=210(下) */}
        <line 
          x1="265" 
          y1="88" 
          x2="265" 
          y2="210" 
          stroke={showExplanation ? "#f87171" : "#94a3b8"} 
          strokeWidth={showExplanation ? "2.5" : "2"} 
          markerStart={showExplanation ? "url(#arrow-red)" : "url(#arrow-gray)"}
          markerEnd={showExplanation ? "url(#arrow-red)" : "url(#arrow-gray)"}
        />
        <rect x="275" y="138" width="30" height="18" rx="3" fill="#0f172a" stroke={showExplanation ? "#f87171" : "#475569"} strokeWidth="1" />
        <text x="290" y="152" textAnchor="middle" fill={showExplanation ? "#f87171" : "#e2e8f0"} fontSize="12" fontWeight="bold">B</text>
        {showExplanation && (
          <text x="320" y="152" textAnchor="left" fill="#f87171" fontSize="11" fontWeight="bold">在庫量</text>
        )}
      </svg>
    </div>
  );
};

// 問題3解説: 流動数曲線の一般的な説明図
const FlowAnalysisExplainSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="400" height="280" viewBox="0 0 400 280" className="max-w-full text-slate-300 select-none">
        <defs>
          <marker id="arrow-blue-ex" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#38bdf8" />
          </marker>
          <marker id="arrow-red-ex" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#f87171" />
          </marker>
        </defs>

        <text x="200" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">流動数曲線の基本概念</text>
        
        {/* 軸 */}
        <line x1="50" y1="240" x2="370" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="240" x2="50" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="370" y="255" textAnchor="end" fill="#94a3b8" fontSize="11">時間</text>
        <text x="35" y="45" textAnchor="middle" fill="#94a3b8" fontSize="11" writingMode="tb">累積量</text>

        {/* 累積流入・累積流出 */}
        <path d="M 50,190 L 150,130 L 250,110 L 350,70" fill="none" stroke="#a7f3d0" strokeWidth="2" />
        <path d="M 50,240 L 150,200 L 250,160 L 350,110" fill="none" stroke="#fda4af" strokeWidth="2" />
        
        <text x="290" y="60" fill="#a7f3d0" fontSize="10" fontWeight="bold">累積流入量（入荷）</text>
        <text x="290" y="130" fill="#fda4af" fontSize="10" fontWeight="bold">累積流出量（出荷）</text>

        {/* 在庫量 (垂直) */}
        <line x1="180" y1="124" x2="180" y2="188" stroke="#f87171" strokeWidth="2" markerStart="url(#arrow-red-ex)" markerEnd="url(#arrow-red-ex)" />
        <text x="190" y="160" fill="#f87171" fontSize="11" fontWeight="bold">在庫量</text>

        {/* 滞留時間 (水平) */}
        <line x1="180" y1="124" x2="278" y2="124" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-blue-ex)" markerEnd="url(#arrow-blue-ex)" />
        <text x="229" y="142" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">滞留時間</text>
      </svg>
    </div>
  );
};

// 問題4解説: P-Q分析グラフ
const PQChartSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="400" height="260" viewBox="0 0 400 260" className="max-w-full text-slate-300 select-none">
        <text x="200" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">P-Q分析 (生産量-品種分析)</text>
        
        {/* 軸 */}
        <line x1="50" y1="210" x2="370" y2="210" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="210" x2="50" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="370" y="225" textAnchor="end" fill="#94a3b8" fontSize="10">製品の種類(P)</text>
        <text x="35" y="45" textAnchor="middle" fill="#94a3b8" fontSize="10" writingMode="tb">生産量(Q)</text>

        {/* 棒グラフ (高い順) */}
        {/* Aグループ */}
        <rect x="60" y="70" width="20" height="140" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
        <rect x="85" y="90" width="20" height="120" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
        <rect x="110" y="110" width="20" height="100" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />

        {/* Bグループ */}
        <rect x="145" y="130" width="20" height="80" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <rect x="170" y="145" width="20" height="65" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <rect x="195" y="155" width="20" height="55" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

        {/* Cグループ */}
        <rect x="230" y="170" width="20" height="40" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
        <rect x="255" y="178" width="20" height="32" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
        <rect x="280" y="185" width="20" height="25" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
        <rect x="305" y="192" width="20" height="18" fill="#86efac" stroke="#16a34a" strokeWidth="1" />

        {/* Aの赤点線枠 */}
        <rect x="55" y="65" width="80" height="150" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="95" y="55" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">製品別レイアウト</text>
        <text x="95" y="130" textAnchor="middle" fill="#ea580c" fontSize="12" fontWeight="bold">Aグループ</text>

        {/* Bの赤点線枠 */}
        <rect x="140" y="125" width="80" height="90" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="180" y="240" textAnchor="middle" fill="#eab308" fontSize="10" fontWeight="bold">B:グループ別</text>
        <text x="180" y="170" textAnchor="middle" fill="#ca8a04" fontSize="12" fontWeight="bold">Bグループ</text>

        {/* Cの赤点線枠 */}
        <rect x="225" y="165" width="105" height="50" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="277" y="155" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">機能別レイアウト</text>
        <text x="277" y="195" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="bold">Cグループ</text>
      </svg>
    </div>
  );
};

// 問題4解説: 運搬活性分析グラフ
const ActivityAnalysisSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="400" height="260" viewBox="0 0 400 260" className="max-w-full text-slate-300 select-none">
        <text x="200" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">運搬活性分析 (活性示数の推移)</text>
        
        {/* 軸 */}
        <line x1="60" y1="210" x2="370" y2="210" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="60" y1="210" x2="60" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="370" y="225" textAnchor="end" fill="#94a3b8" fontSize="10">工程</text>
        <text x="40" y="45" textAnchor="middle" fill="#94a3b8" fontSize="10" writingMode="tb">活性示数</text>

        {/* 縦軸ラベル 0〜4 */}
        {[0, 1, 2, 3, 4].map((v) => (
          <g key={v}>
            <text x="50" y={210 - v * 35 + 4} fill="#cbd5e1" fontSize="10" textAnchor="end">{v}</text>
            <line x1="60" y1={210 - v * 35} x2="360" y2={210 - v * 35} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        ))}

        {/* 各工程 */}
        {/* 
          1: 床にバラ(0) X=80
          2: 台車に積む(3) X=130
          3: 台車で運ぶ(4) X=180
          4: パレットに置く(2) X=230
          5: 車で運ぶ(4) X=280
          6: 床に置く(0) X=330
        */}
        {[
          { label: "バラ置き", active: 0, x: 80, name: "床バラ置き" },
          { label: "台車積", active: 3, x: 130, name: "台車に積む" },
          { label: "台車運", active: 4, x: 180, name: "台車で運ぶ" },
          { label: "パレット置", active: 2, x: 230, name: "パレット置" },
          { label: "車で運ぶ", active: 4, x: 280, name: "車で運ぶ" },
          { label: "床に置く", active: 0, x: 330, name: "床に置く" }
        ].map((pt, idx, arr) => {
          const py = 210 - pt.active * 35;
          return (
            <g key={idx}>
              <circle cx={pt.x} cy={py} r="4" fill="#f87171" />
              {idx < arr.length - 1 && (
                <line 
                  x1={pt.x} 
                  y1={py} 
                  x2={arr[idx+1].x} 
                  y2={210 - arr[idx+1].active * 35} 
                  stroke="#ef4444" 
                  strokeWidth="2.5" 
                />
              )}
              {/* 斜め配置のテキスト */}
              <text x={pt.x} y="222" fill="#94a3b8" fontSize="8" textAnchor="middle" transform={`rotate(15, ${pt.x}, 225)`}>{pt.label}</text>
              <text x={pt.x} y={py - 8} fill="#f87171" fontSize="9" textAnchor="middle" fontWeight="bold">{pt.active}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 問題4解説: 流れ線図
const FlowDiagramSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="360" height="360" viewBox="0 0 360 360" className="max-w-full text-slate-300 select-none">
        <text x="180" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">流れ線図の例</text>
        
        {/* 工場枠 */}
        <rect x="40" y="60" width="280" height="280" fill="none" stroke="#94a3b8" strokeWidth="2" />
        
        {/* 材料倉庫 & 完成品置場 */}
        <polygon points="100,30 120,30 110,50" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <text x="110" y="22" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">材料倉庫</text>
        
        <polygon points="250,30 270,30 260,50" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <text x="260" y="22" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">完成品置場</text>

        {/* レイアウトボックス */}
        <rect x="50" y="130" width="45" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <text x="72.5" y="153" fill="#854d0e" fontSize="9" textAnchor="middle" fontWeight="bold">加工機械</text>

        <rect x="50" y="190" width="45" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <text x="72.5" y="213" fill="#854d0e" fontSize="9" textAnchor="middle" fontWeight="bold">加工機械</text>

        <rect x="50" y="250" width="45" height="40" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1" rx="2" />
        <text x="72.5" y="273" fill="#1e40af" fontSize="9" textAnchor="middle" fontWeight="bold">検査機械</text>

        <rect x="140" y="130" width="45" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <text x="162.5" y="153" fill="#854d0e" fontSize="9" textAnchor="middle" fontWeight="bold">加工機械</text>

        <rect x="140" y="250" width="45" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <text x="162.5" y="273" fill="#854d0e" fontSize="9" textAnchor="middle" fontWeight="bold">加工機械</text>

        <rect x="265" y="130" width="45" height="40" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1" rx="2" />
        <text x="287.5" y="153" fill="#1e40af" fontSize="9" textAnchor="middle" fontWeight="bold">検査機械</text>

        <rect x="265" y="190" width="45" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <text x="287.5" y="213" fill="#854d0e" fontSize="9" textAnchor="middle" fontWeight="bold">加工機械</text>

        {/* 流れ線 (左から入ってUターンして右へ) */}
        {/* 左の下り線 */}
        <path d="M 110,50 L 110,290 L 250,290 L 250,50" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />

        {/* 線上の工程記号 (簡略化) */}
        {/* 左側 */}
        <circle cx="110" cy="80" r="4" fill="#6366f1" />
        <polygon points="105,100 115,100 110,112" fill="#0ea5e9" />
        <circle cx="110" cy="125" r="4" fill="#6366f1" />
        <circle cx="110" cy="150" r="9" fill="none" stroke="#6366f1" strokeWidth="1.5" /> {/* 加工 */}
        <circle cx="110" cy="175" r="4" fill="#6366f1" />
        <circle cx="110" cy="210" r="9" fill="none" stroke="#6366f1" strokeWidth="1.5" /> {/* 加工 */}
        <circle cx="110" cy="240" r="4" fill="#6366f1" />
        <polygon points="110,250 118,260 110,270 102,260" fill="none" stroke="#e11d48" strokeWidth="1.5" /> {/* 検査 */}

        {/* ボトム */}
        <circle cx="180" cy="290" r="9" fill="none" stroke="#6366f1" strokeWidth="1.5" />

        {/* 右側 */}
        <circle cx="250" cy="250" r="9" fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="250" cy="225" r="4" fill="#6366f1" />
        <path d="M 243,190 L 250,190 A 8,8 0 0,1 250,206 L 243,206 Z" fill="none" stroke="#eab308" strokeWidth="1.5" /> {/* 滞留 */}
        <circle cx="250" cy="170" r="4" fill="#6366f1" />
        <polygon points="250,135 258,145 250,155 242,145" fill="none" stroke="#e11d48" strokeWidth="1.5" /> {/* 検査 */}
        <polygon points="244,70 256,70 250,80" fill="none" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

// 問題10解説: 作業測定分類ツリー
const WorkMeasurementTreeSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="460" height="280" viewBox="0 0 460 280" className="max-w-full text-slate-300 select-none">
        <text x="230" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">作業測定の体系</text>

        {/* レベル1: 作業測定 */}
        <rect x="10" y="115" width="80" height="40" rx="5" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
        <text x="50" y="139" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">作業測定</text>

        {/* 線 レベル1 -> レベル2 */}
        <path d="M 90,135 L 120,135 L 120,75 L 140,75 M 120,135 L 120,195 L 140,195" fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* レベル2: 稼動分析 */}
        <rect x="140" y="55" width="80" height="40" rx="5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <text x="180" y="79" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontWeight="bold">稼動分析</text>

        {/* レベル2: 時間研究 */}
        <rect x="140" y="175" width="80" height="40" rx="5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <text x="180" y="199" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontWeight="bold">時間研究</text>

        {/* 線 稼動分析 -> レベル3 */}
        <path d="M 220,75 L 240,75 L 240,50 L 260,50 M 240,75 L 240,100 L 260,100" fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* レベル3 (稼動分析下) */}
        <rect x="260" y="32" width="90" height="30" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
        <text x="305" y="50" fill="#94a3b8" fontSize="10" textAnchor="middle">連続観測法</text>

        <rect x="260" y="82" width="90" height="30" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
        <text x="305" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle">瞬間観測法</text>

        {/* 線 時間研究 -> レベル3 */}
        <path d="M 220,195 L 240,195 L 240,165 L 260,165 M 240,195 L 240,230 L 260,230" fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* レベル3 (時間研究下) */}
        <rect x="260" y="150" width="80" height="30" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
        <text x="300" y="168" fill="#cbd5e1" fontSize="10" textAnchor="middle">直接測定法</text>
        <text x="350" y="168" fill="#38bdf8" fontSize="9" fontWeight="bold">ストップウォッチ法</text>

        <rect x="260" y="215" width="80" height="30" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
        <text x="300" y="233" fill="#cbd5e1" fontSize="10" textAnchor="middle">間接測定法</text>
        
        <text x="350" y="226" fill="#38bdf8" fontSize="9" fontWeight="bold">PTS法、標準資料法</text>
        <text x="350" y="240" fill="#38bdf8" fontSize="9" fontWeight="bold">経験見積法</text>
      </svg>
    </div>
  );
};

// 問題15解説: 余裕率ブロック
const AllowanceBlockSVG = () => {
  return (
    <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-center mt-3">
      <svg width="420" height="260" viewBox="0 0 420 260" className="max-w-full text-slate-300 select-none">
        {/* 内掛け法 */}
        <g>
          <text x="10" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold">内掛け法（標準時間基準）</text>
          {/* 正味時間 */}
          <rect x="10" y="35" width="240" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <text x="130" y="54" fill="#cbd5e1" fontSize="11" textAnchor="middle">正味時間 (80)</text>
          
          {/* 余裕時間 */}
          <rect x="250" y="35" width="60" height="30" fill="#78350f" stroke="#ca8a04" strokeWidth="1" />
          <text x="280" y="54" fill="#f59e0b" fontSize="11" textAnchor="middle">余裕 (20)</text>

          {/* 全体 (標準時間) */}
          <rect x="10" y="75" width="300" height="25" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
          <text x="160" y="91" fill="#a5b4fc" fontSize="11" textAnchor="middle">標準時間 (100)</text>

          {/* 矢印 (余裕 / 標準時間) */}
          <path d="M 330,35 L 330,100" stroke="#f87171" strokeWidth="1.5" markerStart="url(#arrow-red-ex)" markerEnd="url(#arrow-red-ex)" />
          <text x="340" y="72" fill="#f87171" fontSize="11" fontWeight="bold">20 / 100 = 20%</text>
        </g>

        {/* 外掛け法 */}
        <g transform="translate(0, 130)">
          <text x="10" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold">外掛け法（正味時間基準）</text>
          {/* 正味時間 */}
          <rect x="10" y="35" width="240" height="30" fill="#065f46" stroke="#059669" strokeWidth="1" />
          <text x="130" y="54" fill="#a7f3d0" fontSize="11" textAnchor="middle">正味時間 (80)</text>
          
          {/* 余裕時間 */}
          <rect x="250" y="35" width="60" height="30" fill="#78350f" stroke="#ca8a04" strokeWidth="1" />
          <text x="280" y="54" fill="#f59e0b" fontSize="11" textAnchor="middle">余裕 (20)</text>

          {/* 全体 */}
          <rect x="10" y="75" width="300" height="25" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <text x="160" y="91" fill="#94a3b8" fontSize="11" textAnchor="middle">標準時間 (100)</text>

          {/* 矢印 (余裕 / 正味時間) */}
          <path d="M 130,50 L 280,50" stroke="#f87171" strokeWidth="1.5" markerStart="url(#arrow-red-ex)" markerEnd="url(#arrow-red-ex)" />
          <text x="200" y="42" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">20 / 80 = 25%</text>
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// 全クイズ問題データ（完全ノーカット収録）
// ==========================================
const QUESTIONS = [
  {
    id: 1,
    title: "問題 1 製品工程分析 【令和4年　第13問】",
    year: "過去問 4-13",
    type: "past_exam",
    question: "部品Ａ、Ｂ、Ｃを用いて製品Ｘが製造される生産の流れについて、製品工程分析を行った結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。",
    hasSvg: true,
    svgType: "product_process",
    options: [
      "ア　加工ａ、ｂ、ｃは、同期して加工している。",
      "イ　台車は11 台である。",
      "ウ　滞留を表す工程は、4 カ所である。",
      "エ　品質保証室での検査は、品質検査を主として行っているが、同時に数量検査も行っている。",
      "オ　部品Ａ、Ｂ、Ｃは、同じ倉庫にまとめて保管されている。"
    ],
    answer: 3,
    explanation: `製品工程分析に関する出題です。工程図記号の知識が求められています。記号の意味を理解していると容易に正解できる問題です。
製品工程分析は、製品が加工される流れを、運搬、検査、停滞を含めて表します。工程ごとに、作業の種類を表す工程図記号を用いて表します。

では、選択肢を見ていきましょう。
選択肢アは不適切な記述です。製品工程分析では、各工程が同期しているかどうかを読み取ることはできません。
選択肢イは不適切な記述です。製品工程分析では、台車の数までは表していません。この図からは、運搬（台車）工程が11か所あることだけが把握できます。
選択肢ウは不適切な記述です。滞留を表す工程図記号は3ヵ所です。4ヵ所あるのは貯蔵です。
選択肢エは適切な記述です。品質保証室での検査は、品質検査を主として行いながら数量検査も実施する複合記号で表されています。
選択肢オは不適切な記述です。製品工程分析では、同じ倉庫で保管しているかどうかを読み取ることはできません。
工程図記号は過去の本試験でよく出題されています。工程図記号を覚えておくと得点を稼ぎやすいので、記号の種類と意味を覚えておくと良いでしょう。

【ここが重要】
・製品工程分析では、同期生産かどうかの時間的情報は読み取れません。
・「台車」マークは「運搬」工程を表すだけで、台車の台数自体を示すものではありません。
・滞留（D）と貯蔵（▽）は区別する必要があります（Dは一時的な仮置き等で滞留、▽は計画的な保管で貯蔵）。
・複合記号「◇の中に□」は、品質検査を主（外側のひし形）として、同時に数量検査（内側の四角）を行うことを意味します。`
  },
  {
    id: 2,
    title: "問題 2 作業者工程分析 【平成26年　第17問】",
    year: "過去問 26-17",
    type: "past_exam",
    question: "以下の①～④に示す事象に対して作業者工程分析を行った。｢作業｣に分類された事象の数として、最も適切なものを下記の解答群から選べ。\n①対象物を左手から右手に持ち替える。\n②機械設備での対象物の加工を作作業者が監視する。\n③対象物を加工するための前準備や加工後の後始末をする。\n④出荷のために対象物の数量を確認する。",
    hasTable: false,
    options: [
      "ア　1個",
      "イ　2個",
      "ウ　3個",
      "エ　4個"
    ],
    answer: 1,
    explanation: `作業者工程分析に関する問題です。
作業者工程分析に関して細かい内容も問われており、やや難易度の高い問題です。
　まず、作業者工程分析について簡単に復習しておきましょう。

作業者工程分析
　作業者工程分析は、作業者の作業を中心に分析するものです。作業者工程分析では、図のように、加工（作業）、移動、手待ち、検査について、工程図記号で表します。
　ここまで押さえた上で、選択肢を見ていきましょう。
　選択肢①について、上図の作業者工程分析では、工程系列の加工（作業）〇に対しての作業者工程は、「材料を機械に取り付ける」が対象となっています。つまり、加工をしていなくても、「移動」「手待ち」「検査」以外は「加工（作業）」に分類されます。従って、「右から左に持ち替える」ことも加工（作業）に分類されます。よって選択肢①は適切です。
　選択肢②について、作業者工程分析は、作業者の作業を中心に分析するものです。「機械設備での対象物の加工を作業者が監視する」のは、作業者と機械という組み合わせによる作業であり、連合作業分析などにて分析されます。よって選択肢②は不適切です。
　選択肢③について、作業者工程分析では、対象物の加工そのものだけでなく、「加工するための前準備や加工後の後始末」も加工に含まれます。よって選択肢③は適切です。
　選択肢④について、「出荷のために対象物の数量を確認する」のは、作業者工程分析の検査にあたります。検査は作業に含まれません。なお、作業者工程分析では、数量検査と品質検査は分かれておらず、どちらも検査となります。よって選択肢④は不適切です。 　これらから、作業者工程分析の作業に分類されるのは、2個となります。よって、解答群の中でイが適切で正解となります。

【ここが重要】
・作業者工程分析では、「作業（加工）」「移動」「手待ち」「検査」に分類されます。
・持ち替え動作や、前準備・後始末は「作業（加工）」に分類されます。
・監視動作は作業者工程分析ではなく、人・機械分析（連合作業分析）の対象です。
・数量確認は「検査」に分類されます。`
  },
  {
    id: 3,
    title: "問題 3 流動数分析 【令和4年　第14問】",
    year: "過去問 4-14",
    type: "past_exam",
    question: "ある倉庫では、ある製品の入出庫管理が先入先出法で行われている。その製品の在庫状況を把握するために行った流動数分析の結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。",
    hasSvg: true,
    svgType: "flow_analysis",
    options: [
      "ア　Ａが示す区間の値は、時点ａにおける在庫量が倉庫に補充されるまでの期間である。",
      "イ　Ａが示す区間の値は、時点ａに入庫した製品の倉庫における滞留期間である。",
      "ウ　Ｂが示す区間の値は、時点ｂにおいて製品が倉庫に補充された量である。",
      "エ　Ｂが示す区間の値は、時点ｂにおける製品が倉庫から出荷された量である。",
      "オ　インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の在庫が多い。"
    ],
    answer: 1,
    explanation: `流動数分析に関する出題です。前年度の本試験でも類似問題が出題されていますので、過去問に取り組んでいた方は、容易に正解を選びやすい問題と言えます。
流動数分析とは、製造リードタイム、在庫レベル、生産ロット数、生産回数等の関係をひと目でわかるようにした「流動数曲線」というグラフを用いて行う分析のことです。縦軸に累積量、横軸に時間を取って、流入（入荷）と流出（出荷）の関係を2つの折れ線グラフで表します。

では、本問の流動数曲線を確認しながら、選択肢を見ていきましょう。

選択肢アは不適切な記述です。Aが示す区間の値は、時点aに入庫した製品が倉庫から出荷されるまでの滞留期間を示しています。在庫量が倉庫に補充されるまでの期間ではありません。
選択肢イは適切な記述です。選択肢アの解説のとおりです。Aが示す区間の値は、時点aに入庫した製品が倉庫から出荷されるまでの滞留期間を示しています。
選択肢ウは不適切な記述です。Bが示す区間の値は、時点bにおける倉庫の在庫量を示しています。倉庫に補充された量ではありません。
選択肢エは不適切な記述です。選択肢ウの解説のとおりです。Bが示す区間の値は、時点bにおける倉庫の在庫量を示しています。倉庫から出荷された量ではありません。
選択肢オは不適切な記述です。インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の滞留期間が長いことを示します。在庫量を表すのは垂直方向の間隔です。
流動数曲線は今後も出題される可能性があります。難しいグラフではありませんので、縦軸、横軸と2つの折れ線グラフの関係を読み取れるようにしておくと良いでしょう。

【ここが重要】
・流動数曲線の「水平方向の間隔（時間）」は「滞留時間（リードタイム）」を表します。
・流動数曲線の「垂直方向の間隔（累積量）」は「在庫量」を表します。`
  },
  {
    id: 4,
    title: "問題 4 物の流れの分析 【平成24年　第8問】",
    year: "過去問 24-8",
    type: "past_exam",
    question: "物の流れの分析手法に関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　P-Q チャートは、横軸に製品種類P をとり、縦軸に生産量Qをとって、生産量Qの大きい順に並べて作成される。",
      "イ　運搬活性示数は、対象品の移動のしやすさを示す数で、バラ置きの対象品を移動する場合、①まとめる、②起こす、③移動する、という３つの手間が必要となる。",
      "ウ　流れ線図（フローダイヤグラム）では、物や人の流れ、逆行した流れ、隘路、無用な移動、配置 of 不具合が視覚的に把握できる。",
      "エ　流入流出図表（フロムツウチャート）は、多品種少量の品物を生産している職場の、機械設備および作業場所の配置計画をするときに用いられる。"
    ],
    answer: 1,
    explanation: `物の流れの分析手法に関する出題です。
まず、それぞれの物の流れの分析手法について簡単に復習しておきましょう。

分析手法
P-Q チャートは、製品（Product）と生産量（Quantity）を分析する手法です。グラフの横軸には製品の種類（P）をとり、グラフの縦軸には生産量（Q）をとります。製品は生産量が多いものから少ないものに左から順番に並べます。
運搬活性示数とは、運搬活性分析で使用される数値であり、運搬のしやすさを表します。運搬活性分析は、どれぐらい運搬がしやすい状態になっているかを明らかにするための分析です。運搬活性示数は、0 から4 の間の数値を取り、0 がバラ置きの状態、1 が箱入りの状態、2 が枕 （パレット）置きの状態、3 が車上置きの状態、4 が移動中の状態となります。
流れ線図（フローダイヤグラム）は、工場などのレイアウト図の上に、工程図記号を記入することで、工程の流れを表すものです。物・人の動きや機械・設備の配置を視覚的に表すことができます。
流入流出図表（フロムツーチャート）は、工程間の物の流れを分析する手法です。各工程の間でどれぐらいの物量が流れているかを分析することができます。

ここまで押さえた上で選択肢を見ていきましょう。
選択肢アについて、P-Q チャートの作成手順を正しく示しています。よって、選択肢アは適切です。
選択肢イについて、運搬活性示数は、対象品の移動のしやすさを示す数という部分は適切です。しかし、バラ置きの対象品を移動する場合、まとめる、起こす、持ち上げる、移動する、という４つの手間が必要となります。選択肢の記述には「持ち上げる」が含まれていません。よって、選択肢イは不適切であり、これが正解です。
選択肢ウについて、流れ線図（フローダイヤグラム）は、物や人の流れ、機械・設備の配置を視覚的に把握できるという特徴を正しく表しています。よって選択肢ウは適切です。
選択肢エについて、流入流出図表（フロムツーチャート）は、多種少量生産の工程の分析や工場レイアウトの設計に用いられるという用途を正しく表しています。よって、選択肢エは適切です。
本問において、選択肢イは、運搬活性示数についてやや細かい点を問われています。しかし、他の選択肢が適切であることが分かれば、消去法でも解答できる問題です。

【ここが重要】
・バラ置き（活性示数0）の物を移動するには、「①まとめる」「②起こす」「③持ち上げる」「④移動する」の4つの手間が必要です。活性示数は「すでに省かれている手間の数」を意味するため、省かれている手間が0であるバラ置きは活性示数0となります。
・運搬活性示数の覚え方：
  0: バラ置き（手間4つ必要）
  1: 箱入れ（「まとめる」が不要。手間3つ必要）
  2: パレット置き（「起こす」も不要。手間2つ必要）
  3: 車上置き（「持ち上げる」も不要。手間1つ必要）
  4: 移動中（手間0で移動可能）`
  },
  {
    id: 5,
    title: "問題 5 フロムツーチャート【令和元年　第3問】",
    year: "過去問 1-3",
    type: "past_exam",
    question: "ある工場でＡ～Ｅの5台の機械間における運搬回数を分析した結果、次のフロムツウチャートが得られた。この表から読み取れる内容に関する記述として、最も適切なものを下記の解答群から選べ。",
    hasTable: true,
    tableType: "from_to_chart",
    options: [
      "ア　機械Aから他の全ての機械に品物が移動している。",
      "イ　逆流が一カ所発生している。",
      "ウ　他の機械からの機械Bへの運搬回数は12である。",
      "エ　最も運搬頻度が高いのは機械A・D間である。"
    ],
    answer: 3,
    explanation: `本問では、フロムツーチャートについて問われています。
フロムツーチャートの基本的な問題で難易度は高くありません。
では、選択肢を見ていきましょう。
選択肢アですが、機械Aから他の全ての機械に品物が移動しているとされていますが、機械Aから機械Eへ、機械Eから機械Aのいずれも空欄となっており、機械A・E間では移動していません。従って、不適切な記述です。
選択肢イは、逆流が一ヵ所発生している、とされていますが、機械D・A間で11回、機械E・B間で27回の二ヵ所で逆流が発生しており、不適切な記述です。
選択肢ウですが、他の機械から機械Bへの運搬回数は、機械A・B間の12回に加え、機械E・B間の27回があるため、運搬回数は39回となります。従って、不適切な記述です。
選択肢エですが、最も運搬頻度が多いのは機械A・D間であるとしています。機械A・D間では機械Aから機械Dへの運搬は25回、機械Dから機械Aへの運搬は11回の合計36回となっています。他の機械間運搬頻度では機械B・E間が多いですが、運搬回数は機械Bから機械Eへの運搬は4回、機械Eから機械Bへの運搬は27回で合計31回となり、機械A・D間の方が多くなっています。従って、適切な記述です。

【ここが重要】
・フロムツーチャートの対角線より「右上」は順流、「左下」は逆流を表します。本表では、D→Aの「11」と、E→Bの「27」が左下にあり、これらが逆流です。逆流は合計2か所で発生しています。
・機械間の往復運搬頻度は、From→ToとTo→Fromの数値を合計して比較します。
  - A・D間: A→D(25) + D→A(11) = 36回
  - B・E間: B→E(4) + E→B(27) = 31回`
  },
  {
    id: 6,
    title: "問題 6 マテリアルハンドリング 【平成29年　第13問】",
    year: "過去問 29-13",
    type: "past_exam",
    question: "工場内でのマテリアルハンドリングに関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　運搬活性示数は、置かれている物品を運び出すために必要となる取り扱いの手間の数を示している。",
      "イ　運搬管理の改善には、レイアウトの改善、運搬方法の改善、運搬制度の改善がある。",
      "ウ　運搬工程分析では、モノの運搬活動を｢移動｣と｢取り扱い｣の2つの観点から分析する。",
      "エ　平均活性示数は、停滞工程の活性示数の合計を停滞工程数で除した値として求められる。"
    ],
    answer: 0,
    explanation: `マテリアルハンドリングに関する出題です。
運搬活性示数の定義を抑えていれば正解できる基本的な問題です。
選択肢アは不適切な記述です。運搬活性示数は、物を移動するときに「すでに省かれている手間の数」を表し、０から４の間の数値を取ります。例えば、活性示数０は、床にバラ置きしてあるものを運搬する状態のことを指します。活性示数１は、箱に入っているものを運搬する状態のことで、まとめるという手順を省くことができます。このように、活性示数は大きいほうが効率的に運搬している状態となります。よって選択肢アは不適切で、正解です。
選択肢イは適切な記述です。運搬管理を改善するには、非効率な部分をなくすことが必要になります。具体的には、レイアウトの変更、運搬方法の改善、運搬制度の改善があります。これらの改善に取り組むことによって、運搬の効率化が図れるようになります。よって選択肢イは適切です。
選択肢ウは適切な記述です。運搬工程分析で用いられる運搬工程分析記号には、基本記号と台記号があり、このうち作業の種類を表すものは基本記号になります。基本記号には、移動、取り扱い、加工、停滞がありますが、加工と停滞は「モノの運搬活動」ではないため、モノの運搬活動を分析するときは、移動と取り扱いの２つの観点から行います。よって選択肢ウは適切です。
選択肢エは適切な記述です。平均活性示数は、停滞工程の活性示数の合計を停滞工程数で割った値として求めることができます。値が小さいほど物の置き方が非効率であり、移動のために多くの手間を要することになります。よって選択肢エは適切です。

【ここが重要】
・運搬活性示数は「必要となる手間の数」ではなく、「すでに省かれている手間の数」です（ここを引っ掛けてくる問題が非常に多いです）。
・運搬工程分析の基本記号は、「移動」と「取り扱い」の2つの観点で分類されます。`
  },
  {
    id: 7,
    title: "問題 7 サーブリッグ分析 【平成28年　第17問】",
    year: "過去問 28-17",
    type: "past_exam",
    question: "サーブリッグ分析で用いられる記号は、次の3つに分類される。\n第1類：仕事を行ううえで必要な動作要素\n第2類：第1類の作業の実行を妨げる動作要素\n第3類：作業を行わない動作要素\n下表は、｢部品容器から左手で取り出した部品を右手に持ち換えた後、ある定められた位置に部品を定置する動作｣をサーブリッグ分析したものである。この動作の中で第1類に分類される左手の動作要素の数と右手の動作要素の数の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    hasTable: true,
    tableType: "therblig_table",
    options: [
      "ア　左手：3個　右手：2個",
      "イ　左手：4個　右手：3個",
      "ウ　左手：5個　右手：4個",
      "エ　左手：6個　右手：5個"
    ],
    answer: 2,
    explanation: `サーブリッグ分析に関する出題です。サーブリッグ分析の結果から動作要素を読み取る必要があり、やや難易度の高い問題です。

サーブリッグ分析とは、作業者の動作を18の基本動作に分解して分析する手法をいいます。18の基本動作は大きく３つに分類できます。
上記の表より、第1類に該当する動作要素の数は、左手が５個、右手が４個となり、選択肢ウが正解です。
サーブリッグ分析は度々出題されています。18の基本動作やサーブリッグ記号を全て覚える必要はありませんが、レイアウト図や分析表は読み取れるようにしておきましょう。

【ここが重要】
・第1類（仕事に必要な動作）: 手を伸ばす(TE)、つかむ(G)、運ぶ(TL)、放す(RL)、使う(U)、組み立てる(A)、分解する(DA)、調べる(I)。
・第2類（第1類を遅らせる動作）: 探す(SH)、見出す(F)、選ぶ(ST)、位置決め(P)、考える(PN)、前置き(PP)。
・第3類（仕事を進めない動作）: 保持(H)、休む(R)、避けられない遅れ(UD)、避けるべき遅れ(AD)。

本問の左手の動作分類：
1. 部品に手を伸ばす (TE) -> 第1類
2. 部品を選ぶ (ST) -> 第2類
3. 部品をつかむ (G) -> 第1類
4. 部品を運ぶ (TL) -> 第1類
5. 部品を保持する (H) -> 第3類
6. 部品をはなす (RL) -> 第1類
7. 手元に手を戻す (TE) -> 第1類
8. 避け得ぬ遅れ (UD) -> 第3類
9. 避け得ぬ遅れ (UD) -> 第3類
10. 避け得ぬ遅れ (UD) -> 第3類
左手の第1類: TE, G, TL, RL, TE の計5個。

本問の右手の動作分類：
1. 避け得ぬ遅れ (UD) -> 第3類
2. 避け得ぬ遅れ (UD) -> 第3類
3. 避け得ぬ遅れ (UD) -> 第3類
4. 避け得ぬ遅れ (UD) -> 第3類
5. 部品をつかむ (G) -> 第1類
6. 部品を保持する (H) -> 第3類
7. 部品を運ぶ (TL) -> 第1類
8. 部品を位置決めする (P) -> 第2類
9. 部品をはなす (RL) -> 第1類
10. 手元に手を戻す (TE) -> 第1類
右手の第1類: G, TL, RL, TE の計4個。`
  },
  {
    id: 8,
    title: "問題 8 標準作業 【平成28年　第14問】",
    year: "過去問 28-14",
    type: "past_exam",
    question: "作業管理に利用される「標準作業」に関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　作業管理者を中心に、IEスタッフや現場作業者の意見を入れて全員が納得した作業でなければならない。",
      "イ　作業者の教育・訓練の基礎資料とするため、熟練作業者であれば実施可能になる最善の作業でなければならない。",
      "ウ　生産の構成要素である4M（Man, Machine, Material ,Method）を有効に活用した作業でなければならない。",
      "エ　製品または部品の製造工程全体を対象にした作業順序・作業方法・管理方法・使用設備などに関する基準の規定でなければならない。"
    ],
    answer: 1,
    explanation: `標準作業に関する問題です。
ある程度、常識的に判断することが可能な問題です。
　それでは選択肢を見ていきましょう。
　選択肢アですが、標準作業の作成は、対象の管理者が中心に、技術やIEスタッフ、現場作業者などの意見を取り入れて、全員が納得し、実施できる最善の方法を採用することが重要です。したがって、適切な記述です。
　選択肢イを見てみましょう。標準作業は熟練作業者だけでなく、仕事に対する標準的な適性を持っているすべての作業者が実施可能となる最善の作業でなければなりません。したがって不適切な記述です。
　選択肢ウを見てみましょう。標準作業は製品または部品の生産を対象に、作業の目的である「よい品質のものを、より安く、より早く」しかも「より安全」に行うために、生産の構成要素である4M（man, machine, material, method）を有効活用した作業でなければなりません。したがって、適切な記述です。
　選択肢エを見てみましょう。標準作業とは、製品または部品の製造工程全体を対象にした作業条件、作業順序、作業方法、管理方法、使用材料、使用設備、作業要領などに関する基準の規定です。したがって、適切な記述です。

【ここが重要】
・標準作業は「熟練作業者」ではなく、「標準的な適性を持つすべての作業者」が実施できるものでなければなりません。一部の熟練者しかできない作業を標準にすると、ライン生産などでボトルネックや品質のばらつきが発生します。`
  },
  {
    id: 9,
    title: "問題 9 PTS法【平成30年　第15問】",
    year: "過去問 30-15",
    type: "past_exam",
    question: "新製品を組み立てるための標準時間をPTS（Predetermined Time Standard）法を利用して算定することにした。標準時間を設定するための準備に関する記述として、最も適切なものの組み合わせを下記の解答群から選べ。\nａ　PTS 法で算定された標準時間を組立作業を行う作業者の習熟度に応じて調整するために、作業者の組立職場での就業年数を調査した。\nｂ　設備による加工時間を別途付与するために、設備で試加工を実施して加工時間を計測した。\nｃ　標準時間を見積もるための基礎資料を整備するために、既存製品の組立作業に対して時間分析を実施した。\nｄ　試作品を組み立てるための模擬ラインを敷設して、製品組立の標準作業を決定した。",
    options: [
      "ア　ａとｂ",
      "イ　ａとｄ",
      "ウ　ｂとｃ",
      "エ　ｂとｄ"
    ],
    answer: 3,
    explanation: `本問は、PTS法で標準時間を設定するための準備について問われています。
まずPTS法や、その他の標準時間を設定する方法について、簡単に復習しておきましょう。
　PTS法は、動作を微動作（サーブリッグ）のレベルに分解し、あらかじめ定められた微動作ごとの標準時間を合計する方法です。この方法は他の方法に比べ、より細かい微動作まで分解するのが特徴です。
　ここまで押さえた上で、選択肢をみていきましょう。
　ａですが、「標準時間を組立作業を行う作業者の習熟度に応じて調整する」という作業は、実際に観測した作業時間を正味時間に修正する「レイティング」のことです。例えば、作業が早い作業者を基に正味時間を設定してしまうと、標準時間としては相応しくないものになってしまいます。そのため、レイティング係数という数値を使って作業者による時間の個人差が生じないよう調整を行います。PTS法では、前述の通り細かく分解された微動作を基に標準時間を設定し、このレイティングの作業を行うことはありません。よって、ａは不適切です。
　ｂですが、設備によって加工を行う場合、作業者の作業時間とは別に、設備による加工時間を把握した上で、作業者の作業時間に別途付与する必要があります。そのため、設備で試加工を実施して加工時間を計測することで、その設備による加工時間を把握することができます。よって、ｂは適切です。
　ｃですが、「標準時間を見積もるための基礎資料を整備する」という作業は、直接時間を観測せずに、あらかじめ用意しておいた作業要素別の標準時間を合計することで、標準時間を合成する「標準時間資料法」という方法を指しています。これは、直接時間を観測せずに、標準時間を求めることができるものであり、毎回時間を観測する手間を削減するメリットがあります。PTS法では、前述の通り細かく分解された微動作を基に標準時間を設定しますので、標準時間資料法を用いて、既存製品の組立作業に対して時間分析を実施する必要はありません。よって、ｃは不適切です。
　ｄですが、PTS法を含め、標準時間を設定するには、対象となる標準作業を決定する必要があります。製品組立の標準作業を決定するために、試作品を組み立てるための模擬ラインを敷設することは、標準作業の基となるラインの配置や設備を定めることができ、標準時間を設定する準備として有効な方法です。よって、ｄは適切です。
　したがって、ｂとｄの組み合わせ適切であり、エが正解です。
　標準時間設定の方法は、PTS法や標準時間資料法の他に、ストップウォッチ法、実績資料法などがあります。頻出ではありませんが、ある程度の出題実績がある論点ですので、基本的な流れについて理解を深めておきましょう。

【ここが重要】
・PTS法は「既定時間基準法」であり、作業観測を行わない間接測定法です。そのため、観測時間を評価・修正する「レイティング」作業は不要です。
・機械による自動加工時間（機械サイクル時間）は、PTS法でカバーできないため、別途試加工などで計測して付与する必要があります。
・標準時間を設定する大前提として、まずは「標準作業」を決定（模擬ライン等の構築）する必要があります。`
  },
  {
    id: 10,
    title: "問題 10 作業測定【令和3年　第17問】",
    year: "過去問 3-17",
    type: "past_exam",
    question: "作業測定に関する記述として、最も適切なものはどれか。",
    options: [
      "ア　PTS 法では、作業設計が終了した後、その作業を正確に再現して実測しなければ標準時間を求めることができない。",
      "イ　間接測定法である標準時間資料法は、過去に測定された作業単位ごとに資料化されている時間値を使って標準時間を求めるもので、類似の作業が多い職場に適している。",
      "ウ　直接測定法であるストップウオッチ法は、作業を要素作業または単位作業に分割して直接測定する方法で、サイクル作業には適していない。",
      "エ　人と機械が共同して行っているような作業における手待ちロスや停止ロスの改善を実施する場合には、人と機械に1人ずつ観測者がついて工程分析を行う必要がある。"
    ],
    answer: 1,
    explanation: `作業測定に関する出題です。作業測定の様々な測定方法や特徴について問われており、やや難易度の高い問題です。
作業測定とは、「作業又は製造方法の実施効率の評価及び標準時間を設定するための手法」（JIS Z 8141-5104）と定義されています。つまり、作業の効率を測定して標準時間を設定するための手法です。作業測定は「稼動分析」と「時間研究」から構成されます。

では、選択肢を見ていきましょう。
選択肢アは不適切な記述です。PTS法は、動作を微動作のレベルに分解し、あらかじめ定められた微動作ごとの標準時間を合計する方法です。つまり、微動作ごとに規定されている時間を積み上げて合計の作業時間を求めますので、基本的に作業設計が終了したあとに作業を再現して実測する必要はありません。
選択肢イは適切な記述です。標準時間資料法は、作業時間を直接観測しない間接測定法の１つです。過去に測定された「作業単位ごとに資料化されている時間軸」を、作業条件に合わせて合成し、標準時間を求めていきます。事前に細かい作業単位で標準時間を定めておく必要があるため、類似の作業が多い職場に適しています。
選択肢ウは不適切な記述です。ストップウオッチ法とは、作業の要素ごとにストップウオッチで時間を測定し、レイティングを行って標準時間を設定する方法です。繰り返し遂行されるサイクル作業に適しています。
選択肢エは不適切な記述です。人と機械が共同して行っている作業を分析する手法を人・機械分析（連合作業分析の一種）といいます。人・機械分析は1人でも可能であり、必ずしも人と機械に1人ずつ観測者がつく必要はありません。
作業測定は頻出テーマです。作業測定に用いられる測定方法について、しっかり理解しておきましょう。

【ここが重要】
・作業測定の分類:
  - 直接測定法 (実際にストップウォッチ等で計測): ストップウォッチ法
  - 間接測定法 (あらかじめ規定された値や資料から計算): PTS法、標準時間資料法、実績資料法
・PTS法は「実測不要」で、作業設計段階（図面や作業手順書のみ）で標準時間を算定できるのが最大のメリットです。
・ストップウォッチ法は、短サイクルで繰り返される「サイクル作業」に極めて適しています。`
  },
  {
    id: 11,
    title: "問題 11 ワークサンプリング法 【平成28年　第16問】",
    year: "過去問 28-16",
    type: "past_exam",
    question: "人の作業者が電気部品の組み立てを行っている工程でワークサンプリング法を実施した結果が下表に示されている。この実施結果から算出される｢主体作業｣と｢職場余裕｣の時間構成比率の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    hasTable: true,
    tableType: "work_sampling",
    options: [
      "ア　主体作業：58％　職場余裕：11％",
      "イ　主体作業：58％　職場余裕：12％",
      "ウ　主体作業：70％　職場余裕：11％",
      "エ　主体作業：70％　職場余裕：12％"
    ],
    answer: 2,
    explanation: `稼働分析の手法の１つであるワークサンプリング法における、作業分類に関する問題です。
ワークサンプリング法とは、作業者や機械が何をしているかを瞬間的に観測して記録し、その記録を集計して稼働状況を統計的に求める手法です。観測の目的として、作業者や機械の稼働状況の把握や、一連 of 作業に対して適切な余裕率を設定する場合などに行われます。度数とは、繰り返し観測された作業項目の出現頻度を表します。
この問題では、稼働分析における作業分類の知識が問われています。作業分類は次のように分けられます。

分類の説明：
- 作業
  - 主体作業
    - 主作業: 材料を加工したり、部品を組み立てたりする、本来の作業
    - 付随作業: 主作業に付随して規則的に発生し、作業の目的に間接的に関与する作業
  - 準備段取作業: ロットごと、もしくは始業や終業時に発生する、準備や段取、後始末など
- 余裕
  - 管理余裕
    - 作業余裕: 必要な作業であるが、不規則、偶発的に発生する作業
    - 職場余裕: 作業の管理に必要な余裕
  - 人的余裕
    - 用達余裕: 休憩やトイレに行くなど人間的な要素で必要な余裕
    - 疲労余裕: 作業による疲労を回復するための余裕
- 非作業: 作業者の個人的理由や怠惰により発生するもの

「主体作業」とは、製品を直接生産している作業のことであり、作業サイクルに対して毎回又は一定 of 周期で行われる作業を指します。この主体作業は、直接的に加工や組み立てをしている「主作業」と、その主作業に伴って間接的に発生する「付随作業」に分けられます。
「職場余裕」とは、本来の作業とは無関係に発生する職場特有の遅れを指します。例えば、朝礼や職場内の打ち合わせ、作業指導や掃除の時間など、管理のやり方によって生じてしまう「作業ができない時間」の事です。

上記の分類を踏まえて、与えられた作業項目を分類すると次のようになります。
- ハンダ付け (度数: 120) -> 主体作業（主作業）
- 基盤への部品の取り付け (度数: 90) -> 主体作業（主作業）
- 基盤のネジ止め (度数: 80) -> 主体作業（主作業）
- 組立作業完了後の製品検査(全数) (度数: 60) -> 主体作業（付随作業）
- ロット単位での完成部品の運搬 (度数: 33) -> 準備段取作業
- 不良品の手直し (度数: 30) -> 作業余裕
- ネジ・ハンダの補充(不定期) (度数: 22) -> 作業余裕
- 部品不足による手待ち (度数: 24) -> 職場余裕
- 打ち合わせ (度数: 19) -> 職場余裕
- 朝礼 (度数: 12) -> 職場余裕
- 水飲み (度数: 5) -> 用達余裕
- 用便 (度数: 5) -> 用達余裕
合計度数: 500

表より、主体作業には、主作業に分類される「ハンダ付け」「基盤への部品の取り付け」「基盤のネジ止め」と、付随作業に分類される「組立作業完了後の製品検査(全数)」が該当します。
職場余裕には「部品不足による手待ち」「打ち合わせ」「朝礼」が該当します。

ここから、主体作業及び職場余裕の度数の合計は、それぞれ以下の通りとなります。
主体作業 = 120 ＋ 90 ＋ 80 ＋ 60 = 350
職場余裕 = 24 ＋ 19 ＋ 12 = 55
度数の合計が500であるため、主体作業及び職場余裕の度数の合計を500で割り、時間構成比率を計算します。
主体作業 = 350 ÷ 500 × 100 = 70%
職場余裕 = 55 ÷ 500 × 100 = 11%
よって、正解はウになります。

補足
◆主作業と付随作業
主体作業は、主作業と付随作業に分類されます。主作業は材料を加工したり、部品を組み立てたりする作業です。付随作業は主作業に付随して規則的に発生し、主作業に間接的に寄与する作業です。付随作業には、機械の電源オンオフや製品検査が該当します。主体作業の分類の際には付随作業も注意して見ていきましょう。`
  },
  {
    id: 12,
    title: "問題 12 時間計測と分析 【平成28年　第15問】",
    year: "過去問 28-15",
    type: "past_exam",
    question: "作業改善を目的とした時間測定と分析に関する記述として、最も適切なものはどれか。",
    options: [
      "ア　作業時間が管理状態にあるかどうかを確認するために、pn管理図を作成して分析した。",
      "イ　作業時間の測定精度を高めるために、やり直しを行った作業等の異常値は記録から除外して測定を行った。",
      "ウ　作業方法の変化を見つけ易くするために、作業の各サイクルに規則的に表れる要素作業と不規則に表れる要素作業は区別して時間測定を行った。",
      "エ　測定対象となる作業者に心理的な負担を与えないために、測定の実施を事前に通告せずに作業者から見えない場所で測定を行った。"
    ],
    answer: 2,
    explanation: `作業改善を目的とした時間計測と分析に関する問題です。連続観測法 (連続稼働分析) を理解していれば、ある程度まで選択肢を絞り込むことが可能です。
連続観測法は、観測対象に付きっきりで観測する方法です。
連続観測法のメリットは、詳細に作業を分析できるため、問題点の細かい分析に適していることです。一方、デメリットは作業者が観測されることを意識して、偏ったデータになる可能性があることです。

ここまで押さえた上で、選択肢を見ていきましょう。
選択肢アについて、pn管理図は計数値に対する管理図であるため、計量値である作業時間を管理する用途には向いていません。この場合は、Xbar-R管理図を用いて作業時間が管理状態にあるかどうかを確認します。よって、選択肢アは不適切です。
選択肢イについて、異常値を記録から除外すると、改善対象となる要素作業や異常の復旧に要する時間を記録できなくなります。そのため、その要素作業が改善対象とならずに、作業改善を実行できなくなります。よって、選択肢イは不適切です。
選択肢ウについて、規則的に表れる要素作業と不規則に表れる要素作業を区別して時間測定を行うと、規則的に表れる要素作業に要する時間の変化から、作業方法が変化したことを見つけやすくなります。よって、選択肢ウは適切です。
選択肢エについて、測定対象となる作業者には、心理的負荷を軽減するために、観測目的を理解してもらい協力を得るようにします。これを行わない場合、正しく時間を測定できない可能性があります。よって、選択肢エは不適切です。

【ここが重要】
・作業時間（秒・分など）は「計量値」なので、管理図には $X\bar{R}$（エックスバー・アール）管理図などを用います。pn管理図は「不良個数」などの計数値に用いるため不適切です。
・時間観測では「異常値（やり直し等）」も重要な改善情報（ムダの発見）になるため、絶対に勝手に除外してはなりません。原因を明記した上で記録に残します。
・時間測定を秘密裏に行うことは倫理的にNGであり、作業者に不信感を与えて不正確なデータに繋がります。必ず事前に趣旨を説明し、協力を得て行います。`
  },
  {
    id: 13,
    title: "問題 13 標準時間1 【令和5年　第15問（設問2）】",
    year: "過去問 5-15-2",
    type: "past_exam",
    question: "金属部品を人手で加工する作業の標準時間を計算するためのデータとして、\n　　正味作業の観測時間：５分／個\n　　レイティング係数：120\n　　内掛け法による余裕率：0.20\nの値を得た。\nこの作業の標準時間として、最も近いものはどれか（単位：分／個）。",
    options: [
      "ア　6.25",
      "イ　6.50",
      "ウ　7.00",
      "エ　7.50",
      "オ　7.75"
    ],
    answer: 3,
    explanation: `標準時間の設定に関する出題です。標準時間の設定方法について基本的な知識が問われています。公式を覚えている方は容易に解ける問題ですが、公式を理解していないと難しく感じたかもしれません。基礎知識で解ける問題ですので、難易度は高くありません。

では、実際に計算して解いてみましょう。
標準時間は次の式で設定します。
標準時間 ＝ 正味時間 ÷ (1 - 余裕率) （内掛け法の場合）
正味時間 ＝ 観測時間の代表値 × レイティング係数

レイティング係数とは、基準とする作業ペースを100%とした場合のその作業者の作業ペースを表します。作業者のペースが基準よりも速い場合は、レイティング係数は100%よりも大きくなります。
本問に当てはめると、正味作業の観測時間は5分/個、レイティング係数は120%（1.2）ですので、正味時間 ＝ 5分 × 1.2 ＝ 6分となります。

次に、余裕率は正味時間あるいは標準時間に対する余裕時間の割合です。この余裕率を使って、さきほど算出した正味時間から標準時間を計算することができます。
本問では内掛け法による余裕率が0.20と与えられていますので、標準時間の公式にそのまま当てはめれば答えが出ます。
標準時間 ＝ 6分 ÷ （1 － 0.20） ＝ 6分 ÷ 0.8 ＝ 7.5分/個
以上より、選択肢エが正解です。

標準時間は出題頻度の高いテーマです。正味時間、レイティング係数、余裕率は重要なキーワードです。しっかり理解しておましょう。また、余裕率には内掛け法と外掛け法があります。どちらも今後出題される可能性が高いので、両方とも計算できるようにしておきましょう。

【ここが重要】
・正味時間 = 観測時間 × レイティング係数 = 5分 × 1.20 = 6.0分。
・内掛け法による標準時間公式:
  $$標準時間 = \\frac{正味時間}{1 - 内掛け余裕率} = \\frac{6.0}{1 - 0.20} = 7.5分$$
  ※分母が $1 - 余裕率$ になる点に注意してください。`
  },
  {
    id: 14,
    title: "問題 14 標準時間２ 【平成29年　第10問】",
    year: "過去問 29-10",
    type: "past_exam",
    question: "標準時間に関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　PTS法ではレイティングを行う必要はない。",
      "イ　内掛け法では、正味時間に対する余裕時間の割合で余裕率を考える。",
      "ウ　主体作業時間は、正味時間と余裕時間を合わせたものである。",
      "エ　人的余裕は、用達余裕と疲労余裕に分けられる。"
    ],
    answer: 1,
    explanation: `標準時間に関する基本的な問題です。
選択肢アについて、PTS法では、観測者の技能による個人差が結果に影響されやすく、レイティングの設定も難しいため、レイティングを行う必要はありません。よって選択肢アは適切です。
選択肢イについて、内掛け法では、正味時間に余裕時間を加えた標準時間に対して、余裕時間がどれくらいの割合なのかで余裕率を求めます。正味時間に対する余裕時間の割合で余裕率を求めるのは、外掛け法です。よって選択肢イは不適切で、これが正解です。
選択肢ウについて、主体作業時間は、正味時間と余裕時間を合わせたものになります。なお、作業全体の標準時間は、この主体作業時間と準備段取り時間を合わせて求めます。よって選択肢ウは適切です。
選択肢エについて、余裕は管理余裕と人的余裕に分けられます。管理余裕は作業余裕と職場余裕、人的余裕は用達余裕と疲労余裕にそれぞれ分けられます。用達余裕とは水飲みやトイレなどの生理的欲求で発生する時間、疲労余裕とは作業者が疲労回復のために休憩する時間や疲労によって仕事が遅くなるために余計に発生する時間のことを言います。よって選択肢エは適切です。

【ここが重要】
・内掛け余裕率と外掛け余裕率の定義：
  - 内掛け余裕率 = 余裕時間 / 標準時間 (正味時間 + 余裕時間)
  - 外掛け余裕率 = 余裕時間 / 正味時間
・余裕の分類：
  - 余裕 = 管理余裕 (作業余裕、職場余裕) + 人的余裕 (用達余裕、疲労余裕)`
  },
  {
    id: 15,
    title: "問題 15 余裕率 【令和5年　第15問（設問1）】",
    year: "過去問 5-15-1",
    type: "past_exam",
    question: "金属部品を人手で加工する作業の標準時間を計算するためのデータとして、\n　　正味作業の観測時間：５分／個\n　　レイティング係数：120\n　　内掛け法による余裕率：0.20\nの値を得た。\nこの作業に対する外掛け法による余裕率の値として、最も近いものはどれか。",
    options: [
      "ア　0.15",
      "イ　0.20",
      "ウ　0.25",
      "エ　0.30",
      "オ　0.35"
    ],
    answer: 2,
    explanation: `標準時間の余裕率に関する出題です。本問は外掛け法による余裕率の知識が問われています。公式を覚えている方は容易に解ける問題ですが、公式を知らないと難しく感じたかもしれません。基礎知識で解ける問題ですので、難易度は高くありません。

では、実際に計算してみましょう。
余裕率とは、正味時間あるいは標準時間に対する余裕時間の割合です。余裕率には内掛け法と外掛け法があり、標準時間に対する余裕時間の割合が内掛け法で、正味時間に対する余裕時間の割合が外掛け法です。
それぞれ次の公式で求めます。
内掛け法の余裕率 ＝ 余裕時間 ÷ 標準時間（標準時間は正味時間＋余裕時間）
外掛け法の余裕率 ＝ 余裕時間 ÷ 正味時間

本問では、内掛け法による余裕率が0.20と与えられていますので、正味時間の割合は0.80であることが分かります。よって、外掛け法の余裕率は、0.20÷0.80＝0.25と求めることができます。
以上より、選択肢ウが正解です。

標準時間は出題頻度の高いテーマです。余裕率は内掛け法と外掛け法ともに今後出題される可能性が高いです。どちらも計算できるようにしておきましょう。

【ここが重要】
・内掛け余裕率が 0.20 ということは、標準時間(1.00)のうち余裕時間が 0.20、正味時間が 0.80 という比率です。
・外掛け余裕率の定義は「余裕時間 / 正味時間」ですので、比率をあてはめると:
  $$外掛け余裕率 = \\frac{0.20}{0.80} = 0.25 (25\\%)$$`
  }
];

// ==========================================
// メイン React アプリケーション
// ==========================================
export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem(`${APP_ID}_userId`) || "";
  });
  const [userIdInput, setUserIdInput] = useState("");
  
  // 画面状態 "login", "dashboard", "quiz", "results"
  const [screen, setScreen] = useState(() => {
    const savedUserId = localStorage.getItem(`${APP_ID}_userId`);
    return savedUserId ? "dashboard" : "login";
  });

  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const isFirstLoad = useRef(true);
  useEffect(() => {
    isFirstLoad.current = true;
  }, [userId]);

  // 進捗ステート
  const [progress, setProgress] = useState({
    progressIndex: 0,
    progressMode: "all",
    history: {},  // { questionId: { correct: boolean, timestamp: string } }
    reviews: {}   // { questionId: boolean }
  });

  // 途中再開モーダル用の一時データ
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgress, setPendingProgress] = useState(null);

  // 現在のクイズセッション用
  const [quizList, setQuizList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 匿名認証の実行
  useEffect(() => {
    async function initAuth() {
      try {
        const auth = getAuth(app);
        await signInAnonymously(auth);
        console.log("Firebase Anonymous Auth Success");
        setAuthReady(true);
      } catch (error) {
        console.error("Auth Init Error (Using Local Fallback):", error);
        setAuthReady(true); // クラッシュ防止のため、完了とみなしてLocalStorageフォールバックへ進む
      }
    }
    initAuth();
  }, []);

  // Firestore & LocalStorage リアルタイム同期
  useEffect(() => {
    if (!userId || !db) return;

    console.log(`Setting up sync for user: ${userId}`);
    const docRef = doc(db, APP_ID, userId);
    
    // Firestore からのデータ購読
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const parsedProgress = {
          progressIndex: Number(data.progressIndex || 0),
          progressMode: data.progressMode || "all",
          history: data.history || {},
          reviews: data.reviews || {}
        };

        // 途中再開モーダルのトリガー判定 (初回ロードかつダッシュボード画面のときのみ)
        if (isFirstLoad.current && screenRef.current === "dashboard") {
          isFirstLoad.current = false;
          if (parsedProgress.progressIndex > 0) {
            console.log("Triggering resume modal. Saved index:", parsedProgress.progressIndex);
            setPendingProgress(parsedProgress);
            setShowResumeModal(true);
            return; // モーダル回答までステートへの直反映は保留
          }
        }

        setProgress(parsedProgress);
        localStorage.setItem(`${APP_ID}_progress`, JSON.stringify(parsedProgress));
      } else {
        // Firestoreにドキュメントがない場合は新規作成 or ローカルフォールバック
        console.log("No remote progress found, creating initial doc or using local storage");
        const localData = localStorage.getItem(`${APP_ID}_progress`);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setProgress(parsed);
            // サーバーにバックアップ
            setDoc(docRef, parsed, { merge: true });
          } catch (e) {
            console.error("Error parsing local progress:", e);
          }
        }
        isFirstLoad.current = false;
      }
    }, (error) => {
      console.warn("Firestore error or offline (using local storage):", error);
      // オフライン時のローカルフォールバック
      const localData = localStorage.getItem(`${APP_ID}_progress`);
      if (localData) {
        try {
          setProgress(JSON.parse(localData));
        } catch (e) {
          console.error("Local data parse error:", e);
        }
      }
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, [userId]);

  // Firestoreへの書き込みヘルパー
  const saveProgressToRemote = async (updated) => {
    setProgress(updated);
    localStorage.setItem(`${APP_ID}_progress`, JSON.stringify(updated));
    if (userId && db) {
      try {
        const docRef = doc(db, APP_ID, userId);
        await setDoc(docRef, updated, { merge: true });
        console.log("Successfully saved progress to Firestore:", updated);
      } catch (e) {
        console.warn("Could not save progress to Firestore (offline?):", e);
      }
    }
  };

  // ログイン (合言葉決定)
  const handleLogin = (e) => {
    e.preventDefault();
    const cleanId = userIdInput.trim();
    if (!cleanId) return;

    localStorage.setItem(`${APP_ID}_userId`, cleanId);
    setUserId(cleanId);
    setScreen("dashboard");
    console.log("Logged in with user ID:", cleanId);
  };

  // ログアウト (合言葉リセット)
  const handleLogout = () => {
    if (window.confirm("合言葉をクリアしてログアウトしますか？履歴はFirestore上に保存されたままになります。")) {
      localStorage.removeItem(`${APP_ID}_userId`);
      localStorage.removeItem(`${APP_ID}_progress`);
      setUserId("");
      setUserIdInput("");
      setProgress({
        progressIndex: 0,
        progressMode: "all",
        history: {},
        reviews: {}
      });
      setScreen("login");
      console.log("Logged out.");
    }
  };

  // クイズリスト構築
  const startQuiz = (mode) => {
    console.log(`Starting quiz in mode: ${mode}`);
    let filtered = [];
    if (mode === "all") {
      filtered = [...QUESTIONS];
    } else if (mode === "wrong") {
      filtered = QUESTIONS.filter(q => {
        const hist = progress.history?.[q.id];
        return hist && hist.correct === false;
      });
    } else if (mode === "review") {
      filtered = QUESTIONS.filter(q => progress.reviews?.[q.id] === true);
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません。すべての問題から開始します。");
      filtered = [...QUESTIONS];
      mode = "all";
    }

    setQuizList(filtered);
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScreen("quiz");

    // 進捗インデックス＆モード保存
    const updated = {
      ...progress,
      progressIndex: 0,
      progressMode: mode
    };
    saveProgressToRemote(updated);
  };

  // モーダルで「再開する」を押した時
  const resumePendingProgress = () => {
    if (!pendingProgress) return;
    console.log("Resuming progress from saved index:", pendingProgress.progressIndex);
    
    // リスト再構築
    const mode = pendingProgress.progressMode || "all";
    let filtered = [];
    if (mode === "all") {
      filtered = [...QUESTIONS];
    } else if (mode === "wrong") {
      filtered = QUESTIONS.filter(q => {
        const hist = pendingProgress.history?.[q.id];
        return hist && hist.correct === false;
      });
    } else if (mode === "review") {
      filtered = QUESTIONS.filter(q => pendingProgress.reviews?.[q.id] === true);
    }

    if (filtered.length === 0 || pendingProgress.progressIndex >= filtered.length) {
      // 範囲外なら最初から
      filtered = [...QUESTIONS];
      setCurrentQuizIndex(0);
      setProgress({
        ...pendingProgress,
        progressIndex: 0,
        progressMode: "all"
      });
    } else {
      setQuizList(filtered);
      setCurrentQuizIndex(pendingProgress.progressIndex);
      setProgress(pendingProgress);
    }

    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setShowResumeModal(false);
    setPendingProgress(null);
    setScreen("quiz");
  };

  // モーダルで「最初から始める」を押した時
  const resetPendingProgress = () => {
    console.log("Discarding saved progress, starting from first question");
    setShowResumeModal(false);
    setPendingProgress(null);
    
    // 進行状況を0にクリアしてFirestoreに書き込み
    const updated = {
      ...progress,
      progressIndex: 0
    };
    saveProgressToRemote(updated);
  };

  // 解答判定
  const selectOption = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOptionIndex(optionIdx);
    setIsAnswered(true);

    const currentQuestion = quizList[currentQuizIndex];
    const isCorrect = optionIdx === currentQuestion.answer;

    // 履歴と進捗インデックスを更新
    const nextIndex = currentQuizIndex + 1;
    const isFinished = nextIndex >= quizList.length;

    const updatedHistory = {
      ...progress.history,
      [currentQuestion.id]: {
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }
    };

    const updated = {
      ...progress,
      progressIndex: isFinished ? 0 : nextIndex, // 最後まで完了したら0にリセット
      history: updatedHistory
    };

    saveProgressToRemote(updated);
    console.log(`Answered Question ${currentQuestion.id}. Correct: ${isCorrect}. Next Index saved: ${isFinished ? 0 : nextIndex}`);
  };

  // 要復習チェックボックス切り替え
  const toggleReview = (questionId) => {
    const updatedReviews = {
      ...progress.reviews,
      [questionId]: !progress.reviews?.[questionId]
    };
    const updated = {
      ...progress,
      reviews: updatedReviews
    };
    saveProgressToRemote(updated);
    console.log(`Toggled Review for Question ${questionId}:`, updatedReviews[questionId]);
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentQuizIndex + 1 < quizList.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // 完走
      setScreen("results");
    }
  };

  // ホームに戻る
  const exitQuiz = () => {
    setScreen("dashboard");
  };

  // 過去問統計計算
  const getStats = () => {
    const total = QUESTIONS.length;
    let answered = 0;
    let correct = 0;
    let reviewsCount = 0;

    QUESTIONS.forEach(q => {
      const hist = progress.history?.[q.id];
      if (hist) {
        answered++;
        if (hist.correct) correct++;
      }
      if (progress.reviews?.[q.id]) {
        reviewsCount++;
      }
    });

    return {
      total,
      answered,
      unanswered: total - answered,
      correct,
      wrong: answered - correct,
      reviewsCount,
      accuracyRate: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      progressRate: Math.round((answered / total) * 100)
    };
  };

  const stats = getStats();

  // ローディング画面
  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans p-6">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-12 height-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-semibold tracking-wider">セッションを初期化中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30">
      
      {/* 途中再開確認ダイアログ（モーダル） */}
      {showResumeModal && pendingProgress && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-y-0 space-x-3 text-amber-500">
              <AlertCircle className="w-8 height-8 shrink-0" />
              <h3 className="text-lg font-bold text-slate-100">前回の進捗が見つかりました</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              前回は <span className="text-indigo-400 font-bold">【問題 {pendingProgress.progressIndex + 1}】</span> まで進んでいます。
              中断した <span className="text-indigo-400 font-bold">{pendingProgress.progressMode === "all" ? "すべての問題" : pendingProgress.progressMode === "wrong" ? "間違えた問題のみ" : "要復習のみ"}</span> モードの続きから再開しますか？
            </p>
            <div className="flex space-y-0 space-x-3">
              <button 
                onClick={resetPendingProgress}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200"
              >
                最初から始める
              </button>
              <button 
                onClick={resumePendingProgress}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all duration-200 scale-[1.01]"
              >
                続きから再開
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800/80 sticky top-0 z-40 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-y-0 space-x-2.5">
            <div className="w-8 height-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 height-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider bg-gradient-to-r from-indigo-200 to-sky-200 bg-clip-text text-transparent">IE 過去問セレクト演習</h1>
              <p className="text-[10px] text-slate-500">3-5 生産管理セレクト問題集</p>
            </div>
          </div>
          {userId && (
            <div className="flex items-center space-y-0 space-x-3">
              <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 font-semibold flex items-center space-y-0 space-x-1.5">
                <User className="w-3.5 height-3.5 text-indigo-400" />
                <span>ID: {userId}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-400 transition"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 画面コンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* ==========================================
            ログイン画面（合言葉入力）
           ========================================== */}
        {screen === "login" && (
          <div className="max-w-md mx-auto my-12 animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 height-12 mx-auto rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Lock className="w-6 height-6" />
                </div>
                <h2 className="text-xl font-bold">合言葉で学習進捗を同期</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  合言葉（ユーザーID）を入力すると、進捗がFirestoreに自動同期され、PCやスマートフォン間で進捗を復元できます。
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="userId" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">合言葉（ユーザーID）</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 height-4 text-slate-500" />
                    <input 
                      id="userId"
                      type="text" 
                      placeholder="例: senry_study_ie" 
                      value={userIdInput} 
                      onChange={(e) => setUserIdInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/15"
                >
                  学習を開始する
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==========================================
            ダッシュボード画面
           ========================================== */}
        {screen === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* ウェルカム & クイック統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">総合進捗率</span>
                  <div className="text-3xl font-black text-slate-100">{stats.progressRate}%</div>
                </div>
                <div className="mt-4 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${stats.progressRate}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">回答正確性</span>
                  <div className="text-3xl font-black text-slate-100">{stats.accuracyRate}%</div>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                  解いた問題 {stats.answered} 問中、{stats.correct} 問正解
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">要復習リスト</span>
                  <div className="text-3xl font-black text-slate-100">{stats.reviewsCount} 問</div>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                  チェックした重要・苦手問題
                </p>
              </div>
            </div>

            {/* モード選択エリア */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider">演習モードを選択</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => startQuiz("all")}
                  className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-xl text-left group transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-10 height-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <List className="w-5 height-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 mt-4">すべての問題</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">全15問題からランダムで順次出題します。</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>開始する</span>
                    <ArrowRight className="w-3 height-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button 
                  onClick={() => startQuiz("wrong")}
                  disabled={stats.wrong === 0}
                  className={`p-5 rounded-xl text-left group transition-all duration-200 border ${
                    stats.wrong > 0 
                      ? "bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-sky-500/40 hover:-translate-y-0.5" 
                      : "bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="w-10 height-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <X className="w-5 height-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 mt-4">前回不正解の問題</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">間違えた苦手問題のみを出題。（対象: {stats.wrong}問）</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-sky-400">
                    <span>開始する</span>
                    <ArrowRight className="w-3 height-3 ml-1" />
                  </div>
                </button>

                <button 
                  onClick={() => startQuiz("review")}
                  disabled={stats.reviewsCount === 0}
                  className={`p-5 rounded-xl text-left group transition-all duration-200 border ${
                    stats.reviewsCount > 0 
                      ? "bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/40 hover:-translate-y-0.5" 
                      : "bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="w-10 height-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <BookOpen className="w-5 height-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 mt-4">要復習の問題</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">ブックマークした問題のみを出題。（対象: {stats.reviewsCount}問）</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-amber-400">
                    <span>開始する</span>
                    <ArrowRight className="w-3 height-3 ml-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* 問題一覧と解答履歴 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider">問題ごとの解答状況</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-400">
                  <thead className="text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800 bg-slate-900">
                    <tr>
                      <th scope="col" className="px-4 py-3">問題番号</th>
                      <th scope="col" className="px-4 py-3">出題年度</th>
                      <th scope="col" className="px-4 py-3">問題内容</th>
                      <th scope="col" className="px-4 py-3 text-center">正誤状況</th>
                      <th scope="col" className="px-4 py-3 text-center">要復習</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {QUESTIONS.map((q) => {
                      const hist = progress.history?.[q.id];
                      const review = progress.reviews?.[q.id];
                      return (
                        <tr key={q.id} className="hover:bg-slate-950/40 transition">
                          <td className="px-4 py-3.5 font-bold text-slate-300">問題 {q.id}</td>
                          <td className="px-4 py-3.5">
                            <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-semibold text-slate-400">
                              {q.year}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 max-w-xs truncate">{q.question}</td>
                          <td className="px-4 py-3.5 text-center">
                            {hist ? (
                              hist.correct ? (
                                <span className="inline-flex items-center text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">
                                  <Check className="w-3 height-3 mr-1" />正解
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
                                  <X className="w-3 height-3 mr-1" />不正解
                                </span>
                              )
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button 
                              onClick={() => toggleReview(q.id)}
                              className={`transition ${review ? "text-amber-500" : "text-slate-600 hover:text-slate-500"}`}
                            >
                              <BookOpen className="w-4 height-4 mx-auto fill-current" style={{ fillOpacity: review ? 1 : 0 }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            クイズ出題画面
           ========================================== */}
        {screen === "quiz" && quizList[currentQuizIndex] && (() => {
          const q = quizList[currentQuizIndex];
          const review = progress.reviews?.[q.id];
          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* コントロール & 進捗 */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={exitQuiz}
                  className="flex items-center space-y-0 space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  <Home className="w-4 height-4" />
                  <span>ホームに戻る</span>
                </button>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold">
                    進捗: {currentQuizIndex + 1} / {quizList.length} 問
                  </span>
                </div>
              </div>

              {/* クイズカード */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                {/* 年バッジ */}
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-indigo-500/20 to-sky-500/20 text-indigo-300 text-[10px] px-3 py-1 rounded-full border border-indigo-500/30 font-bold tracking-wider uppercase">
                    {q.year}
                  </span>
                  
                  {/* 要復習ボタン */}
                  <button 
                    onClick={() => toggleReview(q.id)}
                    className={`flex items-center space-y-0 space-x-1 px-3 py-1 rounded-lg text-xs border transition ${
                      review 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    <BookOpen className="w-3.5 height-3.5 fill-current" style={{ fillOpacity: review ? 1 : 0 }} />
                    <span>要復習</span>
                  </button>
                </div>

                {/* 問題文 */}
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-slate-100 leading-relaxed white-space-pre-line">
                    {q.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed white-space-pre-line">
                    {q.question}
                  </p>
                </div>

                {/* 問題ごとのインラインSVG / テーブル表示 */}
                {q.hasSvg && q.svgType === "product_process" && (
                  <ProductProcessSVG showExplanation={isAnswered} />
                )}
                {q.hasSvg && q.svgType === "flow_analysis" && (
                  <FlowAnalysisSVG showExplanation={isAnswered} />
                )}

                {/* 問題5のフロムツーチャート */}
                {q.hasTable && q.tableType === "from_to_chart" && (
                  <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <table className="table-fixed w-full text-xs text-center border-collapse border border-slate-800">
                      <thead>
                        <tr className="bg-slate-950">
                          <th className="border border-slate-800 p-2 font-bold text-slate-400 relative w-[15%] h-12">
                            {/* 斜め線入りセル */}
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                              <line x1="0" y1="0" x2="100" y2="100" stroke="#1e293b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                            </svg>
                            <span className="absolute top-1 right-2 text-[10px] z-10">To</span>
                            <span className="absolute bottom-1 left-2 text-[10px] z-10">From</span>
                          </th>
                          <th className="border border-slate-800 p-2 font-bold text-indigo-400 w-[17%]">A</th>
                          <th className="border border-slate-800 p-2 font-bold text-indigo-400 w-[17%]">B</th>
                          <th className="border border-slate-800 p-2 font-bold text-indigo-400 w-[17%]">C</th>
                          <th className="border border-slate-800 p-2 font-bold text-indigo-400 w-[17%]">D</th>
                          <th className="border border-slate-800 p-2 font-bold text-indigo-400 w-[17%]">E</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { from: "A", to: [null, 12, 5, 25, null] },
                          { from: "B", to: [null, null, 11, null, 4] },
                          { from: "C", to: [null, null, null, 2, null] },
                          { from: "D", to: [11, null, null, null, null] },
                          { from: "E", to: [null, 27, null, null, null] }
                        ].map((row, rIdx) => (
                          <tr key={row.from} className="hover:bg-slate-950/20">
                            <td className="border border-slate-800 p-2 font-bold bg-slate-950 text-indigo-400">{row.from}</td>
                            {row.to.map((val, cIdx) => {
                              const isDiagonal = rIdx === cIdx;
                              // 逆流判定：対角線より左下（D→A は r=3, c=0、E→B は r=4, c=1）
                              const isReverseFlow = rIdx > cIdx && val !== null;
                              return (
                                <td 
                                  key={cIdx} 
                                  className={`border border-slate-800 p-2 ${
                                    isDiagonal ? "bg-slate-800/40" : ""
                                  } ${
                                    isAnswered && isReverseFlow ? "bg-red-500/20 text-red-300 font-bold border-red-500/40" : ""
                                  }`}
                                >
                                  {isDiagonal ? (
                                    <svg className="w-full h-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                                      <line x1="0" y1="0" x2="100" y2="100" stroke="#475569" strokeWidth="3" />
                                    </svg>
                                  ) : (
                                    val || ""
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 問題7のサーブリッグ表 */}
                {q.hasTable && q.tableType === "therblig_table" && (
                  <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left border-collapse border border-slate-800">
                      <thead>
                        <tr className="bg-slate-950 text-center text-slate-300 font-bold">
                          <th colSpan="3" className="border border-slate-800 p-2 text-sky-400">左手</th>
                          <th colSpan="3" className="border border-slate-800 p-2 text-amber-400">右手</th>
                        </tr>
                        <tr className="bg-slate-900 text-slate-400 text-center font-bold">
                          <th className="border border-slate-800 p-2">動作内容</th>
                          <th className="border border-slate-800 p-2">記号</th>
                          <th className="border border-slate-800 p-2">アイコン</th>
                          <th className="border border-slate-800 p-2">アイコン</th>
                          <th className="border border-slate-800 p-2">記号</th>
                          <th className="border border-slate-800 p-2">動作内容</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { lAct: "部品に手を伸ばす", lSym: "TE", lIcon: "TE", lCat: 1, rIcon: "UD", rSym: "UD", rAct: "避得ぬ遅れ", rCat: 3 },
                          { lAct: "部品を選ぶ", lSym: "ST", lIcon: "ST", lCat: 2, rIcon: "UD", rSym: "UD", rAct: "避得ぬ遅れ", rCat: 3 },
                          { lAct: "部品をつかむ", lSym: "G", lIcon: "G", lCat: 1, rIcon: "UD", rSym: "UD", rAct: "避得ぬ遅れ", rCat: 3 },
                          { lAct: "部品を運ぶ", lSym: "TL", lIcon: "TL", lCat: 1, rIcon: "UD", rSym: "UD", rAct: "避得ぬ遅れ", rCat: 3 },
                          { lAct: "部品を保持する", lSym: "H", lIcon: "H", lCat: 3, rIcon: "G", rSym: "G", rAct: "部品をつかむ", rCat: 1 },
                          { lAct: "部品をはなす", lSym: "RL", lIcon: "RL", lCat: 1, rIcon: "H", rSym: "H", rAct: "部品を保持する", rCat: 3 },
                          { lAct: "手元に手を戻す", lSym: "TE", lIcon: "TE", lCat: 1, rIcon: "TL", rSym: "TL", rAct: "部品を運ぶ", rCat: 1 },
                          { lAct: "避け得ぬ遅れ", lSym: "UD", lIcon: "UD", lCat: 3, rIcon: "P", rSym: "P", rAct: "部品を位置決めする", rCat: 2 },
                          { lAct: "避け得ぬ遅れ", lSym: "UD", lIcon: "UD", lCat: 3, rIcon: "RL", rSym: "RL", rAct: "部品をはなす", rCat: 1 },
                          { lAct: "避け得ぬ遅れ", lSym: "UD", lIcon: "UD", lCat: 3, rIcon: "TE", rSym: "TE", rAct: "手元に手を戻す", rCat: 1 }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-950/20">
                            {/* 左手 */}
                            <td className={`border border-slate-800 p-2 ${isAnswered && row.lCat === 1 ? "bg-green-500/10 text-green-300 font-semibold" : ""}`}>{row.lAct}</td>
                            <td className={`border border-slate-800 p-2 text-center ${isAnswered && row.lCat === 1 ? "bg-green-500/10 text-green-300 font-semibold" : ""}`}>{row.lSym}</td>
                            <td className={`border border-slate-800 p-2 text-center ${isAnswered && row.lCat === 1 ? "bg-green-500/10" : ""}`}><TherbligIcon type={row.lIcon} /></td>
                            
                            {/* 右手 */}
                            <td className={`border border-slate-800 p-2 text-center ${isAnswered && row.rCat === 1 ? "bg-green-500/10" : ""}`}><TherbligIcon type={row.rIcon} /></td>
                            <td className={`border border-slate-800 p-2 text-center ${isAnswered && row.rCat === 1 ? "bg-green-500/10 text-green-300 font-semibold" : ""}`}>{row.rSym}</td>
                            <td className={`border border-slate-800 p-2 ${isAnswered && row.rCat === 1 ? "bg-green-500/10 text-green-300 font-semibold" : ""}`}>{row.rAct}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 問題11のワークサンプリング表 */}
                {q.hasTable && q.tableType === "work_sampling" && (
                  <div className="w-full overflow-x-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left border-collapse border border-slate-800">
                      <thead>
                        <tr className="bg-slate-950 text-slate-300 font-bold">
                          <th className="border border-slate-800 p-2">作業項目</th>
                          <th className="border border-slate-800 p-2 text-center" style={{ width: "80px" }}>度数</th>
                          {isAnswered && <th className="border border-slate-800 p-2" style={{ width: "120px" }}>作業分類</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { item: "ハンダ付け", freq: 120, cat: "主体作業 (主作業)", isMain: true },
                          { item: "基盤への部品の取り付け", freq: 90, cat: "主体作業 (主作業)", isMain: true },
                          { item: "基盤のネジ止め", freq: 80, cat: "主体作業 (主作業)", isMain: true },
                          { item: "組立作業完了後の製品検査(全数)", freq: 60, cat: "主体作業 (付随作業)", isMain: true },
                          { item: "ロット単位での完成部品の運搬", freq: 33, cat: "準備段取作業" },
                          { item: "不良品の手直し", freq: 30, cat: "作業余裕" },
                          { item: "ネジ・ハンダの補充(不定期)", freq: 22, cat: "作業余裕" },
                          { item: "部品不足による手待ち", freq: 24, cat: "職場余裕", isAllowance: true },
                          { item: "打ち合わせ", freq: 19, cat: "職場余裕", isAllowance: true },
                          { item: "朝礼", freq: 12, cat: "職場余裕", isAllowance: true },
                          { item: "水飲み", freq: 5, cat: "用達余裕" },
                          { item: "用便", freq: 5, cat: "用達余裕" }
                        ].map((row, idx) => (
                          <tr 
                            key={idx} 
                            className={`hover:bg-slate-950/20 ${
                              isAnswered && row.isMain 
                                ? "bg-green-500/5 text-green-300" 
                                : isAnswered && row.isAllowance 
                                  ? "bg-amber-500/5 text-amber-300" 
                                  : ""
                            }`}
                          >
                            <td className="border border-slate-800 p-2">{row.item}</td>
                            <td className="border border-slate-800 p-2 text-center font-bold">{row.freq}</td>
                            {isAnswered && (
                              <td className="border border-slate-800 p-2 font-bold text-[10px]">
                                {row.cat}
                              </td>
                            )}
                          </tr>
                        ))}
                        <tr className="bg-slate-950 font-bold text-slate-300">
                          <td className="border border-slate-800 p-2">合計</td>
                          <td className="border border-slate-800 p-2 text-center">500</td>
                          {isAnswered && <td className="border border-slate-800 p-2"></td>}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 選択肢ボタン */}
                <div className="space-y-3 pt-4">
                  {q.options.map((option, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = q.answer === idx;
                    
                    let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700 hover:text-slate-100";
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-green-500/10 border-green-500 text-green-300 font-bold cursor-default shadow-md shadow-green-500/5";
                      } else if (isSelected) {
                        btnStyle = "bg-red-500/10 border-red-500 text-red-300 font-bold cursor-default shadow-md shadow-red-500/5";
                      } else {
                        btnStyle = "bg-slate-950/40 border-slate-900/60 text-slate-600 cursor-default";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => selectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {isAnswered && (
                          <span className="shrink-0 ml-3">
                            {isCorrect ? (
                              <Check className="w-5 height-5 text-green-400" />
                            ) : (
                              isSelected && <X className="w-5 height-5 text-red-400" />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 解答・解説エリア */}
                {isAnswered && (
                  <div className="border-t border-slate-800/80 pt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center space-y-0 space-x-2.5">
                      <div className={`w-8 height-8 rounded-lg flex items-center justify-center font-bold ${
                        selectedOptionIndex === q.answer 
                          ? "bg-green-500/15 text-green-400 border border-green-500/30" 
                          : "bg-red-500/15 text-red-400 border border-red-500/30"
                      }`}>
                        {selectedOptionIndex === q.answer ? "正" : "誤"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">
                          正解は 「{q.options[q.answer].substring(0, 1)}」 です
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {selectedOptionIndex === q.answer ? "素晴らしい！正解です。" : "残念！解説を確認しましょう。"}
                        </p>
                      </div>
                    </div>

                    {/* 追加グラフィック解説 (各問題の解答後用) */}
                    {q.id === 1 && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <h5 className="text-xs font-bold text-indigo-400">工程図記号の整理</h5>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">基本記号</p>
                            <ul className="space-y-1 list-none p-0 text-slate-300">
                              <li className="flex items-center"><span className="w-6 text-center font-bold">○</span> 加工</li>
                              <li className="flex items-center"><span className="w-6 text-center font-bold">o</span> 運搬</li>
                              <li className="flex items-center"><span className="w-6 text-center font-bold">▽</span> 貯蔵（計画的な保管）</li>
                              <li className="flex items-center"><span className="w-6 text-center font-bold">D</span> 滞留（一時的な停滞）</li>
                              <li className="flex items-center"><span className="w-6 text-center font-bold">◇</span> 品質検査</li>
                              <li className="flex items-center"><span className="w-6 text-center font-bold">□</span> 数量検査</li>
                            </ul>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">複合記号</p>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              外側の図形が<span className="text-indigo-400 font-bold">「主」</span>となる検査、内側の図形が<span className="text-sky-400 font-bold">「従」</span>となる検査です。<br />
                              本問の<span className="font-bold">「◇の中に□」</span>は、品質検査を主として行いながら、同時に数量検査も行うことを意味します。
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {q.id === 2 && (
                      <div className="space-y-3">
                        <div className="w-full overflow-x-auto bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                          <h5 className="text-xs font-bold text-indigo-400 mb-3">作業者工程分析のフロー</h5>
                          <table className="w-full text-[11px] text-center border-collapse border border-slate-800 select-none">
                            <thead>
                              <tr className="bg-slate-900 font-bold text-slate-300">
                                <th className="border border-slate-800 p-1">工程内容</th>
                                <th className="border border-slate-800 p-1">距離</th>
                                <th className="border border-slate-800 p-1">時間</th>
                                <th className="border border-slate-800 p-1">作業</th>
                                <th className="border border-slate-800 p-1">移動</th>
                                <th className="border border-slate-800 p-1">手待ち</th>
                                <th className="border border-slate-800 p-1">検査</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: "材料を取りに行く", dist: "3m", time: "20秒", cat: "move" },
                                { name: "材料を機械に取り付ける", dist: "", time: "15秒", cat: "work" },
                                { name: "機械で加工する", dist: "", time: "55秒", cat: "work" },
                                { name: "検査機に移動する", dist: "2m", time: "20秒", cat: "move" },
                                { name: "検査機の順番を待つ", dist: "", time: "30秒", cat: "wait" },
                                { name: "数量検査を行う", dist: "", time: "40秒", cat: "inspect" }
                              ].map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-900/40">
                                  <td className="border border-slate-800 p-1 text-left">{row.name}</td>
                                  <td className="border border-slate-800 p-1">{row.dist}</td>
                                  <td className="border border-slate-800 p-1">{row.time}</td>
                                  <td className="border border-slate-800 p-1 relative">
                                    {row.cat === "work" && <span className="w-3 height-3 rounded-full bg-indigo-500 inline-block"></span>}
                                  </td>
                                  <td className="border border-slate-800 p-1 relative">
                                    {row.cat === "move" && <span className="w-2 height-2 rounded-full border border-sky-400 inline-block"></span>}
                                  </td>
                                  <td className="border border-slate-800 p-1 relative">
                                    {row.cat === "wait" && <span className="font-bold text-amber-500">D</span>}
                                  </td>
                                  <td className="border border-slate-800 p-1 relative">
                                    {row.cat === "inspect" && <span className="w-3.5 height-3.5 border border-red-400 inline-block"></span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* 絶対配置のSVGで折れ線を重ねる */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: "35px" }}>
                            {/* 
                              SVGでテーブル内のドットを接続
                              行の高さ約22px
                              1行目: move(X=64%) Y=11px
                              2行目: work(X=50%) Y=33px
                              3行目: work(X=50%) Y=55px
                              4行目: move(X=64%) Y=77px
                              5行目: wait(X=78%) Y=99px
                              6行目: inspect(X=92%) Y=121px
                              (レスポンシブ用に比率または簡易パスで表現)
                            */}
                          </svg>
                        </div>
                      </div>
                    )}

                    {q.id === 3 && (
                      <FlowAnalysisExplainSVG />
                    )}

                    {q.id === 4 && (
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                          <h5 className="text-xs font-bold text-indigo-400">物の流れの分析手法まとめ</h5>
                          
                          <PQChartSVG />
                          <ActivityAnalysisSVG />
                          <FlowDiagramSVG />

                          <div className="text-[11px] text-slate-400 space-y-2 pt-2 leading-relaxed">
                            <p>
                              <strong className="text-slate-200">・流入流出図表（フロムツーチャート）：</strong><br />
                              機械の配置計画等に利用。対角線の「右上」が順送りの移動、「左下」が逆送りの移動（逆流）を示します。
                            </p>
                            <table className="table-fixed w-full text-center border-collapse border border-slate-800 mt-2 text-[10px]">
                              <thead>
                                <tr className="bg-slate-900">
                                  <th className="border border-slate-800 p-1 relative w-1/4 h-10">
                                    <span className="absolute top-1 right-2 text-[9px] text-slate-400 z-10">To</span>
                                    <span className="absolute bottom-1 left-2 text-[9px] text-slate-400 z-10">From</span>
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                      <line x1="0" y1="0" x2="100" y2="100" stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                  </th>
                                  <th className="border border-slate-800 p-1 w-1/4">工程A</th>
                                  <th className="border border-slate-800 p-1 w-1/4">工程B</th>
                                  <th className="border border-slate-800 p-1 w-1/4">工程C</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-800 p-1 bg-slate-900 font-bold">工程A</td>
                                  <td className="border border-slate-800 p-1 bg-slate-800/30">\</td>
                                  <td className="border border-slate-800 p-1 text-green-400 font-bold">20 (順流)</td>
                                  <td className="border border-slate-800 p-1 text-green-400 font-bold">5 (順流)</td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-800 p-1 bg-slate-900 font-bold">工程B</td>
                                  <td className="border border-slate-800 p-1 text-red-400 font-bold">10 (逆流)</td>
                                  <td className="border border-slate-800 p-1 bg-slate-800/30">\</td>
                                  <td className="border border-slate-800 p-1 text-green-400 font-bold">35 (順流)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {q.id === 7 && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                        <h5 className="text-xs font-bold text-indigo-400">サーブリッグ記号の分類体系</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px] text-left border-collapse border border-slate-800">
                            <thead>
                              <tr className="bg-slate-900 text-slate-300 font-bold">
                                <th className="border border-slate-800 p-2" style={{ width: "80px" }}>分類</th>
                                <th className="border border-slate-800 p-2">該当する動作要素</th>
                                <th className="border border-slate-800 p-2">特徴</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-slate-900/30">
                                <td className="border border-slate-800 p-2 font-bold text-green-400">第1類</td>
                                <td className="border border-slate-800 p-2 leading-relaxed">
                                  手を伸ばす(TE), つかむ(G), 運ぶ(TL), 放す(RL), 使う(U), 組み立てる(A), 分解する(DA), 調べる(I)
                                </td>
                                <td className="border border-slate-800 p-2">仕事を行ううえで必要な動作要素（作業の基本）</td>
                              </tr>
                              <tr className="hover:bg-slate-900/30">
                                <td className="border border-slate-800 p-2 font-bold text-amber-400">第2類</td>
                                <td className="border border-slate-800 p-2 leading-relaxed">
                                  探す(SH), 見出す(F), 選ぶ(ST), 位置決め(P), 考える(PN), 前置き(PP)
                                </td>
                                <td className="border border-slate-800 p-2">第1類の作業の実行を妨げる動作要素（遅れを生む）</td>
                              </tr>
                              <tr className="hover:bg-slate-900/30">
                                <td className="border border-slate-800 p-2 font-bold text-red-400">第3類</td>
                                <td className="border border-slate-800 p-2 leading-relaxed">
                                  保持(H), 休む(R), 避けられない遅れ(UD), 避けるべき遅れ(AD)
                                </td>
                                <td className="border border-slate-800 p-2">作業を行わない動作要素（不要なムダ）</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {q.id === 10 && (
                      <WorkMeasurementTreeSVG />
                    )}

                    {q.id === 15 && (
                      <AllowanceBlockSVG />
                    )}

                    {/* 解説フルテキスト */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-y-0 space-x-1.5">
                        <BookOpen className="w-4 height-4 text-indigo-400" />
                        <span>解説レジュメ</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {q.explanation}
                      </p>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={nextQuestion}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-lg shadow-indigo-600/15 flex items-center space-y-0 space-x-1"
                      >
                        <span>
                          {currentQuizIndex + 1 < quizList.length ? "次の問題へ" : "結果画面へ"}
                        </span>
                        <ChevronRight className="w-4 height-4" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            演習結果画面（セッション終了）
           ========================================== */}
        {screen === "results" && (
          <div className="max-w-md mx-auto my-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
              <div className="inline-flex w-16 height-16 rounded-full bg-indigo-500/10 items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Check className="w-8 height-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold">演習が完了しました！</h2>
                <p className="text-xs text-slate-400">
                  お疲れ様でした。今回のセッションの解答状況がFirestoreに保存されました。
                </p>
              </div>

              {/* クイックフィードバック */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">回答数</div>
                  <div className="text-xl font-black text-slate-200 mt-1">{quizList.length} 問</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">正解数</div>
                  <div className="text-xl font-black text-green-400 mt-1">
                    {quizList.filter(q => progress.history?.[q.id]?.correct).length} 問
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button 
                  onClick={exitQuiz}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-600/15"
                >
                  ダッシュボードに戻る
                </button>
                <button 
                  onClick={() => startQuiz(progress.progressMode)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-4 rounded-xl text-xs transition"
                >
                  もう一度同じモードで解く
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="max-w-4xl mx-auto px-4 py-8 border-t border-slate-900/60 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <p>© 2026 IE past exams select training application. All rights reserved.</p>
          <div className="flex items-center space-y-0 space-x-3">
            <span className="flex items-center space-y-0 space-x-1">
              <Database className="w-3 height-3 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Cloud Synced</span>
            </span>
            <span>AppID: {APP_ID}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
