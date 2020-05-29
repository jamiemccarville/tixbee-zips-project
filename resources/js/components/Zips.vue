<template>
  <div>
    <GithubCorner
      url="https://github.com/jamiemccarville/tixbee-zips-project"
      cornerColor="#fff"
      gitColor="ff6200"
      :flipOnHover="flipOnHover"
    ></GithubCorner>
    <!-- <a
      href="https://github.com/jamiemccarville/tixbee-zips-project"
      class="github-corner"
      aria-label="View source on GitHub"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="fill:#fff; color:#ff6200; position: absolute; top: 0; border: 0; right: 0;"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>-->
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
import GithubCorner from "vue-github-corners";

export default {
  components: {
    GithubCorner
  },
  data() {
    return {
      flipOnHover: true,
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
        proxy: {
          host: "http://fixie:6avnVjdIdvIsIjg@velodrome.usefixie.com",
          port: "80"
        },
        data: {
          firstDate: this.firstDate,
          secondDate: this.secondDate
        }
      });
      // let res = await axios.post("/api/zips/dates", {
      //   firstDate: this.firstDate,
      //   secondDate: this.secondDate
      // });
      this.output = res.data;

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
<style scoped>
.github-corner {
  position: absolute;
  top: 0;
  border: 0;
  right: 0;
}
.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}
</style>
