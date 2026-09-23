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
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentRoom: ClassRoom;
  onChangeRoom: (room: ClassRoom) => void;
  currentUser: User | null;
}

const ROOM_OPTIONS: ClassRoom[] = ['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentRoom,
  onChangeRoom,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTeacher = currentUser?.role === 'teacher';

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Official School Logo & Title (Clean, no "หนองเดิ่นฯ" tag) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabClick(isTeacher ? 'home' : 'student-portal')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-rose-900 to-rose-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform p-1.5">
                <GraduationCap className="w-6 h-6 text-rose-200" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900">
                    NONGDOEN <span className="text-rose-600">CARE</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1
                </span>
              </div>
            </button>
          </div>

          {/* Right: Navigation Menu placed on the right side */}
          <div className="hidden lg:flex items-center gap-1.5 ml-auto">
            {/* Class Room Selector (for teachers) or Class Badge (for students) */}
            {isTeacher ? (
              <div className="flex items-center gap-1.5 mr-2 pr-3 border-r border-slate-200 bg-slate-50 px-2.5 py-1 rounded-lg border">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                  ชั้น:
                </span>
                <select
                  value={currentRoom}
                  onChange={(e) => onChangeRoom(e.target.value as ClassRoom)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
                >
                  {ROOM_OPTIONS.map((room) => (
                    <option key={room} value={room}>
                      {room.startsWith('อ.') ? `อนุบาล ${room.slice(2)} (${room})` : `ประถม ${room.slice(2)} (${room})`}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                <span>ชั้น {currentUser?.room || currentRoom}</span>
                {currentUser?.number && <span>• เลขที่ {currentUser.number}</span>}
              </div>
            )}

            {/* STUDENT MENU: Only "การบ้าน" and "บัญชีส่วนตัว" */}
            {!isTeacher && (
              <>
                <button
                  onClick={() => handleTabClick('student-portal')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'student-portal'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Backpack className="w-4 h-4" />
                  <span>การบ้าน & ภาระงานของฉัน</span>
                </button>

                <button
                  onClick={() => handleTabClick('profile')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>บัญชีส่วนตัว</span>
                </button>
              </>
            )}

            {/* TEACHER MENU */}
            {isTeacher && (
              <>
                <button
                  onClick={() => handleTabClick('home')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'home'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>หน้าแรก</span>
                </button>

                <button
                  onClick={() => handleTabClick('seating')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'seating'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>ผังที่นั่ง & เช็กชื่อ</span>
                </button>

                <button
                  onClick={() => handleTabClick('grading')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'grading'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>ตรวจงาน & คะแนน</span>
                </button>

                <button
                  onClick={() => handleTabClick('homework')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'homework'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ติดตามการบ้าน</span>
                </button>

                <button
                  onClick={() => handleTabClick('students')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'students'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>ทะเบียนนักเรียน</span>
                </button>

                <button
                  onClick={() => handleTabClick('tools')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'tools'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  <span>เครื่องมือครู</span>
                </button>

                <button
                  onClick={() => handleTabClick('profile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>บัญชีส่วนตัว</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isTeacher && (
              <select
                value={currentRoom}
                onChange={(e) => onChangeRoom(e.target.value as ClassRoom)}
                className="bg-slate-100 text-xs font-bold text-slate-800 py-1 px-2 rounded border border-slate-300"
              >
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-rose-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {/* STUDENT MOBILE MENU */}
          {!isTeacher && (
            <>
              <button
                onClick={() => handleTabClick('student-portal')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'student-portal' ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Backpack className="w-4 h-4" />
                <span>การบ้าน & ภาระงานของฉัน</span>
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'profile' ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>บัญชีส่วนตัว</span>
              </button>
            </>
          )}

          {/* TEACHER MOBILE MENU */}
          {isTeacher && (
            <>
              <button
                onClick={() => handleTabClick('home')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'home' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>หน้าแรก & สารสนเทศ</span>
              </button>

              <button
                onClick={() => handleTabClick('seating')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'seating' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>ผังที่นั่ง & เช็กชื่อ</span>
              </button>

              <button
                onClick={() => handleTabClick('grading')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'grading' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>ตรวจงาน & คะแนน</span>
              </button>

              <button
                onClick={() => handleTabClick('homework')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'homework' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>ติดตามการบ้าน</span>
              </button>

              <button
                onClick={() => handleTabClick('students')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'students' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>ทะเบียนนักเรียน</span>
              </button>

              <button
                onClick={() => handleTabClick('tools')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'tools' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>เครื่องมือครู</span>
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                  activeTab === 'profile' ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>บัญชีส่วนตัว</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
