import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

/** Inject Google Fonts for certificate serif typography */
function ensureCertFonts() {
  if (document.getElementById('cert-fonts')) return;
  const link = document.createElement('link');
  link.id = 'cert-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;600;700&display=swap';
  document.head.appendChild(link);
}

/* AMOUS EDU electronic seal */
function AmousSeal({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="44" stroke="#c0392b" strokeWidth="3" fill="none" opacity="0.75" />
      <circle cx="50" cy="50" r="38" stroke="#c0392b" strokeWidth="0.8" fill="none" opacity="0.4" />
      <text x="50" y="38" textAnchor="middle" fontSize="11" fontFamily="'Cormorant Garamond', serif" fill="#c0392b" opacity="0.8" fontWeight="700" letterSpacing="1.5">AMOUS</text>
      <text x="50" y="53" textAnchor="middle" fontSize="13" fontFamily="'Cormorant Garamond', serif" fill="#c0392b" opacity="0.8" fontWeight="700" letterSpacing="2">EDU</text>
      <line x1="22" y1="58" x2="78" y2="58" stroke="#c0392b" strokeWidth="0.5" opacity="0.35" />
      <text x="50" y="70" textAnchor="middle" fontSize="7" fontFamily="'Noto Serif KR', serif" fill="#c0392b" opacity="0.65" letterSpacing="3">에이머스교육</text>
      <text x="50" y="80" textAnchor="middle" fontSize="5.5" fontFamily="'Cormorant Garamond', serif" fill="#c0392b" opacity="0.5" letterSpacing="1.5">CONSULTING</text>
    </svg>
  );
}

