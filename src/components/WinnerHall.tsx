/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WinnerHistory } from '../types';
import { Trophy, Award, TrendingDown, ArrowUpRight, BadgeHelp } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../sound';

interface WinnerHallProps {
  winners: WinnerHistory[];
}

export default function WinnerHall({ winners }: WinnerHallProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-4"
    >
      {/* Lobby Hero Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2.5">
          <Trophy className="w-3.5 h-3.5" />
          ทำเนียบผู้ชนะรางวัล (Hall of Fame)
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          หั่นราคาจริง ประหยัดสูงถึง 99%!
        </h2>
        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
          นี่คือหลักฐานจริงที่แสดงให้เห็นว่า ผู้ร่วมเสนอราคาประมูลแบบ Penny Auction ได้ครอบครองสินค้าราคาพรีเมียมตัวท็อปในราคาแสนถูกอย่างไร
        </p>
      </div>

      {/* Grid of Winners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map((winner, idx) => {
          return (
            <motion.div
              layout
              key={winner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="group bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-amber-500/5 transition-all text-slate-100 flex flex-col"
            >
              {/* Product Thumbnail with badge */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={winner.image}
                  alt={winner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Save \% Badge */}
                <span className="absolute top-3 left-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-md">
                  <TrendingDown className="w-3.5 h-3.5" />
                  ประหยัด {winner.savedPercent}%
                </span>

                {/* Big Winner Overlay Badge */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-[10px] text-slate-300 font-medium px-2 py-1 rounded-md border border-slate-700/60 flex items-center gap-1 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ปิดบิดเรียบร้อย
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {winner.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                    ราคาท้องตลาด: ฿{winner.originalPrice.toLocaleString()}
                  </div>

                  {/* Pricing Win Box */}
                  <div className="grid grid-cols-2 gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 my-3.5 text-center">
                    <div>
                      <span className="text-[9px] uppercase text-amber-500 tracking-wider">ราคาปิดประมูล</span>
                      <div className="text-sm font-extrabold text-white font-mono mt-0.5">
                        ฿{winner.winningPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="border-l border-slate-800">
                      <span className="text-[9px] uppercase text-emerald-400 tracking-wider">ประหยัดทุนไป</span>
                      <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
                        ฿{winner.savings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Champion Nickname Row */}
                <div className="pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-linear-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-sm">
                      🏆
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-sans">ผู้ชนะที่โชคดี</div>
                      <div className="text-xs font-bold text-slate-200 font-mono">{winner.winnerName}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    {winner.dateString}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Quote Card */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mt-8 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-white uppercase tracking-wider font-sans">ผู้ชนะการันตีได้รับของแท้ 100%</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">ลักซ์เพนนีร่วมมือกับผู้นำเข้าแบรนด์หรูโดยตรง จัดส่งเอกสารใบรับประกันศูนย์ไทยแท้ฟรีทุกรายการ</p>
          </div>
        </div>
        <div className="text-xs font-sans text-slate-400 whitespace-nowrap bg-slate-950/60 border border-slate-800/60 px-3.5 py-1.5 rounded-xl">
          ระยะเวลานำส่งของเฉลี่ย: <span className="text-emerald-400 font-bold">2 - 3 วัน</span>
        </div>
      </div>
    </motion.div>
  );
}
