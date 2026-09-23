import React, { useState } from 'react';
import { User, UserRole, ClassRoom } from '../types';
import {
  GraduationCap,
  LogIn,
  UserPlus,
  ShieldCheck,
  User as UserIcon,
  Phone,
  Key,
  Sparkles,
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  onQuickDemoTeacher: () => void;
  onQuickDemoStudent: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickDemoTeacher,
  onQuickDemoStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginPhone, setLoginPhone] = useState('0910610997');
  const [loginPassword, setLoginPassword] = useState('1234');

  // Register Form
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regPrefix, setRegPrefix] = useState('เด็กชาย');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regRoom, setRegRoom] = useState<ClassRoom>('ป.1');
  const [regNumber, setRegNumber] = useState<number>(1);
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCare = loginPhone === '0910610997';
    const user: User = {
      id: isCare ? 'usr-teacher-care' : 'usr-' + Date.now(),
      role: isCare ? 'teacher' : 'student',
      login: loginPhone,
      prefix: isCare ? 'คุณครู' : 'เด็กชาย',
      firstName: isCare ? 'ครูแคร์' : 'น้องเดิ่น',
      lastName: 'ศรีเจริญ',
      nickname: isCare ? 'ครูแคร์' : 'น้องเดิ่น',
      room: 'ป.1',
      phone: loginPhone,
      exp: isCare ? 999 : 150,
      avatarSize: 96,
      themeColor: isCare ? 'rose' : 'sakura',
    };
    onLogin(user);
    playSuccessChime();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim()) return;

    const newUser: User = {
      id: 'usr-' + Date.now(),
      role: regRole,
      login: regPhone.trim() || 'user_' + Date.now(),
      prefix: regPrefix,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      nickname: regNickname.trim() || regFirstName.trim(),
      room: regRoom,
      number: regRole === 'student' ? Number(regNumber) : undefined,
      phone: regPhone.trim(),
      exp: 50,
    };

    onRegister(newUser);
    playSuccessChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full space-y-5 animate-fade-in relative max-h-[90vh] overflow-y-auto">
        {/* Header Badge */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-slate-950 via-rose-900 to-rose-600 flex items-center justify-center text-white shadow-lg p-2 mb-2">
            <GraduationCap className="w-8 h-8 text-rose-200" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            NONGDOEN <span className="text-rose-600">CARE</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1
          </p>
        </div>

        {/* Quick Demo Login Deck */}
        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 space-y-2">
          <div className="text-[11px] font-bold text-rose-800 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>เข้าสู่ระบบด่วนเพื่อทดสอบระบบทันที (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onQuickDemoTeacher();
                playSuccessChime();
              }}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>ทดลองใช้: ครูแคร์</span>
            </button>
            <button
              onClick={() => {
                onQuickDemoStudent();
                playSuccessChime();
              }}
              className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>ทดลองใช้: น้องเดิ่น</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ลงทะเบียนใหม่</span>
          </button>
        </div>

        {/* 1. Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>เบอร์โทรศัพท์ หรือ อีเมล:</span>
              </label>
              <input
                type="text"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="เช่น 0910610997"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-rose-600" />
                <span>รหัสผ่าน:</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 pt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ NONGDOEN CARE</span>
            </button>
          </form>
        )}

        {/* 2. Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">สมัครในฐานะ:</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-hidden"
              >
                <option value="student">นักเรียน (เข้าส่งการบ้านและดูเช็กชื่อ)</option>
                <option value="teacher">คุณครู (บริหารจัดการชั้นเรียน)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">คำนำหน้า:</label>
                <select
                  value={regPrefix}
                  onChange={(e) => setRegPrefix(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-hidden"
                >
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
                  <option value="คุณครู">คุณครู</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อจริง:</label>
                <input
                  type="text"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="ชื่อ"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">นามสกุล:</label>
                <input
                  type="text"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="นามสกุล"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อเล่น:</label>
                <input
                  type="text"
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value)}
                  placeholder="ชื่อเล่น"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {regRole === 'student' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ระดับชั้น:</label>
                  <select
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value as ClassRoom)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-hidden"
                  >
                    {['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เลขที่:</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={regNumber}
                    onChange={(e) => setRegNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ (ใช้เข้าระบบ):</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="เช่น 0910610997"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">รหัสผ่าน:</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="ตั้งรหัสผ่าน"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-hidden font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>ยืนยันการลงทะเบียน</span>
            </button>
          </form>
        )}

        {/* Close Button */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ปิดหน้าต่างนี้
          </button>
        </div>
      </div>
    </div>
  );
};
