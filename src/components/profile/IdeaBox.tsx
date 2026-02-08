import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Package,
} from 'lucide-react';
import {
  type IdeaItem,
  type IdeaItemType,
  loadIdeaBox,
  removeIdeaItem,
  ideaTypeIcons,
} from '../../types/ideaBox';

interface IdeaBoxProps {
  userId: string;
}

const typeFilters: (IdeaItemType | 'all')[] = ['all', 'persona', 'usp', 'copy', 'hashtag', 'color', 'roi', 'ad', 'other'];

export default function IdeaBox({ userId }: IdeaBoxProps) {
  const { t } = useTranslation('common');
  const [items, setItems] = useState<IdeaItem[]>([]);
  const [filterType, setFilterType] = useState<IdeaItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadIdeaBox(userId));
  }, [userId]);

  const handleDelete = (itemId: string) => {
    removeIdeaItem(userId, itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleCopy = async (item: IdeaItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.preview && item.preview.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getTypeLabel = (type: IdeaItemType): string => {
    const labelMap: Record<IdeaItemType, string> = {
      persona: t('profile.ideaBox.typePersona', '페르소나'),
      usp: t('profile.ideaBox.typeUSP', 'USP'),
      copy: t('profile.ideaBox.typeCopy', '카피'),
      hashtag: t('profile.ideaBox.typeHashtag', '해시태그'),
      color: t('profile.ideaBox.typeColor', '컬러'),
      roi: t('profile.ideaBox.typeROI', 'ROI'),
      ad: t('profile.ideaBox.typeAd', '광고'),
      other: t('profile.ideaBox.typeOther', '기타'),
    };
    return labelMap[type] || type;
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {t('profile.ideaBox.title', '아이디어 상자')}
          </h2>
          <span className="text-sm text-gray-400 ml-auto">
            {items.length}{t('profile.ideaBox.countUnit', '개')}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {t('profile.ideaBox.description', '마케팅 도구에서 만든 결과물을 모아두는 곳이에요. 나중에 다시 보고 활용할 수 있어요!')}
        </p>
      </div>

      {/* 필터 + 검색 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('profile.ideaBox.searchPlaceholder', '검색...')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {typeFilters.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {type === 'all'
                ? t('profile.ideaBox.filterAll', '전체')
                : `${ideaTypeIcons[type]} ${getTypeLabel(type)}`
              }
            </button>
          ))}
        </div>
      </div>

      {/* 아이템 목록 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {items.length === 0
              ? t('profile.ideaBox.empty', '아직 저장된 아이디어가 없어요.\n마케팅 도구를 사용하고 결과를 저장해보세요!')
              : t('profile.ideaBox.noResults', '검색 결과가 없습니다.')
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              {/* 아이템 헤더 */}
              <div className="flex items-start gap-3">
                <span className="text-xl">{ideaTypeIcons[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 shrink-0">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.preview || item.content.slice(0, 100)}
                  </p>

                  {/* 펼쳐진 내용 */}
                  {expandedId === item.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {item.content}
                      </pre>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t('profile.ideaBox.copy', '복사')}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('profile.ideaBox.delete', '삭제')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 날짜 */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {item.toolId && (
                  <span className="text-xs text-gray-400">
                    {item.toolId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
