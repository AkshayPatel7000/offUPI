import { useState } from 'react';
import {
  ChevronRight,
  X,
  Search,
} from 'lucide-react';
import { CarrierLogo } from '../components/CarrierLogo';
import { PAYMENT_GUIDES, HELP_ARTICLES } from '../lib/help/articles';

export function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const filteredArticles = HELP_ARTICLES.filter((art) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
  });

  return (
    <div className="screen-container">
      {/* Header */}
      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
        Help & Guide
      </h2>

      {/* Search Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          marginBottom: 16,
          border: '1px solid var(--border-light)',
        }}
      >
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help articles..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 13,
            color: 'var(--text-primary)',
            width: '100%',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Payment Guides */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          Payment guides
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => setSelectedGuide(PAYMENT_GUIDES[0])}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CarrierLogo carrierId="airtel" size={34} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Airtel – USSD (*99#)
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Step by step guide with screenshots
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedGuide(PAYMENT_GUIDES[1])}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CarrierLogo carrierId="jio" size={34} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Jio – 124PAY (Call)
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Step by step guide with voice instructions
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* General Help Articles */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          General help
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredArticles.map((art) => (
            <button
              key={art.id}
              type="button"
              onClick={() => setSelectedArticle(art)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {art.title}
              </span>
              <ChevronRight size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px 20px 0 0',
              padding: '18px 20px 24px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
                Offline Help
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{
                  border: 'none',
                  background: 'var(--bg-card-soft)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              {selectedArticle.title}
            </h3>

            <div
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                whiteSpace: 'pre-line',
                backgroundColor: 'var(--bg-card-soft)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
              }}
            >
              {selectedArticle.content}
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setSelectedArticle(null)}
              style={{ height: 42, fontSize: 13.5 }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px 20px 0 0',
              padding: '18px 20px 24px',
              maxHeight: '82vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-blue)' }}>
                {selectedGuide.badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                style={{
                  border: 'none',
                  background: 'var(--bg-card-soft)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {selectedGuide.title}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              {selectedGuide.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {selectedGuide.steps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    backgroundColor: 'var(--bg-card-soft)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {s.step}. {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {s.description}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setSelectedGuide(null)}
              style={{ height: 42, fontSize: 13.5 }}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
