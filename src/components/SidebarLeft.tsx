import React, { useState } from 'react';
import { NavigationTab, ClassRoom, User } from '../types';
import {
  Home,
  LayoutGrid,
  Timer,
  CheckSquare,
  BookOpen,
  Users,
  Backpack,
  User as UserIcon,
  Menu,
  X,
  GraduationCap,
  Globe,
  Sparkles,
  Music,
  LogOut,
  ExternalLink,
  Volume2,
  VolumeX,
  ShieldCheck,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { MascotIcon } from './MascotIcon';

interface SidebarLeftProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentRoom: ClassRoom;
  onChangeRoom: (room: ClassRoom) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenMarchModal: () => void;
  onSwitchRole: (role: 'teacher' | 'student') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const ROOM_OPTIONS: ClassRoom[] = ['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  onSelectTab,
  currentRoom,
  onChangeRoom,
  currentUser,
  onLogout,
  onOpenMarchModal,
  onSwitchRole,
  isMuted,
  onToggleMute,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header with Left Hamburger */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            aria-label="เปิดเมนูด้านซ้าย"
          >
            <Menu className="w-5 h-5 text-rose-600" />
          </button>
          <div className="flex items-center gap-2">
            <MascotIcon size="sm" variant="mascot" />
            <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white border-2 border-pink-400 shadow-2xs">
              <span className="font-black text-xs text-slate-700 tracking-tight">
                NONGDOEN <span className="text-pink-600">CARE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Current Role / User Indicator */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold"
            >
              <span>{currentUser.nickname || currentUser.firstName}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Left Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between shadow-lg lg:shadow-xs transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header: School Logo & Title */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <MascotIcon size="md" variant="mascot" className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white border-2 border-pink-400 shadow-2xs">
                <span className="font-black text-xs text-slate-700 tracking-tight">
                  NONGDOEN <span className="text-pink-600">CARE</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold leading-tight line-clamp-1 mt-1">
                รร.หนองเดิ่นศรีเจริญวิทยา
              </span>
              <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider">
                สพป.หนองคาย เขต 1
              </span>
            </div>
          </button>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini-Card in Left Sidebar */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-50/60 to-pink-50/40 border-b border-rose-100/70">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser?.nickname?.slice(0, 1) || currentUser?.firstName.slice(0, 1) || 'N'}</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-black text-xs text-slate-900 truncate">
                  {currentUser?.prefix} {currentUser?.firstName}
                </span>
                {currentUser?.nickname && (
                  <span className="text-[10px] font-bold text-rose-600 shrink-0">
                    ({currentUser.nickname})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-rose-300 text-[10px] font-bold">
                  {isTeacher ? 'ครูประจำชั้น' : 'นักเรียน'}
                </span>
                <span className="text-[10px] text-slate-600 font-bold">
                  ชั้น {currentUser?.room || currentRoom}
                  {isStudent && currentUser?.number && ` #${currentUser.number}`}
                </span>
              </div>
            </div>
          </div>

          {/* Teacher Class Room Switcher */}
          {isTeacher && (
            <div className="mt-2.5 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                <span>เปลี่ยนห้อง:</span>
              </span>
              <select
                value={currentRoom}
                onChange={(e) => onChangeRoom(e.target.value as ClassRoom)}
                className="bg-transparent text-xs font-black text-rose-700 focus:outline-hidden cursor-pointer"
              >
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room.startsWith('อ.') ? `อนุบาล ${room.slice(2)} (${room})` : `ประถม ${room.slice(2)} (${room})`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation List on the Left Side */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            แถบเมนูหลัก (Navigation)
          </div>

          {/* 1. หน้าแรก & สารสนเทศ (Home for Both) */}
          <button
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'home'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>หน้าแรก & สารสนเทศ</span>
            {activeTab === 'home' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>

          {/* STUDENT MENU ITEMS */}
          {isStudent && (
            <>
              <button
                onClick={() => handleTabClick('student-portal')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'student-portal'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Backpack className="w-4 h-4 shrink-0" />
                <span>การบ้าน & ภาระงานของฉัน</span>
                {activeTab === 'student-portal' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span>บัญชีส่วนตัว & แต่งธีม</span>
                {activeTab === 'profile' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            </>
          )}

          {/* TEACHER MENU ITEMS */}
          {isTeacher && (
            <>
              <button
                onClick={() => handleTabClick('seating')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'seating'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>ผังที่นั่ง & เช็กชื่อ ({currentRoom})</span>
                {activeTab === 'seating' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('grading')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'grading'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>ตรวจงาน & สมุดคะแนน</span>
                {activeTab === 'grading' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('homework')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'homework'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>ติดตามการบ้าน & ใบงาน</span>
                {activeTab === 'homework' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('students')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>ทะเบียนนักเรียน (เพิ่ม/ลบ)</span>
                {activeTab === 'students' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('tools')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Timer className="w-4 h-4 shrink-0" />
                <span>เครื่องมือครู (นาฬิกา/สุ่ม)</span>
                {activeTab === 'tools' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span>บัญชีส่วนตัว & แต่งธีม</span>
                {activeTab === 'profile' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            </>
          )}

          {/* Quick External School Links Section */}
          <div className="pt-4 pb-1">
            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              เว็บไซต์โรงเรียน (2 ช่องทาง)
            </div>

            <a
              href="https://www.nsw-school.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50 transition-all group"
            >
              <Globe className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">เว็บทางการ (NSW)</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-rose-600 ml-auto shrink-0" />
            </a>

            <a
              href="https://kku-creative.my.canva.site/dahu41ngfhw"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-slate-700 hover:text-pink-700 hover:bg-pink-50 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
              <span className="truncate">เว็บสื่อสร้างสรรค์</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-pink-600 ml-auto shrink-0" />
            </a>

            <button
              onClick={onOpenMarchModal}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-rose-800 hover:bg-rose-50 transition-all text-left cursor-pointer"
            >
              <Music className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">เพลงมาร์ชประจำ รร.</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Quick Trial Role Switcher & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          {/* Trial Accounts Switcher (ครูแคร์ & น้องเดิ่น) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSwitchRole('teacher')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                isTeacher
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-rose-400" />
              <span>ครูแคร์</span>
            </button>

            <button
              onClick={() => onSwitchRole('student')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                isStudent
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-3 h-3" />
              <span>น้องเดิ่น</span>
            </button>
          </div>

          {/* Sound & Logout Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
