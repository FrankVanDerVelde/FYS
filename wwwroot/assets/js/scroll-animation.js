// Selects all the rows
const rows = document.querySelectorAll('.row')

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("show-row", entry.isIntersecting)
        })
    },
    {
        // run every time visibility passes 20% (will not show a glitch effect from other rows while scrolling)
        threshold:0.2
    }
)

rows.forEach(row => {
    // targeting the rows for the observer 
  observer.observe(row)
})