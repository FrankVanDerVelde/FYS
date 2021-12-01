let xValues = ["Actief", "Inactief (+1 maand)"];


const totalUser = getAllUsersAsync()[0].length;

alert(totalUser)

let yValues = [55, 44]; // Update with real vallues. getActiveUsersAsync(), getInactiveUsersAsync(), getLongInactiveUsersAsync()
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

c