export default function GraduationCertificate({ userName, userOrg, teamName, onClose }: GraduationCertificateProps) {
  const { t } = useTranslation('common');
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => { ensureCertFonts(); }, []);

  const now = new Date();
  const todayFormatted = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;
  const certNumber = `SGC-${now.getFullYear()}-MK-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  // Spaced name for formal look
  const spacedName = userName.split('').join(' ');

  const renderToCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!certRef.current) return null;
    return html2canvas(certRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#fffef7',
      logging: false,
    });
  };

  const handleDownloadPng = async () => {
    try {
      const canvas = await renderToCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `수료증_${userName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Certificate PNG download failed:', err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const canvas = await renderToCanvas();
      if (!canvas) return;
      const imgData = canvas.toDataURL('image/png');
      // A4 landscape to match certificate aspect ratio
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const aspectRatio = canvas.height / canvas.width;
      let imgWidth = availableWidth;
      let imgHeight = imgWidth * aspectRatio;
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = imgHeight / aspectRatio;
      }
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(`수료증_${userName}.pdf`);
    } catch (err) {
      console.error('Certificate PDF download failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[520px] flex flex-col items-center">
        {/* 닫기 */}
        <div className="w-full flex justify-end mb-2">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* ─── Certificate Frame ─── */}
        <div
          ref={certRef}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.414 / 1',
            background: '#fffef7',
            fontFamily: "'Noto Serif KR', serif",
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.3)',
          }}
        >
          {/* Triple borders */}
          <div style={{ position: 'absolute', inset: 14, border: '2px solid #b8942d', pointerEvents: 'none', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 19, border: '1px solid #c9a96e', pointerEvents: 'none', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 24, border: '0.5px solid rgba(201,169,110,0.4)', pointerEvents: 'none', zIndex: 2 }} />

          {/* Corner ornaments */}
          <div style={{ position: 'absolute', top: 11, left: 11, width: 48, height: 48, zIndex: 3, pointerEvents: 'none' }}>
            <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
              <path d="M4 4 L4 20 Q4 4 20 4 Z" fill="#b8942d" opacity="0.6" />
              <path d="M8 8 L8 28 Q8 8 28 8" stroke="#c9a96e" strokeWidth="0.5" fill="none" />
              <path d="M4 30 Q10 18 30 4" stroke="#c9a96e" strokeWidth="0.3" fill="none" opacity="0.5" />
              <circle cx="10" cy="10" r="2" fill="#c9a96e" opacity="0.4" />
            </svg>
          </div>
          <div style={{ position: 'absolute', top: 11, right: 11, width: 48, height: 48, zIndex: 3, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
            <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
              <path d="M4 4 L4 20 Q4 4 20 4 Z" fill="#b8942d" opacity="0.6" />
              <path d="M8 8 L8 28 Q8 8 28 8" stroke="#c9a96e" strokeWidth="0.5" fill="none" />
              <path d="M4 30 Q10 18 30 4" stroke="#c9a96e" strokeWidth="0.3" fill="none" opacity="0.5" />
              <circle cx="10" cy="10" r="2" fill="#c9a96e" opacity="0.4" />
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: 11, left: 11, width: 48, height: 48, zIndex: 3, pointerEvents: 'none', transform: 'scaleY(-1)' }}>
            <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
              <path d="M4 4 L4 20 Q4 4 20 4 Z" fill="#b8942d" opacity="0.6" />
              <path d="M8 8 L8 28 Q8 8 28 8" stroke="#c9a96e" strokeWidth="0.5" fill="none" />
              <path d="M4 30 Q10 18 30 4" stroke="#c9a96e" strokeWidth="0.3" fill="none" opacity="0.5" />
              <circle cx="10" cy="10" r="2" fill="#c9a96e" opacity="0.4" />
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: 11, right: 11, width: 48, height: 48, zIndex: 3, pointerEvents: 'none', transform: 'scale(-1,-1)' }}>
            <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
              <path d="M4 4 L4 20 Q4 4 20 4 Z" fill="#b8942d" opacity="0.6" />
              <path d="M8 8 L8 28 Q8 8 28 8" stroke="#c9a96e" strokeWidth="0.5" fill="none" />
              <path d="M4 30 Q10 18 30 4" stroke="#c9a96e" strokeWidth="0.3" fill="none" opacity="0.5" />
              <circle cx="10" cy="10" r="2" fill="#c9a96e" opacity="0.4" />
            </svg>
          </div>

          {/* Watermark seal */}
          <svg
            viewBox="0 0 200 200"
            fill="none"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 220, height: 220, opacity: 0.04, zIndex: 0, pointerEvents: 'none' }}
          >
            <circle cx="100" cy="100" r="90" stroke="#b8942d" strokeWidth="2" fill="none" />
            <circle cx="100" cy="100" r="82" stroke="#b8942d" strokeWidth="0.5" fill="none" />
            <circle cx="100" cy="100" r="75" stroke="#b8942d" strokeWidth="1" fill="none" />
            <path d="M100 25 L106 45 L125 45 L110 55 L116 75 L100 63 L84 75 L90 55 L75 45 L94 45 Z" fill="#b8942d" opacity="0.5" />
            <text x="100" y="115" textAnchor="middle" fontSize="14" fontFamily="serif" fill="#b8942d" letterSpacing="4">AMOUS EDU</text>
          </svg>

          {/* Certificate number */}
          <div style={{ position: 'absolute', top: 28, left: 40, fontSize: 7, color: '#bbb09a', letterSpacing: 1, zIndex: 5 }}>
            No. {certNumber}
          </div>

          {/* ─── Content ─── */}
          <div
            style={{
              position: 'relative',
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '40px 48px',
              textAlign: 'center',
            }}
          >
            {/* Title */}
            <div style={{ fontSize: 36, fontWeight: 900, color: '#2c2418', letterSpacing: 14, marginBottom: 4, textShadow: '0 1px 0 rgba(201,169,110,0.2)' }}>
              수 료 증
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: '#b8942d', letterSpacing: 8, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 20 }}>
              Certificate of Completion
            </div>

            {/* Divider */}
            <div style={{ width: 180, height: 1, background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)', marginBottom: 16 }} />

            {/* Name */}
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1408', padding: '2px 24px 6px', borderBottom: '2px solid #b8942d', letterSpacing: 8, marginBottom: 4, minWidth: 200, display: 'inline-block' }}>
              {spacedName}
            </div>

            {/* Body */}
            <div style={{ fontSize: 10, color: '#7a6b52', lineHeight: 1.8, marginTop: 12, letterSpacing: 0.5 }}>
              하기의 사람은 {userOrg || '깍두기 학교'}가 주관하는 교육과정을
            </div>
            <div style={{ fontSize: 10, color: '#7a6b52', lineHeight: 1.8, letterSpacing: 0.5, marginBottom: 8 }}>
              성실히 이수하였기에 이 증서를 수여합니다.
            </div>

            {/* Course */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2c2418', marginBottom: 6 }}>
              예비 마케터 양성과정 (6차시)
            </div>

            {/* Curriculum list */}
            <div style={{ fontSize: 8, color: '#7a6b52', lineHeight: 1.8, letterSpacing: 0.3, marginBottom: 4 }}>
              {Array.from({ length: Math.ceil(CURRICULUM.length / 2) }, (_, i) => (
                <div key={i}>
                  {CURRICULUM[i * 2]}{CURRICULUM[i * 2 + 1] ? ` · ${CURRICULUM[i * 2 + 1]}` : ''}
                </div>
              ))}
            </div>

            {/* Team */}
            {teamName && (
              <div style={{ fontSize: 9, color: '#5a4d3a', letterSpacing: 1, marginBottom: 2 }}>
                소속 팀: {teamName}
              </div>
            )}

            {/* Footer: date + seal + signatory */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 400,
                marginTop: 'auto',
                paddingTop: 8,
              }}
            >
              {/* Date */}
              <div style={{ fontSize: 9, color: '#7a6b52', letterSpacing: 1, textAlign: 'left' }}>
                발급일자 : {todayFormatted}
              </div>

              {/* Seal + signatory */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 8, color: '#7a6b52', letterSpacing: 1.5 }}>
                    {userOrg || '깍두기 학교'} X 에이머스교육컨설팅
                  </div>
                </div>
                <AmousSeal size={52} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Download Buttons ─── */}
        <div className="flex gap-3 mt-5 w-full">
          <button
            onClick={handleDownloadPng}
            className="flex-1 py-3 rounded flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: '#b8942d', color: '#fff', fontFamily: "'Noto Serif KR', serif", fontSize: 13, letterSpacing: 2, boxShadow: '0 4px 16px rgba(184,148,45,0.3)' }}
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex-1 py-3 rounded flex items-center justify-center gap-2 transition-all"
            style={{ background: 'transparent', color: '#c9a96e', border: '1px solid #c9a96e', fontFamily: "'Noto Serif KR', serif", fontSize: 13, letterSpacing: 2 }}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 py-2 text-sm transition-colors"
          style={{ color: 'rgba(201,169,110,0.6)', letterSpacing: 2 }}
        >
          {t('common.close', '닫기')}
        </button>
      </div>
    </div>
  );
}
