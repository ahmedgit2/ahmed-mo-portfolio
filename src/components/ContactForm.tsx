import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ahmedmoh6000@gmail.com';
const WHATSAPP_NUMBER = '201009014257'; // +20 100 901 4257, no leading '+' for wa.me
const MAX_FILES = 5;

type Status = 'idle' | 'sending' | 'sent' | 'error';

function fileKey(f: File) {
  return `${f.name}_${f.size}_${f.lastModified}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // A native <input multiple> replaces its whole selection every time the
  // picker reopens — so newly picked files are merged into our own list
  // instead, deduped by name+size+mtime, with a delete button per file.
  function handleFilesPicked(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ''; // let picking the same file again re-trigger onChange
    setFiles((prev) => {
      const existingKeys = new Set(prev.map(fileKey));
      const merged = [...prev];
      for (const f of picked) {
        if (!existingKeys.has(fileKey(f))) {
          merged.push(f);
          existingKeys.add(fileKey(f));
        }
      }
      return merged.slice(0, MAX_FILES);
    });
  }

  function removeFile(key: string) {
    setFiles((prev) => prev.filter((f) => fileKey(f) !== key));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — real visitors never fill this in; bots usually do.
    if (data.get('_honey')) return;

    // The visible file input is just a picker trigger (see handleFilesPicked) —
    // the real, deduped list lives in `files` state, so send that instead of
    // whatever FormData(form) auto-collected from the input itself.
    data.delete('attachment');
    files.forEach((f) => data.append('attachment', f));

    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('sent');
      form.reset();
      setFiles([]);
    } catch {
      setStatus('error');
    }
  }

  const waText = encodeURIComponent("Hi Ahmed — found your portfolio, let's talk.");

  return (
    <div className="contact-form-block">
      {status === 'sent' ? (
        <p className="contact-form-status success">{t('contact.successMessage')}</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Honeypot field — hidden from real users via CSS, not a native 'hidden' input bots skip. */}
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />
          <input type="hidden" name="_subject" value="New message from your portfolio" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />

          <input type="text" name="name" placeholder={t('contact.namePlaceholder')} required />
          <input type="email" name="email" placeholder={t('contact.emailPlaceholder')} required />
          <textarea name="message" rows={4} placeholder={t('contact.messagePlaceholder')} required />

          <div className="file-field">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.zip"
              onChange={handleFilesPicked}
              className="file-field-input"
              id="attachment-input"
            />
            <label htmlFor="attachment-input" className="file-field-trigger">
              {t('contact.attachmentLabel')}
            </label>

            {files.length > 0 && (
              <ul className="file-chip-list">
                {files.map((f) => {
                  const key = fileKey(f);
                  return (
                    <li className="file-chip" key={key}>
                      <span className="file-chip-name">{f.name}</span>
                      <span className="file-chip-size">{formatSize(f.size)}</span>
                      <button
                        type="button"
                        className="file-chip-remove"
                        aria-label={t('contact.removeFileAria')}
                        onClick={() => removeFile(key)}
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? t('contact.sendingButton') : t('contact.sendButton')}
          </button>

          {status === 'error' && <p className="contact-form-status error">{t('contact.errorMessage')}</p>}
        </form>
      )}

      <div className="contact-or">
        <span className="contact-or-line" />
        <span>{t('contact.orDivider')}</span>
        <span className="contact-or-line" />
      </div>

      <a
        className="btn btn-ghost whatsapp-btn"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
        target="_blank"
        rel="noopener"
      >
        {t('contact.whatsappCta')}
      </a>
    </div>
  );
}
