// npm install lucide-react recharts firebase
import React, { useState, useEffect } from "react";
import { Check, X, Home, ChevronRight, RefreshCw, BarChart2, BookOpen, User, ArrowRight, HelpCircle } from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// データの分離用ID
const APP_ID = "QuizApp_PastExams_IE_Industrial_Engineering_001";

// Firebase設定 (環境変数を使用、秘匿化)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase初期化 (安全な初期化)
let app;
let db;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// ==========================================
// サーブリッグ記号 (SVGパス) コンポーネント
// ==========================================
const TherbligIcon = ({ type }) => {
  const baseClass = "w-6 h-6 stroke-slate-700 fill-none stroke-[2]";
  switch (type) {
    case "TE": // 手を伸ばす (上部開き半円弧)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M 4,8 A 8,8 0 0,0 20,8" />
        </svg>
      );
    case "ST": // 選ぶ (右矢印)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M 3,12 L 21,12 M 15,6 L 21,12 L 15,18" />
        </svg>
      );
    case "G": // つかむ (下部開き半円弧)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M 4,16 A 8,8 0 0,1 20,16" />
        </svg>
      );
    case "TL": // 運ぶ (円弧＋中央の丸)
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-slate-700 fill-none stroke-[2]">
          <path d="M 3,14 A 9,9 0 0,0 21,14" />
          <circle cx="12" cy="8" r="3" className="fill-slate-700 stroke-none" />
        </svg>
      );
    case "H": // 保持する (逆U字ドーム＋下線)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M 5,18 L 5,11 A 7,7 0 0,1 19,11 L 19,18 Z" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      );
    case "RL": // 放す (円弧＋左端の丸)
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-slate-700 fill-none stroke-[2]">
          <path d="M 3,14 A 9,9 0 0,0 21,14" />
          <circle cx="5" cy="11" r="3" className="fill-slate-700 stroke-none" />
        </svg>
      );
    case "UD": // 避け得ぬ遅れ (波状ループ)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M 4,15 C 8,7 10,7 12,12 C 14,17 16,17 20,11" />
        </svg>
      );
    case "P": // 位置決めする (丸の下に反転L字)
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <circle cx="12" cy="8" r="5" />
          <path d="M 12,13 L 12,19 C 12,19 8,19 8,17" />
        </svg>
      );
    default:
      return <span className="text-slate-400">-</span>;
  }
};

// ==========================================
// インラインSVG & HTML 図表コンポーネント
// ==========================================

// 問題1: 製品工程分析図 (縦型フロー)
const ProductProcessFlowDiagram = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-lg overflow-x-auto">
      <svg width="460" height="740" viewBox="0 0 460 740" className="mx-auto bg-white rounded-lg shadow-sm">
        {/* 背景グリッド補助 */}
        <rect width="100%" height="100%" fill="#ffffff" />
        
        {/* 部品Aのライン (x=90) */}
        <line x1="90" y1="50" x2="90" y2="350" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="70,50 110,50 90,80" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="90" y="40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">部品A</text>
        <circle cx="90" cy="120" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="110" y="123" fontSize="10" fill="#64748b">台車</text>
        <circle cx="90" cy="180" r="20" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
        <text x="90" y="184" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">加工ａ</text>
        <circle cx="90" cy="240" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="110" y="243" fontSize="10" fill="#64748b">台車</text>
        <path d="M 75,280 L 95,280 A 15,15 0 0,1 95,310 L 75,310 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="115" y="300" fontSize="10" fill="#64748b">仮置き場</text>
        <circle cx="90" cy="340" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="110" y="343" fontSize="10" fill="#64748b">台車</text>

        {/* 部品Bのライン (x=230) */}
        <line x1="230" y1="50" x2="230" y2="350" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="210,50 250,50 230,80" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="230" y="40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">部品B</text>
        <circle cx="230" cy="120" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="250" y="123" fontSize="10" fill="#64748b">台車</text>
        <circle cx="230" cy="180" r="20" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
        <text x="230" y="184" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">加工ｂ</text>
        <circle cx="230" cy="240" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="250" y="243" fontSize="10" fill="#64748b">台車</text>
        <path d="M 215,280 L 235,280 A 15,15 0 0,1 235,310 L 215,310 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="255" y="300" fontSize="10" fill="#64748b">仮置き場</text>
        <circle cx="230" cy="340" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="250" y="343" fontSize="10" fill="#64748b">台車</text>

        {/* 部品Cのライン (x=370) */}
        <line x1="370" y1="50" x2="370" y2="350" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="350,50 390,50 370,80" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="370" y="40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">部品C</text>
        <circle cx="370" cy="120" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="390" y="123" fontSize="10" fill="#64748b">台車</text>
        <circle cx="370" cy="180" r="20" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
        <text x="370" y="184" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">加工ｃ</text>
        <circle cx="370" cy="240" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="390" y="243" fontSize="10" fill="#64748b">台車</text>
        <path d="M 355,280 L 375,280 A 15,15 0 0,1 375,310 L 355,310 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="395" y="300" fontSize="10" fill="#64748b">仮置き場</text>
        <circle cx="370" cy="340" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="390" y="343" fontSize="10" fill="#64748b">台車</text>

        {/* 合流線 */}
        <path d="M 90,350 L 90,380 L 370,380 L 370,350" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <line x1="230" y1="340" x2="230" y2="380" stroke="#94a3b8" strokeWidth="2" />
        <line x1="230" y1="380" x2="230" y2="700" stroke="#94a3b8" strokeWidth="2" />

        {/* 組立以降の流れ (x=230) */}
        <circle cx="230" cy="420" r="22" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
        <text x="230" y="424" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">部品A、B、Cを組立</text>
        
        <circle cx="230" cy="480" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="250" y="483" fontSize="10" fill="#64748b">台車</text>

        {/* 複合検査記号 (ひし形の中に四角) */}
        <polygon points="230,510 255,535 230,560 205,535" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
        <rect x="217.5" y="522.5" width="25" height="25" fill="none" stroke="#1e293b" strokeWidth="1.5" />
        <text x="265" y="539" fontSize="11" fontWeight="bold" fill="#1e293b">品質保証室で検査</text>

        <circle cx="230" cy="600" r="10" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
        <text x="250" y="603" fontSize="10" fill="#64748b">台車</text>

        <polygon points="200,640 260,640 230,680" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
        <text x="230" y="632" textAnchor="middle" fontSize="10" fill="#64748b">貯蔵</text>
        <text x="265" y="665" fontSize="11" fontWeight="bold" fill="#1e293b">製品Xを倉庫に保管</text>
      </svg>
    </div>
  </div>
);

// 問題1解説: 工程図記号対応表 (JIS Z 8206)
const ProcessSymbolsTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs text-left border-collapse">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-3 w-20 text-slate-700">要素工程</th>
          <th className="p-3 w-24 text-slate-700">記号の名称</th>
          <th className="p-3 w-16 text-center text-slate-700">記号</th>
          <th className="p-3 text-slate-700">説明と分類</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-3 font-semibold bg-slate-50 text-slate-700">加工</td>
          <td className="p-3 font-medium text-slate-800">加工</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">原材料や部品の形状を変えたり組み立てたりする工程（丸大）</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-3 font-semibold bg-slate-50 text-slate-700">運搬</td>
          <td className="p-3 font-medium text-slate-800">運搬</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">別の場所に移動させる工程（丸小。台車など）</td>
        </tr>
        <tr className="border-b border-slate-100" style={{ borderBottomWidth: "2px" }}>
          <td className="p-3 font-semibold bg-slate-50 text-slate-700" rowSpan="2">停滞</td>
          <td className="p-3 font-medium text-slate-800">貯蔵</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <polygon points="12,20 2,4 22,4" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">計画的な保管状態。許可なしに移動できない（逆三角形）</td>
        </tr>
        <tr className="border-b border-slate-100" style={{ borderBottomWidth: "2px" }}>
          <td className="p-3 font-medium text-slate-800">滞留</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <path d="M 6,4 L 12,4 A 8,8 0 0,1 12,20 L 6,20 Z" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">一時的な待ち状態。工程間の仕掛品や乾燥待ちなど（D字型）</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-3 font-semibold bg-slate-50 text-slate-700" rowSpan="2">検査</td>
          <td className="p-3 font-medium text-slate-800">数量検査</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <rect x="4" y="4" width="16" height="16" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">個数、重量、長さなどを計測する検査（四角）</td>
        </tr>
        <tr className="border-b border-slate-100" style={{ borderBottomWidth: "2px" }}>
          <td className="p-3 font-medium text-slate-800">品質検査</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[2]">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">規格、品質特性、動作テスト等を確認する検査（ひし形）</td>
        </tr>
        {/* 複合記号の紹介 */}
        <tr className="border-b border-slate-100 bg-indigo-50/20">
          <td className="p-3 font-bold text-indigo-900 bg-indigo-50/50" rowSpan="4">複合記号</td>
          <td className="p-3 font-semibold text-slate-800">品質主・数量従</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[1.5]">
              <polygon points="12,2 22,12 12,22 2,12" />
              <rect x="7.5" y="7.5" width="9" height="9" />
            </svg>
          </td>
          <td className="p-3 text-slate-600 font-semibold">品質検査を主として行いながら数量検査もする（ひし形の中に四角）</td>
        </tr>
        <tr className="border-b border-slate-100 bg-indigo-50/20">
          <td className="p-3 font-semibold text-slate-800">数量主・品質従</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[1.5]">
              <rect x="4" y="4" width="16" height="16" />
              <polygon points="12,6 18,12 12,18 6,12" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">数量検査を主として行いながら品質検査もする（四角の中にひし形）</td>
        </tr>
        <tr className="border-b border-slate-100 bg-indigo-50/20">
          <td className="p-3 font-semibold text-slate-800">加工主・数量従</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[1.5]">
              <circle cx="12" cy="12" r="9" />
              <rect x="7.5" y="7.5" width="9" height="9" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">加工を主として行いながら数量検査もする（丸の中に四角）</td>
        </tr>
        <tr className="bg-indigo-50/20">
          <td className="p-3 font-semibold text-slate-800">加工主・運搬従</td>
          <td className="p-3 text-center">
            <svg width="24" height="24" className="mx-auto stroke-slate-800 fill-none stroke-[1.5]">
              <circle cx="12" cy="12" r="9" />
              <path d="M 8,12 L 16,12 M 13,9 L 16,12 L 13,15" />
            </svg>
          </td>
          <td className="p-3 text-slate-600">加工を主として行いながら運搬もする（丸の中に矢印）</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題2解説: 作業者工程分析表 (HTML + SVG折れ線)
