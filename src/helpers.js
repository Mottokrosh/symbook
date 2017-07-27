const scrollToTop = (el, paddingTop = 16) => {
  document.body.scrollTop = el.offsetTop - paddingTop;
};

export { scrollToTop };
