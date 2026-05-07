'use client';

import { useState } from 'react';
import Image from 'next/image';

const SectionCard = ({ section, index }) => {
  const IGNORED_KEYS = ['id', '__component', 'type', 'image', 'buttons'];

  return (
    <div className="section-card">
      <div className="section-card-header">
        <span className="section-type">
          {section.type ?? section.__component ?? `Section ${index + 1}`}
        </span>
        {section.id && <span className="card-id">#{section.id}</span>}
      </div>

      {section.image?.url && (
        <div className="section-image-wrapper">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${section.image.url}`}
            alt={section.image.alternativeText ?? section.heading ?? 'Section image'}
            width={section.image.width ?? 600}
            height={section.image.height ?? 400}
            className="section-image"
          />
        </div>
      )}

      <div className="section-fields">
        {Object.entries(section)
          .filter(([key, value]) =>
            !IGNORED_KEYS.includes(key) &&
            value !== null &&
            value !== undefined &&
            value !== '' &&
            !Array.isArray(value)
          )
          .map(([key, value]) => (
            <div key={key} className="section-field">
              <span className="section-field-key">{key}</span>
              <span className="section-field-value">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
      </div>

      {section.buttons?.length > 0 && (
        <div className="section-buttons">
          {section.buttons.map((btn) => (
            <a
              key={btn.id}
              href={btn.url ?? '#'}
              target={btn.openInNewTab ? '_blank' : '_self'}
              rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
              className={`section-btn section-btn--${btn.style ?? 'default'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {btn.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const PageCard = ({ page }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`card ${open ? 'card--open' : ''}`} onClick={() => setOpen(!open)}>

      {page.video?.url && (
        <div className="card-video-wrapper" onClick={(e) => e.stopPropagation()}>
          <video
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${page.video.url}`}
            controls
            className="card-video"
          />
        </div>
      )}

      <div className="card-header">
        <span className="card-title">{page.title}</span>
        <div className="card-header-right">
          <span className="card-id">#{page.id}</span>
          <span className="card-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      <p className="card-meta">
        {page.metaDescription || <em>No description</em>}
      </p>

      <div className="card-badges">
        <span className="badge badge-sections">
          {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
        </span>
        {page.video && (
          <span className="badge badge-video">▶ Video</span>
        )}
        {page.publishedAt && (
          <span className="badge badge-published">✓ Published</span>
        )}
      </div>

      <hr className="card-divider" />

      <div className="card-footer">
        <span>
          <strong>Slug:</strong>{' '}
          {page.slug ?? <span className="slug-missing">—</span>}
        </span>
        <span>
          <strong>Created:</strong>{' '}
          {new Date(page.createdAt).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
        <span>
          <strong>Updated:</strong>{' '}
          {new Date(page.updatedAt).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
        <span title={page.documentId}>
          <strong>Doc ID:</strong> {page.documentId.slice(0, 12)}…
        </span>
      </div>

      {open && (
        <div className="card-sections" onClick={(e) => e.stopPropagation()}>
          <hr className="card-divider" />
          <p className="sections-heading">Sections</p>
          {page.sections.length === 0 ? (
            <p className="no-sections">No sections on this page.</p>
          ) : (
            <div className="sections-list">
              {page.sections.map((section, index) => (
                <SectionCard key={section.id ?? index} section={section} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageCard;
