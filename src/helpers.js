const scrollToTop = (el, paddingTop = 16) => {
  window.scrollTo(0, el.offsetTop - paddingTop);
};

export { scrollToTop };
