/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, ChevronRight, Zap, Target, Shield, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../sound';

export default function StrategyGuide() {
  const steps = [
    {
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      title: '1. เติม "เครดิตบิด" (Bid Pack)',
      desc: 'การเสนอราคาแต่ละครั้ง (1 บิด) จะใช้เหรียญสิทธิ์ประมูลที่คุณซื้อไว้ โดยทุกการบิดจะเพิ่มราคาสินค้าขึ้นทีละ 10 สตางค์ (฿0.10) และต่อเวลาประมูลเพิ่ม 10-15 วินาที'
    },
    {
      icon: <Zap className="w-5 h-5 text-sky-400" />,
      title: '2. แข่งขันและจับจังหวะแบบเรียลไทม์',
      desc: 'เมื่อเวลาถอยหลังใกล้หมด ทุกคนจะแย่งกันบิดเพื่อต่อเวลา หากใครบิดเป็นคนสุดท้ายเมื่อตัวจับเวลาลดลงถึง 0.00 วินาที จะเป็นผู้ชนะการประมูลทันที!'
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      title: '3. ชำระเงินสินค้าในราคาที่ชนะ',
      desc: 'ผู้ชนะสามารถกดซื้อสินค้าระดับพรีเมียมนั้นๆ ได้ในราคาประมูลสุดท้ายที่ถูกหั่นลดลงสูงสุดถึง 99%! เป็นเจ้าของของหรูในราคาสุทธิหลักร้อยบาทเท่านั้น'
    }
  ];

  const tactics = [
    {
      title: 'กลยุทธ์ "วินาทีสุดท้าย" (Sniping Tactic)',
      desc: 'อย่าบิดพร่ำเพรื่อเมื่อเกจเวลามีมากกว่า 10 วินาที! รอให้เหลือ 1-2 วินาทีสุดท้ายแล้วค่อยกดเสนอราคา การทำเช่นนี้ทำให้ประหยัดสิทธิ์บิดของคุณและสร้างความกดดันให้ผู้เล่นท่านอื่น',
      color: 'border-l-sky-500 bg-sky-950/20 text-sky-200'
    },
    {
      title: 'เน้นเกาะติดชิ้นเดียว (Single Focus Tactic)',
      desc: 'เลือกสินค้าที่คุณต้องการชนะจริงๆ เพียงชิ้นเดียวในการเล่นแต่ละครั้งเพื่อคุมงบสิทธิ์บิด การกระจายบิดหลายห้องพร้อมๆ กันจะทำให้เหรียญหมดไวและไม่ได้อะไรติดมือ',
      color: 'border-l-amber-500 bg-amber-950/20 text-amber-200'
    },
    {
      title: 'สังเกตคู่แข่ง (Opponent Profiling)',
      desc: 'ผู้เล่นบางท่านหรือบอทจอมลุยจะบิดดุดันมาก ให้ปล่อยเวลาผ่านไปเพื่อให้พวกเขาห้ำหั่นกันเองจนโควตาบิดของแต่ละคนอ่อนแรง แล้วคุณค่อยสังหารสอยบิดจังหวะทองคำ',
      color: 'border-l-emerald-500 bg-emerald-950/20 text-emerald-200'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-4xl mx-auto text-slate-200 py-4"
    >
      {/* Hero Badge Section */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          คู่มือการประมูลฉบับเซียน
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          เล่นอย่างไรให้ชนะ ได้รับของหรูกว่า 99%?
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          ความลับของระบบประมูลแบบ Penny Auction หรือเว็บประมูลไอเดียแปลกใหม่ที่ไม่เหมือนที่ไหน
          เราเน้นการใช้สมาธิ จังหวะ และกลยุทธ์ที่ล้ำลึกที่สุด
        </p>
      </div>

      {/* 3 Step Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800/60 mb-4 shadow-inner">
              {s.icon}
            </div>
            <h4 className="text-md font-bold text-white font-sans">{s.title}</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Secret Strategy Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-sans">
          <Shield className="w-5 h-5 text-amber-500" />
          3 คีย์หลักเจาะลึกกลยุทธ์ผู้ชนะ (Winning Blueprint)
        </h3>

        <div className="space-y-4">
          {tactics.map((t, i) => (
            <div key={i} className={`p-4 rounded-xl border-l-4 transition-all hover:translate-x-1 duration-200 ${t.color}`}>
              <h5 className="font-bold text-sm font-sans mb-1 flex items-center gap-1.5 text-white">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                {t.title}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Banner */}
      <div className="bg-linear-to-r from-emerald-950/20 to-emerald-900/10 border border-emerald-800/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
        <div>
          <h4 className="font-bold text-white text-sm font-sans">ต้องการชิปเสี่ยงทายเริ่มทดลองเล่นฟรี?</h4>
          <p className="text-xs text-slate-400 mt-0.5">ในระบบทดลองนี้ ทีมงานเราได้มอบโบนัสเริ่มแรกให้คุณฟรี 120 Bids ทันทีเพื่อสัมผัสความมันส์!</p>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            // Fire event or change tab - will let App component handle
            const btn = document.getElementById('tab-bids');
            if (btn) btn.click();
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
        >
          รีบไปเติมสิทธิ์ประมูล
        </button>
      </div>
    </motion.div>
  );
}
