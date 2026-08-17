function parseRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('/').filter(Boolean);

  if (path.length === 0) return { name: 'home' };

  if (path[0] === 'unidade' && path[1] && path[2] === 'licao' && path[3] && path.length === 4) {
    return { name: 'lesson', unitId: path[1], lessonId: path[3] };
  }

  if (path[0] === 'unidade' && path[1] && path[2] === 'verificacao' && path.length === 3) {
    return { name: 'verification', unitId: path[1] };
  }

  if (path[0] === 'unidade' && path[1] && path.length === 2) {
    return { name: 'unit', unitId: path[1] };
  }

  return { name: 'not-found' };
}

export function initRouter(onRoute) {
  const dispatch = () => onRoute(parseRoute());

  window.addEventListener('hashchange', dispatch);

  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    dispatch();
  }

  return () => window.removeEventListener('hashchange', dispatch);
}
