// ===================================================
// Random Wealth Exchange Simulation
// Nischal Regmi
// Southasia Institute for History and Philosophy
// ===================================================

// -----------------------------
// Agent class
// -----------------------------

class Agent {

    constructor(id, initialWealth) {
        this.id = id;
        this.wealth = initialWealth;
    }

}

// -----------------------------
// Gini coefficient
// -----------------------------

function calculateGini(wealth) {

    let values = [...wealth].sort((a, b) => a - b);

    let total = values.reduce((a, b) => a + b, 0);

    if (total === 0)
        return 0;

    let n = values.length;

    let numerator = 0;

    for (let i = 0; i < n; i++) {
        numerator += (2 * (i + 1) - n - 1) * values[i];
    }

    return numerator / (n * total);

}

// -----------------------------
// Histogram
// -----------------------------

let histogramChart = null;

function drawHistogram(wealth) {

    if (histogramChart)
        histogramChart.destroy();

    const binWidth = 2;

    const maxWealth = Math.max(...wealth);

    const numberOfBins = Math.ceil(maxWealth / binWidth) + 1;

    let histogram = new Array(numberOfBins).fill(0);

    wealth.forEach(w => {
        histogram[Math.floor(w / binWidth)]++;
    });

    let labels = [];

    for (let i = 0; i < numberOfBins; i++)
        labels.push(i * binWidth);

    histogramChart = new Chart(

        document.getElementById("histogram"),

        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Number of Agents",

                    data: histogram

                }]
            },

            options: {

                responsive: true,

                plugins: {

                    title: {

                        display: true,

                        text: "Final Wealth Distribution"

                    }

                },

                scales: {

                    x: {

                        title: {

                            display: true,

                            text: "Wealth"

                        }

                    },

                    y: {

                        title: {

                            display: true,

                            text: "Number of Agents"

                        }

                    }

                }

            }

        }

    );

}

// -----------------------------
// Gini Plot
// -----------------------------

let giniChart = null;

function drawGini(giniHistory) {

    if (giniChart)
        giniChart.destroy();

    giniChart = new Chart(

        document.getElementById("giniPlot"),

        {

            type: "line",

            data: {

                labels:
                    giniHistory.map((_, i) => i + 1),

                datasets: [{

                    label: "Gini Coefficient",

                    data: giniHistory,

                    fill: false,

                    tension: 0.1

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    title: {

                        display: true,

                        text: "Gini Coefficient vs Iteration"

                    }

                },

                scales: {

                    x: {

                        title: {

                            display: true,

                            text: "Iteration"

                        }

                    },

                    y: {

                        min: 0,

                        max: 1,

                        title: {

                            display: true,

                            text: "Gini Coefficient"

                        }

                    }

                }

            }

        }

    );

}

// -----------------------------
// Main simulation
// -----------------------------

function runSimulation() {

    // Read GUI parameters

    const totalAgents =
        Number(document.getElementById("agents").value);

    const totalIterations =
        Number(document.getElementById("iterations").value);

    const initialWealth =
        Number(document.getElementById("wealth").value);

    const wealthDonated =
        Number(document.getElementById("donation").value);

    const executionOrder =
        document.querySelector(
            'input[name="order"]:checked'
        ).value;

    // Create agents

    let agents = [];

    for (let i = 0; i < totalAgents; i++) {

        agents.push(new Agent(i, initialWealth));

    }

    let giniHistory = [];

    // -------------------------
    // Simulation
    // -------------------------

    for (let tick = 0; tick < totalIterations; tick++) {

        // Randomize execution order if selected

        if (executionOrder === "random") {

            agents.sort(() => Math.random() - 0.5);

        }

        // Agent interactions

        for (let agent of agents) {

            if (agent.wealth === 0)
                continue;

            let other =
                agents[Math.floor(Math.random() * totalAgents)];

            agent.wealth -= wealthDonated;

            other.wealth += wealthDonated;

        }

        let wealth =
            agents.map(a => a.wealth);

        giniHistory.push(
            calculateGini(wealth)
        );

    }

    // -------------------------
    // Display first five agents
    // -------------------------

    let output = "";

    output += "Final Simulation Results\n\n";

    for (let i = 0; i < 5; i++) {

        output +=
            `Agent ${agents[i].id}: Wealth = ${agents[i].wealth}\n`;

    }

    document.getElementById("results").textContent = output;

    // -------------------------
    // Draw charts
    // -------------------------

    let wealth =
        agents.map(a => a.wealth);

    drawHistogram(wealth);

    drawGini(giniHistory);

}