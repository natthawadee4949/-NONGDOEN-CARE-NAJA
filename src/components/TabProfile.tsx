import React, { useState } from 'react';
import { User, ClassRoom } from '../types';
import {
  User as UserIcon,
  Star,
  Download,
  Upload,
  RotateCcw,
  Save,
  GraduationCap,
  Phone,
  Camera,
  Palette,
  Sparkles,
  Sliders,
  Heart,
  Smile,
  CheckCircle2,
  Brush,
  ShieldCheck,
} from 'lucide-react';
import { playSuccessChime, playClickSound } from '../utils/audio';

interface TabProfileProps {
  currentUser: User | null;
  onUpdateUser: (updated: Partial<User>) => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaultData: () => void;
}

export interface ProfileTheme {
  id: string;
  name: string;
  emoji: string;
  badge: string;
  bgGradient: string;
  cardBorder: string;
  accentText: string;
  buttonBg: string;
  previewColor: string;
}

export const PROFILE_THEMES: ProfileTheme[] = [
  {
    id: 'rose',
    name: 'ชมพูกุหลาบ (สี รร.)',
    emoji: '🌸',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    bgGradient: 'from-slate-950 via-rose-950 to-pink-900',
    cardBorder: 'border-rose-200',
    accentText: 'text-rose-600',
    buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    previewColor: '#e11d48',
  },
  {
    id: 'sakura',
    name: 'ซากุระพาสเทลหวาน',
    emoji: '🎀',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    bgGradient: 'from-pink-900 via-rose-900 to-purple-950',
    cardBorder: 'border-pink-200',
    accentText: 'text-pink-600',
    buttonBg: 'bg-pink-600 hover:bg-pink-700 text-white',
    previewColor: '#ec4899',
  },
  {
    id: 'peach',
    name: 'พีชแคนดี้สดใส',
    emoji: '🍑',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    bgGradient: 'from-amber-950 via-orange-950 to-rose-950',
    cardBorder: 'border-orange-200',
    accentText: 'text-orange-600',
    buttonBg: 'bg-orange-500 hover:bg-orange-600 text-white',
    previewColor: '#f97316',
  },
  {
    id: 'lavender',
    name: 'ลาเวนเดอร์นุ่มนวล',
    emoji: '💜',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    bgGradient: 'from-slate-950 via-purple-950 to-indigo-950',
    cardBorder: 'border-purple-200',
    accentText: 'text-purple-600',
    buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    previewColor: '#9333ea',
  },
  {
    id: 'mint',
    name: 'มิ้นต์สดชื่นสบายตา',
    emoji: '🍃',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgGradient: 'from-slate-950 via-teal-950 to-emerald-950',
    cardBorder: 'border-emerald-200',
    accentText: 'text-emerald-600',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    previewColor: '#10b981',
  },
  {
    id: 'sky',
    name: 'ท้องฟ้าสดใส',
    emoji: '🌊',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    bgGradient: 'from-slate-950 via-blue-950 to-sky-950',
    cardBorder: 'border-sky-200',
    accentText: 'text-sky-600',
    buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    previewColor: '#0284c7',
  },
  {
    id: 'official',
    name: 'ชมพู-ดำ อัตลักษณ์ รร.',
    emoji: '🖤',
    badge: 'bg-slate-900 text-rose-300 border-slate-700',
    bgGradient: 'from-black via-slate-950 to-rose-950',
    cardBorder: 'border-slate-800',
    accentText: 'text-rose-500',
    buttonBg: 'bg-slate-900 hover:bg-black text-rose-300 border border-rose-500/40',
    previewColor: '#0f172a',
  },
];

