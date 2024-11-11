<template lang="pug">
.analytic
    Box.header(padding="500")
        Text(as="h1", variant="headingLg") Analytics

    Box.main-content 
        Box.day_range
          div.selected-date(@click="showModal = true") 
            Text(as="p" fontWeight="medium") {{ formatDate(selectedDates.start) }} - {{ formatDate(selectedDates.end) }}

          Button(@click="showModal = true") Select date
          div.modal(v-if="showModal")
            DatePicker.modal-content(multi-month allow-range :month="month" :year="year" v-model="Dates" @month-change="handleMonthChange" :disable-dates-after="new Date()")
            div(style="margin-top: auto; display: flex; justify-content: flex-end;  gap: 10px;")
              Button(@click = "changeDate()" variant="primary") Change
              Button(@click = "closeDatePicker()") Close
        Box.click_add.flex
            Box.click.flex
                Box.total_click.result_box.border
                    Text(as='h2', variant="headingSm") Total click 
                Box.click_histogram.histogram_box.border
                    Text(as='h2', variant="headingSm") Click histogram
                    Line(:data="chartData" :options="chartOptions")

            Box.add_to_cart.flex
                Box.total_add_to_cart.result_box.border
                    Text(as='h2', variant="headingSm") Total add to cart 
                Box.add_to_cart_histogram.histogram_box.border
                    Text(as='h2', variant="headingSm") Add to cart diagram 
                    Line(:data="chartData" :options="chartOptions")
            
        Box.item_click_and_add.full_size_box.border
            Text(as='h2', variant="headingSm") Analytics for each item 
            LegacyCard
            ResourceList(
              :resourceName="{ singular: 'product', plural: 'products' }"
              :items="products"
            )
                template(#filterControl)
                    Filters(
                    :query-value="queryValue"
                    :filters="filters"
                    :appliedFilters="appliedFilters"
                    @query-change="setQueryValue"
                    @query-clear="handleQueryValueRemove"
                    @clear-all="handleClearAll"
                    )

                template(v-for="product in filteredProducts.slice(0,3)" :key="product.id")
                  ResourceItem(
                    :id="product.id"
                    :url="product.image"
                    :accessibilityLabel="`View details for ${product.name}`"
                  )
                    
                    div.resource-item-info
                      div.resource-item-content
                        img(:src="product.image" style="width: 50px; height: 70px; margin: 10px;")
                        div(style= "display: flex; justify-content: center;flex-direction: column;")
                          Text(variant="bodyMd" fontWeight="bold" as="h3") {{ product.name }}
                          div {{ product.location }}
                      div(style= "display: flex; justify-content: center;flex-direction: column;")
                        Button(@click="toggleDropdown(product.id) ") View
                    div.resource-item-edit(:class="{ 'expanded': dropdownVisible === product.id }")

        Box.top_performing.full_size_box.border
            Text(as='h2', variant="headingSm") Top performing items
            LegacyCard
            ResourceList(:resourceName="{ singular: 'product', plural: 'products' }" :items="products")
                template(v-for="product in products.slice(0,3)" :key="product.id")
                  ResourceItem(
                    :id="product.id"
                    :url="product.image"
                    :accessibilityLabel="`View details for ${product.name}`"
                  )
                    div.resource-item-info
                      div.resource-item-content
                        img(:src="product.image" style="width: 50px; height: 70px; margin: 10px;")
                        div(style= "display: flex; justify-content: center;flex-direction: column;")
                          Text(variant="bodyMd" fontWeight="bold" as="h3") {{ product.name }}
                          div {{ product.location }}

        Box.low_performing.full_size_box.border
            Text(as='h2', variant="headingSm") Low performing items
            LegacyCard
            ResourceList(:resourceName="{ singular: 'product', plural: 'products' }" :items="products")
                template(v-for="product in products.slice(0,3)" :key="product.id")
                  ResourceItem(
                    :id="product.id"
                    :url="product.image"
                    :accessibilityLabel="`View details for ${product.name}`"
                  )
                    div.resource-item-info
                      div.resource-item-content
                        img(:src="product.image" style="width: 50px; height: 70px; margin: 10px;")
                        div(style= "display: flex; justify-content: center;flex-direction: column;")
                          Text(variant="bodyMd" fontWeight="bold" as="h3") {{ product.name }}
                          div {{ product.location }}

</template>

<script setup lang="ts">
import { DatePicker } from '@ownego/polaris-vue';
import { ref, computed, resolveComponent,h, onMounted, reactive } from 'vue';
import { inject } from 'vue';
import { Line } from 'vue-chartjs'  // Đảm bảo đã import đúng component Line từ vue-chartjs
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);


const account = inject('account');
console.log(account);


//Date range verialble
const showModal = ref(false);

const month = ref(10);
const year = ref(2024);

const selectedDates = ref({
  start: new Date(),
  end: new Date(),
});

const Dates = ref({
  start: new Date(),
  end: new Date(),
});


// Product variable
interface Product {
  id: number;
  name: string;
  location: string;
  image: string;
}
const products = ref<Product[]>([]);


//Filter variable
const taggedWith = ref('');
const queryValue = ref('');
const dropdownVisible = ref<number | null>(null);

