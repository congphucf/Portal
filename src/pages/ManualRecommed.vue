<template lang="pug">
.manual_recommend
    Box(padding="500").header
        Text(as="h1", variant="headingLg") Manual recommend

    Box.main-content
        Text(as="h2", variant="headingSm" style="margin-bottom: 10px;") List item 
        LegacyCard
            ResourceList(
              :resourceName="{ singular: 'product', plural: 'products' }"
              :items="products"
              :pagination="pagination"
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

                template(v-for="product in filteredProducts" :key="product.id")
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
                        Button(@click="toggleDropdown(product.id) ") Edit

                    div.resource-item-edit(:class="{ 'expanded': dropdownVisible === product.id }")
                      div(v-if="recommended_items[product.id] && recommended_items[product.id].length > 0")
                        Text(as="h3", variant="headingSm") List of recommended items
                        LegacyCard(style="margin-bottom: 20px; margin-top: 10px;")
                          ResourceList(
                              :resourceName="{ singular: 'product', plural: 'products' }"
                              :items="products"
                              :showHeader="false"
                            )
                            template(v-for="productId in recommended_items[product.id]" :key="productId")
                              ResourceItem(
                                :id="productId"
                              )
                                div.resource-item-info
                                  div.resource-item-content
                                    img(:src="products[productId-1].image" style="width: 50px; height: 70px; margin: 10px;")
                                    div(style= "display: flex; justify-content: center;flex-direction: column;")
                                      Text(variant="bodyMd" fontWeight="bold" as="h3") {{ products[productId-1].name }}
                                      div {{ products[productId-1].location }}
                                  div(style= "display: flex; justify-content: center;flex-direction: column;")
                                    Button(variant="primary" @click = "delteRecommendeditems(product.id, productId)") Delete 

                      Text(as="h3", variant="headingSm") Add more
                      LegacyCard(style="margin-bottom: 20px; margin-top: 10px;")
                        ResourceList(
                          :resourceName="{ singular: 'product', plural: 'products' }"
                          :items="products"
                        )
                            template(#filterControl)
                                Filters(
                                :query-value="subQueryValue"
                                :filters="filters"
                                :appliedFilters="subAppliedFilters"
                                @query-change="setSubQueryValue"
                                @query-clear="handleSubQueryValueRemove"
                                @clear-all="handleSubClearAll"
                              )
                            template(v-for="product in subFilteredProducts" :key="product.id")
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
                                    Button(@click = "addRecommendedItem(dropdownVisible , product.id)") Add
</template>

<script setup lang="ts">
import { LegacyCard } from '@ownego/polaris-vue';
import { ref, computed, resolveComponent,h, onMounted } from 'vue';
import { inject } from 'vue';

const account = inject('account');
account.username = "abs";
console.log(account);

interface Product {
  id: number;
  name: string;
  location: string;
  image: string;
}

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

const taggedWith = ref('');
const queryValue = ref('');
const subQueryValue = ref('');
const subTaggedWith = ref('');
const dropdownVisible = ref<number>(-1);
const products = ref<Product[]>([]);

const recommended_items = ref<number[][]>([[]]);



//Add recommended_items
function addRecommendedItem(productIndex : number, recommendedProduct: number) {
  if (!recommended_items.value[productIndex]) {
    recommended_items.value[productIndex] = [];
  }
  if (!recommended_items.value[productIndex].includes(recommendedProduct)) {
      recommended_items.value[productIndex].push(recommendedProduct);
      console.log(recommended_items.value[productIndex]);
  }
  else{
      console.log("Đã tồn tại");
  }
}

function delteRecommendeditems(productIndex:number, recommendedProduct:number){
  if(recommended_items.value[productIndex]){
    const index = recommended_items.value[productIndex].indexOf(recommendedProduct);

    if (index>-1){
      recommended_items.value[productIndex].splice(index, 1);
    }
  }
}

//Load products
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

const pagination = {
  hasNext: true,
  onNext: () => {
    console.log('Next');
  },
}


//Handle edit
function toggleDropdown(id: number): void {
  dropdownVisible.value = dropdownVisible.value === id ? -1 : id;
  subQueryValue.value=''
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


//Sub Filter
const subAppliedFilters = computed(() => {
  const tmpFilters = [];

  if (!isSubEmpty(subTaggedWith.value)) {
    const name = 'taggedWith';
    tmpFilters.push({
      name,
      label: disambiguateSubLabel(name, subTaggedWith.value),
      onRemove: handleSubTaggedWithRemove,
    });
  }

  return tmpFilters;
});

const setSubTaggedWith = (value: any) => {
  subTaggedWith.value = value;
};

const setSubQueryValue = (value: any) => {
  subQueryValue.value = value;
};

const handleSubTaggedWithRemove = () => setSubTaggedWith('');
const handleSubQueryValueRemove = () => setSubQueryValue('');

const handleSubTaggedWithChange = (_e: Event, value: string) => {
  subTaggedWith.value = value;
};

const handleSubClearAll = () => {
  handleSubTaggedWithRemove();
  handleSubQueryValueRemove();
};

function disambiguateSubLabel(key: string, value: string): string {
  switch (key) {
    case 'taggedWith':
      return `Tagged with ${value}`;
    default:
      return value;
  }
}

function isSubEmpty(value: string): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === '' || value == null;
  }
}

const subFilteredProducts = computed(() =>
  subQueryValue.value !=='' ? products.value.filter(product => product.name.toLowerCase().includes(subQueryValue.value.toLowerCase())) : []
);

</script>

<style scoped lang="scss">
.manual_recommend {
    width: 100%;
    position: relative;
}

.main-content {
    border: 0.5px solid #d5d5d5;
    background-color: white;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
}

.resource-item-edit {
    display: none;
    flex-direction: column; 
    overflow: hidden;
    margin-bottom: auto;
    transition: display 2s , opacity 2s , max-height 2s ;

    &.expanded {
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        min-height: 100px;
    }
}

.dropdown-box {
    margin-top: 8px;
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

.border{
  border-radius: 10px;
  border: 0.5px solid #d5d5d5;
  background-color: white;
}
</style>