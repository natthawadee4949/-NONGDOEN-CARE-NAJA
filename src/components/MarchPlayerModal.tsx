import React from 'react';
import { Music, Volume2, ShieldCheck, Heart } from 'lucide-react';

interface MarchPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarchPlayerModal: React.FC<MarchPlayerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-xl w-full space-y-4 animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                เพลงมาร์ช โรงเรียนหนองเดิ่นศรีเจริญวิทยา
              </h3>
              <span className="text-[11px] text-slate-500">สพป.หนองคาย เขต 1 (สีชมพู - ดำ)</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Video Embed */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-900">
          <iframe
            src="https://www.youtube-nocookie.com/embed/dIbxG5p1oD8?rel=0&autoplay=1"
            title="เพลงมาร์ช โรงเรียนหนองเดิ่นศรีเจริญวิทยา"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Anthem Context & Values */}
        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-xs space-y-2">
          <div className="font-bold text-rose-950 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
            <span>บทเพลงแห่งเกียรติยศและปัญญา โรงเรียนหนองเดิ่นศรีเจริญวิทยา</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            ร่วมใจรักสามัคคี มุ่งมั่นสร้างสรรค์การศึกษา ปลูกฝังคุณธรรม ระเบียบวินัย และความภาคภูมิใจในสถานศึกษา
            หล่อหลอมเยาวชนคนดีสู่สังคมอย่างยั่งยืน
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-600">
            <span>• สีชมพู: ความรัก ความเมตตา และการดูแลเอาใจใส่</span>
            <span>• สีดำ: ความมั่นคง เข้มแข็ง และระเบียบวินัย</span>
          </div>
        </div>

        <div className="text-right pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
