<template>
  <div>
    <div id="loading-overlay" class="uk-flex uk-flex-center uk-flex-middle" v-if="isLoading">
      <svg height="20" width="80" id="dots">
        <circle cx="10" cy="10" r="10" id="dot1" />
        <circle cx="40" cy="10" r="10" id="dot2" />
        <circle cx="70" cy="10" r="10" id="dot3" />
      </svg>
    </div>
    <div class="uk-container uk-container-large">
      <div class="uk-section uk-section-small">
        <vk-grid class="uk-flex-middle uk-margin-medium-bottom">
          <div class="uk-width-auto">
            <h1>Zip Code Report</h1>
          </div>
          <div class="uk-width-expand uk-flex uk-flex-middle">
            <div class="uk-margin-small-right">Select Date Range:</div>
            <div class="uk-width-1-3">
              <date-range-picker
                v-model="range"
                :options="options"
                class="uk-input uk-width-expand pointer"
              />
            </div>
            <div>
              <button
                type="button"
                class="uk-button uk-button-default uk-margin-medium-left"
                @click="datesPicked"
              >Generate Charts</button>
            </div>
          </div>
        </vk-grid>
        <vk-card class="uk-margin-medium-bottom">
          <vk-grid class="uk-child-width-1-1 uk-height-large">
            <div>
              <div v-if="noData" class="uk-margin-auto uk-width-1-2 uk-text-center">
                <strong>THERE ARE NO ZIPS FOR THIS DATE RANGE</strong>
              </div>
              <div v-if="chooseDate" class="uk-margin-auto uk-width-2-3 uk-text-center">
                <span class="uk-label uk-label-warning">WARNING</span>
                <strong>PLEASE CHOOSE A DATE RANGE BEFORE GENERATING A CHART</strong>
              </div>
              <vk-grid class="uk-child-width-1-2 uk-height-large">
                <GChart
                  v-if="chartData1"
                  type="PieChart"
                  :data="chartData1"
                  :options="chartOptions1"
                />
                <GChart
                  v-if="chartData2"
                  type="PieChart"
                  :data="chartData2"
                  :options="chartOptions2"
                />
              </vk-grid>
            </div>
          </vk-grid>
        </vk-card>
        <vk-card>
          <vk-grid class="uk-child-width-1-1" gutter="small" divided>
            <vk-grid
              class="uk-child-width-1-4 uk-flex-center uk-text-center"
              v-for="item in chartData3"
              :key="item.id"
              gutter="collapse"
            >
              <div v-if="item">{{ item[0] }}</div>
              <div>{{ item[1] }}</div>
              <div>{{ toPercent(item[1]) }}%</div>
            </vk-grid>
          </vk-grid>
        </vk-card>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      isLoading: false,
      range: undefined,
      output: [],
      chooseDate: undefined,
      noData: undefined,
      options: {
        timePicker: false,
        startDate: "02/28/2020",
        endDate: "02/28/2020",
        // startDate: this.$moment().startOf("day"),
        // endDate: this.$moment().endOf("day"),
        locale: {
          format: "MM/DD/YYYY"
        }
      },

      // Resource
      chartOptions1: {
        backgroundColor: "transparent",
        pieHole: 0.4,
        colors: []
      },
      chartOptions2: {
        backgroundColor: "transparent",
        pieHole: 0.4,
        colors: []
      }
    };
  },
  methods: {
    async datesPicked() {
      if (this.range == undefined) {
        this.chooseDate = true;

        return;
      }
      this.chooseDate = undefined;
      this.isLoading = true;
      let res = await axios({
        method: "post",
        url: "/zips/dates",
        data: {
          firstDate: this.firstDate,
          secondDate: this.secondDate
        }
      });
      // let res = await axios.post("/api/zips/dates", {
      //   firstDate: this.firstDate,
      //   secondDate: this.secondDate
      // });
      // this.output = res.data;

      if (this.output.length < 1) {
        this.noData = true;
      }

      if (this.output.length) {
        this.noData = undefined;
        this.buildColors();
      }
      this.isLoading = false;
    },

    buildColors() {
      for (let counter = 0; counter < this.chartData1.length; counter++) {
        this.chartOptions1.colors.push(
          "#0000CC".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
          })
        );
      }
      for (let counter = 0; counter < this.chartData2.length - 1; counter++) {
        this.chartOptions2.colors.push(
          "#0000CC".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
          })
        );
      }
    },

    toPercent(val) {
      val = (val / this.zipsTotal) * 100;
      return val.toFixed(1);
    }
  },
  computed: {
    firstDate() {
      return this.range[0]
        .split("/")
        .reverse()
        .join("-");
    },

    secondDate() {
      return this.range[1]
        .split("/")
        .reverse()
        .join("-");
    },

    chartData1() {
      // property is computed only if there is an axios response stored in output
      if (this.output.length) {
        let zipsArray = [];

        // push response from axios call in datesPicked() into zipsArray
        this.output.map(item => zipsArray.push(item.zip));

        // change all null values in array to "Unknown"
        const unknownArray = zipsArray.map(item =>
          item == null ? "Unknown" : item
        );

        // create object that has the zip as the key and the number of times the zip occurs as a value
        const countObj = _.countBy(unknownArray);

        // turn countObj object into an array and spread it into the array
        // "Zips" and "Total" need to be added becuase they let GCart know what the data will be - column headers
        const finalArray = [["Zips", "Total"], ...Object.entries(countObj)];

        return finalArray;
      }
    },
    chartData2() {
      if (this.output.length) {
        let zipsArray = [];

        this.output.map(item => zipsArray.push(item.zip));

        const justZipsArray = zipsArray.filter(item => item);

        const countObj = _.countBy(justZipsArray);

        const finalArray = [["Zips", "Total"], ...Object.entries(countObj)];

        return finalArray;
      }
    },
    chartData3() {
      if (this.output.length) {
        let zipsArray = [];

        this.output.map(item => zipsArray.push(item.zip));

        const unknownArray = zipsArray.map(item =>
          item == null ? "Unknown" : item
        );

        const countObj = _.countBy(unknownArray);

        const unsortedArray = [...Object.entries(countObj)];

        const finalArray = unsortedArray.sort((a, b) => (a[1] > b[1] ? -1 : 1));

        return finalArray;
      }
    },
    zipsTotal() {
      if (this.output.length) {
        let zipsArray = [];

        this.output.map(item => zipsArray.push(item.zip));

        return zipsArray.length;
      }
    }
  }
};
</script>