const filters = [
 {
    name: 'taggedWith',
    label: 'Tagged with',
    filter: () => h(resolveComponent('TextField'), {
      label: 'Tagged with',
      modelValue: taggedWith.value,
      autoComplete: "off",
      labelHidden: true,
      onInput: handleTaggedWithChange,
    }),
    shortcut: true,
  },
];


// Data range handle
function changeDate ():void{
    showModal.value = false;
    selectedDates.value = Dates.value;
}

function closeDatePicker() :void {
  showModal.value = false;
}

const formatDate = (date: Date) => {
  return date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short',year: 'numeric'}) : 'Select a date';
};

const handleMonthChange = (m: number, y: number) => {
  month.value = m;
  year.value = y;
};


//Load image
const loadImages = () => {
  const imageModules = import.meta.glob('/public/Image/*.{png,jpg,jpeg,gif,svg}');
  products.value = Object.keys(imageModules).map((path, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    location: 'Vietnam',
    image: path
  }));
  console.log(products)
};
onMounted(loadImages);


//Handle view
function toggleDropdown(id: number): void {
  dropdownVisible.value = dropdownVisible.value === id ? null : id;
}


//Filter
const appliedFilters = computed(() => {
  const tmpFilters = [];

  if (!isEmpty(taggedWith.value)) {
    const name = 'taggedWith';
    tmpFilters.push({
      name,
      label: disambiguateLabel(name, taggedWith.value),
      onRemove: handleTaggedWithRemove,
    });
  }
  return tmpFilters;
});

const setTaggedWith = (value: any) => {
  taggedWith.value = value;
};

const setQueryValue = (value: any) => {
  queryValue.value = value;
};

const handleTaggedWithRemove = () => setTaggedWith('');
const handleQueryValueRemove = () => setQueryValue('');

const handleTaggedWithChange = (_e: Event, value: string) => {
  taggedWith.value = value;
};

const handleClearAll = () => {
  handleTaggedWithRemove();
  handleQueryValueRemove();
};


function disambiguateLabel(key: string, value: string): string {
  switch (key) {
    case 'taggedWith':
      return `Tagged with ${value}`;
    default:
      return value;
  }
}

function isEmpty(value: string): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === '' || value == null;
  }
}

const filteredProducts = computed(() =>
  products.value.filter(product =>
    product.name.toLowerCase().includes(queryValue.value.toLowerCase())
  )
);


// Tạo dữ liệu fake
function generateFakeClickData(daysCount: number) {
  const clickData = [];
  const startDate = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);  // Tạo ngày cho các ngày trước

    clickData.push({
      date: date.toISOString().split('T')[0],  // Chỉ lấy phần ngày (YYYY-MM-DD)
      clicks: Math.floor(Math.random() * 100) + 1  // Số lần click ngẫu nhiên từ 1 đến 100
    });
  }

  return clickData;
}
const clickData = generateFakeClickData(10);

const chartData = reactive({
  labels: clickData.map((item) => item.date),  // Lấy các ngày
  datasets: [
    {
      label: 'Số lần Click',
      data: clickData.map((item) => item.clicks),  // Lấy số lần click
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      fill: true,
    },
  ],
})

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          return `Clicks: ${tooltipItem.raw}`
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Ngày',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Số Click',
      },
      min: 0,
    },
  },
})


</script>

<style scoped lang="scss">
.analytic{
    width: 100%;
    position: relative;
}

.header{
    display: flex;
    justify-content: space-between;
}

.main-content{
    border: 0.5px solid #d5d5d5;
    background-color: white;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
}

.day_range{
    display: flex;
    justify-content: flex-end;
    margin-right: 50px;
}

.day_range_select{
    min-width: 200px;
}

.flex{
    display: flex;
    justify-content: space-between;
}

.result_box{
    min-width: 200px;
    max-height: 300px;
    padding: 20px;
    margin: 20px;
    background-color: white;
}

.histogram_box{
    min-width: 300px;
    height: 300px;
    padding: 20px;
    margin: 20px;
    background-color: white;
}

.full_size_box{
    width: 95%;
    margin: 20px;
    padding: 20px;
    min-height: 200px;
    background-color: white;
}

.footer{
    height: 10px;
}

.resource-item-edit {
    display: flex;
    flex-direction: column; 
    transition: all 0.3s ease;
    padding: 16px;
    margin-bottom: auto;
    &.expanded {
        height: 500px;
    }
}
.dropdown-content {
    background-color: white;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    position: absolute;
    top: calc(100% + 8px); 
    left: 0;
    width: 100%; 
    z-index: 10;
    max-height: 300px; 
    overflow-y: auto; 
}

.resource-item-info{
  display: flex;
  justify-content: space-between;
}

.resource-item-content{
  display: flex;
}

.modal {
  background-color: white;
  display: block;
  position: absolute;
  z-index: 99;
  padding: 20px;
  width: 700px;
  margin-top: 45px;
  border: 1px solid #ccc;
  border-radius: 10px;
  min-height: 350px;
}

.selected-date {
  display: inline-block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  width: 200px;
  text-align: center;
  background-color: white;
  margin-right: 20px;
}

.modal-content {
  display: flex;
  flex: 1; 
  min-height: 280px;
}

.border{
  border: 1px solid #dedede;
  border-radius: 10px;
}
</style>