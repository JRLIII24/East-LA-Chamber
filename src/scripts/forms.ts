/**
 * Progressive enhancement for all Web3Forms forms ([data-form]).
 * Without JS the form still posts normally and Web3Forms shows its own thank-you page.
 */
const forms = document.querySelectorAll<HTMLFormElement>('form[data-form]');

for (const form of forms) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const key = form.querySelector<HTMLInputElement>('input[name="access_key"]')?.value;

  form.addEventListener('submit', async (e) => {
    if (!key) {
      e.preventDefault();
      if (status) status.textContent = 'This form isn’t connected yet. Please email us instead.';
      return;
    }
    e.preventDefault();
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], input[type="submit"]');
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (status) status.textContent = form.dataset.success ?? 'Thanks — we’ve got it.';
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      if (status) status.textContent = 'Something went wrong. Please try again or email us.';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}
