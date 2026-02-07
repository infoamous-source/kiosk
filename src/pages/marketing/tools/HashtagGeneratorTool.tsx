import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Hash, Copy, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchHashtags } from '../../../data/marketing/hashtagMocks';
import type { HashtagGroup } from '../../../types/marketing';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

export default function HashtagGeneratorTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<HashtagGroup[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    const found = searchHashtags(keyword.trim());
    setResults(found);
    setHasSearched(true);

    logPortfolioActivity(
      'hashtag-generator', 'mk-05', 'Hashtag Generator',
      { keyword: keyword.trim() },
      { groups: found.length, totalHashtags: found.reduce((a, g) => a + g.hashtags.length, 0) },
      true
    );
  };

  const allHashtags = results.flatMap((g) => g.hashtags);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(allHashtags.join(' '));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyTag = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    } catch {
      // ignore
    }
  };

  const suggestedKeywords = ['맛집', '카페', '패션', '뷰티', '여행', '마케팅', '창업'];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-6 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('marketing.tools.back', '뒤로 가기')}</span>
      </button>

      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Hash className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('marketing.tools.hashtagGenerator.title', '해시태그 생성기')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.hashtagGenerator.description', '키워드에 맞는 해시태그를 추천받으세요')}</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="키워드를 입력하세요 (예: 맛집, 카페)"
          className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={!keyword.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            keyword.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Keywords */}
      {!hasSearched && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">추천 키워드</p>
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setKeyword(kw);
                  const found = searchHashtags(kw);
                  setResults(found);
                  setHasSearched(true);
                  logPortfolioActivity(
                    'hashtag-generator', 'mk-05', 'Hashtag Generator',
                    { keyword: kw },
                    { groups: found.length },
                    true
                  );
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && results.length > 0 && (
        <div>
          {/* Copy All Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{allHashtags.length}개의 해시태그</p>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              {copiedAll ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  전체 복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  전체 복사
                </>
              )}
            </button>
          </div>

          {/* Hashtag Groups */}
          {results.map((group, gIdx) => (
            <div key={gIdx} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  group.category === 'trending'
                    ? 'bg-red-50 text-red-600'
                    : group.category === 'niche'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  {group.category === 'trending' ? '🔥 인기' : group.category === 'niche' ? '💎 니치' : '🌐 일반'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.hashtags.map((tag, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => handleCopyTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      copiedTag === tag
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {copiedTag === tag ? '✓ 복사됨' : tag}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Usage Tip */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-yellow-800">
              💡 <strong>팁:</strong> 인기 해시태그 3~5개 + 니치 해시태그 5~7개를 조합하면 효과가 좋아요!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
