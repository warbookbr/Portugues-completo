function statusCopy(state) {
  if (state.status === 'SYNCED') return `Sincronizado${state.login ? ` como ${state.login}` : ''}.`;
  if (state.status === 'LOCAL_CHANGES') return 'Alterações salvas neste navegador aguardam sincronização com o GitHub.';
  if (state.status === 'SYNCING') return 'Sincronizando com o GitHub…';
  if (state.status === 'CONFLICT_PRESERVED') return 'Sincronizado com conflito preservado. Nenhuma resposta foi descartada.';
  if (state.status === 'ERROR') return `Falha de sincronização: ${state.lastError || 'erro desconhecido'}`;
  return 'O progresso está apenas neste navegador até você conectar o GitHub.';
}

export function renderProgressSettings(root, { progressSyncService } = {}) {
  const state = progressSyncService?.getState?.() || { status: 'LOCAL_ONLY', connected: false };
  root.innerHTML = `
    <div class="settings-header">
      <div><button class="settings-back" type="button" data-settings-back>← Voltar</button><h2>Progresso</h2><p class="settings-subtitle">Sincronize o progresso acadêmico com um Gist da sua própria conta.</p></div>
    </div>
    <div class="sync-status" data-sync-status data-state="${state.status}">${statusCopy(state)}</div>
    <form data-github-connect>
      <div class="settings-row">
        <label for="githubProgressToken">Token GitHub</label>
        <input id="githubProgressToken" name="token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" ${state.connected ? 'disabled' : ''}>
        <small class="settings-help">Use uma credencial do seu próprio GitHub com permissão de usuário “Gists: write”. Ela fica somente nesta sessão do navegador e nunca é salva no Gist.</small>
      </div>
      <div class="settings-actions">
        ${state.connected
          ? '<button class="primary-button" type="button" data-sync-now>Sincronizar agora</button><button class="secondary-button" type="button" data-disconnect-github>Desconectar desta sessão</button>'
          : '<button class="primary-button" type="submit">Conectar e sincronizar</button>'}
      </div>
    </form>
    <div class="settings-note"><strong>Onde o progresso fica?</strong><p>O curso mantém uma cópia local para não perder trabalho quando a rede falha. A cópia sincronizada usa o arquivo <code>portugues-completo-progress.json</code> em um Gist da sua conta.</p></div>
  `;

  const form = root.querySelector('[data-github-connect]');
  const status = root.querySelector('[data-sync-status]');
  let busy = false;

  const refresh = next => {
    status.dataset.state = next.status;
    status.textContent = statusCopy(next);
  };
  const unsubscribe = progressSyncService?.subscribe?.(refresh) || (() => {});

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const token = new FormData(form).get('token')?.toString().trim();
    if (!token) { status.textContent = 'Informe o token GitHub para conectar.'; return; }
    busy = true;
    try {
      await progressSyncService.connect(token);
      unsubscribe();
      renderProgressSettings(root, { progressSyncService });
    } catch {
      refresh(progressSyncService.getState());
    } finally { busy = false; }
  });

  root.querySelector('[data-sync-now]')?.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    try { await progressSyncService.sync(); } catch { /* estado já é exposto pelo serviço */ }
    finally { busy = false; refresh(progressSyncService.getState()); }
  });

  root.querySelector('[data-disconnect-github]')?.addEventListener('click', () => {
    unsubscribe();
    progressSyncService.disconnect();
    renderProgressSettings(root, { progressSyncService });
  });

  return unsubscribe;
}
