const scrollToTop = (el, paddingTop = 64) => {
  window.scrollTo(0, el.offsetTop - paddingTop);
};

export { scrollToTop };
