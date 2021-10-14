var xValues = ["Actief", "Inactief", "Inactief (+1 maand)"];
var yValues = [55, 49, 44]; // Update with real vallues. getActiveUsersAsync(), getInactiveUsersAsync(), getLongInactiveUsersAsync()
var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797"
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

c