import React from 'react';
import { NavigationTab, User } from '../types';
import { Globe, MapPin, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLineModal: () => void;
  currentUser?: User | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenLineModal, currentUser }) => {
  const isStudent = currentUser?.role === 'student';

  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800 mt-12 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Address */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm tracking-tight">
              โรงเรียนหนองเดิ่นศรีเจริญวิทยา
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Nong Doen Sri Charoen Wittaya School<br />
              หมู่ 11 ตำบลหนองกอมเกาะ อำเภอเมืองหนองคาย จังหวัดหนองคาย 43000<br />
              โทรศัพท์: 0910610997<br />
              สังกัด สพป.หนองคาย เขต 1
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                ชมพู
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10px]">
                ดำ
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold text-[10px]">
                NONGDOEN CARE
              </span>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="space-y-2.5">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">
              {isStudent ? 'เมนูนักเรียน' : 'เมนูด่วนคุณครู'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              {isStudent ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigateTab('student-portal')}
                      className="hover:text-white transition-colors text-rose-300 font-semibold"
                    >
                      การบ้าน & ภาระงานของฉัน
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('profile')}
                      className="hover:text-white transition-colors"
                    >
                      บัญชีส่วนตัว
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onNavigateTab('home')}
                      className="hover:text-white transition-colors"
                    >
                      หน้าแรก & สารสนเทศ
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('seating')}
                      className="hover:text-white transition-colors"
                    >
                      ผังที่นั่งห้องเรียน & เช็กชื่อ
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('students')}
                      className="hover:text-white transition-colors"
                    >
                      ทะเบียนนักเรียน
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('grading')}
                      className="hover:text-white transition-colors"
                    >
                      โต๊ะตรวจงาน & สมุดคะแนน
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('profile')}
                      className="hover:text-white transition-colors"
                    >
                      บัญชีส่วนตัว
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* External Services */}
          <div className="space-y-2.5">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">
              เว็บไซต์และบริการโรงเรียน
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a
                  href="https://www.nsw-school.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-rose-400" />
                  <span>เว็บไซต์ทางการ: www.nsw-school.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://kku-creative.my.canva.site/dahu41ngfhw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-pink-400" />
                  <span>เว็บไซต์สื่อสร้างสรรค์ (ไม่ทางการ)</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenLineModal}
                  className="text-[#06C755] hover:underline flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#06C755]" />
                  <span>ระบบแจ้งเตือน LINE Official Account</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="space-y-2.5">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">
              โครงงาน NONGDOEN CARE
            </h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              ระบบดิจิทัลเพื่อยกระดับการบริหารจัดการชั้นเรียนและระบบดูแลช่วยเหลือนักเรียน
              โรงเรียนหนองเดิ่นศรีเจริญวิทยา อ.เมืองหนองคาย จ.หนองคาย สพป.หนองคาย เขต 1
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          Copyright © 2026 โรงเรียนหนองเดิ่นศรีเจริญวิทยา หมู่ 11 ต.หนองกอมเกาะ อ.เมืองหนองคาย จ.หนองคาย 43000. All rights reserved. | Powered by NONGDOEN CARE
        </div>
      </div>
    </footer>
  );
};