export const TabProfile: React.FC<TabProfileProps> = ({
  currentUser,
  onUpdateUser,
  onExportBackup,
  onImportBackup,
  onResetDefaultData,
}) => {
  // Sub-tabs: 'info' | 'customize' | 'backup'
  const [subTab, setSubTab] = useState<'info' | 'customize' | 'backup'>('info');

  // Form states
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [room, setRoom] = useState<ClassRoom>(currentUser?.room || 'ป.1');
  const [prefix, setPrefix] = useState(currentUser?.prefix || (currentUser?.role === 'teacher' ? 'คุณครู' : 'เด็กชาย'));

  // Customization states
  const [avatarSize, setAvatarSize] = useState<number>(currentUser?.avatarSize || 96);
  const [themeColor, setThemeColor] = useState<string>(currentUser?.themeColor || 'rose');
  const [avatarBorderShape, setAvatarBorderShape] = useState<'circle' | 'squircle' | 'flower'>('squircle');

  const activeTheme = PROFILE_THEMES.find((t) => t.id === themeColor) || PROFILE_THEMES[0];

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      prefix,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      room,
      avatarSize,
      themeColor,
    });
    playSuccessChime();
  };

  const handleApplyTheme = (themeId: string) => {
    setThemeColor(themeId);
    onUpdateUser({ themeColor: themeId });
    playClickSound();
  };

  const handleAvatarSizeChange = (newSize: number) => {
    setAvatarSize(newSize);
    onUpdateUser({ avatarSize: newSize });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateUser({ avatarUrl: url });
      playSuccessChime();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Profile Interactive Cover Card */}
      <div className={`bg-white rounded-3xl border-2 ${activeTheme.cardBorder} shadow-sm overflow-hidden transition-all duration-300`}>
        {/* Cover Gradient Banner */}
        <div className={`h-36 bg-gradient-to-r ${activeTheme.bgGradient} relative p-4 flex items-start justify-between text-white`}>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
            <span>{activeTheme.emoji}</span>
            <span>ธีม: {activeTheme.name}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{currentUser?.exp || 0} EXP</span>
          </div>
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Dynamic Resizable Avatar with Cute Frame */}
              <div className="relative group shrink-0 self-start">
                <div
                  style={{
                    width: `${avatarSize}px`,
                    height: `${avatarSize}px`,
                    maxWidth: '180px',
                    maxHeight: '180px',
                  }}
                  className={`bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black overflow-hidden transition-all duration-200 ${
                    avatarBorderShape === 'circle'
                      ? 'rounded-full'
                      : avatarBorderShape === 'flower'
                      ? 'rounded-3xl rotate-1 hover:rotate-0'
                      : 'rounded-2xl'
                  }`}
                >
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-rose-300">
                      {currentUser?.nickname?.slice(0, 1) || currentUser?.firstName.slice(0, 1) || 'N'}
                    </span>
                  )}
                </div>

                {/* Upload Avatar Overlay Button */}
                <label
                  title="เปลี่ยนรูปภาพประจำตัว"
                  className="absolute bottom-0 right-0 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110 flex items-center justify-center border-2 border-white"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name and Badges */}
              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentUser?.prefix} {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  {currentUser?.nickname && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>ชื่อเล่น: {currentUser.nickname}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-rose-300">
                    {currentUser?.role === 'teacher' ? 'คุณครูประจำชั้น' : 'นักเรียน'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    ชั้น {currentUser?.room || 'ป.1'}
                    {currentUser?.number && ` • เลขที่ ${currentUser.number}`}
                  </span>
                  {currentUser?.phone && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{currentUser.phone}</span>
                    </span>
                  )}
                </div>

                {currentUser?.bio && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 max-w-xl">
                    "{currentUser.bio}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Cute Sub-Tabs Navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1.5">
        <button
          onClick={() => {
            setSubTab('info');
            playClickSound();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'info'
              ? `${activeTheme.buttonBg} shadow-xs`
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>ข้อมูลส่วนตัว & ชื่อเล่น</span>
        </button>

        <button
          onClick={() => {
            setSubTab('customize');
            playClickSound();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'customize'
              ? `${activeTheme.buttonBg} shadow-xs`
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>ลากปรับขนาดรูป & แต่งธีมสี</span>
        </button>

        <button
          onClick={() => {
            setSubTab('backup');
            playClickSound();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'backup'
              ? `${activeTheme.buttonBg} shadow-xs`
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>สำรองข้อมูลระบบ</span>
        </button>
      </div>

      {/* 3. Sub-Tab Content: Personal Info & Nickname */}
      {subTab === 'info' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                แก้ไขข้อมูลส่วนตัว และชื่อเล่น
              </h3>
            </div>
            <span className="text-xs text-slate-500">บันทึกข้อมูลเพื่อแสดงผลในระบบ</span>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">คำนำหน้า</label>
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-semibold"
                >
                  <option value="คุณครู">คุณครู</option>
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อจริง *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="เช่น แคร์"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">นามสกุล *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="เช่น ศรีเจริญ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-medium"
                />
              </div>

              {/* Dedicated Nickname field */}
              <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-200">
                <label className="block font-black text-rose-800 mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                  <span>ชื่อเล่น (ใส่เพิ่มได้)</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="เช่น ครูแคร์ หรือ น้องเดิ่น"
                  className="w-full bg-white border border-rose-300 rounded-lg p-2 text-slate-900 focus:border-rose-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>เบอร์โทรศัพท์ติดต่อ</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0910610997"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>ระดับชั้นประจำ</span>
                </label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value as ClassRoom)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                >
                  {['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((r) => (
                    <option key={r} value={r}>
                      {r.startsWith('อ.') ? `ชั้นอนุบาล ${r.slice(2)} (${r})` : `ชั้นประถมศึกษาปีที่ ${r.slice(2)} (${r})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ข้อความแนะนำตัว / สโลแกนประจำตัว</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="เช่น มุ่งมั่นตั้งใจเรียน เพื่ออนาคตที่สดใส..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-2.5 ${activeTheme.buttonBg} font-bold rounded-xl shadow-xs transition-colors cursor-pointer`}
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูลส่วนตัว</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Sub-Tab Content: Drag to Resize Avatar & Cute Themes */}
      {subTab === 'customize' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                ลากปรับขนาดรูปภาพประจำตัว & แต่งธีมสีน่ารัก
              </h3>
            </div>
            <span className="text-xs text-rose-600 font-bold">พรีวิวแบบเรียลไทม์ ✨</span>
          </div>

          {/* Section A: Drag Slider to Resize Avatar */}
          <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  <span>ลากแถบเพื่อปรับขนาดรูปภาพโปรไฟล์ (Drag to Resize)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  ลากแถบเลื่อนไปทางขวาเพื่อขยายรูป หรือทางซ้ายเพื่อย่อรูปภาพตามใจชอบ
                </p>
              </div>
              <span className="text-sm font-black text-rose-600 bg-white px-3 py-1 rounded-xl border border-rose-200 shadow-2xs self-start sm:self-auto">
                {avatarSize} px
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="64"
                max="160"
                step="4"
                value={avatarSize}
                onChange={(e) => handleAvatarSizeChange(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>เล็กน่ารัก (64px)</span>
                <span>พอดีมาตรฐาน (96px)</span>
                <span>เด่นชัด (128px)</span>
                <span>ใหญ่พิเศษ (160px)</span>
              </div>
            </div>

            {/* Quick Size Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-700 mr-2">ขนาดด่วน:</span>
              {[
                { label: 'เล็ก (72px)', size: 72 },
                { label: 'มาตรฐาน (96px)', size: 96 },
                { label: 'ใหญ่ (120px)', size: 120 },
                { label: 'ใหญ่มาก (144px)', size: 144 },
              ].map((btn) => (
                <button
                  key={btn.size}
                  type="button"
                  onClick={() => handleAvatarSizeChange(btn.size)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    avatarSize === btn.size
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Shape selector */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-100">
              <span className="text-xs font-bold text-slate-700 mr-2">รูปทรงกรอบรูป:</span>
              <button
                type="button"
                onClick={() => setAvatarBorderShape('squircle')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  avatarBorderShape === 'squircle'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border'
                }`}
              >
                มุมโค้งมน (Squircle)
              </button>
              <button
                type="button"
                onClick={() => setAvatarBorderShape('circle')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  avatarBorderShape === 'circle'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border'
                }`}
              >
                วงกลม (Circle)
              </button>
              <button
                type="button"
                onClick={() => setAvatarBorderShape('flower')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  avatarBorderShape === 'flower'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border'
                }`}
              >
                น่ารักสดใส (Cute)
              </button>
            </div>
          </div>

          {/* Section B: Theme Color Palette Picker */}
          <div className="space-y-4">
            <div>
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-rose-600" />
                <span>เลือกธีมสีประจำโปรไฟล์ของคุณ (Cute Themes)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                คลิกเลือกธีมสีเพื่อเปลี่ยนโทนสีการแสดงผลและหัวการ์ดโปรไฟล์ของคุณ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PROFILE_THEMES.map((theme) => {
                const isSelected = theme.id === themeColor;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleApplyTheme(theme.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? `${theme.cardBorder} bg-slate-50 ring-2 ring-rose-500 shadow-sm`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: theme.previewColor }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg shadow-2xs shrink-0"
                    >
                      {theme.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span
                          style={{ backgroundColor: theme.previewColor }}
                          className="w-2 h-2 rounded-full inline-block"
                        />
                        <span>{isSelected ? 'กำลังใช้งาน' : 'คลิกเพื่อเลือก'}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-Tab Content: System Data Backup */}
      {subTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                สำรอง & กู้คืนข้อมูลระบบ (System Data Backup)
              </h3>
            </div>
            <span className="text-xs text-slate-500">ความปลอดภัยของข้อมูลสถานศึกษา</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            บันทึกสำรองข้อมูลนักเรียน การส่งการบ้าน สมุดบันทึกคะแนนเก็บ และสถานะเช็กชื่อเป็นไฟล์ JSON ลงในเครื่องของคุณได้ตลอดเวลา เพื่อความปลอดภัยและพร้อมกู้คืนเมื่อเปลี่ยนเครื่อง
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onExportBackup}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>ดาวน์โหลดสำรองข้อมูล (JSON)</span>
            </button>

            <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>นำเข้ากู้คืนข้อมูล (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={onResetDefaultData}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors ml-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