const WorkerProcessAnalysisTable = () => (
  <div className="my-6 overflow-x-auto bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="min-w-[550px]">
      <div className="text-center font-bold text-slate-800 text-sm mb-3">◆ 作業者工程分析の結果（赤線は工程経路のつながり）</div>
      
      {/* SVGで描くハイブリッドテーブル */}
      <svg width="550" height="380" viewBox="0 0 550 380" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        {/* 表のヘッダー境界線 */}
        <line x1="10" y1="50" x2="540" y2="50" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="10" y1="10" x2="540" y2="10" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* 列縦線 */}
        <line x1="240" y1="10" x2="240" y2="370" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="290" y1="10" x2="290" y2="370" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="340" y1="10" x2="340" y2="370" stroke="#e2e8f0" strokeWidth="1" />
        
        {/* 工程系列の中の縦線 */}
        <line x1="390" y1="30" x2="390" y2="370" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="440" y1="30" x2="440" y2="370" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="490" y1="30" x2="490" y2="370" stroke="#f1f5f9" strokeWidth="1" />
        
        {/* ヘッダーテキスト */}
        <text x="125" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">工程</text>
        <text x="265" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">距離</text>
        <text x="265" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">(m)</text>
        <text x="315" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">時間</text>
        <text x="315" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">(秒)</text>
        
        {/* 工程系列ヘッダー */}
        <text x="440" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">工程系列</text>
        <line x1="340" y1="28" x2="540" y2="28" stroke="#cbd5e1" strokeWidth="1" />
        <text x="365" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">作業</text>
        <text x="415" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">移動</text>
        <text x="465" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">手待ち</text>
        <text x="515" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">検査</text>

        {/* 各行データ (y=80, 120, 160, 200, 240, 280, 320) */}
        {[
          { y: 80, name: "材料を取りに行く", dist: "3", time: "20" },
          { y: 120, name: "材料を機械に取り付ける", dist: "", time: "15" },
          { y: 160, name: "機械で加工する", dist: "", time: "55" },
          { y: 200, name: "検査機に移動する", dist: "2", time: "20" },
          { y: 240, name: "検査機の順番を待つ", dist: "", time: "30" },
          { y: 280, name: "数量検査を行う", dist: "", time: "40" },
          { y: 320, name: "・・・", dist: "", time: "" },
        ].map((row, idx) => {
          return (
            <g key={idx}>
              <line x1="10" y1={row.y + 15} x2="540" y2={row.y + 15} stroke="#e2e8f0" strokeWidth="1" />
              <text x="20" y={row.y + 4} fontSize="11" fill="#1e293b">{row.name}</text>
              <text x="265" y={row.y + 4} textAnchor="middle" fontSize="11" fill="#475569">{row.dist}</text>
              <text x="315" y={row.y + 4} textAnchor="middle" fontSize="11" fill="#475569">{row.time}</text>
              
              {/* 各記号プレースホルダー */}
              {/* 作業 (○) */}
              <circle cx="365" cy={row.y} r="8" fill="none" stroke="#94a3b8" strokeWidth="1" />
              {/* 移動 (◯小) */}
              <circle cx="415" cy={row.y} r="4" fill="none" stroke="#94a3b8" strokeWidth="1" />
              {/* 手待ち (D) */}
              <path d={`M 461,${row.y - 4} L 464,${row.y - 4} A 4,4 0 0,1 464,${row.y + 4} L 461,${row.y + 4} Z`} fill="none" stroke="#94a3b8" strokeWidth="1" />
              {/* 検査 (□) */}
              <rect x="509" y={row.y - 6} width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="1" />
            </g>
          );
        })}

        {/* 実際の経路を示す赤の折れ線 (移動[行1] -> 作業[行2] -> 作業[行3] -> 移動[行4] -> 検査[行6]) */}
        {/* 座標: 行1移動(415, 80) -> 行2作業(365, 120) -> 行3作業(365, 160) -> 行4移動(415, 200) -> 行6検査(515, 280) */}
        <polyline points="415,80 365,120 365,160 415,200 515,280" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* 通過点の強調 */}
        <circle cx="415" cy="80" r="4.5" fill="#ef4444" />
        <circle cx="365" cy="120" r="4.5" fill="#ef4444" />
        <circle cx="365" cy="160" r="4.5" fill="#ef4444" />
        <circle cx="415" cy="200" r="4.5" fill="#ef4444" />
        <rect x="511" y="276" width="8" height="8" fill="#ef4444" />
      </svg>
    </div>
  </div>
);

// 問題3: 流動数曲線 (問題図)
const FlowRateAnalysisDiagram = ({ overlayLabels = false }) => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-md">
      <svg width="100%" height="280" viewBox="0 0 420 280" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        {/* 軸 */}
        <line x1="50" y1="40" x2="50" y2="240" stroke="#334155" strokeWidth="2" />
        <line x1="50" y1="240" x2="390" y2="240" stroke="#334155" strokeWidth="2" />
        <text x="30" y="35" fontSize="11" fontWeight="bold" fill="#334155">累積量</text>
        <text x="380" y="255" fontSize="11" fontWeight="bold" fill="#334155">時間</text>

        {/* 曲線1: 倉庫へのインプット累積線 */}
        <path d="M 50,200 Q 150,150 180,110 T 320,60 T 380,40" fill="none" stroke="#1e293b" strokeWidth="2" />
        <text x="210" y="75" textAnchor="end" fontSize="10" fontWeight="bold" fill="#334155">倉庫への</text>
        <text x="210" y="90" textAnchor="end" fontSize="10" fontWeight="bold" fill="#334155">インプット累積線</text>

        {/* 曲線2: 倉庫からのアウトプット累積線 */}
        <path d="M 50,240 Q 190,230 260,180 T 330,120 T 385,60" fill="none" stroke="#1e293b" strokeWidth="2" />
        <text x="350" y="145" textAnchor="start" fontSize="10" fontWeight="bold" fill="#334155">倉庫からの</text>
        <text x="350" y="160" textAnchor="start" fontSize="10" fontWeight="bold" fill="#334155">アウトプット累積線</text>

        {/* 時点 a (x=130) */}
        {/* インプット線上点: a=130, y1=140 */}
        <line x1="130" y1="140" x2="130" y2="240" stroke="#94a3b8" strokeDasharray="3,3" />
        <circle cx="130" cy="140" r="3.5" fill="#334155" />
        <text x="130" y="255" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">a</text>

        {/* 時点 b (x=225) */}
        <line x1="225" y1="95" x2="225" y2="240" stroke="#94a3b8" strokeDasharray="3,3" />
        <circle cx="225" cy="95" r="3.5" fill="#334155" />
        <circle cx="225" cy="200" r="3.5" fill="#334155" />
        <text x="225" y="255" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">b</text>

        {/* 時点 c (x=280) */}
        {/* アウトプット線上点: c=280, y2=140 */}
        <line x1="280" y1="140" x2="280" y2="240" stroke="#94a3b8" strokeDasharray="3,3" />
        <circle cx="280" cy="140" r="3.5" fill="#334155" />
        <text x="280" y="255" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">c</text>

        {/* 区間 A (水平方向 y=140, x=130〜280) */}
        <g>
          <line x1="130" y1="140" x2="280" y2="140" stroke={overlayLabels ? "#2563eb" : "#475569"} strokeWidth={overlayLabels ? "2.5" : "1.5"} />
          <path d="M 130,140 L 138,136 M 130,140 L 138,144 M 280,140 L 272,136 M 280,140 L 272,144" stroke={overlayLabels ? "#2563eb" : "#475569"} strokeWidth="1.5" />
          <rect x="195" y="127" width="20" height="14" fill="#ffffff" />
          <text x="205" y="138" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill={overlayLabels ? "#2563eb" : "#334155"}>A</text>
          {overlayLabels && (
            <text x="205" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">滞留期間</text>
          )}
        </g>

        {/* 区間 B (垂直方向 x=225, y=95〜200) */}
        <g>
          <line x1="225" y1="95" x2="225" y2="200" stroke={overlayLabels ? "#dc2626" : "#475569"} strokeWidth={overlayLabels ? "2.5" : "1.5"} />
          <path d="M 225,95 L 221,103 M 225,95 L 229,103 M 225,200 L 221,192 M 225,200 L 229,192" stroke={overlayLabels ? "#dc2626" : "#475569"} strokeWidth="1.5" />
          <rect x="230" y="137" width="20" height="14" fill="#ffffff" />
          <text x="240" y="148" textAnchor="middle" fontSize="11" fontWeight="extrabold" fill={overlayLabels ? "#dc2626" : "#334155"}>B</text>
          {overlayLabels && (
            <text x="250" y="148" textAnchor="start" fontSize="10" fontWeight="bold" fill="#dc2626">在庫量</text>
          )}
        </g>
      </svg>
    </div>
  </div>
);

// 問題3解説: 流動数曲線（基本の折れ線イメージ）
const CumulativeFlowAnalysisExplanationDiagram = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-md">
      <div className="text-center text-xs font-bold text-slate-800 mb-2">流動数曲線における在庫量と滞留時間の関係</div>
      <svg width="100%" height="260" viewBox="0 0 400 260" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        <line x1="40" y1="30" x2="40" y2="220" stroke="#334155" strokeWidth="2" />
        <line x1="40" y1="220" x2="370" y2="220" stroke="#334155" strokeWidth="2" />
        <text x="25" y="25" fontSize="10" fill="#334155">累積量</text>
        <text x="360" y="235" fontSize="10" fill="#334155">時間</text>
        
        {/* 流入累積 */}
        <polyline points="40,220 80,180 120,165 160,130 200,120 240,100 280,70 320,50 360,40" fill="none" stroke="#94a3b8" strokeWidth="2" />
        {/* 流出累積 */}
        <polyline points="40,220 100,220 140,200 180,175 220,150 260,130 300,100 340,70 360,60" fill="none" stroke="#1e293b" strokeWidth="2" />
        
        <circle cx="200" cy="120" r="3.5" fill="#475569" />
        <circle cx="280" cy="120" r="3.5" fill="#475569" />
        
        <circle cx="160" cy="130" r="3.5" fill="#475569" />
        <circle cx="160" cy="188" r="3.5" fill="#475569" />
        
        {/* 滞留時間 (水平) */}
        <line x1="200" y1="120" x2="280" y2="120" stroke="#2563eb" strokeWidth="2" />
        <path d="M 200,120 L 206,117 M 200,120 L 206,123 M 280,120 L 274,117 M 280,120 L 274,123" stroke="#2563eb" strokeWidth="1.5" />
        <text x="240" y="113" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">滞留時間</text>
        
        {/* 在庫量 (垂直) */}
        <line x1="160" y1="130" x2="160" y2="188" stroke="#dc2626" strokeWidth="2" />
        <path d="M 160,130 L 157,136 M 160,130 L 163,136 M 160,188 L 157,182 M 160,188 L 163,182" stroke="#dc2626" strokeWidth="1.5" />
        <text x="166" y="163" textAnchor="start" fontSize="10" fontWeight="bold" fill="#dc2626">在庫量</text>

        <legend>
          <rect x="250" y="180" width="10" height="2" fill="#94a3b8" />
          <text x="265" y="184" fontSize="9" fill="#475569">累積流入量</text>
          <rect x="250" y="195" width="10" height="2" fill="#1e293b" />
          <text x="265" y="199" fontSize="9" fill="#475569">累積流出量</text>
        </legend>
      </svg>
    </div>
  </div>
);

// 問題4解説: P-Q分析チャート
const PQAnalysisExplanationChart = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-sm">
      <div className="text-center text-xs font-bold text-slate-800 mb-2">P-Q分析 (生産量-製品種類の関係)</div>
      <svg viewBox="0 0 320 220" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        <line x1="30" y1="20" x2="30" y2="180" stroke="#334155" strokeWidth="1.5" />
        <line x1="30" y1="180" x2="300" y2="180" stroke="#334155" strokeWidth="1.5" />
        <text x="15" y="15" fontSize="9" fill="#334155">生産量(Q)</text>
        <text x="295" y="193" textAnchor="end" fontSize="9" fill="#334155">製品の種類(P)</text>
        
        {/* Aグループ (棒グラフ) */}
        <rect x="40" y="40" width="16" height="140" fill="#f97316" />
        <rect x="60" y="60" width="16" height="120" fill="#f97316" />
        <rect x="80" y="80" width="16" height="100" fill="#f97316" />
        
        {/* Bグループ */}
        <rect x="105" y="100" width="16" height="80" fill="#eab308" />
        <rect x="125" y="115" width="16" height="65" fill="#eab308" />
        <rect x="145" y="125" width="16" height="55" fill="#eab308" />
        
        {/* Cグループ */}
        <rect x="170" y="140" width="16" height="40" fill="#22c55e" />
        <rect x="190" y="148" width="16" height="32" fill="#22c55e" />
        <rect x="210" y="155" width="16" height="25" fill="#22c55e" />
        <rect x="230" y="160" width="16" height="20" fill="#22c55e" />
        
        {/* 点線囲みとテキスト */}
        <rect x="36" y="30" width="64" height="155" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="68" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444">Aグループ</text>
        <text x="68" y="34" textAnchor="middle" fontSize="7" fill="#ef4444">製品別レイアウト</text>

        <rect x="102" y="90" width="62" height="95" fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="133" y="84" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#b45309">Bグループ</text>
        <text x="133" y="94" textAnchor="middle" fontSize="7" fill="#b45309">グループ別</text>

        <rect x="167" y="132" width="82" height="53" fill="none" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="208" y="124" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#15803d">Cグループ</text>
        <text x="208" y="134" textAnchor="middle" fontSize="7" fill="#15803d">機能別レイアウト</text>
      </svg>
    </div>
  </div>
);

