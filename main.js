// Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Example: Fetch all barbers
async function fetchBarbers() {
    const res = await fetch('http://localhost:3000/barbers');
    const barbers = await res.json();

    const container = document.getElementById('barbers-container');
    container.innerHTML = '';

    barbers.forEach(barber => {
        const div = document.createElement('div');
        div.className = 'barber-card';
        div.innerHTML = `
            <h3>${barber.name} (${barber.status})</h3>
            <p><strong>Skills:</strong> ${barber.skills}</p>
            <p><strong>Services:</strong> ${barber.services}</p>
            <p><strong>Phone:</strong> ${barber.phone}</p>
            <a href="barber.html?id=${barber.id}"><button>Book Now</button></a>
        `;
        container.appendChild(div);
    });
}

// Call fetchBarbers() if on barbers.html
if(document.getElementById('barbers-container')) {
    fetchBarbers();
}
