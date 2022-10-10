// donnees

// configuration pie
const config_pie = {
  type: 'pie',
  data: {
    labels: ['Men', 'Woman', 'Non-binary'],
    datasets: [{
      label: 'Genders',
      data: [91.67, 5.31, 3.02],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)'],
      borderColor : [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(51, 51, 51, 1)'
      ]
    }]
  },
  options : {
    plugins: {
      title: {
        display: true,
        text: 'Pie Genders',
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  }
};

// configuration bar
const config_bar = {
  type: 'bar',
  data: {
    labels: ['Univ_lille', 'Univ_valencienne', 'Univ_Artois'],
    datasets: [{
      label: 'Univ',
      data: [36, 33, 31],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)'],
      borderColor : [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(51, 51, 51, 1)'
      ]
    }]
  },
  options : {
    plugins: {
      title: {
        display: true,
        text: 'Nbr de personne par université',
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  }
};