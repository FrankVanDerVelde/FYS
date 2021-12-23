window.onload = async function () {
    await loadChart();
}

async function loadChart() {
    const xValues = ["Actief", "Inactief (+1 maand)"];
    const users = await getAllUsersAsync();

    // +1 bc starts at 0.
    const currentMonth = parseInt( new Date().getMonth() + 1);

    document.getElementById("total-users").innerHTML = users.length;

    let active = 0, inactive = 0;

    for(let i=0; i<users.length; i++) {
        const lastLoggedIn = users[i].lastLoggedIn;

        if(lastLoggedIn != null) {
            const loggedInMonth = parseInt(users[i].lastLoggedIn.split("-")[1]);

            if(loggedInMonth !== currentMonth) {
                inactive += 1;
            } else {
                active += 1;
            }
        }
    }

    let yValues = [active, inactive];
    let barColors = [
        "#2b5797",
        "#b91d47",
    ];

    new Chart("chart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Activiteit van gebruikers"
            }
        }
    });
}
