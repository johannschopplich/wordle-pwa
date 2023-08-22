;((root) => {
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
  const isMobile = matchMedia('(hover: none)').matches
  const themeSetting = localStorage.getItem('app.color-scheme')
  if (
    themeSetting === 'dark' ||
    (isMobile && prefersDark && themeSetting !== 'light')
  ) {
    root.classList.toggle('dark', true)
  }
})(document.documentElement)
