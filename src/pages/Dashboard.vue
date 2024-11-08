<template lang="pug">
.dashboard
  Box(padding="500")
    Text(as="h1", variant="headingLg") Dashboard

  Box.main-content
    Text.title(as="h2", variant="headingMd") Getting started
    MediaCard(
      title="Getting Started"
      description="Discover how Shopify can power up your entrepreneurial journey."
      :primaryAction="{ content: 'Learn about getting started', onAction: () => {} }"
      :popoverActions="[{ content: 'Dismiss', onAction: () => {} }]"
    )
      img(
        alt=""
        width="50%"
        src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
        :style="{ objectFit: 'cover', objectPosition: 'center' }"
      )

    Text.title(as="h2", variant="headingMd") Analytics
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
      Box.add_to_cart.flex
          Box.total_add_to_cart.result_box.border
              Text(as='h2', variant="headingSm") Total add to cart 
          Box.add_to_cart_histogram.histogram_box.border
              Text(as='h2', variant="headingSm") Add to cart diagram 

    Text.title(as="h2", variant="headingMd") Recommendation features
    Box.features 
      Box.card(v-for="(product, index) in products" :key="index" padding="4" shadow="small" border="neutral")
        Box.media
          img(:src="product.image" alt="" width="200px")
        Text(as="h3", variant="headingSm") {{ product.title }}
        Button.primary {{ product.buttonText }}
    
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';

const account = inject('account');
console.log(account);

const products = ref([
  {
    image: '/public/Image/mzz70155_navy_xl.jpg',
    title: 'Frequently Bought',
    buttonText: 'Get Started',
  },
  {
    image: '/public/Image/mzz70155_navy_xl.jpg',
    title: 'Related Products',
    buttonText: 'Get Started',
  },
  {
    image: '/public/Image/mzz70155_navy_xl.jpg',
    title: 'Manual Recommendations',
    buttonText: 'Get Started',
  },
  {
    image: '/public/Image/mzz70155_navy_xl.jpg',
    title: 'Post Purchase Upsell',
    buttonText: 'Get Started',
  },
]);

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

</script>

<style scoped lang="scss">
.main-content{
    border: 0.5px solid #d5d5d5;
    background-color: white;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    position: relative;
}

.title{
  margin: 20px;
}

.features{
  display: flex;
  justify-content: space-between;
  padding: 20px;
}


.card{
  align-items: center;
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day_range{
    display: flex;
    justify-content: flex-end;
    margin-right: 50px;
}

.day_range_select{
    min-width: 200px;
}

.modal {
  background-color: white;
  display: block;
  position: absolute;
  z-index: 99;
  padding: 20px;
  width: 700px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  min-height: 350px;
  right: 30px;
  left: auto;
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

.flex{
    display: flex;
    justify-content: space-between;
}

.result_box{
    min-width: 200px;
    min-height: 200px;
    padding: 20px;
    margin: 20px;
    background-color: white;
}

.histogram_box{
    min-width: 300px;
    min-height: 200px;
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

.border{
  border: 1px solid #dedede;
  border-radius: 10px;
}

</style>