// 問題4解説: 運搬活性分析
const HandlingActivityExplanationChart = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-sm">
      <div className="text-center text-xs font-bold text-slate-800 mb-2">運搬活性分析 (状態と活性示数)</div>
      <svg viewBox="0 0 320 220" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        {/* 横グリッド線 */}
        {[0, 1, 2, 3, 4].map(val => (
          <g key={val}>
            <line x1="45" y1={170 - val * 30} x2="300" y2={170 - val * 30} stroke="#f1f5f9" strokeWidth="1" />
            <text x="35" y={173 - val * 30} textAnchor="end" fontSize="9" fill="#64748b">{val}</text>
          </g>
        ))}
        
        {/* 軸 */}
        <line x1="45" y1="20" x2="45" y2="180" stroke="#334155" strokeWidth="1.5" />
        <line x1="45" y1="170" x2="300" y2="170" stroke="#334155" strokeWidth="1.5" />
        <text x="20" y="15" fontSize="8" fill="#334155">活性示数</text>
        <text x="290" y="185" textAnchor="end" fontSize="8" fill="#334155">工程</text>
        
        {/* プロット点と線 (0 -> 3 -> 4 -> 2 -> 4 -> 0) */}
        {/* x座標: 60, 100, 140, 180, 220, 260 */}
        <polyline points="60,170 100,80 140,50 180,110 220,50 260,170" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {[
          { x: 60, y: 170, label: "床にバラ置き" },
          { x: 100, y: 80, label: "台車に積む" },
          { x: 140, y: 50, label: "台車で運ぶ" },
          { x: 180, y: 110, label: "パレットに置く" },
          { x: 220, y: 50, label: "車で運ぶ" },
          { x: 260, y: 170, label: "床に置く" },
        ].map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ef4444" />
            <text x={pt.x} y="195" textAnchor="middle" fontSize="6.5" fill="#334155" transform={`rotate(-15, ${pt.x}, 195)`}>{pt.label}</text>
          </g>
        ))}
      </svg>
    </div>
  </div>
);

// 問題4解説: 流れ線図 (フローダイヤグラム)
const FlowDiagramExplanation = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-sm">
      <div className="text-center text-xs font-bold text-slate-800 mb-2">流れ線図 (フローダイヤグラムのイメージ)</div>
      <svg viewBox="0 0 320 260" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        {/* 工場外枠 */}
        <rect x="15" y="35" width="290" height="210" fill="none" stroke="#475569" strokeWidth="2" />
        
        {/* 各部屋レイアウト */}
        <rect x="25" y="45" width="80" height="60" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="2,2" />
        <text x="65" y="78" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">加工機械 A</text>

        <rect x="215" y="45" width="80" height="60" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="2,2" />
        <text x="255" y="78" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">検査機械 A</text>

        <rect x="25" y="170" width="80" height="60" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="2,2" />
        <text x="65" y="203" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">加工機械 B</text>

        {/* 流れ記号と接続線 */}
        {/* 材料倉庫(逆三角) -> 運搬(○) -> 加工(○大) -> 検査(◇) */}
        <line x1="65" y1="20" x2="65" y2="75" stroke="#ef4444" strokeWidth="2" />
        <polygon points="55,20 75,20 65,35" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        <text x="65" y="12" textAnchor="middle" fontSize="8" fill="#475569">材料倉庫</text>
        
        <circle cx="65" cy="50" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="65" cy="75" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        
        {/* 加工から検査へ移動 */}
        <path d="M 65,85 L 65,135 L 255,135 L 255,80" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
        <circle cx="160" cy="135" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        
        <polygon points="255,60 270,75 255,90 240,75" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        
        {/* 検査から倉庫へ */}
        <line x1="255" y1="50" x2="255" y2="20" stroke="#ef4444" strokeWidth="2" />
        <polygon points="245,20 265,20 255,35" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
        <text x="255" y="12" textAnchor="middle" fontSize="8" fill="#475569">製品倉庫</text>
      </svg>
    </div>
  </div>
);

