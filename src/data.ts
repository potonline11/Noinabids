/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuctionItem, BidPackage, WinnerHistory, UserStats } from './types';

export const BOT_NAMES = [
  'NongPloy_Rich',
  'Kitti_Siam',
  'Somchai_Sniper',
  'VipBidder99',
  'Nicha_Golden',
  'Art_SuperCar',
  'Chon_Pattaya',
  'Krating_BKK',
  'Anan_ProBid',
  'Siri_Smile',
  'Phuket_Luxe',
  'BonusHunter',
  'Tawan_Nite',
  'PennyWise_TH',
  'RichyRich'
];

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'leica-m6',
    title: 'กล้องฟิล์มระดับตำนาน Leica M6 Classic (สภาพสะสมนางฟ้า 95%)',
    description: 'กล้องฟิล์ม Rangefinder เยอรมันแท้ พร้อมเคสหนังดั้งเดิม ตัวถังไร้รอยบุบ วัดแสงยังทำงานสมบูรณ์ 100% เหมาะสำหรับคนรักกล้องฟาร์มินและผู้สะสมคุณภาพสูง',
    category: 'luxury',
    originalPrice: 120000.00,
    currentPrice: 425.80,
    timeRemaining: 14,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    lastBidder: 'Somchai_Sniper',
    isUserHighBidder: false,
    bidsPlacedCount: 4258,
    bidsRequiredPerBid: 1,
    bidsHistory: [
      { id: 'h1', bidderName: 'Somchai_Sniper', isUser: false, timeString: '01:14:58', priceAfterBid: 425.80 },
      { id: 'h2', bidderName: 'Siri_Smile', isUser: false, timeString: '01:14:48', priceAfterBid: 425.70 },
      { id: 'h3', bidderName: 'Nicha_Golden', isUser: false, timeString: '01:14:33', priceAfterBid: 425.60 }
    ],
    status: 'live',
    savingPercent: 99.6,
    timerMax: 15
  },
  {
    id: 'vintage-rolex',
    title: 'นาฬิกาวินเทจ Rolex Oyster Datejust 36mm (สภาพสะสม 90%)',
    description: 'ขอบหยักทองคำขาวตัวเรือนสตีลสุดคลาสสิกปี 1994 เครื่องกลไกออโตเมติกแท้ลื่นไหล กระจกเซลลูลอยด์ดั้งเดิมสายจูบิลี่ครบข้อ',
    category: 'luxury',
    originalPrice: 185000.00,
    currentPrice: 812.10,
    timeRemaining: 18,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    lastBidder: 'Kitti_Siam',
    isUserHighBidder: false,
    bidsPlacedCount: 8121,
    bidsRequiredPerBid: 2,
    bidsHistory: [
      { id: 'g1', bidderName: 'Kitti_Siam', isUser: false, timeString: '01:14:59', priceAfterBid: 812.10 },
      { id: 'g2', bidderName: 'VipBidder99', isUser: false, timeString: '01:14:52', priceAfterBid: 811.90 },
      { id: 'g3', bidderName: 'Somchai_Sniper', isUser: false, timeString: '01:14:39', priceAfterBid: 811.70 }
    ],
    status: 'live',
    savingPercent: 99.5,
    timerMax: 20
  },
  {
    id: 'macbook-m1',
    title: 'MacBook Pro 14" ชิป M1 Pro (RAM 16GB / SSD 512GB, สภาพงาม 93%)',
    description: 'เครื่องนอก อดีตศูนย์ไทย รอยขนแมวเล็กน้อยใต้ฐาน แบตเตอรี่สุขภาพดีเยี่ยม 87% รอบชาร์จน้อย หน้าจอสวยไร้รอยเดดพิกเซล อุปกรณ์สายชาร์จครบกล่อง',
    category: 'electronics',
    originalPrice: 54900.00,
    currentPrice: 184.60,
    timeRemaining: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    lastBidder: 'NongPloy_Rich',
    isUserHighBidder: false,
    bidsPlacedCount: 1846,
    bidsRequiredPerBid: 1,
    bidsHistory: [
      { id: 'p1', bidderName: 'NongPloy_Rich', isUser: false, timeString: '01:14:58', priceAfterBid: 184.60 },
      { id: 'p2', bidderName: 'Art_SuperCar', isUser: false, timeString: '01:14:51', priceAfterBid: 184.50 },
      { id: 'p3', bidderName: 'VipBidder99', isUser: false, timeString: '01:14:44', priceAfterBid: 184.40 }
    ],
    status: 'live',
    savingPercent: 99.6,
    timerMax: 15
  },
  {
    id: 'fender-strat',
    title: 'กีตาร์ไฟฟ้า Fender Custom Shop \'62 Stratocaster Relic (มือสองญี่ปุ่น)',
    description: 'งานทำสีแตกเสมือนผ่านการใช้งานจริงจากโรงงานเฟนเดอร์คัสตอมช็อป เสียงย่านแหลมทุ้มทอประกาย คอวีทรงคลาสสิก ปิ๊กอัพดั้งเดิม พร้อมกล่องแข็งหนังกวางหรูหรา',
    category: 'luxury',
    originalPrice: 98000.00,
    currentPrice: 340.20,
    timeRemaining: 11,
    image: 'https://images.unsplash.com/photo-1508186227448-8a541f2c6288?w=600&q=80',
    lastBidder: 'Chon_Pattaya',
    isUserHighBidder: false,
    bidsPlacedCount: 3402,
    bidsRequiredPerBid: 1,
    bidsHistory: [
      { id: 'w1', bidderName: 'Chon_Pattaya', isUser: false, timeString: '01:14:54', priceAfterBid: 340.20 },
      { id: 'w2', bidderName: 'BonusHunter', isUser: false, timeString: '01:14:47', priceAfterBid: 340.10 },
      { id: 'w3', bidderName: 'Krating_BKK', isUser: false, timeString: '01:14:30', priceAfterBid: 340.00 }
    ],
    status: 'live',
    savingPercent: 99.4,
    timerMax: 15
  },
  {
    id: 'ipad-pro-11',
    title: 'iPad Pro 11 นิ้ว ชิป M1 (128GB Wi-Fi สีเทาสเปซเกรย์, สภาพสวย 92%)',
    description: 'บอดี้ขอบมุมไม่มีรอยเคสจิกกัด ใส่เคสตลอดการใช้งาน หน้าจอติดฟิล์มกระดาษไว้ลำโพงกระหึ่ม ครบกล่องกลไกแท้พร้อมคู่มือการใช้งานครบถ้วน',
    category: 'electronics',
    originalPrice: 27900.00,
    currentPrice: 98.70,
    timeRemaining: 15,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    lastBidder: 'Art_SuperCar',
    isUserHighBidder: false,
    bidsPlacedCount: 987,
    bidsRequiredPerBid: 1,
    bidsHistory: [
      { id: 'i1', bidderName: 'Art_SuperCar', isUser: false, timeString: '01:14:57', priceAfterBid: 98.70 },
      { id: 'i2', bidderName: 'Anan_ProBid', isUser: false, timeString: '01:14:50', priceAfterBid: 98.60 },
      { id: 'i3', bidderName: 'NongPloy_Rich', isUser: false, timeString: '01:14:42', priceAfterBid: 98.50 }
    ],
    status: 'live',
    savingPercent: 99.6,
    timerMax: 15
  },
  {
    id: 'marshall-acton',
    title: 'ลำโพงบลูทูธ Marshall Acton II Black (สภาพดีแท้สยามพารากอน)',
    description: 'ตัวเครื่องสีดำขลับประทับตราปัดทองนูนชัด วอลลุ่มปรับหนืดแน่นปึก เสียงดีเบสหนักกลมกล่อม มีร่องรอยการเช็ดทำความสะอาดตามปกติสภาพรวมเกิน 93%',
    category: 'gadgets',
    originalPrice: 11900.00,
    currentPrice: 54.10,
    timeRemaining: 19,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    lastBidder: 'Yut_Rider',
    isUserHighBidder: false,
    bidsPlacedCount: 541,
    bidsRequiredPerBid: 1,
    bidsHistory: [
      { id: 'm1', bidderName: 'Yut_Rider', isUser: false, timeString: '01:14:55', priceAfterBid: 54.10 },
      { id: 'm2', bidderName: 'Phuket_Luxe', isUser: false, timeString: '01:14:49', priceAfterBid: 54.00 },
      { id: 'm3', bidderName: 'Siri_Smile', isUser: false, timeString: '01:14:35', priceAfterBid: 53.90 }
    ],
    status: 'live',
    savingPercent: 99.5,
    timerMax: 20
  }
];

