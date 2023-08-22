;((root) => {
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
  const themeSetting = localStorage.getItem('app.color-scheme')
  if (themeSetting === 'dark' || (prefersDark && themeSetting !== 'light')) {
    root.classList.toggle('dark', true)
  }
})(document.documentElement)