// 問題5: フロムツーチャート (HTML Table)
const FromToMatrixTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white p-2">
    <table className="border-collapse border border-slate-300 w-full max-w-sm mx-auto text-center text-xs">
      <thead>
        <tr className="bg-slate-100 font-bold">
          <th className="border border-slate-300 p-2 relative w-16 h-12 bg-slate-50">
            <span className="absolute top-1 right-2 text-[10px] text-slate-500">To</span>
            <span className="absolute bottom-1 left-2 text-[10px] text-slate-500">From</span>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#cbd5e1" strokeWidth="1.5"/>
            </svg>
          </th>
          <th className="border border-slate-300 p-2 font-bold text-slate-800 w-12">A</th>
          <th className="border border-slate-300 p-2 font-bold text-slate-800 w-12">B</th>
          <th className="border border-slate-300 p-2 font-bold text-slate-800 w-12">C</th>
          <th className="border border-slate-300 p-2 font-bold text-slate-800 w-12">D</th>
          <th className="border border-slate-300 p-2 font-bold text-slate-800 w-12">E</th>
        </tr>
      </thead>
      <tbody>
        {[
          { from: "A", to: [null, 12, 5, 25, null] },
          { from: "B", to: [null, null, 11, null, 4] },
          { from: "C", to: [null, null, null, 2, null] },
          { from: "D", to: [11, null, null, null, null] },
          { from: "E", to: [null, 27, null, null, null] },
        ].map((row, rIdx) => (
          <tr key={rIdx}>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">{row.from}</td>
            {row.to.map((val, cIdx) => {
              const isDiagonal = rIdx === cIdx;
              return (
                <td
                  key={cIdx}
                  className={`border border-slate-300 p-2 font-semibold ${
                    isDiagonal
                      ? "bg-slate-100 relative"
                      : val !== null
                      ? "text-slate-800 bg-white"
                      : "text-slate-400 bg-slate-50/30"
                  }`}
                >
                  {isDiagonal ? (
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e2e8f0" strokeWidth="1.5"/>
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
);

// 問題7: サーブリッグ分析結果表 (JIS Z 8141)
const TherbligAnalysisResultTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white">
    <div className="text-center font-bold text-xs text-slate-800 p-3 bg-slate-50 border-b border-slate-200">部品を取り置く動作のサーブリッグ分析結果</div>
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200 text-center">
          <th className="p-3 border-r border-slate-200 w-1/2" colSpan="3">左手</th>
          <th className="p-3 w-1/2" colSpan="3">右手</th>
        </tr>
        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <th className="p-2 text-left pl-3">動作説明</th>
          <th className="p-2 w-12 text-center">略号</th>
          <th className="p-2 w-12 text-center border-r border-slate-200">記号</th>
          <th className="p-2 w-12 text-center">記号</th>
          <th className="p-2 w-12 text-center">略号</th>
          <th className="p-2 text-left pl-3">動作説明</th>
        </tr>
      </thead>
      <tbody>
        {[
          { lName: "部品に手を伸ばす", lCode: "TE", rCode: "UD", rName: "避得ぬ遅れ" },
          { lName: "部品を選ぶ", lCode: "ST", rCode: "UD", rName: "避得ぬ遅れ" },
          { lName: "部品をつかむ", lCode: "G", rCode: "UD", rName: "避得ぬ遅れ" },
          { lName: "部品を運ぶ", lCode: "TL", rCode: "UD", rName: "避得ぬ遅れ" },
          { lName: "部品を保持する", lCode: "H", rCode: "G", rName: "部品をつかむ" },
          { lName: "部品をはなす", lCode: "RL", rCode: "H", rName: "部品を保持する" },
          { lName: "手元に手を戻す", lCode: "TE", rCode: "TL", rName: "部品を運ぶ" },
          { lName: "避け得ぬ遅れ", lCode: "UD", rCode: "P", rName: "部品を位置決めする" },
          { lName: "避け得ぬ遅れ", lCode: "UD", rCode: "RL", rName: "部品をはなす" },
          { lName: "避け得ぬ遅れ", lCode: "UD", rCode: "TE", rName: "手元に手を戻す" },
        ].map((row, idx) => (
          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
            <td className="p-2.5 pl-3 text-slate-700 font-medium">{row.lName}</td>
            <td className="p-2.5 text-center font-bold text-slate-800">{row.lCode}</td>
            <td className="p-2.5 text-center border-r border-slate-200">
              <div className="flex justify-center"><TherbligIcon type={row.lCode} /></div>
            </td>
            <td className="p-2.5 text-center">
              <div className="flex justify-center"><TherbligIcon type={row.rCode} /></div>
            </td>
            <td className="p-2.5 text-center font-bold text-slate-800">{row.rCode}</td>
            <td className="p-2.5 pl-3 text-slate-700 font-medium">{row.rName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 問題7解説: サーブリッグ動作分類表
const TherbligClassificationTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs text-left border-collapse">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-3 w-20 text-slate-700">分類</th>
          <th className="p-3 w-40 text-slate-700">動作名(略号)</th>
          <th className="p-3 text-slate-700">動作の説明・特徴</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-3 font-bold text-emerald-800 bg-emerald-50 text-center">第1類</td>
          <td className="p-3 font-semibold text-slate-800 leading-relaxed">
            手を伸ばす(TE) / つかむ(G)<br/>
            運ぶ(TL) / 放す(RL)<br/>
            組み合わす(A) / 使う(U)<br/>
            分解する(DA) / 調べる(I)
          </td>
          <td className="p-3 text-slate-600 leading-relaxed">
            <span className="font-bold text-emerald-700">仕事を行ううえで必要な動作要素。</span>主に上半身を使って行われ、これら自体を省略することは不可能だが、時間の短縮や簡素化などの改善余地がある。
          </td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-3 font-bold text-amber-800 bg-amber-50 text-center">第2類</td>
          <td className="p-3 font-semibold text-slate-800 leading-relaxed">
            探す(SH) / 見出す(F)<br/>
            選ぶ(ST) / 考える(PN)<br/>
            位置決め(P) / 前置き(PP)
          </td>
          <td className="p-3 text-slate-600 leading-relaxed">
            <span className="font-bold text-amber-700">第1類の作業の実行を妨げる（遅らせる）動作要素。</span>主に感覚器官や頭脳で行う動作で、治具の改善や配置の定位置化などによって極力減らす・排除すべき動作。
          </td>
        </tr>
        <tr>
          <td className="p-3 font-bold text-red-800 bg-red-50 text-center">第3類</td>
          <td className="p-3 font-semibold text-slate-800 leading-relaxed">
            保持(H) / 休む(R)<br/>
            避け得ぬ遅れ(UD)<br/>
            避け得る遅れ(AD)
          </td>
          <td className="p-3 text-slate-600 leading-relaxed">
            <span className="font-bold text-red-700">作業を行わない動作要素（無駄）。</span>手で部品を固定する(保持)や、機械待ち(手待ち)など、レイアウトや治具の工夫により完全に排除することが目指される。
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題10解説: 作業測定体系図 (SVG Tree)
const WorkMeasurementTreeDiagram = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-md overflow-x-auto">
      <svg width="400" height="200" viewBox="0 0 400 200" className="mx-auto bg-white rounded-lg shadow-sm border border-slate-100">
        {/* 各結線 */}
        <path d="M 90,100 L 120,50 L 220,50" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 90,100 L 120,150 L 220,150" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 220,50 L 235,25 L 300,25" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 220,50 L 235,75 L 300,75" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 220,150 L 235,125 L 300,125" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 220,150 L 235,175 L 300,175" fill="none" stroke="#64748b" strokeWidth="1.5" />

        {/* 第1層 */}
        <rect x="10" y="80" width="80" height="40" rx="4" fill="#3b82f6" />
        <text x="50" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">作業測定</text>

        {/* 第2層 */}
        <rect x="140" y="30" width="80" height="40" rx="4" fill="#10b981" />
        <text x="180" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">稼動分析</text>

        <rect x="140" y="130" width="80" height="40" rx="4" fill="#10b981" />
        <text x="180" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">時間研究</text>

        {/* 第3層 */}
        <text x="300" y="29" fontSize="10" fontWeight="bold" fill="#1e293b">連続観測法</text>
        <text x="300" y="79" fontSize="10" fontWeight="bold" fill="#1e293b">瞬間観測法 (WSなど)</text>
        <text x="300" y="129" fontSize="10" fontWeight="bold" fill="#1e293b">直接測定法 (SWなど)</text>
        <text x="300" y="179" fontSize="10" fontWeight="bold" fill="#1e293b">間接測定法 (PTSなど)</text>
      </svg>
    </div>
  </div>
);

// 問題11: ワークサンプリング度数表 (HTML Table)
const WorkSamplingFrequencyTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs text-left border-collapse">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-3 text-slate-700 pl-4">作業項目</th>
          <th className="p-3 text-right pr-6 text-slate-700 w-24">度数</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "ハンダ付け", freq: 120 },
          { name: "基盤への部品の取り付け", freq: 90 },
          { name: "基盤のネジ止め", freq: 80 },
          { name: "組立作業完了後の製品検査(全数)", freq: 60 },
          { name: "ロット単位での完成部品の運搬", freq: 33 },
          { name: "不良品の手直し", freq: 30 },
          { name: "ネジ・ハンダの補充(不定期)", freq: 22 },
          { name: "部品不足による手待ち", freq: 24 },
          { name: "打ち合わせ", freq: 19 },
          { name: "朝礼", freq: 12 },
          { name: "水飲み", freq: 5 },
          { name: "用便", freq: 5 },
        ].map((row, idx) => (
          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
            <td className="p-2.5 pl-4 text-slate-700 font-medium">{row.name}</td>
            <td className="p-2.5 text-right pr-6 font-bold text-slate-900">{row.freq}</td>
          </tr>
        ))}
        <tr className="bg-slate-50 font-bold border-t border-slate-200">
          <td className="p-3 pl-4 text-slate-800 text-sm">合計</td>
          <td className="p-3 text-right pr-6 text-slate-900 text-sm">500</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題11解説: ワークサンプリング詳細分類表 (HTML Table)
const WorkSamplingDetailClassificationTable = () => (
  <div className="my-6 overflow-x-auto shadow-md rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs text-left border-collapse">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-3 text-slate-700 pl-4">作業項目</th>
          <th className="p-3 text-right pr-6 text-slate-700 w-20">度数</th>
          <th className="p-3 text-slate-700 w-44">作業分類</th>
          <th className="p-3 text-slate-700">分類の説明</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "ハンダ付け", freq: 120, cls: "主体作業 (主作業)", desc: "製品の組み立て本来の作業" },
          { name: "基盤への部品の取り付け", freq: 90, cls: "主体作業 (主作業)", desc: "製品の組み立て本来の作業" },
          { name: "基盤のネジ止め", freq: 80, cls: "主体作業 (主作業)", desc: "製品の組み立て本来の作業" },
          { name: "組立作業完了後の製品検査(全数)", freq: 60, cls: "主体作業 (付随作業)", desc: "主作業に付随して規則的に発生する検査" },
          { name: "ロット単位での完成部品の運搬", freq: 33, cls: "準備段取作業", desc: "ロット毎や始業・終業時に発生する運搬" },
          { name: "不良品の手直し", freq: 30, cls: "作業余裕", desc: "不規則、偶発的に発生するロス的作業" },
          { name: "ネジ・ハンダの補充(不定期)", freq: 22, cls: "作業余裕", desc: "不定期な資材補充など" },
          { name: "部品不足による手待ち", freq: 24, cls: "職場余裕", desc: "部品欠品などの管理不良による手待ち時間" },
          { name: "打ち合わせ", freq: 19, cls: "職場余裕", desc: "朝礼や打合せなどの職場管理時間" },
          { name: "朝礼", freq: 12, cls: "職場余裕", desc: "朝礼や打合せなどの職場管理時間" },
          { name: "水飲み", freq: 5, cls: "用達余裕", desc: "休憩や生理現象など人的要素に必要な余裕" },
          { name: "用便", freq: 5, cls: "用達余裕", desc: "休憩や生理現象など人的要素に必要な余裕" },
        ].map((row, idx) => (
          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
            <td className="p-2.5 pl-4 text-slate-700 font-medium">{row.name}</td>
            <td className="p-2.5 text-right pr-6 font-bold text-slate-900">{row.freq}</td>
            <td className="p-2.5 text-slate-800 font-semibold bg-slate-50/30">{row.cls}</td>
            <td className="p-2.5 text-slate-500">{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 問題15解説: 余裕率（内掛け法・外掛け法）イメージ図
const AllowanceRateComparisonDiagram = () => (
  <div className="flex justify-center my-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
    <div className="w-full max-w-md">
      <div className="space-y-6">
        {/* 内掛け法 */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
          <div className="text-[11px] font-bold text-indigo-700 mb-2">■ 内掛け法の余裕率（標準時間に対する余裕時間の割合）</div>
          <div className="flex h-12 rounded overflow-hidden border border-slate-300 relative text-xs">
            <div className="bg-emerald-100 flex items-center justify-center font-bold text-emerald-800" style={{ width: "80%" }}>
              正味時間 (80)
            </div>
            <div className="bg-amber-100 flex items-center justify-center font-bold text-amber-800 border-l border-slate-300" style={{ width: "20%" }}>
              余裕時間 (20)
            </div>
          </div>
          {/* 下部トータル線 */}
          <div className="flex justify-between items-center mt-2 px-1 text-[11px]">
            <span className="text-slate-500">標準時間 ＝ 正味時間 ＋ 余裕時間 (100)</span>
            <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">余裕率 ＝ 20 / 100 ＝ 0.20 (20%)</span>
          </div>
        </div>

        {/* 外掛け法 */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
          <div className="text-[11px] font-bold text-sky-700 mb-2">■ 外掛け法の余裕率（正味時間に対する余裕時間の割合）</div>
          <div className="flex h-12 rounded overflow-hidden border border-slate-300 relative text-xs">
            <div className="bg-emerald-100 flex items-center justify-center font-bold text-emerald-800" style={{ width: "80%" }}>
              正味時間 (80)
            </div>
            <div className="bg-amber-100 flex items-center justify-center font-bold text-amber-800 border-l border-slate-300" style={{ width: "20%" }}>
              余裕時間 (20)
            </div>
          </div>
          {/* 外掛け法での割合矢印 */}
          <div className="flex justify-between items-center mt-2 px-1 text-[11px]">
            <span className="text-slate-500">基準となるのは「正味時間」</span>
            <span className="font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">余裕率 ＝ 20 / 80 ＝ 0.25 (25%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ダイアグラム決定関数
const renderDiagram = (id, isExplanation = false) => {
  if (!isExplanation) {
    if (id === 1) return <ProductProcessFlowDiagram />;
    if (id === 3) return <FlowRateAnalysisDiagram />;
    if (id === 5) return <FromToMatrixTable />;
    if (id === 7) return <TherbligAnalysisResultTable />;
    if (id === 11) return <WorkSamplingFrequencyTable />;
    return null;
  } else {
    switch (id) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 text-center">【工程図記号の対照表】</div>
            <ProcessSymbolsTable />
          </div>
        );
      case 2:
        return <WorkerProcessAnalysisTable />;
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 text-center">【流動数曲線の構造と見方】</div>
            <FlowRateAnalysisDiagram overlayLabels={true} />
            <CumulativeFlowAnalysisExplanationDiagram />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <PQAnalysisExplanationChart />
            <HandlingActivityExplanationChart />
            <FlowDiagramExplanation />
            <div className="text-xs font-semibold text-slate-500 text-center">【フロムツーチャートの例】</div>
            <FromToMatrixTable />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 text-center">【フロムツーチャートの分析と解説】</div>
            <FromToMatrixTable />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <TherbligClassificationTable />
          </div>
        );
      case 10:
        return <WorkMeasurementTreeDiagram />;
      case 11:
        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 text-center">【ワークサンプリング法の作業分類・度数詳細】</div>
            <WorkSamplingDetailClassificationTable />
          </div>
        );
      case 15:
        return <AllowanceRateComparisonDiagram />;
      default:
        return null;
    }
  }
};

// ==========================================
// 過去問データ配列 (完全ノンカット収録)
// ==========================================
const QUESTIONS = [
  {
    id: 1,
    title: "製品工程分析",
    source: "過去問 令和4年 第13問",
    question: "部品Ａ、Ｂ、Ｃを用いて製品Ｘが製造される生産の流れについて、製品工程分析を行った結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "ア　加工ａ、ｂ、ｃは、同期して加工している。",
      "イ　台車は11 台である。",
      "ウ　滞留を表す工程は、4 カ所である。",
      "エ　品質保証室での検査は、品質検査を主として行っているが、同時に数量検査も行っている。",
      "オ　部品Ａ、Ｂ、Ｃは、同じ倉庫にまとめて保管されている。"
    ],
    answer: "エ",
    explanation: "製品工程分析に関する出題です。工程図記号の知識が求められています。記号の意味を理解していると容易に正解できる問題です。\n\n製品工程分析は、製品が加工される流れを、運搬、検査、停滞を含めて表します。工程ごとに、作業の種類を表す工程図記号を用いて表します。\n\nでは、選択肢を見ていきましょう。\n\n選択肢アは不適切な記述です。製品工程分析では、各工程が同期しているかどうかを読み取ることはできません。\n\n選択肢イは不適切な記述です。製品工程分析では、台車の数までは表していません。この図からは、運搬（台車）工程が11か所あることだけが把握できます。\n\n選択肢ウは不適切な記述です。滞留を表す工程図記号は3ヵ所です。4ヵ所あるのは貯蔵です。\n\n選択肢エは適切な記述です。品質保証室での検査は、品質検査を主として行いながら数量検査も実施する複合記号で表されています。\n\n選択肢オは不適切な記述です。製品工程分析では、同じ倉庫で保管しているかどうかを読み取ることはできません。\n\n工程図記号は過去の本試験でよく出題されています。工程図記号を覚えておくと得点を稼ぎやすいので、記号の種類と意味を覚えておくと良いでしょう。"
  },
  {
    id: 2,
    title: "作業者工程分析",
    source: "過去問 平成26年 第17問",
    question: "以下の①～④に示す事象に対して作業者工程分析を行った。｢作業｣に分類された事象の数として、最も適切なものを下記の解答群から選べ。\n①対象物を左手から右手に持ち替える。\n②機械設備での対象物の加工を作業者が監視する。\n③対象物を加工するための前準備や加工後の後始末をする。\n④出荷のために対象物の数量を確認する。",
    choices: [
      "ア　1個",
      "イ　2個",
      "ウ　3個",
      "エ　4個"
    ],
    answer: "イ",
    explanation: "作業者工程分析に関する問題です。\n作業者工程分析に関して細かい内容も問われており、やや難易度の高い問題です。\n\nまず、作業者工程分析について簡単に復習しておきましょう。\n\n【作業者工程分析】\n作業者工程分析は、作業者の作業を中心に分析するものです。作業者工程分析では、図のように、加工（作業）、移動、手待ち、検査について、工程図記号で表します。\n\nここまで押さえた上で、選択肢を見ていきましょう。\n\n選択肢①について、上図の作業者工程分析では、工程系列の加工（作業）〇に対しての作業者工程は、「材料を機械に取り付ける」が対象となっています。つまり、加工をしていなくても、「移動」「手待ち」「検査」以外は「加工（作業）」に分類されます。従って、「右から左に持ち替える」ことも加工（作業）に分類されます。よって選択肢①は適切です。\n\n選択肢②について、作業者工程分析は、作業者の作業を中心に分析するものです。「機械設備での対象物の加工を作業者が監視する」のは、作業者と機械という組み合わせによる作業であり、連合作業分析などにて分析されます。よって選択肢②は不適切です。\n\n選択肢③について、作業者工程分析では、対象物の加工そのものだけでなく、「加工するための前準備や加工後の後始末」も加工に含まれます。よって選択肢③は適切です。\n\n選択肢④について、「出荷のために対象物の数量を確認する」のは、作業者工程分析の検査にあたります。検査は作業に含まれません。なお、作業者工程分析では、数量検査と品質検査は分かれておらず、どちらも検査となります。よって選択肢④は不適切です。\n\nこれらから、作業者工程分析の作業に分類されるのは、2個となります。よって、解答群の中でイが適切で正解となります。"
  },
  {
    id: 3,
    title: "流動数分析",
    source: "過去問 令和4年 第14問",
    question: "ある倉庫では、ある製品の入出庫管理が先入先出法で行われている。その製品の在庫状況を把握するために行った流動数分析の結果を下図に示す。この図から読み取ることができる記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "ア　Ａが示す区間の値は、時点ａにおける在庫量が倉庫に補充されるまでの期間である。",
      "イ　Ａが示す区間の値は、時点ａに入庫した製品の倉庫における滞留期間である。",
      "ウ　Ｂが示す区間の値は、時点ｂにおいて製品が倉庫に補充された量である。",
      "エ　Ｂが示す区間の値は、時点ｂにおける製品が倉庫から出荷された量である。",
      "オ　インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の在庫が多い。"
    ],
    answer: "イ",
    explanation: "流動数分析に関する出題です。前年度の本試験でも類似問題が出題されていますので、過去問に取り組んでいた方は、容易に正解を選びやすい問題と言えます。\n\n流動数分析とは、製造リードタイム、在庫レベル、生産ロット数、生産回数等の関係をひと目でわかるようにした「流動数曲線」というグラフを用いて行う分析のことです。縦軸に累積量、横軸に時間を取って、流入（入荷）と流出（出荷）の関係を2つの折れ線グラフで表します。\n\nでは、本問の流動数曲線を確認しながら、選択肢を見ていきましょう。\n\n選択肢アは不適切な記述です。Aが示す区間の値は、時点aに入庫した製品が倉庫から出荷されるまでの滞留期間を示しています。在庫量が倉庫に補充されるまでの期間ではありません。\n\n選択肢イは適切な記述です。選択肢アの解説のとおりです。Aが示す区間の値は、時点aに入庫した製品が倉庫から出荷されるまでの滞留期間を示しています。\n\n選択肢ウは不適切な記述です。Bが示す区間の値は、時点bにおける倉庫の在庫量を示しています。倉庫に補充された量ではありません。\n\n選択肢エは不適切な記述です。選択肢ウの解説のとおりです。Bが示す区間の値は、時点bにおける倉庫の在庫量を示しています。倉庫から出荷された量ではありません。\n\n選択肢オは不適切な記述です。インプット累積線とアウトプット累積線における水平方向の間隔が広いほど、倉庫内の滞留期間が長いことを示します。在庫量を表すのは垂直方向の間隔です。\n\n流動数曲線は今後も出題される可能性があります。難しいグラフではありませんので、縦軸、横軸と2つの折れ線グラフの関係を読み取れるようにしておくと良いでしょう。"
  },
  {
    id: 4,
    title: "物の流れの分析",
    source: "過去問 平成24年 第8問",
    question: "物の流れの分析手法に関する記述として、最も不適切なものはどれか。",
    choices: [
      "ア　P-Q チャートは、横軸に製品種類P をとり、縦軸に生産量Qをとって、生産量Qの大きい順に並べて作成される。",
      "イ　運搬活性示数は、対象品の移動のしやすさを示す数で、バラ置きの対象品を移動する場合、①まとめる、②起こす、③移動する、という３つの手間が必要となる。",
      "ウ　流れ線図（フローダイヤグラム）では、物や人の流れ、逆行した流れ、隘路、無用な移動、配置の不具合が視覚的に把握できる。",
      "エ　流入流出図表（フロムツウチャート）は、多品種少量の品物を生産している職場の、機械設備および作業場所の配置計画をするときに用いられる。"
    ],
    answer: "イ",
    explanation: "物の流れの分析手法に関する出題です。\nまず、それぞれの物の流れの分析手法について簡単に復習しておきましょう。\n\n【分析手法】\n・P-Q チャートは、製品（Product）と生産量（Quantity）を分析する手法です。グラフの横軸には製品の種類（P）をとり、グラフの縦軸には生産量（Q）をとります。製品は生産量が多いものから少ないものに左から順番に並べます。\n・運搬活性示数とは、運搬活性分析で使用される数値であり、運搬のしやすさを表します。運搬活性分析は、どれぐらい運搬がしやすい状態になっているかを明らかにするための分析です。運搬活性示数は、0 から4 の間の数値を取り、0 がバラ置きの状態、1 が箱入りの状態、2 が枕 （パレット）置きの状態、3 が車上置きの状態、4 が移動中の状態となります。\n・流れ線図（フローダイヤグラム）は、工場などのレイアウト図の上に、工程図記号を記入することで、工程の流れを表すものです。物・人の動きや機械・設備の配置を視覚的に表すことができます。\n・流入流出図表（フロムツーチャート）は、工程間の物の流れを分析する手法です。各工程の間でどれぐらいの物量が流れているかを分析することができます。\n\nここまで押さえた上で選択肢を見ていきましょう。\n\n選択肢アについて、P-Q チャートの作成手順を正しく示しています。よって、選択肢アは適切です。\n\n選択肢イについて、運搬活性示数は、対象品の移動のしやすさを示す数という部分は適切です。しかし、バラ置きの対象品を移動する場合、まとめる、起こす、持ち上げる、移動する、という４つの手間が必要となります。選択肢の記述には「持ち上げる」が含まれていません。よって、選択肢イは不適切であり、これが正解です。\n\n選択肢ウについて、流れ線図（フローダイヤグラム）は、物や人の流れ、機械・設備の配置を視覚的に把握できるという特徴を正しく表しています。よって選択肢ウは適切です。\n\n選択肢エについて、流入流出図表（フロムツーチャート）は、多種少量生産の工程の分析や工場レイアウトの設計に用いられるという用途を正しく表しています。よって、選択肢エは適切です。\n\n本問において、選択肢イは、運搬活性示数についてやや細かい点を問われています。しかし、他の選択肢が適切であることが分かれば、消去法でも解答できる問題です。"
  },
  {
    id: 5,
    title: "フロムツーチャート",
    source: "過去問 令和元年 第3問",
    question: "ある工場でＡ～Ｅの5台の機械間における運搬回数を分析した結果、次のフロムツウチャートが得られた。この表から読み取れる内容に関する記述として、最も適切なものを下記の解答群から選べ。",
    choices: [
      "ア　機械Aから他の全ての機械に品物が移動している。",
      "イ　逆流が一カ所発生している。",
      "ウ　他の機械からの機械Bへの運搬回数は12である。",
      "エ　最も運搬頻度が高いのは機械A・D間である。"
    ],
    answer: "エ",
    explanation: "本問では、フロムツーチャートについて問われています。フロムツーチャートの基本的な問題で難易度は高くありません。\n\nでは、選択肢を見ていきましょう。\n\n選択肢アですが、機械Aから他の全ての機械に品物が移動しているとされていますが、機械Aから機械Eへ、機械Eから機械Aのいずれも空欄となっており、機械A・E間では移動していません。従って、不適切な記述です。\n\n選択肢イは、逆流が一ヵ所発生している、とされていますが、機械D・A間で11回、機械E・B間で27回の二ヵ所で逆流が発生しており、不適切な記述です。\n\n選択肢ウですが、他の機械から機械Bへの運搬回数は、機械A・B間の12回に加え、機械E・B間の27回があるため、運搬回数は39回となります。従って、不適切な記述です。\n\n選択肢エですが、最も運搬頻度が多いのは機械A・D間であるとしています。機械A・D間では機械Aから機械Dへの運搬は25回、機械Dから機械Aへの運搬は11回の合計36回となっています。他の機械間運搬頻度では機械B・E間が多いですが、運搬回数は機械Bから機械Eへの運搬は4回、機械Eから機械Bへの運搬は27回で合計31回となり、機械A・D間の方が多くなっています。従って、適切な記述です。"
  },
  {
    id: 6,
    title: "マテリアルハンドリング",
    source: "過去問 平成29年 第13問",
    question: "工場内でのマテリアルハンドリングに関する記述として、最も不適切なものはどれか。",
    choices: [
      "ア　運搬活性示数は、置かれている物品を運び出すために必要となる取り扱いの手間の数を示している。",
      "イ　運搬管理の改善には、レイアウトの改善、運搬方法の改善、運搬制度の改善がある。",
      "ウ　運搬工程分析では、モノの運搬活動を｢移動｣と｢取り扱い｣の2つの観点から分析する。",
      "エ　平均活性示数は、停滞工程の活性示数の合計を停滞工程数で除した値として求められる。"
    ],
    answer: "ア",
    explanation: "マテリアルハンドリングに関する出題です。運搬活性示数の定義を抑えていれば正解できる基本的な問題です。\n\n選択肢アは不適切な記述です。運搬活性示数は、物を移動するときに「すでに省かれている手間の数」を表し、０から４の間の数値を取ります。例えば、活性示数０は、床にバラ置きしてあるものを運搬する状態のことを指します。活性示数１は、箱に入っているものを運搬する状態のことで、まとめるという手順を省くことができます。このように、活性示数は大きいほうが効率的に運搬している状態となります。よって選択肢アは不適切で、正解です。\n\n選択肢イは適切な記述です。運搬管理を改善するには、非効率な部分をなくすことが必要になります。具体的には、レイアウトの変更、運搬方法の改善、運搬制度の改善があります。これらの改善に取り組むことによって、運搬の効率化が図れるようになります。よって選択肢イは適切です。\n\n選択肢ウは適切な記述です。運搬工程分析で用いられる運搬工程分析記号には、基本記号と台記号があり、このうち作業の種類を表すものは基本記号になります。基本記号には、移動、取り扱い、加工、停滞がありますが、加工と停滞は「モノの運搬活動」ではないため、モノの運搬活動を分析するときは、移動と取り扱いの２つの観点から行います。よって選択肢ウは適切です。\n\n選択肢エは適切な記述です。平均活性示数は、停滞工程の活性示数の合計を停滞工程数で割った値として求めることができます。値が小さいほど物の置き方が非効率であり、移動のために多くの手間を要することになります。よって選択肢エは適切です。"
  },
  {
    id: 7,
    title: "サーブリッグ分析",
    source: "過去問 平成28年 第17問",
    question: "サーブリッグ分析で用いられる記号は、次の3つに分類される。\n第1類：仕事を行ううえで必要な動作要素\n第2類：第1類の作業の実行を妨げる動作要素\n第3類：作業を行わない動作要素\n下表は、｢部品容器から左手で取り出した部品を右手に持ち換えた後、ある定められた位置に部品を定置する動作｣をサーブリッグ分析したものである。この動作の中で第1類に分類される左手の動作要素の数と右手の動作要素の数の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    choices: [
      "ア　左手：3個　右手：2個",
      "イ　左手：4個　右手：3個",
      "ウ　左手：5個　右手：4個",
      "エ　左手：6個　右手：5個"
    ],
    answer: "ウ",
    explanation: "サーブリッグ分析に関する出題です。サーブリッグ分析の結果から動作要素を読み取る必要があり、やや難易度の高い問題です。\n\nサーブリッグ分析とは、作業者の動作を18の基本動作に分解して分析する手法をいいます。18の基本動作は大きく３つに分類できます。\n\n上記の表より、第1類に該当する動作要素の数は、左手が５個、右手が４個となり、選択肢ウが正解です。\n\n※第1類(仕事に必要な動作): 手を伸ばす(TE)、つかむ(G)、運ぶ(TL)、放す(RL)、手元に手を戻す(TE) など。\n※第2類(妨げる動作): 選ぶ(ST) など。\n※第3類(作業を行わない動作): 保持する(H)、避け得ぬ遅れ(UD) など。\n\n左手で第1類に該当するのは：\n- 1行目: 部品に手を伸ばす (TE) [第1類]\n- 3行目: 部品をつかむ (G) [第1類]\n- 4行目: 部品を運ぶ (TL) [第1類]\n- 6行目: 部品をはなす (RL) [第1類]\n- 7行目: 手元に手を戻す (TE) [第1類]\n計 5 個。\n\n右手で第1類に該当するのは：\n- 5行目: 部品をつかむ (G) [第1類]\n- 7行目: 部品を運ぶ (TL) [第1類]\n- 9行目: 部品をはなす (RL) [第1類]\n- 10行目: 手元に手を戻す (TE) [第1類]\n計 4 個。\n\nサーブリッグ分析は度々出題されています。18の基本動作やサーブリッグ記号を全て覚える必要はありませんが、レイアウト図や分析表は読み取れるようにしておきましょう。"
  },
  {
    id: 8,
    title: "標準作業",
    source: "過去問 平成28年 第14問",
    question: "作業管理に利用される「標準作業」に関する記述として、最も不適切なものはどれか。",
    choices: [
      "ア　作業管理者を中心に、IEスタッフや現場作業者の意見を入れて全員が納得した作業でなければならない。",
      "イ　作業者の教育・訓練 of 基礎資料とするため、熟練作業者であれば実施可能になる最善の作業でなければならない。",
      "ウ　生産の構成要素である4M（Man, Machine, Material ,Method）を有効に活用した作業でなければならない。",
      "エ　製品または部品の製造工程全体を対象にした作業順序・作業方法・管理方法・使用設備などに関する基準の規定でなければならない。"
    ],
    answer: "イ",
    explanation: "標準作業に関する問題です。ある程度、常識的に判断することが可能な問題です。\n\nそれでは選択肢を見ていきましょう。\n\n選択肢アですが、標準作業の作成は、対象の管理者が中心に、技術やIEスタッフ、現場作業者などの意見を取り入れて、全員が納得し、実施できる最善の方法を採用することが重要です。したがって、適切な記述です。\n\n選択肢イを見てみましょう。標準作業は熟練作業者だけでなく、仕事に対する標準的な適性を持っているすべての作業者が実施可能となる最善の作業でなければなりません。したがって不適切な記述です。\n\n選択肢ウを見てみましょう。標準作業は製品または部品の生産を対象に、作業の目的である「よい品質のものを、より安く、より早く」しかも「より安全」に行うために、生産の構成要素である4M（man, machine, material, method）を有効活用した作業でなければなりません。したがって、適切な記述です。\n\n選択肢エを見てみましょう。標準作業とは、製品または部品の製造工程全体を対象にした作業条件、作業順序、作業方法、管理方法、使用材料、使用設備、作業要領などに関する基準の規定です。したがって、適切な記述です。"
  },
  {
    id: 9,
    title: "PTS法",
    source: "過去問 平成30年 第15問",
    question: "新製品を組み立てるための標準時間をPTS（Predetermined Time Standard）法を利用して算定することにした。標準時間を設定するための準備に関する記述として、最も適切なものの組み合わせを下記の解答群から選べ。\n\na　PTS 法で算定された標準時間を組立作業を行う作業者の習熟度に応じて調整するために、作業者の組立職場での就業年数を調査した。\nb　設備による加工時間を別途付与するために、設備で試加工を実施して加工時間を計測した。\nc　標準時間を見積もるための基礎資料を整備するために、既存製品の組立作業に対して時間分析を実施した。\nd　試作品を組み立てるための模擬ラインを敷設して、製品組立の標準作業を決定した。",
    choices: [
      "ア　ａとｂ",
      "イ　ａとｄ",
      "ウ　ｂとｃ",
      "エ　ｂとｄ"
    ],
    answer: "エ",
    explanation: "本問は、PTS法で標準時間を設定するための準備について問われています。\n\nまずはPTS法や、その他の標準時間を設定する方法について、簡単に復習しておきましょう。\n\nPTS法は、動作を微動作（サーブリッグ）のレベルに分解し、あらかじめ定められた微動作ごとの標準時間を合計する方法です。この方法は他の方法に比べ、より細かい微動作まで分解するのが特徴です。\n\nここまで押さえた上で、選択肢をみていきましょう。\n\nａですが、「標準時間を組立作業を行う作業者の習熟度に応じて調整する」という作業は、実際に観測した作業時間を正味時間に修正する「レイティング」のことです。例えば、作業が早い作業者を基に正味時間を設定してしまうと、標準時間としては相応しくないものになってしまいます。そのため、レイティング係数という数値を使って作業者による時間の個人差が生じないよう調整を行います。PTS法では、前述の通り細かく分解された微動作を基に標準時間を設定し、このレイティングの作業を行うことはありません。よって、ａは不適切です。\n\nｂですが、設備によって加工を行う場合、作業者の作業時間とは別に、設備による加工時間を把握した上で、作業者の作業時間に別途付与する必要があります。そのため、設備で試加工を実施して加工時間を計測することで、その設備による加工時間を把握することができます。よって、ｂは適切です。\n\nｃですが、「標準時間を見積もるための基礎資料を整備する」という作業は、直接時間を観測せずに、あらかじめ用意しておいた作業要素別の標準時間を合計することで、標準時間を合成する「標準時間資料法」という方法を指しています。これは、直接時間を観測せずに、標準時間を求めることができるものであり、毎回時間を観測する手間を削減するメリットがあります。PTS法では、前述の通り細かく分解された微動作を基に標準時間を設定しますので、標準時間資料法を用いて、既存製品の組立作業に対して時間分析を実施する必要はありません。よって、ｃは不適切です。\n\nｄですが、PTS法を含め、標準時間を設定するには、対象となる標準作業を決定する必要があります。製品組立の標準作業を決定するために、試作品を組み立てるための模擬ラインを敷設することは、標準作業の基となるラインの配置や設備を定めることができ、標準時間を設定する準備として有効な方法です。よって、ｄは適切です。\n\nしたがって、ｂとｄの組み合わせが適切であり、エが正解です。\n\n標準時間設定の方法は、PTS法や標準時間資料法の他に、ストップウォッチ法、実績資料法などがあります。頻出ではありませんが、ある程度の出題実績がある論点ですので、基本的な流れについて理解を深めておきましょう。"
  },
  {
    id: 10,
    title: "作業測定",
    source: "過去問 令和3年 第17問",
    question: "作業測定に関する記述として、最も適切なものはどれか。",
    choices: [
      "ア　PTS 法では、作業設計が終了した後、その作業を正確に再現して実測しなければ標準時間を求めることができない。",
      "イ　間接測定法である標準時間資料法は、過去に測定された作業単位ごとに資料化されている時間値を使って標準時間を求めるもので、類似の作業が多い職場に適している。",
      "ウ　直接測定法であるストップウオッチ法は、作業を要素作業または単位作業に分割して直接測定する方法で、サイクル作業には適していない。",
      "エ　人と機械が共同して行っているような作業における手待ちロスや停止ロスの改善を実施する場合には、人と機械に1人ずつ観測者がついて工程分析を行う必要がある。"
    ],
    answer: "イ",
    explanation: "作業測定に関する出題です。作業測定の様々な測定方法や特徴について問われており、やや難易度の高い問題です。\n\n作業測定とは、「作業又は製造方法の実施効率の評価及び標準時間を設定するための手法」（JIS Z 8141-5104）と定義されています。つまり、作業の効率を測定して標準時間を設定するための手法です。作業測定は「稼動分析」と「時間研究」から構成されます。\n\nでは、選択肢を見ていきましょう。\n\n選択肢アは不適切な記述です。PTS法は、動作を微動作のレベルに分解し、あらかじめ定められた微動作ごとの標準時間を合計する方法です。つまり、微動作ごとに規定されている時間を積み上げて合計の作業時間を求めますので、基本的に作業設計が終了したあとに作業を再現して実測する必要はありません。\n\n選択肢イは適切な記述です。標準時間資料法は、作業時間を直接観測しない間接測定法の１つです。過去に測定された「作業単位ごとに資料化されている時間軸」を、作業条件に合わせて合成し、標準時間を求めていきます。事前に細かい作業単位で標準時間を定めておく必要があるため、類似の作業が多い職場に適しています。\n\n選択肢ウは不適切な記述です。ストップウオッチ法とは、作業の要素ごとにストップウオッチで時間を測定し、レイティングを行って標準時間を設定する方法です。繰り返し遂行されるサイクル作業に適しています。\n\n選択肢エは不適切な記述です。人と機械が共同して行っている作業を分析する手法を人・機械分析（連合作業分析の一種）といいます。人・機械分析は1人でも可能であり、必ずしも人と機械に1人ずつ観測者がつく必要はありません。\n\n作業測定は頻出テーマです。作業測定に用いられる測定方法について、しっかり理解しておきましょう。"
  },
  {
    id: 11,
    title: "ワークサンプリング法",
    source: "過去問 平成28年 第16問",
    question: "人の作業者が電気部品の組み立てを行っている工程でワークサンプリング法を実施した結果が下表に示されている。この実施結果から算出される｢主体作業｣と｢職場余裕｣の時間構成比率の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    choices: [
      "ア　主体作業：58％　職場余裕：11％",
      "イ　主体作業：58％　職場余裕：12％",
      "ウ　主体作業：70％　職場余裕：11％",
      "エ　主体作業：70％　職場余裕：12％"
    ],
    answer: "ウ",
    explanation: "稼働分析の手法の１つであるワークサンプリング法における、作業分類に関する問題です。\n\nワークサンプリング法とは、作業者や機械が何をしているかを瞬間的に観測して記録し、その記録を集計して稼働状況を統計的に求める手法です。観測の目的として、作業者や機械の稼働状況の把握や、一連 of 作業に対して適切な余裕率を設定する場合などに行われます。度数とは、繰り返し観測された作業項目の出現頻度を表します。\n\nこの問題では、稼働分析における作業分類の知識が問われています。作業分類は次のように分けられます。\n\n【作業の分類体系】\n- 作業:\n  - 主体作業:\n    - 主作業: 材料を加工したり、部品を組み立てたりする、本来の作業\n    - 付随作業: 主作業に付随して規則的に発生し、作業の目的に間接的に関与する作業\n  - 準備段取作業: ロットごと、もしくは始業や終業時に発生する、準備や段取、後始末など\n- 余裕:\n  - 管理余裕:\n    - 作業余裕: 必要な作業であるが、不規則、偶発的に発生する作業\n    - 職場余裕: 作業の管理に必要な余裕\n  - 人的余裕:\n    - 用達余裕: 休憩やトイレに行くなど人間的な要素で必要な余裕\n    - 疲労余裕: 作業による疲労を回復するための余裕\n- 非作業: 作業者の個人的理由や怠惰により発生するもの\n\n「主体作業」とは、製品を直接生産している作業のことであり、作業サイクルに対して毎回又は一定の周期で行われる作業を指します。この主体作業は、直接的に加工や組み立てをしている「主作業」と、その主作業に伴って間接的に発生する「付随作業」に分けられます。\n\n「職場余裕」とは、本来の作業とは無関係に発生する職場特有の遅れを指します。例えば、朝礼や職場内の打ち合わせ、作業指導や掃除の時間など、管理のやり方によって生じてしまう「作業ができない時間」の事です。\n\n上記の分類を踏まえて、与えられた作業項目を分類すると次のようになります。\n\nハンダ付け(120) [主作業 -> 主体作業]\n基盤への部品の取り付け(90) [主作業 -> 主体作業]\n基盤のネジ止め(80) [主作業 -> 主体作業]\n組立作業完了後の製品検査(全数)(60) [付随作業 -> 主体作業]\n\nこれら「主体作業」の度数の合計は、120 ＋ 90 ＋ 80 ＋ 60 ＝ 350。\n\n職場余裕には以下が該当します。\n部品不足による手待ち(24) [職場余裕]\n打ち合わせ(19) [職場余裕]\n朝礼(12) [職場余裕]\n\nこれら「職場余裕」の度数の合計は、24 ＋ 19 ＋ 12 ＝ 55。\n\n全体の度数の合計が500であるため、時間構成比率を計算すると：\n- 主体作業: 350 ÷ 500 × 100 ＝ 70%\n- 職場余裕: 55 ÷ 500 × 100 ＝ 11%\n\nよって、正解はウになります。\n\n◆主作業と付随作業\n主体作業は、主作業と付随作業に分類されます。主作業は材料を加工したり、部品を組み立てたりする作業です。付随作業は主作業に付随して規則的に発生し、主作業に間接的に寄与する作業です。付随作業には、機械の電源オンオフや製品検査が該当します。主体作業の分類の際には付随作業も注意して見ていきましょう。"
  },
  {
    id: 12,
    title: "時間計測と分析",
    source: "過去問 平成28年 第15問",
    question: "作業改善を目的とした時間測定と分析に関する記述として、最も適切なものはどれか。",
    choices: [
      "ア　作業時間が管理状態にあるかどうかを確認するために、pn管理図を作成して分析した。",
      "イ　作業時間の測定精度を高めるために、やり直しを行った作業等の異常値は記録から除外して測定を行った。",
      "ウ　作業方法の変化を見つけ易くするために、作業の各サイクルに規則的に表れる要素作業と不規則に表れる要素作業は区別して時間測定を行った。",
      "エ　測定対象となる作業者に心理的な負担を与えないために、測定の実施を事前に通告せずに作業者から見えない場所で測定を行った。"
    ],
    answer: "ウ",
    explanation: "作業改善を目的とした時間計測と分析に関する問題です。連続観測法 (連続稼働分析) を理解していれば、ある程度まで選択肢を絞り込むことが可能です。\n\n連続観測法は、観測対象に付きっきりで観測する方法です。\n連続観測法のメリットは、詳細に作業を分析できるため、問題点の細かい分析に適していることです。一方、デメリットは作業者が観測されることを意識して、偏ったデータになる可能性があることです。\n\nここまで押さえた上で、選択肢を見ていきましょう。\n\n選択肢アについて、pn管理図は計数値に対する管理図であるため、計量値である作業時間を管理する用途には向いていません。この場合は、Xbar-R管理図を用いて作業時間が管理状態にあるかどうかを確認します。よって、選択肢アは不適切です。\n\n選択肢イについて、異常値を記録から除外すると、改善対象となる要素作業や異常の復旧に要する時間を記録できなくなります。そのため、その要素作業が改善対象とならずに、作業改善を実行できなくなります。よって、選択肢イは不適切です。\n\n選択肢ウについて、規則的に表れる要素作業と不規則に表れる要素作業を区別して時間測定を行うと、規則的に表れる要素作業に要する時間の変化から、作業方法が変化したことを見つけやすくなります。よって、選択肢ウは適切です。\n\n選択肢エについて、測定対象となる作業者には、心理的負荷を軽減するために、観測目的を理解してもらい協力を得るようにします。これを行わない場合、正しく時間を測定できない可能性があります。よって、選択肢エは不適切です。"
  },
  {
    id: 13,
    title: "標準時間1",
    source: "過去問 令和5年 第15問（設問2）",
    question: "金属部品を人手で加工する作業の標準時間を計算するためのデータとして、\n　　　　　　正味作業の観測時間：５分／個\n　　　　　　レイティング係数：120\n　　　　　　内掛け法による余裕率：0.20\nの値を得た。\n　このとき、下記の設問に答えよ。\n（設問２ ）\nこの作業の標準時間として、最も近いものはどれか（単位：分／個）。",
    choices: [
      "ア　6.25",
      "イ　6.50",
      "ウ　7.00",
      "エ　7.50",
      "オ　7.75"
    ],
    answer: "エ",
    explanation: "標準時間の設定に関する出題です。標準時間の設定方法について基本的な知識が問われています。公式を覚えている方は容易に解ける問題ですが、公式を理解していないと難しく感じたかもしれません。基礎知識で解ける問題ですので、難易度は高くありません。\n\nでは、実際に計算して解いてみましょう。\n\n標準時間は次の式で設定します。\n\n■ 標準時間 ＝ 正味時間 ÷ (1 - 余裕率) （内掛け法の場合）\n■ 正味時間 ＝ 観測時間の代表値 × レイティング係数\n\nレイティング係数とは、基準とする作業ペースを100%とした場合のその作業者の作業ペースを表します。作業者のペースが基準よりも速い場合は、レイティング係数は100%よりも大きくなります。\n\n本問に当てはめると、正味作業の観測時間は5分/個、レイティング係数は120%ですので、正味時間 ＝ 5分 × 1.2 ＝ 6分となります。\n\n次に、余裕率は正味時間あるいは標準時間に対する余裕時間の割合です。この余裕率を使って、さきほど算出した正味時間から標準時間を計算することができます。\n\n本問では内掛け法による余裕率が0.20と与えられていますので、標準時間の公式にそのまま当てはめれば答えが出ます。\n\n標準時間 ＝ 6分 ÷ （1 － 0.20） ＝ 6分 ÷ 0.8 ＝ 7.5分/個\n\n以上より、選択肢エが正解です。\n\n標準時間は出題頻度の高いテーマです。正味時間、レイティング係数、余裕率は重要なキーワードです。しっかり理解しておきましょう。また、余裕率には内掛け法と外掛け法があります。どちらも今後出題される可能性が高いので、両方とも計算できるようにしておきましょう。"
  },
  {
    id: 14,
    title: "標準時間２",
    source: "過去問 平成29年 第10問",
    question: "標準時間に関する記述として、最も不適切なものはどれか。",
    choices: [
      "ア　PTS法ではレイティングを行う必要はない。",
      "イ　内掛け法では、正味時間に対する余裕時間の割合で余裕率を考える。",
      "ウ　主体作業時間は、正味時間と余裕時間を合わせたものである。",
      "エ　人的余裕は、用達余裕と疲労余裕に分けられる。"
    ],
    answer: "イ",
    explanation: "標準時間に関する基本的な問題です。\n\n選択肢アについて、PTS法では、既定動作時間基準法としてあらかじめ細かく動作ごとの時間が決められているため、測定時にレイティング（作業ペースの補正）を行う必要はありません。よって選択肢アは適切です。\n\n選択肢イについて、内掛け法では、正味時間に余裕時間を加えた「標準時間」に対する「余裕時間」の割合で余裕率を求めます。正味時間に対する余裕時間の割合で余裕率を求めるのは、「外掛け法」です。よって選択肢イは不適切で、これが正解です。\n\n選択肢ウについて、主体作業時間は、正味時間と余裕時間を合わせたものになります。なお、作業全体の標準時間は、この主体作業時間と準備段取り時間を合わせて求めます。よって選択肢ウは適切です。\n\n選択肢エについて、余裕は管理余裕と人的余裕に分けられます。管理余裕は作業余裕と職場余裕、人的余裕は用達余裕と疲労余裕にそれぞれ分けられます。用達余裕とは水飲みやトイレなどの生理的欲求で発生する時間、疲労余裕とは作業者が疲労回復のために休憩する時間や疲労によって仕事が遅くなるために余計に発生する時間のことを言います。よって選択肢エは適切です。"
  },
  {
    id: 15,
    title: "余裕率",
    source: "過去問 令和5年 第15問（設問1）",
    question: "金属部品を人手で加工する作業の標準時間を計算するためのデータとして、\n　　　　　　正味作業の観測時間：５分／個\n　　　　　　レイティング係数：120\n　　　　　　内掛け法による余裕率：0.20\nの値を得た。\n　このとき、下記の設問に答えよ。\n（設問１ ）\n　この作業に対する外掛け法による余裕率の値として、最も近いものはどれか。",
    choices: [
      "ア　0.15",
      "イ　0.20",
      "ウ　0.25",
      "エ　0.30",
      "オ　0.35"
    ],
    answer: "ウ",
    explanation: "標準時間の余裕率に関する出題です。本問は外掛け法による余裕率の知識が問われています。公式を覚えている方は容易に解ける問題ですが、公式を知らないと難しく感じたかもしれません。基礎知識で解ける問題ですので、難易度は高くありません。\n\nでは、実際に計算してみましょう。\n\n余裕率とは、正味時間あるいは標準時間に対する余裕時間の割合です。余裕率には内掛け法と外掛け法があり、標準時間に対する余裕時間の割合が内掛け法で、正味時間に対する余裕時間の割合が外掛け法です。\n\nそれぞれ次の公式で求めます。\n\n■ 内掛け法の余裕率 ＝ 余裕時間 ÷ 標準時間 （標準時間は正味時間＋余裕時間）\n■ 外掛け法の余裕率 ＝ 余裕時間 ÷ 正味時間\n\n本問では、内掛け法による余裕率が0.20と与えられています。これは、標準時間を1.00としたとき、余裕時間が0.20、正味時間が0.80（1.00 - 0.20）になることを意味します。\n\nよって、外掛け法の余裕率は：\n外掛け法の余裕率 ＝ 0.20 ÷ 0.80 ＝ 0.25 と求めることができます。\n\n以上より、選択肢ウが正解です。\n\n標準時間は出題頻度の高いテーマです。余裕率は内掛け法と外掛け法ともに今後出題される可能性が高いです。どちらも計算できるようにしておきましょう。"
  }
];

// ==========================================
// メインアプリケーションコンポーネント
// ==========================================
export default function App() {
  const [userKey, setUserKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // クイズ状態
  const [quizMode, setQuizMode] = useState("all"); // "all" | "wrong" | "review"
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // ユーザーの履歴データ
  const [history, setHistory] = useState({}); // { [questionId]: { isCorrect: boolean, time: number } }
  const [reviewList, setReviewList] = useState({}); // { [questionId]: boolean }
  
  // 途中再開用一時データ
  const [pendingResume, setPendingResume] = useState(null); // { index: number, mode: string }
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "quiz"

  // 1. マウント時にFirebase匿名サインイン実行
  useEffect(() => {
    const doAuth = async () => {
      setLoading(true);
      console.log("Starting Anonymous Auth...");
      try {
        const auth = getAuth(app);
        await signInAnonymously(auth);
        console.log("Anonymous Auth Succeeded.");
      } catch (err) {
        console.error("Auth failed:", err);
        setAuthError("Firebase認証に失敗しました。接続状況を確認してください。");
      } finally {
        setLoading(false);
      }
    };
    doAuth();
  }, []);

  // 2. 合言葉でのロード処理
  const handleLoadData = async (e) => {
    if (e) e.preventDefault();
    if (!userKey.trim()) return;
    
    setLoading(true);
    setAuthError("");
    console.log(`Loading data for user: ${userKey}`);
    try {
      const docRef = doc(db, APP_ID, userKey.trim());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("User data retrieved:", data);
        setHistory(data.history || {});
        setReviewList(data.reviewList || {});
        
        // 途中再開データの有無を確認
        if (data.progressIndex > 0 && data.progressMode) {
          console.log(`Pending resume found: Index ${data.progressIndex}, Mode ${data.progressMode}`);
          setPendingResume({
            index: data.progressIndex,
            mode: data.progressMode
          });
        }
      } else {
        console.log("No existing user data. Starting fresh.");
        setHistory({});
        setReviewList({});
        setPendingResume(null);
      }
      setIsAuthorized(true);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Firestore read error:", err);
      setAuthError("データの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // 3. データ保存関数
  const saveStateToFirestore = async (newHistory, newReviewList, progressIdx, progressM) => {
    if (!isAuthorized || !userKey.trim()) return;
    
    try {
      const docRef = doc(db, APP_ID, userKey.trim());
      const payload = {
        history: newHistory || history,
        reviewList: newReviewList || reviewList,
        progressIndex: progressIdx !== undefined ? progressIdx : 0,
        progressMode: progressM || quizMode,
        updatedAt: Date.now()
      };
      await setDoc(docRef, payload, { merge: true });
      console.log("State synchronized with Firestore:", payload);
    } catch (err) {
      console.error("Firestore write error:", err);
    }
  };

  // 4. クイズの初期化・出題リスト構築
  const startQuiz = (mode, resumeIndex = 0) => {
    console.log(`Starting quiz - Mode: ${mode}, ResumeIndex: ${resumeIndex}`);
    let list = [];
    if (mode === "all") {
      list = [...QUESTIONS];
    } else if (mode === "wrong") {
      list = QUESTIONS.filter(q => history[q.id] && !history[q.id].isCorrect);
    } else if (mode === "review") {
      list = QUESTIONS.filter(q => reviewList[q.id]);
    }
    
    if (list.length === 0) {
      alert("出題対象の問題がありません。別のモードを選択してください。");
      return;
    }
    
    setCurrentQuestions(list);
    setQuizMode(mode);
    setCurrentIndex(resumeIndex < list.length ? resumeIndex : 0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setActiveTab("quiz");
    setPendingResume(null);
  };

  // 5. 回答送信
  const handleAnswerSubmit = (choice) => {
    if (isAnswered) return;
    
    const currentQ = currentQuestions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswer(choice);
    setIsAnswered(true);
    
    // 正誤判定
    const choiceChar = choice.charAt(0); // "ア", "イ", "ウ", "エ" などの頭文字を取得
    const isCorrect = choiceChar === currentQ.answer;
    
    console.log(`Question ${currentQ.id} Answered. Choice: ${choiceChar}, Correct: ${isCorrect}`);
    
    const updatedHistory = {
      ...history,
      [currentQ.id]: {
        isCorrect,
        timestamp: Date.now(),
        lastAnswer: choiceChar
      }
    };
    
    setHistory(updatedHistory);
    
    // 進捗の更新 (最終問題を完走したら 0 に戻す、途中なら次の問題のインデックスを保存)
    const nextIdx = currentIndex + 1;
    const isFinished = nextIdx >= currentQuestions.length;
    const saveIdx = isFinished ? 0 : nextIdx;
    
    saveStateToFirestore(updatedHistory, reviewList, saveIdx, quizMode);
  };

  // 6. 次へ進む / 終了
  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < currentQuestions.length) {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsAnswered(false);
      
      // 進捗状況を即時保存 (再度リロードしてもこの問題から再開できるように)
      saveStateToFirestore(history, reviewList, nextIdx, quizMode);
    } else {
      // 完走完了
      console.log("All questions in current session completed.");
      alert("お疲れ様です！選択したモードのすべての問題を解き終えました。");
      saveStateToFirestore(history, reviewList, 0, quizMode); // 完走時は進捗インデックスをリセット
      setActiveTab("dashboard");
    }
  };

  // 7. 復習登録の切り替え
  const toggleReview = (qId) => {
    const updatedReviewList = {
      ...reviewList,
      [qId]: !reviewList[qId]
    };
    setReviewList(updatedReviewList);
    
    // Firestore同期 (現在のクイズインデックスも維持して保存)
    saveStateToFirestore(history, updatedReviewList, isAnswered ? currentIndex + 1 : currentIndex, quizMode);
  };

  // 8. 中断してホームに戻る
  const handleBackToHome = () => {
    console.log("User backed to home. Current index saved:", currentIndex);
    // その時点の進捗を即座に書き込み
    saveStateToFirestore(history, reviewList, currentIndex, quizMode);
    setActiveTab("dashboard");
  };

  // ==========================================
  // UI レンダリング
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 p-6">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold tracking-wider animate-pulse">データを読み込み中...</p>
      </div>
    );
  }

  // ログイン画面 (合言葉入力フォーム)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/80 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-3 ring-1 ring-indigo-500/20 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">3-5 過去問セレクト演習</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">生産管理 (IE分野) 過去問マスター</p>
          </div>

          <form onSubmit={handleLoadData} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">合言葉 (ユーザーID)</label>
              <div className="relative">
                <input
                  type="text"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  placeholder="合言葉を入力してください"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-semibold transition"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                ※PCとスマートフォンで同じ合言葉を入力することで、学習進捗や復習フラグを完全同期できます。
              </p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 font-semibold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-50 via-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/10 transition active:scale-[0.98]"
            >
              学習を開始する
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-12">
      {/* ナビゲーションバー */}
      <header className="bg-slate-900 text-white py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleBackToHome()}>
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <div>
              <h1 className="text-sm font-black tracking-wider leading-none">3-5 過去問セレクト演習</h1>
              <span className="text-[9px] text-slate-400 font-medium">生産管理 (IE分野)</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-300">
              <User className="w-3.5 h-3.5" />
              <span>合言葉: {userKey}</span>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm("ログアウトしますか？")) {
                  setIsAuthorized(false);
                  setUserKey("");
                  setHistory({});
                  setReviewList({});
                  setPendingResume(null);
                }
              }}
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              閉じる
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* ダッシュボード画面 */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 中断データの復元案内 */}
            {pendingResume && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-indigo-900">前回学習の中断データが見つかりました</h3>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    前回は【{pendingResume.mode === "all" ? "すべての問題" : pendingResume.mode === "wrong" ? "前回不正解の問題" : "要復習の問題"}モード】で
                    <span className="font-bold">問題 {pendingResume.index + 1}</span> まで解き進めました。
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => startQuiz(pendingResume.mode, pendingResume.index)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20"
                  >
                    続きから再開
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("進捗状況を最初からにリセットしますか？")) {
                        await saveStateToFirestore(history, reviewList, 0, quizMode);
                        setPendingResume(null);
                      }
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold text-xs px-4 py-2 rounded-xl transition"
                  >
                    最初から
                  </button>
                </div>
              </div>
            )}

            {/* モード選択パネル */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* すべての問題 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span>すべての問題</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    本演習に収録されている全15問を順番に解き進めます。
                  </p>
                </div>
                <button
                  onClick={() => startQuiz("all")}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <span>スタート</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 前回不正解の問題のみ */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>前回不正解の問題</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    直前の解答で間違えた問題のみを抽出して再挑戦します。
                  </p>
                </div>
                <button
                  onClick={() => startQuiz("wrong")}
                  className="mt-6 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <span>再挑戦する</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 要復習の問題のみ */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>要復習の問題</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    解説画面で「要復習リスト」に登録した問題を重点的に学習します。
                  </p>
                </div>
                <button
                  onClick={() => startQuiz("review")}
                  className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <span>復習を開始</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 履歴管理ダッシュボードの一覧テーブル */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-500" />
                  <span>学習進捗・履歴一覧 (全{QUESTIONS.length}問)</span>
                </h3>
                
                {/* 簡易サマリー */}
                <div className="flex space-x-3 text-[10px] sm:text-xs">
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    正解: {QUESTIONS.filter(q => history[q.id]?.isCorrect).length}
                  </span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    不正解: {QUESTIONS.filter(q => history[q.id] && !history[q.id].isCorrect).length}
                  </span>
                  <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    要復習: {QUESTIONS.filter(q => reviewList[q.id]).length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 text-slate-500 font-bold border-b border-slate-200">
                      <th className="p-3 pl-6">問題番号</th>
                      <th className="p-3">出典・分野</th>
                      <th className="p-3">問題テーマ</th>
                      <th className="p-3 text-center">ステータス</th>
                      <th className="p-3 text-center">要復習</th>
                      <th className="p-3">最終解答日時</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUESTIONS.map((q) => {
                      const hist = history[q.id];
                      const isReview = reviewList[q.id];
                      
                      return (
                        <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3 pl-6 font-bold text-slate-800">問題 {q.id}</td>
                          <td className="p-3 text-slate-500">{q.source}</td>
                          <td className="p-3 text-slate-700 font-semibold">{q.title}</td>
                          <td className="p-3 text-center">
                            {hist ? (
                              hist.isCorrect ? (
                                <span className="inline-flex items-center space-x-0.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  <Check className="w-3 h-3" />
                                  <span>正解</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-0.5 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  <X className="w-3 h-3" />
                                  <span>不正解</span>
                                </span>
                              )
                            ) : (
                              <span className="inline-flex bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                未着手
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleReview(q.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                                isReview
                                  ? "bg-amber-50 border-amber-300 text-amber-600 font-bold"
                                  : "border-slate-200 text-slate-400 hover:bg-slate-50"
                              }`}
                            >
                              {isReview ? "★ 復習中" : "☆ 登録"}
                            </button>
                          </td>
                          <td className="p-3 text-slate-400">
                            {hist?.timestamp
                              ? new Date(hist.timestamp).toLocaleString("ja-JP", {
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
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

        {/* クイズ出題・解答画面 */}
        {activeTab === "quiz" && currentQuestions[currentIndex] && (
          <div className="space-y-6">
            {/* 上部ヘッダー情報 */}
            <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-200/60 shadow-xs">
              <button
                onClick={handleBackToHome}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center space-x-1 transition"
              >
                <Home className="w-4 h-4" />
                <span>ホームに戻る</span>
              </button>

              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                問題 {currentIndex + 1} / {currentQuestions.length} ({quizMode === "all" ? "すべて" : quizMode === "wrong" ? "前回不正解" : "要復習"})
              </span>
            </div>

            {/* 問題カード */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 space-y-6">
              {/* 出典バッジ */}
              <div className="flex items-center space-x-2">
                <span className="bg-slate-850 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {currentQuestions[currentIndex].source}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  分野: IE（インダストリアル・エンジニアリング）
                </span>
              </div>

              {/* 問題文 */}
              <div className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
                {currentQuestions[currentIndex].question}
              </div>

              {/* インラインSVG/HTML図表の配置 */}
              {renderDiagram(currentQuestions[currentIndex].id, false)}

              {/* 選択肢リスト */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {currentQuestions[currentIndex].choices.map((choice, idx) => {
                  const choiceChar = choice.charAt(0);
                  const isSelected = selectedAnswer === choice;
                  const isCorrectChoice = choiceChar === currentQuestions[currentIndex].answer;
                  
                  let btnStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
                  let icon = null;

                  if (isAnswered) {
                    if (isCorrectChoice) {
                      btnStyle = "border-emerald-400 bg-emerald-50/80 text-emerald-800 ring-1 ring-emerald-400";
                      icon = <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                    } else if (isSelected) {
                      btnStyle = "border-rose-400 bg-rose-50/85 text-rose-800 ring-1 ring-rose-400";
                      icon = <X className="w-5 h-5 text-rose-600 flex-shrink-0" />;
                    } else {
                      btnStyle = "border-slate-100 bg-slate-50/20 text-slate-400 opacity-60";
                    }
                  } else {
                    btnStyle = "border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/10 active:scale-[0.99]";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerSubmit(choice)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between text-xs font-bold leading-relaxed ${btnStyle}`}
                    >
                      <span>{choice}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 解答解説エリア (回答後に展開) */}
            {isAnswered && (
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className={`p-2 rounded-xl text-white ${
                      selectedAnswer?.charAt(0) === currentQuestions[currentIndex].answer
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}>
                      {selectedAnswer?.charAt(0) === currentQuestions[currentIndex].answer ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <X className="w-6 h-6" />
                      )}
                    </span>
                    <div>
                      <h4 className="text-base font-black tracking-wide">
                        正解は 「 {currentQuestions[currentIndex].answer} 」 です
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        あなたの回答: {selectedAnswer?.charAt(0) || "-"} ({
                          selectedAnswer?.charAt(0) === currentQuestions[currentIndex].answer
                            ? "正解"
                            : "不正解"
                        })
                      </p>
                    </div>
                  </div>

                  {/* 要復習チェックボックス */}
                  <label className="flex items-center space-x-2.5 bg-slate-800 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-750 transition border border-slate-700/60">
                    <input
                      type="checkbox"
                      checked={!!reviewList[currentQuestions[currentIndex].id]}
                      onChange={() => toggleReview(currentQuestions[currentIndex].id)}
                      className="w-4 h-4 accent-amber-500 rounded text-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-200">要復習リストに追加</span>
                  </label>
                </div>

                {/* 解説本文 */}
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-300">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>解説・レジュメ</span>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {currentQuestions[currentIndex].explanation}
                  </div>
                </div>

                {/* 解説の補助図表 */}
                {renderDiagram(currentQuestions[currentIndex].id, true)}

                {/* アクションボタン */}
                <div className="border-t border-slate-800 pt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-indigo-900/30"
                  >
                    <span>
                      {currentIndex + 1 < currentQuestions.length ? "次の問題へ" : "演習を終了する"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
