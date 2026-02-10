import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, Award } from 'lucide-react';
import KkakdugiMascot from '../brand/KkakdugiMascot';

interface GraduationCertificateProps {
  userName: string;
  onClose: () => void;
}

export default function GraduationCertificate({ userName, onClose }: GraduationCertificateProps) {
  const { t } = useTranslation('common');
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = async () => {
    if (!certRef.current) return;

    try {
      // Use html2canvas-style approach with canvas
      const cert = certRef.current;
      const canvas = document.createElement('canvas');
      const scale = 2; // High DPI
      canvas.width = cert.offsetWidth * scale;
      canvas.height = cert.offsetHeight * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('다운로드를 지원하지 않는 환경입니다.');
        return;
      }

      ctx.scale(scale, scale);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, cert.offsetWidth, cert.offsetHeight);
      gradient.addColorStop(0, '#FFFBEB');
      gradient.addColorStop(0.5, '#FEF9C3');
      gradient.addColorStop(1, '#FDE68A');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cert.offsetWidth, cert.offsetHeight);

      // Draw border
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, cert.offsetWidth - 24, cert.offsetHeight - 24);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.strokeRect(18, 18, cert.offsetWidth - 36, cert.offsetHeight - 36);

      // Draw content
      const centerX = cert.offsetWidth / 2;

      // Medal circle
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(centerX, 60, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎓', centerX, 68);

      // Title
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(t('school.graduation.certificate.title', '졸업증서'), centerX, 120);

      // Divider
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 60, 135);
      ctx.lineTo(centerX + 60, 135);
      ctx.stroke();

      // Name
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`${userName} 님`, centerX, 175);

      // Body text
      ctx.fillStyle = '#92400E';
      ctx.font = '13px sans-serif';
      const bodyText = t('school.graduation.certificate.body', '위 학생은 깍두기 학교 마케팅 학과 예비 마케터 교실의 전 과정을 성실히 이수하고 소정의 졸업 요건을 충족하였기에 이 증서를 수여합니다.');

      // Word wrap (공백 기준, 없으면 글자별)
      const maxWidth = cert.offsetWidth - 80;
      const segments = bodyText.split(/(?<=\s)/);
      let line = '';
      let y = 210;
      for (const seg of segments) {
        const testLine = line + seg;
        if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
          ctx.fillText(line.trimEnd(), centerX, y);
          line = seg;
          y += 22;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line.trimEnd(), centerX, y);

      // Date
      ctx.fillStyle = '#B45309';
      ctx.font = '12px sans-serif';
      ctx.fillText(today, centerX, y + 45);

      // Principal
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(t('school.graduation.certificate.principal', '깍두기 학교 교장'), centerX, y + 75);

      // Download
      const link = document.createElement('a');
      link.download = `깍두기학교_졸업증서_${userName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Certificate download failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 졸업증서 */}
        <div className="px-6 pb-6">
          <div
            ref={certRef}
            className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl p-8 text-center shadow-inner"
            style={{ minHeight: 380 }}
          >
            {/* 상단 메달 */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>

            {/* 제목 */}
            <h2 className="text-2xl font-extrabold text-amber-800 mb-2">
              {t('school.graduation.certificate.title', '졸업증서')}
            </h2>

            <div className="w-12 h-0.5 bg-amber-400 mx-auto my-3" />

            {/* 이름 */}
            <p className="text-xl font-bold text-amber-900 mb-4">
              {userName} 님
            </p>

            {/* 본문 */}
            <p className="text-sm text-amber-700 leading-relaxed mb-6">
              {t('school.graduation.certificate.body', '위 학생은 깍두기 학교 마케팅 학과 예비 마케터 교실의 전 과정을 성실히 이수하고 소정의 졸업 요건을 충족하였기에 이 증서를 수여합니다.')}
            </p>

            {/* 날짜 */}
            <p className="text-xs text-amber-500 mb-3">{today}</p>

            {/* 교장 */}
            <div className="flex items-center justify-center gap-2">
              <KkakdugiMascot size={20} />
              <span className="text-sm font-bold text-amber-800">
                {t('school.graduation.certificate.principal', '깍두기 학교 교장')}
              </span>
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <button
            onClick={handleDownload}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {t('school.graduation.certificate.download', '졸업증 다운로드')}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-gray-500 text-sm hover:text-gray-700"
          >
            {t('common.close', '닫기')}
          </button>
        </div>
      </div>
    </div>
  );
}
