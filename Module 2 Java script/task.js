
console.log("Welcome to the Community Portal");
window.addEventListener('load', () => {
    alert("Community Portal is fully loaded!");
});

const eventName = "Summer Music Festival";
const eventDate = "2024-07-20";
let availableSeats = 100;

function updateSeats(change) {
    availableSeats += change;
    console.log(`Event: ${eventName} on ${eventDate}. Seats available: ${availableSeats}`);
}

const events = [
    { name: "Community Cleanup", date: "2024-06-15", seats: 0, category: "volunteer" },
    { name: "Summer Music Festival", date: "2024-07-20", seats: 100, category: "music" },
    { name: "Farmers Market", date: "2024-08-05", seats: 50, category: "shopping" }
];

function displayValidEvents() {
    const today = new Date().toISOString().split('T')[0];
    events.forEach(event => {
        try {
            if (new Date(event.date) >= new Date(today) && event.seats > 0) {
                console.log(`VALID: ${event.name}`);
            }
        } catch (error) {
            console.error(`Error processing event: ${event.name}`, error);
        }
    });
}


function createEventManager() {
    let totalRegistrations = 0;
    
    return {
        addEvent: (name, date, seats, category) => {
            events.push({ name, date, seats, category });
        },
        registerUser: (eventName) => {
            const event = events.find(e => e.name === eventName);
            if (event && event.seats > 0) {
                event.seats--;
                totalRegistrations++;
                return true;
            }
            return false;
        },
        filterEvents: (callback) => {
            return events.filter(callback);
        },
        getTotalRegistrations: () => totalRegistrations
    };
}

const eventManager = createEventManager();


class Event {
    constructor(name, date, seats, category) {
        this.name = name;
        this.date = date;
        this.seats = seats;
        this.category = category;
    }

    checkAvailability() {
        return this.seats > 0;
    }
}


function addNewEvent(name, date, seats, category) {
    events.push({ name, date, seats, category });
}

function getMusicEvents() {
    return events.filter(event => event.category === "music");
}

function formatEventNames() {
    return events.map(event => `${event.name} (${event.date})`);
}


function renderEvents() {
    const container = document.querySelector('#events-container');
    container.innerHTML = '';
    
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Date: ${event.date}</p>
            <p>Seats: ${event.seats}</p>
            <button class="register-btn" data-event="${event.name}">Register</button>
        `;
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Register button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('register-btn')) {
            const eventName = e.target.dataset.event;
            if (eventManager.registerUser(eventName)) {
                alert(`Registered for ${eventName} successfully!`);
                renderEvents();
            } else {
                alert(`Registration failed for ${eventName}`);
            }
        }
    });

    const categoryFilter = document.querySelector('#category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const filtered = eventManager.filterEvents(event => event.category === e.target.value);
            console.log("Filtered events:", filtered);
        });
    }

  
    const searchInput = document.querySelector('#event-search');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.toLowerCase();
                const results = events.filter(event => 
                    event.name.toLowerCase().includes(searchTerm)
                );
                console.log("Search results:", results);
            }
        });
    }
});

async function fetchEvents() {
    try {
        document.querySelector('#loading-spinner').style.display = 'block';
        const response = await fetch('https://mockapi.io/events');
        const data = await response.json();
        data.forEach(event => events.push(event));
        renderEvents();
    } catch (error) {
        console.error("Failed to fetch events:", error);
    } finally {
        document.querySelector('#loading-spinner').style.display = 'none';
    }
}

function addEventWithDefaults(name, date = new Date().toISOString().split('T')[0], seats = 50, category = 'general') {
    const newEvent = { name, date, seats, category };
    events.push(newEvent);
    return newEvent;
}

function processEvent({ name, date }) {
    console.log(`Processing ${name} on ${date}`);
}

const eventListCopy = [...events];


document.querySelector('#registration-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const eventName = form.elements['event'].value;

    if (!name || !email || !eventName) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await submitRegistration({ name, email, eventName });
        alert(`Registration successful: ${response.message}`);
        form.reset();
    } catch (error) {
        alert(`Registration failed: ${error.message}`);
    }
});

async function submitRegistration(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve({ message: "Thank you for registering!" });
            } else {
                reject(new Error("Server unavailable, please try later"));
            }
        }, 1000);
    });
}


async function postRegistration(data) {
    try {
        const response = await fetch('https://mockapi.io/registrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


function debugRegistration() {
    const form = document.querySelector('#registration-form');
    console.log("Form elements:", form.elements);
    
    form.addEventListener('submit', (e) => {
        console.log("Form submitted with values:", {
            name: e.target.elements['name'].value,
            email: e.target.elements['email'].value,
            event: e.target.elements['event'].value
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    displayValidEvents();
    updateSeats(0); 
});