/**
 * Small, auth-only interaction-state controller.
 * The live regions are present in the DOM before requests begin; this helper
 * never guesses a network outcome or uses a timer as proof of success.
 */
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function createAuthFeedback(form: HTMLFormElement | null, id: string) {
  const status = document.getElementById(`${id}-status`);
  const alert = document.getElementById(`${id}-error`);
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]') ?? null;
  const idleLabel = submit?.textContent || '';
  let busy = false;
  let invalidField: Field | null = null;
  let previousDescription: string | null = null;

  const clearFieldError = () => {
    if (!invalidField) return;
    invalidField.removeAttribute('aria-invalid');
    if (previousDescription === null) invalidField.removeAttribute('aria-describedby');
    else invalidField.setAttribute('aria-describedby', previousDescription);
    invalidField = null;
    previousDescription = null;
  };

  const clear = () => {
    clearFieldError();
    if (status) status.textContent = '';
    if (alert) alert.textContent = '';
    if (form && !busy) form.dataset.authState = 'idle';
  };

  const show = (text: string, kind: 'info' | 'success' | 'error' = 'info', field?: Field) => {
    clear();
    if (kind === 'error') {
      if (alert) alert.textContent = text;
      if (field && alert) {
        invalidField = field;
        previousDescription = field.getAttribute('aria-describedby');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby',
          [previousDescription, alert.id].filter(Boolean).join(' '));
        field.focus();
      }
    } else if (status) {
      status.textContent = text;
    }
    if (form) form.dataset.authState = kind === 'info' ? 'idle' : kind;
  };

  form?.addEventListener('input', (event) => {
    if (event.target === invalidField) clear();
  });

  async function run(pendingLabel: string, action: () => Promise<void>, unexpectedError: string) {
    if (!form || busy) return;
    busy = true; // synchronous guard, even before the first await
    clear();
    if (status) status.textContent = 'Sedang memproses permintaan…';
    form.dataset.authState = 'loading';
    form.setAttribute('aria-busy', 'true');
    if (submit) {
      submit.disabled = true;
      submit.textContent = pendingLabel;
    }
    try {
      await action();
    } catch {
      show(unexpectedError, 'error');
    } finally {
      busy = false;
      form.setAttribute('aria-busy', 'false');
      if (submit) {
        submit.disabled = false;
        submit.textContent = idleLabel;
      }
      if (form.dataset.authState === 'loading') form.dataset.authState = 'idle';
    }
  }

  return { show, clear, run };
}
