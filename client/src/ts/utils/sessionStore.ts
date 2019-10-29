window.onbeforeunload = () => {
  sessionStorage.setItem('origin', window.location.href)
}

window.onload = () => {
  if (window.location.href === sessionStorage.getItem('origin')) {
    sessionStorage.clear()
  }
}
