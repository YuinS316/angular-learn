export function onClickOutside(el: Element, cb: Function) {
  const fn = function (e: Event) {
    if (!el.contains(e.target as any)) {
      cb();
    }
  };
  document.addEventListener('click', fn);
  return function () {
    document.removeEventListener('click', fn);
  };
}
