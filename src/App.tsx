/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Coins, 
  Volume2, 
  VolumeX, 
  Search, 
  Sparkles, 
  TrendingDown, 
  History, 
  CheckCircle, 
  Package, 
  Compass, 
  HelpCircle, 
  Smartphone, 
  Clock, 
  Zap, 
  Eye, 
  Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from './sound';
import { 
  INITIAL_AUCTIONS, 
  BID_PACKAGES, 
  INITIAL_WINNERS, 
  INITIAL_STATS, 
  BOT_NAMES 
} from './data';
import { AuctionItem, BidPackage, WinnerHistory, UserStats, BidHistory } from './types';

// Import our beautiful sub-components
import WinnerHall from './components/WinnerHall';
import StrategyGuide from './components/StrategyGuide';
import Dashboard from './components/Dashboard';
import CheckoutModal from './components/CheckoutModal';
import LiveFeed from './components/LiveFeed';

export default function App() {
  const [activeTab, setActiveTab] = useState<'live' | 'winners' | 'bids' | 'guide' | 'dashboard'>('live');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'electronics' | 'luxury' | 'gadgets'>('all');
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [winners, setWinners] = useState<WinnerHistory[]>(INITIAL_WINNERS);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [selectedPack, setSelectedPack] = useState<BidPackage | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1420);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep stats in ref for the real-time callback context
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const handleToggleSound = () => {
    const nextVal = sound.toggleSound();
    setSoundEnabled(nextVal);
    sound.playClick();
  };

  // Realistic timer and competitive bidder simulator loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prevAuctions => {
        return prevAuctions.map(item => {
          if (item.status === 'ended') return item;

          let newTime = item.timeRemaining - 1;
          
          // Play tick or alert if time is running incredibly low
          if (newTime <= 4 && newTime > 0 && activeTab === 'live' && soundEnabled) {
            sound.playTick();
          }

          // If time expires
          if (newTime <= 0) {
            // Determine winner based on last bidder
            const isUserWinner = item.isUserHighBidder;
            const finalWinnerName = isUserWinner ? 'Me (คุณ)' : item.lastBidder;
            
            // Add to winner list state
            const winSavings = item.originalPrice - item.currentPrice;
            const newWinner: WinnerHistory = {
              id: `win-${Date.now()}-${item.id}`,
              title: `${item.title} (สภาพประมูล)`,
              image: item.image,
              originalPrice: item.originalPrice,
              winningPrice: item.currentPrice,
              winnerName: finalWinnerName,
              savings: winSavings,
              savedPercent: parseFloat(item.savingPercent.toFixed(1)),
              dateString: 'เพิ่งปิดบิดประมูลประวัติศาสตร์'
            };

            setWinners(prevWinners => [newWinner, ...prevWinners]);

            if (isUserWinner) {
              sound.playWin();
              setStats(prevStats => ({
                ...prevStats,
                wonItemsCount: prevStats.wonItemsCount + 1,
                moneySaved: prevStats.moneySaved + winSavings
              }));
            }

            return {
              ...item,
              timeRemaining: 0,
              status: 'ended',
              winnerName: finalWinnerName
            };
          }

          // SIMULATED COMPETITIVE OPPONENTS (BOT bidding behavior)
          // Competitive pressure is dynamic: higher stress at lower seconds
          let shouldBotBid = false;
          const randomFactor = Math.random();

          if (newTime <= 4) {
            // High intensity sniping below 4 seconds
            shouldBotBid = randomFactor < 0.45;
          } else if (newTime <= 8) {
            // Medium intensity
            shouldBotBid = randomFactor < 0.18;
          } else if (item.timeRemaining > 15) {
            // Rarely bid at high times
            shouldBotBid = randomFactor < 0.02;
          }

          // Bot should NEVER bid if the user is currently the absolute high bidder and time is still safe
          // But bots will vigorously defend exclusive products as times ticking down
          if (shouldBotBid && !item.isUserHighBidder) {
            const randomBotName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
            const updatedPrice = parseFloat((item.currentPrice + 0.10).toFixed(2));
            const newHistory: BidHistory = {
              id: `bid-bot-${Date.now()}`,
              bidderName: randomBotName,
              isUser: false,
              timeString: new Date().toLocaleTimeString('th-TH', { hour12: false }),
              priceAfterBid: updatedPrice
            };

            // If bots bid, reset timer of item up to dynamic seconds
            const extension = 10; // Reset back to robust timer range
            const newSavingsPercent = parseFloat(((1 - (updatedPrice / item.originalPrice)) * 100).toFixed(1));

            return {
              ...item,
              timeRemaining: extension,
              currentPrice: updatedPrice,
              lastBidder: randomBotName,
              isUserHighBidder: false,
              bidsPlacedCount: item.bidsPlacedCount + 1,
              savingPercent: newSavingsPercent,
              bidsHistory: [newHistory, ...item.bidsHistory.slice(0, 5)]
            };
          }

          return {
            ...item,
            timeRemaining: newTime
          };
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, soundEnabled]);

  // Fluctuating Simulated Active Online Users count
  useEffect(() => {
    const userInterval = setInterval(() => {
      setOnlineCount(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(1200, prev + delta);
      });
    }, 5000);
    return () => clearInterval(userInterval);
  }, []);

  // Place continuous Bid handler
  const handlePlaceBid = (itemId: string) => {
    sound.playClick();
    
    // Check if user has bids left
    if (stats.bidsRemaining <= 0) {
      sound.playLowBids();
      alert('⚠️ ยอดเครดิตบิดคงเหลือของคุณหมดแล้ว! กรุณาเติมสิทธิประมูลเพิ่มช่องทาง "เติมบิดที่นี่"');
      setActiveTab('bids');
      return;
    }

    setAuctions(prev => {
      return prev.map(item => {
        if (item.id !== itemId || item.status === 'ended') return item;

        const updatedPrice = parseFloat((item.currentPrice + 0.10).toFixed(2));
        const newHistoryItem: BidHistory = {
          id: `user-bid-${Date.now()}`,
          bidderName: 'Me (คุณ)',
          isUser: true,
          timeString: new Date().toLocaleTimeString('th-TH', { hour12: false }),
          priceAfterBid: updatedPrice
        };

        // Standard extension for Bidder Action
        const timeReset = Math.min(item.timerMax, 15);
        const newSavingsPercent = parseFloat(((1 - (updatedPrice / item.originalPrice)) * 100).toFixed(1));

        // Deduct exactly 1 bid package
        setStats(prevStats => ({
          ...prevStats,
          bidsRemaining: Math.max(0, prevStats.bidsRemaining - 1),
          totalBidsPlaced: prevStats.totalBidsPlaced + 1
        }));

        sound.playBidSuccess();

        return {
          ...item,
          currentPrice: updatedPrice,
          timeRemaining: timeReset,
          lastBidder: 'Me (คุณ)',
          isUserHighBidder: true,
          bidsPlacedCount: item.bidsPlacedCount + 1,
          savingPercent: newSavingsPercent,
          bidsHistory: [newHistoryItem, ...item.bidsHistory.slice(0, 5)]
        };
      });
    });
  };

  // Simulate Instant Revitalize an ended item for demo fun
  const handleQuickRestartItem = (itemId: string) => {
    sound.playClick();
    setAuctions(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            currentPrice: parseFloat((Math.random() * 200 + 40).toFixed(2)),
            timeRemaining: 15,
            status: 'live',
            lastBidder: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
            isUserHighBidder: false,
            bidsPlacedCount: Math.floor(Math.random() * 400 + 100)
          };
        }
        return item;
      });
    });
  };

  // Handle successful payments from the package modal
  const handlePaymentSuccess = (bidsAdded: number, priceSpent: number) => {
    setStats(prev => ({
      ...prev,
      bidsRemaining: prev.bidsRemaining + bidsAdded,
      totalSpent: prev.totalSpent + priceSpent
    }));
    setSelectedPack(null);
  };

  // Remove claimed item or change status visually
  const handleClaimItem = (claimId: string) => {
    setWinners(prev => {
      return prev.map(w => {
        if (w.id === claimId) {
          return {
            ...w,
            dateString: 'จัดทำบิลเรียบร้อย • กำลังเตรียมส่งโดย LuxeExpress'
          };
        }
        return w;
      });
    });
  };

  const filteredAuctions = auctions.filter(item => {
    // Category match
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    
    // Search filter
    const query = searchQuery.trim().toLowerCase();
    const searchMatch = !query || 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative selection:bg-amber-500/30 selection:text-white">
      {/* Absolute high-end starry background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 pointer-events-none z-0" />
      
      {/* Decorative Golden Ambient Blur */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Global Header Navigation Panel */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Online Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => { sound.playClick(); setActiveTab('live'); }} 
                className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div onClick={() => { sound.playClick(); setActiveTab('live'); }} className="text-xl font-black tracking-tight text-white flex items-baseline gap-1.5 cursor-pointer hover:opacity-95">
                  LuxePenny
                  <span className="text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md uppercase font-mono">
                    มือสอง VIP
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>มีผู้ใช้งาน {onlineCount.toLocaleString()} คน กำลังห้ำหั่นราคา</span>
                </div>
              </div>
            </div>

            {/* Sound Toggle (Mobile view) */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={handleToggleSound}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="สลับเสียงเอฟเฟกต์"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search Box */}
          {activeTab === 'live' && (
            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหากล้องฟิล์ม, นาฬิกาวินเทจ, แบรนด์เนมมือสอง..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-full text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
              />
            </div>
          )}

          {/* Quick Wallet Stats Drawer */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            {/* Audio Toggle (Desktop) */}
            <button 
              onClick={handleToggleSound}
              className="hidden md:flex p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="สลับเสียงประกอบ"
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-amber-400" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            {/* Simulated Live Coins Status */}
            <div 
              onClick={() => { sound.playClick(); setActiveTab('bids'); }}
              className="flex items-center gap-2.5 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                <Coins className="w-4.5 h-4.5 animate-bounce" />
              </div>
              <div className="text-left leading-none">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans">คงเหลือ</div>
                <div className="text-sm font-black text-white font-mono mt-0.5">{stats.bidsRemaining} <span className="text-[10px] text-amber-500">BIDs</span></div>
              </div>
            </div>

            {/* Fast buy button */}
            <button 
              onClick={() => { sound.playClick(); setActiveTab('bids'); }}
              className="bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all shadow-md active:translate-y-px cursor-pointer"
            >
              + เติมสิทธิ์
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Sub Tab List */}
      <nav className="bg-slate-900/40 border-b border-slate-900/80 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="max-w-7xl mx-auto flex gap-4 md:gap-8 justify-start md:justify-center">
          <button
            onClick={() => { sound.playClick(); setActiveTab('live'); }}
            className={`py-3.5 px-1 bg-transparent text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Compass className="w-4.5 h-4.5" />
            ห้องประมูลของสะสมมือสอง
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('winners'); }}
            className={`py-3.5 px-1 bg-transparent text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'winners'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4.5 h-4.5" />
            ทำเนียบผู้ชนะประหยัดจริง
          </button>

          <button
            id="tab-bids"
            onClick={() => { sound.playClick(); setActiveTab('bids'); }}
            className={`py-3.5 px-1 bg-transparent text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'bids'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Coins className="w-4.5 h-4.5" />
            ซื้อแพ็คเครดิตบิด
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('guide'); }}
            className={`py-3.5 px-1 bg-transparent text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4.5 h-4.5" />
            สูตรลับทำกำไร
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('dashboard'); }}
            className={`py-3.5 px-1 bg-transparent text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'dashboard'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Package className="w-4.5 h-4.5" />
            ตู้รับของของฉัน
            {winners.filter(w => w.winnerName === 'Me (คุณ)' && !w.dateString.includes('จัดทำบิลเรียบร้อย')).length > 0 && (
              <span className="absolute -top-0.5 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>
      </nav>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 z-10 relative">

        <AnimatePresence mode="wait">
          
          {/* TAB 1: LIVE SECOND-HAND AUCTION ROOMS */}
          {activeTab === 'live' && (
            <motion.div
              key="live-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              
              {/* Category Filter Pills & Banner */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/30 border border-slate-900 p-4 rounded-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { sound.playClick(); setCategoryFilter('all'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    🚀 สมบัติยอดนิยมทั้งหมด
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setCategoryFilter('luxury'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      categoryFilter === 'luxury'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    💎 แบรนด์เนม & คาสเซ็ตกล้อง
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setCategoryFilter('electronics'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      categoryFilter === 'electronics'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    💻 ไอที & คอมพิวเตอร์สภาพสวย
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setCategoryFilter('gadgets'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      categoryFilter === 'gadgets'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    📻 ลำโพงเสียงระดับตำนาน
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-right font-sans lg:max-w-xs">
                  💡 <span className="text-amber-400">กฎกติกา Penny:</span> ทุกวินาทีที่คนกดบิดราคาสินค้าเพิ่มเพียง <strong>฿0.10</strong> สตางค์ ประทับใจรับโอกาสครอบครองของหรูถูกลงถึง 99%!
                </div>
              </div>

              {/* Master Layout: 2 Columns - Left is active bid cards; Right is live feeds */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* 3/4 Grid: Items List */}
                <div className="lg:col-span-3 space-y-6">
                  {filteredAuctions.length === 0 ? (
                    <div className="text-center py-24 bg-slate-900/20 border border-slate-850 rounded-3xl">
                      <p className="text-slate-500">ไม่พบสินค้าในหมวดหมู่นี้ หรือการค้นหาไม่ตรงกับสินค้าที่มีอยู่</p>
                      <button 
                        onClick={() => { sound.playClick(); setCategoryFilter('all'); setSearchQuery(''); }}
                        className="mt-3 bg-slate-800 hover:bg-slate-750 px-4 py-2 rounded-xl text-xs font-bold text-slate-200"
                      >
                        ล้างข้อมูค้นหา
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAuctions.map((item) => {
                        const isTimeCritical = item.timeRemaining <= 5 && item.status === 'live';
                        const isUserWinning = item.isUserHighBidder;

                        return (
                          <div
                            key={item.id}
                            className={`group rounded-3xl border text-slate-100 flex flex-col bg-slate-900 overflow-hidden relative transition-all duration-300 ${
                              item.status === 'ended'
                                ? 'opacity-70 border-slate-800/60'
                                : isUserWinning
                                ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                                : isTimeCritical
                                ? 'border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.12)] shadow-red-500/10 animate-pulse'
                                : 'border-slate-800/80 hover:border-slate-750 hover:shadow-xl hover:shadow-slate-950/40'
                            }`}
                          >
                            {/* Product Image Panel with badges */}
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                              
                              {/* Saving Percent Badge */}
                              <span className="absolute top-3 left-3 bg-red-600/90 border border-red-500/30 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-md">
                                <TrendingDown className="w-3.5 h-3.5 text-white" />
                                ลดแล้ว {item.savingPercent}%
                              </span>

                              {/* Category Small Stamp */}
                              <span className="absolute top-3 right-3 bg-slate-900/80 border border-slate-700/50 text-slate-300 text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-md">
                                {item.category === 'luxury' ? 'ของสะสมชั้นสูง' : item.category === 'electronics' ? 'ไอทียอดฮิต' : 'ลำโพงเสียงดี'}
                              </span>

                              {/* Live Bidding Interactive Indicator Badge */}
                              {item.status === 'live' && (
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded-lg text-[10px] backdrop-blur-md">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isUserWinning ? 'bg-emerald-500' : 'bg-amber-400'} animate-ping`} />
                                  <span className="text-slate-400">ผู้บิดล่าสุด:</span>
                                  <span className={`font-bold font-mono ${isUserWinning ? 'text-emerald-400' : 'text-slate-200'}`}>
                                    {isUserWinning ? 'คุณ (Me)' : item.lastBidder}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Card Content & Interactive Game loop controls */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1 pl-1 border-l-2 border-slate-800 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>

                                {/* Price block */}
                                <div className="flex items-baseline justify-between mt-4">
                                  <div>
                                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider">ราคาท้องตลาด</span>
                                    <span className="text-xs text-slate-400 line-through font-mono">
                                      ฿{item.originalPrice.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-amber-500 block uppercase font-bold tracking-widest">ราคาประมูลทุบสถิติ</span>
                                    <span className="text-xl font-black text-amber-400 font-mono tracking-tight">
                                      ฿{item.currentPrice.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                {/* Countdowns and Timer progress lines */}
                                <div className="my-4">
                                  {item.status === 'live' ? (
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 flex items-center gap-1.5">
                                          <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-red-500 animate-spin' : 'text-slate-500'}`} />
                                          เวลาคงเหลือ
                                        </span>
                                        <span className={`font-mono font-bold text-sm ${isTimeCritical ? 'text-red-400 scale-105' : 'text-white'}`}>
                                          {item.timeRemaining} วินาที
                                        </span>
                                      </div>
                                      {/* Timer visual scale bar */}
                                      <div className="h-1.5 bg-slate-950 w-full rounded-full overflow-hidden">
                                        <div
                                          className={`h-full transition-all duration-1000 ${
                                            isTimeCritical 
                                              ? 'bg-linear-to-r from-red-500 to-rose-600' 
                                              : 'bg-linear-to-r from-amber-500 to-amber-600'
                                          }`}
                                          style={{ width: `${(item.timeRemaining / item.timerMax) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                                      <div className="text-slate-500">ปิดประมูลเสร็จสิ้น</div>
                                      <div className="text-[11px] font-bold text-emerald-400 mt-0.5 truncate">
                                        🏆 ผู้ชนะ: {item.winnerName}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Active bid counter details for fun metrics */}
                                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-4 bg-slate-950/20 p-2 rounded-lg border border-slate-850">
                                  <span>บิดรวมกันแล้ว {item.bidsPlacedCount} ครั้ง</span>
                                  <span>ครั้งละ {item.bidsRequiredPerBid} สิทธิ์บิด</span>
                                </div>

                                {/* Main Interaction Button */}
                                {item.status === 'live' ? (
                                  <button
                                    onClick={() => handlePlaceBid(item.id)}
                                    className={`w-full font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                      isUserWinning
                                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400 hover:brightness-105'
                                        : 'bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-101 active:scale-99 shadow-lg shadow-amber-500/10'
                                    }`}
                                  >
                                    <Zap className="w-4 h-4" />
                                    <span>{isUserWinning ? 'คุณประมูลสูงสุดอยู่!' : 'เสนอราคาบิดด่วน'}</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleQuickRestartItem(item.id)}
                                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                                  >
                                    🔄 จำลองเริ่มประมูลอีกรอบ
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 1/4 Grid: Realtime Network Pulse Columns */}
                <div className="space-y-6">
                  <LiveFeed />

                  {/* Guaranteed Safe Seal Badge */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">LuxePenny Assurance</span>
                    <h5 className="font-bold text-xs mt-1 text-slate-200">ประมวลผลหลังบ้านปลอดภัย</h5>
                    <p className="text-[10px] text-slate-400 mt-1 lines-clamp-3">
                      ระบบประมวลราคาประมูลของเราคำนวณแบบสถิติด้วยเศษแสนแม่นยำ พร้อมการันตีส่งเคาะรางวัลจริงไม่มีกั๊ก
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: WINNERS HALL */}
          {activeTab === 'winners' && (
            <motion.div
              key="winners-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <WinnerHall winners={winners} />
            </motion.div>
          )}

          {/* TAB 3: BUY MORE BID PACKS */}
          {activeTab === 'bids' && (
            <motion.div
              key="bids-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  เติมกระสุนสงครามแย่งชิง
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                  แพ็กเกจสิทธิ์ประมูลเครดิตทองคำ
                </h2>
                <p className="text-slate-400 text-xs mt-1.5">
                  เลือกเติมโควตาตามที่คุณต้องการเพื่อลุยสอยของสะสมมือสองชิ้นโปรด เราจัดโปรแถมเหรียญโบนัสฟรีสูงสุดคุ้มสำหรับนักบิดมือระดับพระกาฬ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {BID_PACKAGES.map((pack) => {
                  return (
                    <div
                      key={pack.id}
                      className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-350 relative ${
                        pack.popular
                          ? 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-500/10 scale-102'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {pack.popular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          ยอดนิยมสูงสุดคุ้ม ★
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-slate-400 uppercase font-mono">{pack.name}</div>
                        
                        <div className="my-4">
                          <span className="text-4xl font-black text-white font-mono leading-none tracking-tight">
                            {pack.bidsCount + pack.bonusBids}
                          </span>
                          <span className="text-xs text-amber-500 font-bold ml-1.5 uppercase tracking-wider">
                            Bids
                          </span>
                        </div>

                        {pack.bonusBids > 0 && (
                          <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold tracking-wide py-1 px-2.5 rounded-lg border border-emerald-500/20 inline-block mb-4">
                            แถมฟรีโบนัส +{pack.bonusBids} บิด
                          </div>
                        )}

                        <p className="text-slate-400 text-xs leading-relaxed mb-6">
                          เหมาะสำหรับประมูลห้องสินค้าราคาประมาณ ฿{((pack.bidsCount + pack.bonusBids) * 10).toLocaleString()} ด้วยกลยุทธ์เคาะสไนเปอร์
                        </p>
                      </div>

                      <div>
                        {/* Cost visualizer */}
                        <div className="flex justify-between items-baseline mb-4">
                          <span className="text-xs text-slate-500">ราคาสุทธิ</span>
                          <span className="text-2xl font-bold text-white font-mono">฿{pack.price.toLocaleString()}</span>
                        </div>

                        <button
                          onClick={() => { sound.playClick(); setSelectedPack(pack); }}
                          className={`w-full font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            pack.popular
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-750'
                          }`}
                        >
                          เลือกข้อเสนอนี้
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Bids Refill Button */}
              <div className="mt-8 max-w-xl mx-auto bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white font-sans">ไม่อยากเสียเงินจริง? เติมฟรีเดโมบิด!</h4>
                  <p className="text-xs text-slate-400 mt-1">รับเพิ่มทันที 150 Bids ฟรีสำหรับทดลองแข่งกับคนอื่น</p>
                </div>
                <button
                  onClick={() => {
                    sound.playWin();
                    setStats(prev => ({
                      ...prev,
                      bidsRemaining: prev.bidsRemaining + 150
                    }));
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider shrink-0"
                >
                  ⚡ เติมฟรี 150 บิด
                </button>
              </div>

            </motion.div>
          )}

          {/* TAB 4: STRATEGIC GUIDE */}
          {activeTab === 'guide' && (
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <StrategyGuide />
            </motion.div>
          )}

          {/* TAB 5: MY ACCOUNT / CLAIM BOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Dashboard 
                stats={stats} 
                wonItems={winners.filter(w => w.winnerName === 'Me (คุณ)')} 
                onClaimItem={handleClaimItem}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Persistent global app footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 mt-16 py-6 px-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div>
            <div className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5 justify-center md:justify-start">
              <span>LuxePenny Premium Second-Hand Micro Bidding Network</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              ลิขสิทธิ์ © 2026 LuxePenny TH. จำลองโครงข่ายประมูลอย่างถูกต้องเพื่อมอบความตื่นเต้นสูงสุด
            </p>
          </div>
          <p className="text-[10px] text-slate-600">
            *แอปพลิเคชันเวอร์ชันนี้มีไว้สำหรับทดสอบและการซื้อขายแบบอินเทอร์แอกทีฟเสมือนจริงในระบบแซนด์บ็อกซ์
          </p>
        </div>
      </footer>

      {/* Dynamic Payment Gate Checkouts Popup */}
      <AnimatePresence>
        {selectedPack && (
          <CheckoutModal
            pack={selectedPack}
            onClose={() => setSelectedPack(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
