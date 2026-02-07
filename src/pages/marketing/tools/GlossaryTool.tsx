import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { glossaryTerms, glossaryCategories } from '../../../data/marketing/glossary';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

export default function GlossaryTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.termKo.includes(searchQuery) ||
        term.easyExplanation.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleTermClick = (termId: string) => {
    logPortfolioActivity('glossary', 'mk-01', 'Marketing Glossary', { termId }, { viewed: true }, true);
  };

  const categoryLabels: Record<string, string> = {
    all: '전체',
    basic: '기초',
    digital: '디지털',
    sns: 'SNS',
    performance: '퍼포먼스',
    branding: '브랜딩',
    ai: 'AI',
  };

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
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('marketing.tools.glossary.title', '마케팅 용어 사전')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.glossary.description', '마케팅 용어를 쉽게 배워보세요')}</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('marketing.tools.glossary.searchPlaceholder', '용어를 검색하세요...')}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {glossaryCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[cat.id] || t(cat.labelKey, cat.id)}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredTerms.length}개의 용어
      </p>

      {/* Term Cards */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            onClick={() => handleTermClick(term.id)}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{term.termKo}</h3>
                <p className="text-sm text-blue-600">{term.term}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                {categoryLabels[term.category] || term.category}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed mt-3">{term.easyExplanation}</p>
            <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">{term.example}</p>
            </div>
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>검색 결과가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
