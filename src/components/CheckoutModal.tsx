/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BidPackage } from '../types';
import { X, CreditCard, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../sound';

interface CheckoutModalProps {
  pack: BidPackage | null;
  onClose: () => void;
  onSuccess: (bidsCount: number, priceSpent: number) => void;
}

export default function CheckoutModal({ pack, onClose, onSuccess }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');
  const [cardNo, setCardNo] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!pack) return null;

  const totalBids = pack.bidsCount + pack.bonusBids;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsProcessing(true);

    // Simulate standard credit card or QR billing with nice progressive visual indicator
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      sound.playWin();
      setTimeout(() => {
        onSuccess(totalBids, pack.price);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Absolute Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        id="checkout-modal"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden text-slate-100 z-10"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800 p-2 rounded-full transition-all"
        >
          <X className="w-5 h-5" id="close-checkout-btn" />
        </button>

        <AnimatePresence mode="wait">
          {!isProcessing && !isDone ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header Title */}
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">ขั้นตอนสุดท้าย</span>
                <h3 className="text-2xl font-bold font-sans mt-1 text-white">เติมกระสุนประมูลของคุณ</h3>
                <p className="text-slate-400 text-sm mt-1">
                  แพ็กเกจ: <span className="text-emerald-400 font-medium">{pack.name}</span>
                </p>
              </div>

              {/* Package Recap Item */}
              <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">สิทธิ์บิดที่ได้รับทั้งหมด</div>
                  <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5 mt-1">
                    {totalBids}
                    <span className="text-xs font-medium text-amber-500 uppercase tracking-widest">Bids</span>
                  </div>
                  {pack.bonusBids > 0 && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      ได้รับโบนัสแถมฟรี +{pack.bonusBids} บิด
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">ราคาสุทธิ</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    ฿{pack.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">ไม่มีค่าธรรมเนียมแอบแฝง</div>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setPaymentMethod('promptpay'); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    paymentMethod === 'promptpay'
                      ? 'bg-slate-800/80 border-amber-500 text-slate-100'
                      : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold font-mono tracking-wide text-cyan-400">PromptPay</span>
                  <span className="text-[11px] mt-1 text-slate-400 font-sans">สแกนคิวอาร์โค้ดทันใจ</span>
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setPaymentMethod('card'); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    paymentMethod === 'card'
                      ? 'bg-slate-800/80 border-amber-500 text-slate-100'
                      : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[11px] text-slate-400 font-sans">บัตรเครดิต/เดบิต</span>
                </button>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {paymentMethod === 'promptpay' ? (
                  <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-800 text-center flex flex-col items-center">
                    <p className="text-xs text-slate-400 mb-3">จำลองการสแกนด้วยแอปพลิเคชันธนาคารบนมือถือ</p>
                    
                    {/* Fake PromptPay QR */}
                    <div className="relative bg-white p-3 rounded-xl border border-slate-200 shadow-md mb-3">
                      <div className="absolute top-1 left-1.5 right-1.5 h-1.5 bg-sky-900 rounded-sm flex items-center justify-center text-[5px] text-white">PROMPTPAY</div>
                      <svg className="w-40 h-40 mt-1" viewBox="0 0 100 100">
                        {/* High fidelity-like vector QR code */}
                        <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="#03254C"/>
                        <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="#03254C"/>
                        <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="#03254C"/>
                        <path d="M40,20 h10 v10 h-10 z M55,10 h5 v5 h-5 z M60,25 h10 v10 h-10 z" fill="#03254C"/>
                        <path d="M40,40 h20 v20 h-20 z M45,45 h10 v10 h-10 z" fill="#03254C"/>
                        <path d="M10,40 h15 v5 h-15 z M30,50 h10 v5 h-10 z M10,55 h5 v10 h-5 z" fill="#03254C"/>
                        <path d="M70,40 h10 v5 h-10 z M85,55 h5 v15 h-5 z M75,65 h10 v5 h-10 z" fill="#03254C"/>
                        <path d="M40,70 h5 v20 h-5 z M50,80 h15 v5 h-15 z M55,65 h5 v10 h-5 z" fill="#03254C"/>
                      </svg>
                      <div className="text-[10px] font-bold text-slate-800 tracking-wide mt-2">LuxePenny PromptPay QR</div>
                    </div>

                    <div className="text-xs text-sky-400 font-medium">สแกนชำระออโตเมติก เครดิตเข้าทันทีหลังจากสแกนสำเร็จ</div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">เลขหน้าบัตร</label>
                      <input
                        type="text"
                        required
                        placeholder="•••• •••• •••• ••••"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">ชื่อผู้ถือบัตร</label>
                      <input
                        type="text"
                        required
                        placeholder="CHAMPION BIDDER"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">วันหมดอายุ</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-amber-500 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">รหัสหลังบัตร (CVV)</label>
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-amber-500 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  id="submit-payment-btn"
                  className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:translate-y-px transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>ฉันชำระเงินเรียบร้อยแล้ว (฿{pack.price.toLocaleString()})</span>
                </button>
              </form>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>จำลองการทำธุรกรรมด้วย SSL 256-bit ปลอดภัยทุกการทดสอบ</span>
              </div>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              key="processing"
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin" />
                <CreditCard className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h4 className="text-xl font-bold font-sans text-white">กำลังอัปเกรดสถานะการชำระเงิน...</h4>
              <p className="text-slate-400 text-xs mt-2 max-w-xs">
                เซิร์ฟเวอร์ LuxePenny กำลังประมวลผลเครดิตโปรดเกล้าและยืนยันการสแกนผ่านธนาคารโดยไม่มีค่าใช้จ่ายจริง
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-2xl font-black font-sans text-white tracking-wide">ทำรายการสำเร็จพรีเมียม!</h4>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mt-1.5">
                ได้รับ +{totalBids} เครดิตบิดแล้ว!
              </p>
              <p className="text-slate-400 text-xs mt-2 max-w-xs">
                ขอบคุณที่ร่วมสัมผัสประสบการณ์ของ LuxePenny เครดิตเตรียมพร้อมสำหรับการประมูลวินาทีสำคัญ!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
