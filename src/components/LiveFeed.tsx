/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BOT_NAMES } from '../data';
import { Sparkles, TrendingUp } from 'lucide-react';

interface FeedItem {
  id: string;
  username: string;
  itemName: string;
  amount: number;
  timeString: string;
  actionType: 'bid' | 'win' | 'bonus';
}

export default function LiveFeed() {
  const [feeds, setFeeds] = useState<FeedItem[]>([
    {
      id: 'f1',
      username: 'Kitti_Siam',
      itemName: 'ทองคำแท้ประทับตรา 1 บาท',
      amount: 210.10,
      timeString: 'เพิ่งเสนอราคา',
      actionType: 'bid'
    },
    {
      id: 'f2',
      username: 'NongPloy_Rich',
      itemName: 'MacBook Pro 14" M4 Pro',
      amount: 432.10,
      timeString: 'ชนะการประมูล!',
      actionType: 'win'
    },
    {
      id: 'f3',
      username: 'Somchai_Sniper',
      itemName: 'iPhone 16 Pro Max',
      amount: 125.40,
      timeString: 'เพิ่งเสนอราคา',
      actionType: 'bid'
    }
  ]);

  useEffect(() => {
    // Periodically append new mock activities to mimic highly active environment
    const interval = setInterval(() => {
      const items = [
        'iPhone 16 Pro Max',
        'ทองคำแท้ประทับตรา 1 บาท',
        'Sony PlayStation 5 Pro',
        'iPad Pro 13" M4',
        'นาฬิกาหรูสไตล์สวิสตูร์บินยอง',
        'Marshall Woburn III'
      ];
      
      const randomUser = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const randomPrice = parseFloat((Math.random() * 200 + 50).toFixed(2));
      const actions: ('bid' | 'bonus')[] = ['bid', 'bid', 'bid', 'bonus'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      const newFeed: FeedItem = {
        id: Date.now().toString(),
        username: randomUser,
        itemName: randomItem,
        amount: action === 'bonus' ? 10 : randomPrice,
        timeString: action === 'bonus' ? 'เติมเครดิตโบนัส!' : 'เสนอราคาบิด',
        actionType: action
      };

      setFeeds(prev => [newFeed, ...prev.slice(0, 12)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/60">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-sans">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          กิจกรรมสดยอดนิยม (Live Pulse)
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] md:max-h-none pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {feeds.map((feed) => (
            <motion.div
              layout
              key={feed.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              className={`p-3 rounded-xl text-xs border ${
                feed.actionType === 'win'
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  : feed.actionType === 'bonus'
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-300'
              } transition-all`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold tracking-wide text-slate-100 font-mono">
                  {feed.username}
                </span>
                <span className={`text-[10px] font-medium font-sans px-1.5 py-0.5 rounded-full ${
                  feed.actionType === 'win'
                    ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                    : feed.actionType === 'bonus'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {feed.timeString}
                </span>
              </div>
              <div className="mt-1 flex justify-between items-center gap-2">
                <span className="text-slate-400 truncate max-w-[120px]">{feed.itemName}</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {feed.actionType === 'bonus' ? `+${feed.amount} Bids` : `฿${feed.amount.toLocaleString()}`}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
