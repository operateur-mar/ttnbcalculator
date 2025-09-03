
const { createApp } = Vue;

createApp({
  data() {
    return {
      surface: null,
      year: null,
      result: null,
      zone: 'zone1', // default selected zone
      tableData: [],
      total: {
        calculatedPrice: 0,
        nonReport: 0,
        tax10: 0,
        tax5: 0,
        taxMonthly: 0,
        sum: 0
      }
    };
  },
  computed: {
    totalMonthsLabel() {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      let totalMonths = 0;
      if (!this.year || this.year > currentYear) return '';
      for (let y = this.year; y <= currentYear; y++) {
        totalMonths += (y === currentYear) ? currentMonth : 12;
      }
      return `Total Des Mois (${totalMonths})`;
    }
  },
  methods: {
    calculateTTNB() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const zoneRates = {
    zone1: 8,
    zone2: 15
  };

  // Apply the rule: if year < 2019, multiplier is 6
  let multiplier;
  if (this.year < 2019) {
    multiplier = 6;
  } else {
    multiplier = zoneRates[this.zone] || 6;
  }

  if (this.surface && this.year && this.year <= currentYear) {
    this.result = this.surface * multiplier + (this.year - 2000);
    this.tableData = [];

    const yearsRange = [];
    for (let y = currentYear; y >= this.year; y--) {
      yearsRange.push(y);
    }

    let cumulativeMonths = 0;
    const reversedTable = [];

   yearsRange.forEach((year) => {
  if (year < 2008) return;

  // Apply pricing rule per year
  const yearMultiplier = (year < 2019) ? 6 : zoneRates[this.zone] || 6;
  const calculatedPrice = this.surface * yearMultiplier;

  // Apply month calculation rule
  let monthsForThisYear;
  if (year === currentYear) {
    monthsForThisYear = Math.max(currentMonth - 3, 0);
  } else if (year === 2020) {
    monthsForThisYear = 9; // Special rule for 2020
  } else {
    monthsForThisYear = 12;
  }

  cumulativeMonths += monthsForThisYear;

  const tax10 = calculatedPrice * 0.10;
  const tax5 = calculatedPrice * 0.05;

  const nonreportcalc = calculatedPrice * 0.15;
  let nonReport = (nonreportcalc < 500) ? 500 : nonreportcalc;

  const taxMonthly = calculatedPrice * cumulativeMonths * 0.005;
  const includeNonReport = true;

  const sum = calculatedPrice + (includeNonReport ? nonReport : 0) + tax10 + tax5 + taxMonthly;

  reversedTable.push({
    year,
    calculatedPrice,
    tax10,
    tax5,
    months: cumulativeMonths,
    taxMonthly,
    nonReport,
    includeNonReport,
    sum
  });
});

    this.tableData = reversedTable.reverse();
    this.updateTotal();
  } else {
    this.result = null;
    this.tableData = [];
    alert("Veuillez remplir les champs correctement.");
  }},

    updateTotal() {
      this.total = {
        calculatedPrice: 0,
        nonReport: 0,
        tax10: 0,
        tax5: 0,
        taxMonthly: 0,
        sum: 0
      };

      this.tableData.forEach(row => {
        this.total.calculatedPrice += row.calculatedPrice;
        this.total.tax10 += row.tax10;
        this.total.tax5 += row.tax5;
        this.total.taxMonthly += row.taxMonthly;
        const nonReportVal = row.includeNonReport ? row.nonReport : 0;
        this.total.nonReport += nonReportVal;
        row.sum = row.calculatedPrice + nonReportVal + row.tax10 + row.tax5 + row.taxMonthly;
        this.total.sum += row.sum;
      });
    }
  }
}).mount('#app');
