/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserStats, WinnerHistory } from '../types';
import { Wallet, Package, Gift, Compass, Trophy, TrendingDown, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../sound';

interface DashboardProps {
  stats: UserStats;
  wonItems: WinnerHistory[];
  onClaimItem: (itemId: string) => void;
}

export default function Dashboard({ stats, wonItems, onClaimItem }: DashboardProps) {
  const [claimAddress, setClaimAddress] = useState('');
  const [claimingItem, setClaimingItem] = useState<WinnerHistory | null>(null);
  const [shippedItems, setShippedItems] = useState<Record<string, { address: string; tracking: string }>>({});

  const handleOpenClaim = (item: WinnerHistory) => {
    sound.playClick();
    setClaimingItem(item);
  };

  const handleCloseClaim = () => {
    sound.playClick();
    setClaimingItem(null);
    setClaimAddress('');
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem) return;
    sound.playWin();

    const randomTracking = 'LXP' + Math.floor(10000000 + Math.random() * 90000000) + 'TH';
    setShippedItems(prev => ({
      ...prev,
      [claimingItem.id]: {
        address: claimAddress,
        tracking: randomTracking
      }
    }));

    onClaimItem(claimingItem.id);
    setClaimingItem(null);
    setClaimAddress('');
  };

  const totalEarningsSaved = wonItems.reduce((acc, current) => {
    return acc + (current.originalPrice - current.winningPrice);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-4"
    >
      {/* Dynamic Summary Cards Grid */}
      <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
        <Compass className="w-5 h-5 text-amber-500" />
        ภาพรวมแดชบอร์ดนักบิดของคุณ
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bid Balance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5 uppercase tracking-wide">
            <Wallet className="w-4 h-4 text-amber-500" />
            กระสุนคงเหลือ
          </span>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-amber-400 font-mono">
              {stats.bidsRemaining}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">ใช้เคาน์เตอร์บิดอย่างถูกวิธี</div>
          </div>
        </div>

        {/* Won Items Counter Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5 uppercase tracking-wide">
            <Package className="w-4 h-4 text-emerald-400" />
            สินค้าที่คุณชนะแล้ว
          </span>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {stats.wonItemsCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">กดรับของรางวัลด้านล่าง</div>
          </div>
        </div>

        {/* Money Saved Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5 uppercase tracking-wide">
            <Gift className="w-4 h-4 text-rose-400" />
            คุ้มทุนประหยัดได้สะสม
          </span>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-rose-400 font-mono">
              ฿{(stats.moneySaved + totalEarningsSaved).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-50 relative overflow-hidden text-red-400">
              ประหยัดเพิ่มขึ้นสูงสุด 99%
            </div>
          </div>
        </div>

        {/* Capital Spent Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-sans flex items-center gap-1.5 uppercase tracking-wide">
            <Trophy className="w-4 h-4 text-sky-400" />
            ลงทุนแพ็กเกจสะสม
          </span>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-sky-400 font-mono">
              ฿{stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">เฉลี่ย 1.25 THB ต่อบิด</div>
          </div>
        </div>
      </div>

      {/* Claim Center Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2 font-sans">
          <Trophy className="w-5 h-5 text-emerald-400" />
          ศูนย์รับรางวัลที่ชนะ (Bidding Prize Claim Center)
        </h4>

        {wonItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-850">
            <p className="text-xs text-slate-500">คุณยังไม่มีรายการที่ชนะ ณ ขณะนี้</p>
            <p className="text-xs text-slate-400 mt-1">รีบไปเสนอราคาในห้องประมูลเพื่อชิงของรางวัลสุดล้ำกันเถอะ!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wonItems.map((item) => {
              const isShipped = shippedItems[item.id];
              return (
                <div key={item.id} className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-white leading-snug">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">ราคาประเมิน: ฿{item.originalPrice.toLocaleString()} • ชนะที่ราคา: <span className="text-amber-400 font-bold">฿{item.winningPrice.toLocaleString()}</span></p>
                      {isShipped && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                            ส่งสินค้าสำเร็จแล้ว
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            คิวจัดส่งเลขที่: <span className="text-slate-300 font-semibold">{isShipped.tracking}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 text-right">
                    {!isShipped ? (
                      <button
                        onClick={() => handleOpenClaim(item)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/15 active:translate-y-px transition-all"
                      >
                        กดเคลมบิลลด 99%
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-slate-850 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl border border-slate-800"
                      >
                        รอการจัดส่ง 
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Claim Address Form Popup Overlay (AnimatePresence) */}
      <AnimatePresence>
        {claimingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={handleCloseClaim}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 text-slate-100"
            >
              <h4 className="text-lg font-bold text-white mb-2 font-sans flex items-center gap-1.5">
                📦 ขั้นตอนการเคลมสินค้าที่ชนะประมูล
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                คุณชนะการประมูล <span className="text-amber-400">{claimingItem.title}</span> ที่ราคาพิเศษ ฿{claimingItem.winningPrice.toLocaleString()} เท่านั้น!
              </p>

              <form onSubmit={handleConfirmClaim} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                    ที่อยู่ในการจัดส่งโดยละเอียด
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="ใส่ บ้านเลขที่ หมู่บ้าน ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์ และเบอร์มือถือที่ติดต่อได้..."
                    value={claimAddress}
                    onChange={(e) => setClaimAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-700 font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-relaxed">
                  📢 <strong className="text-emerald-400">ค่าจัดส่งฟรีพรีเมียม:</strong> การจัดส่งเป็นแบบ Kerry/Flash VIP ไม่มีค่าขนส่งหรือค่าประกันภัยใดๆ เพิ่มเติมทั้งสิ้น
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseClaim}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    ยืนยันที่อยู่รับของ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
