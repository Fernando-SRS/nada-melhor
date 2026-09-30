(() => {
  const dialog = document.querySelector('.shirt-dialog');
  const status = dialog.querySelector('.viewer-status');
  let viewer, loading, generation = 0, opener, selection = Promise.resolve();
  const close = () => dialog.close();
  dialog.querySelector('.viewer-close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) close(); } });
  dialog.addEventListener('close', () => { generation++; document.documentElement.classList.remove('viewer-open'); viewer?.suspend(); opener?.focus(); });
  document.querySelectorAll('[data-shirt]').forEach(button => button.addEventListener('click', async () => {
    opener = button; const request = ++generation;
    dialog.querySelector('#shirt-title').textContent = button.dataset.shirt === 'brown' ? 'Camiseta marrom' : 'Camiseta clara';
    status.hidden = false; status.textContent = 'Preparando sua peça…';
    dialog.querySelector('.viewer-canvas').style.visibility = 'hidden';
    dialog.showModal(); document.documentElement.classList.add('viewer-open');
    try {
      loading ||= import('./shirt-3d.js');
      const module = await loading;
      viewer ||= module.createViewer(dialog);
      if (request !== generation) return;
      selection = selection.catch(() => {}).then(() => viewer.setColor(button.dataset.shirt));
      await selection;
      if (request !== generation) { viewer.suspend(); return; }
      status.hidden = true; dialog.querySelector('.viewer-canvas').style.visibility = 'visible'; viewer.resume();
    } catch (error) {
      if (request !== generation) return;
      loading = null; status.textContent = 'Não foi possível carregar o 3D neste navegador. Feche e tente novamente em um navegador com WebGL.';
      console.error('3D viewer unavailable', error);
    }
  }));
})();
