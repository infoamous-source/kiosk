import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, Award, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import KkakdugiMascot from '../brand/KkakdugiMascot';

interface GraduationCertificateProps {
  userName: string;
  userOrg: string;
  teamName: string;
  onClose: () => void;
}

const CURRICULUM = [
  '1교시 나의 적성 찾기',
  '2교시 시장 조사하기',
  '3교시 나만의 무기 만들기',
  '4교시 SNS 광고 만들기',
  '5교시 설득의 기술',
  '6교시 투자 시뮬레이션',
];

export default function GraduationCertificate({ userName, userOrg, teamName, onClose }: GraduationCertificateProps) {
  const { t } = useTranslation('common');
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const renderCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!certRef.current) return null;

    const cert = certRef.current;
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = cert.offsetWidth * scale;
    canvas.height = cert.offsetHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

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
    ctx.arc(centerX, 50, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎓', centerX, 58);

    // Title
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(t('school.graduation.certificate.title', '졸업증서'), centerX, 108);

    // Divider
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 60, 120);
    ctx.lineTo(centerX + 60, 120);
    ctx.stroke();

    // Name
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${userName} 님`, centerX, 155);

    // Body text
    ctx.fillStyle = '#92400E';
    ctx.font = '13px sans-serif';
    const bodyText = t('school.graduation.certificate.body', '위 학생은 깍두기 학교 마케팅 학과 예비 마케터 교실의 전 과정을 성실히 이수하고 소정의 졸업 요건을 충족하였기에 이 증서를 수여합니다.');

    // Word wrap
    const maxWidth = cert.offsetWidth - 80;
    const segments = bodyText.split(/(?<=\s)/);
    let line = '';
    let y = 185;
    for (const seg of segments) {
      const testLine = line + seg;
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        ctx.fillText(line.trimEnd(), centerX, y);
        line = seg;
        y += 20;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line.trimEnd(), centerX, y);

    // Curriculum section
    y += 35;
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(t('school.graduation.certificate.curriculum', '이수 과정'), centerX, y);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#A16207';
    // Draw curriculum in two columns (3 per row)
    for (let i = 0; i < CURRICULUM.length; i += 2) {
      y += 18;
      const left = CURRICULUM[i];
      const right = CURRICULUM[i + 1] || '';
      const colText = right ? `${left}  ·  ${right}` : left;
      ctx.fillText(colText, centerX, y);
    }

    // Team name
    y += 30;
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(t('school.graduation.certificate.team', { team: teamName, defaultValue: `소속 팀: ${teamName}` }), centerX, y);

    // Date
    y += 28;
    ctx.fillStyle = '#B45309';
    ctx.font = '12px sans-serif';
    ctx.fillText(today, centerX, y);

    // Issuer
    y += 28;
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(t('school.graduation.certificate.issuer', { org: userOrg, defaultValue: `${userOrg} x 에이머스에듀` }), centerX, y);

    return canvas;
  };

  const handleDownloadPng = async () => {
    try {
      const canvas = await renderCanvas();
      if (!canvas) {
        alert('다운로드를 지원하지 않는 환경입니다.');
        return;
      }
      const link = document.createElement('a');
      link.download = `깍두기학교_졸업증서_${userName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Certificate PNG download failed:', err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const canvas = await renderCanvas();
      if (!canvas) {
        alert('다운로드를 지원하지 않는 환경입니다.');
        return;
      }
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit A4 with margins
      const margin = 20;
      const availableWidth = pageWidth - margin * 2;
      const aspectRatio = canvas.height / canvas.width;
      const imgWidth = availableWidth;
      const imgHeight = imgWidth * aspectRatio;

      // Center vertically
      const yOffset = Math.max(margin, (pageHeight - imgHeight) / 2);

      pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
      pdf.save(`깍두기학교_졸업증서_${userName}.pdf`);
    } catch (err) {
      console.error('Certificate PDF download failed:', err);
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
            style={{ minHeight: 480 }}
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
            <p className="text-sm text-amber-700 leading-relaxed mb-5">
              {t('school.graduation.certificate.body', '위 학생은 깍두기 학교 마케팅 학과 예비 마케터 교실의 전 과정을 성실히 이수하고 소정의 졸업 요건을 충족하였기에 이 증서를 수여합니다.')}
            </p>

            {/* 이수 과정 */}
            <div className="mb-4">
              <p className="text-xs font-bold text-amber-800 mb-2">
                {t('school.graduation.certificate.curriculum', '이수 과정')}
              </p>
              <div className="text-xs text-amber-600 space-y-1">
                {Array.from({ length: Math.ceil(CURRICULUM.length / 2) }, (_, i) => (
                  <p key={i}>
                    {CURRICULUM[i * 2]}
                    {CURRICULUM[i * 2 + 1] && ` · ${CURRICULUM[i * 2 + 1]}`}
                  </p>
                ))}
              </div>
            </div>

            {/* 소속 팀 */}
            <p className="text-sm font-bold text-amber-800 mb-3">
              {t('school.graduation.certificate.team', { team: teamName, defaultValue: `소속 팀: ${teamName}` })}
            </p>

            {/* 날짜 */}
            <p className="text-xs text-amber-500 mb-3">{today}</p>

            {/* 발급자 (issuer) */}
            <div className="flex items-center justify-center gap-2">
              <KkakdugiMascot size={20} />
              <span className="text-sm font-bold text-amber-800">
                {t('school.graduation.certificate.issuer', { org: userOrg, defaultValue: `${userOrg} x 에이머스에듀` })}
              </span>
            </div>
          </div>

          {/* 다운로드 버튼들 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDownloadPng}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              PNG
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              {t('school.graduation.certificate.downloadPdf', 'PDF 다운로드')}
            </button>
          </div>

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
