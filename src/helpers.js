const scrollToTop = (el, paddingTop = 76) => {
  document.body.scrollTop = el.offsetTop - paddingTop;
};

export { scrollToTop };