export const BID_PACKAGES: BidPackage[] = [
  { id: 'pack-sm', name: 'ไมโคร สตาร์ตเตอร์ (Starter)', bidsCount: 50, price: 150, bonusBids: 0 },
  { id: 'pack-md', name: 'แพ็คสุดคุ้มยอดนิยม (Silver)', bidsCount: 150, price: 420, bonusBids: 15, popular: true },
  { id: 'pack-lg', name: 'กัปตันบิดเกอร์ แถมนัว (Gold)', bidsCount: 300, price: 790, bonusBids: 50 },
  { id: 'pack-xl', name: 'วาฬระดับเศรษฐี (Diamond VIP)', bidsCount: 1000, price: 2390, bonusBids: 250 }
];

export const INITIAL_WINNERS: WinnerHistory[] = [
  {
    id: 'win-1',
    title: 'MacBook Air 13" ชิป M1 (RAM 8GB / SSD 256GB - สภาพสวย 94%)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    originalPrice: 26900.00,
    winningPrice: 215.30,
    winnerName: 'Me (คุณ)',
    savings: 26684.70,
    savedPercent: 99.2,
    dateString: '12 มิ.ย. 2569 - 00:45'
  },
  {
    id: 'win-2',
    title: 'กล้องทอยออโต้คลาสสิก Olympus mju II (สภาพพร้อมใช้ 88%)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    originalPrice: 12500.00,
    winningPrice: 84.50,
    winnerName: 'NongPloy_Rich',
    savings: 12415.50,
    savedPercent: 99.3,
    dateString: '12 มิ.ย. 2569 - 01:02'
  },
  {
    id: 'win-3',
    title: 'เครื่องชงกาแฟแมนนวล Flair Classic Manual Espresso (สภาพ 90%)',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    originalPrice: 9800.00,
    winningPrice: 48.20,
    winnerName: 'VipBidder99',
    savings: 9751.80,
    savedPercent: 99.5,
    dateString: '11 มิ.ย. 2569 - 23:14'
  }
];

export const INITIAL_STATS: UserStats = {
  bidsRemaining: 120, // Starting amount to give them instant joy to play!
  totalBidsPlaced: 14,
  moneySaved: 26684.70,
  totalSpent: 120.00,
  wonItemsCount: 1
};
