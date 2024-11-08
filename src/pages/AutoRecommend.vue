<template lang="pug">
.auto_recommend
    Box(padding="500")
        Text(as="h1", variant="headingLg") Auto Recommend
    
    Box.maincontent
        Box.setting
            Box.setting_header
                Text(as='h2', variant="headingLg") Setting
            Box.label_box
                Text(as='h3', variant="headingSm") Frequently bought together 
                Button(:class="{'on': freIsOn, 'off': !freIsOn}" @click="freToggleState" ) {{ freIsOn ? 'Turn off' : 'Turn on' }}
            Box.dropdown(v-if="freIsOn" )
                LegacyStack.question(vertical) Choose layout
                    RadioButton(
                    name="layout" 
                    value="1"
                    v-model="freLayoutValue"
                    label="Layout 1"
                    )

                    RadioButton(
                    name="layout"  
                    value="2"
                    v-model="freLayoutValue"
                    label="Layout 2" 
                    )

                    RadioButton(
                    name="layout"  
                    value="3"
                    v-model="freLayoutValue"
                    label="Layout 3" 
                    )

                LegacyStack.question(vertical) Choose position
                    RadioButton(
                    name="position"  
                    value="1"
                    v-model="frePositionValue"
                    label="Layout 1"
                    )

                    RadioButton(
                    name="position"  
                    value="2"
                    v-model="frePositionValue"
                    label="Layout 2" 
                    )

                    RadioButton(
                    name="position"  
                    value="3"
                    v-model="frePositionValue"
                    label="Layout 3" 
                    )
            Box.label_box
                Text(as='h3', variant="headingSm") Related items
                Button(:class="{'on': relIsOn, 'off': !relIsOn}" @click="relToggleState" ) {{ relIsOn ? 'Turn off' : 'Turn on' }}

            Box.dropdown(v-if="relIsOn")
                LegacyStack.question(vertical) Choose layout
                    RadioButton(
                    name="rellayout" 
                    value="1"
                    v-model="relLayoutValue"
                    label="Layout 1"
                    )

                    RadioButton(
                    name="rellayout"  
                    value="2"
                    v-model="relLayoutValue"
                    label="Layout 2" 
                    )

                    RadioButton(
                    name="rellayout"  
                    value="3"
                    v-model="relLayoutValue"
                    label="Layout 3" 
                    )

                LegacyStack.question(vertical) Choose position
                    RadioButton(
                    name="relposition"  
                    value="1"
                    v-model="relPositionValue"
                    label="Layout 1"
                    )

                    RadioButton(
                    name="relposition"  
                    value="2"
                    v-model="relPositionValue"
                    label="Layout 2" 
                    )

                    RadioButton(
                    name="relposition"  
                    value="3"
                    v-model="relPositionValue"
                    label="Layout 3" 
                    )
            Button.save(variant="primary" @click ="handleSave") Save
        
        Box.preview 
            Box.setting_header
            Text(as='h2', variant="headingLg") Preview
            Box.preview_nav
</template>

<script setup lang="ts">
import { Button } from '@ownego/polaris-vue';
import { ref } from 'vue';
import { inject } from 'vue';

const account = inject('account');
console.log(account);

const freIsOn = ref(false);
const relIsOn = ref(false);
const frePositionValue = ref('1');
const freLayoutValue = ref('1');
const relPositionValue = ref('1');
const relLayoutValue = ref('1');

const freToggleState = () => {
  freIsOn.value = !freIsOn.value;
};

const relToggleState = () => {
  relIsOn.value = !relIsOn.value;
};

const handleSave = () => {
  console.log('Save clicked');
  console.log('Frequently bought together:', freIsOn.value, freLayoutValue.value, frePositionValue.value);
  console.log('Related items:', relIsOn.value, relLayoutValue.value, relPositionValue.value);
};
</script>

<style scoped lang="scss">

.maincontent{
    border: 0.5px solid #d5d5d5;
    border-radius: 10px;
    background-color: white;
    margin: 10px;
}
.auto_recommend{
    width: 100%;
}

.setting{
    width: 400px;
    background-color: white;
    padding: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    border: 0.5px solid #e9e9e9;
    border-radius: 10px;
}

.preview{
    background-color: white;
    padding: 30px;
    margin: 20px;
    border: 1px solid  #e9e9e9;
    border-radius: 10px;
}

.setting_header{
    margin-bottom: 20px;
}

.maincontent{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.preview_nav{
    height: 250px;
    width: 750px;
    background-color: aqua;
    margin: 20px;
}

.off {
  background-color: #28a745;
  color: white;
}

.on {
  background-color: rgba(229, 28, 0, 1);
  color: white;
}

.off:hover{
    background-color:#06621f;
    color: white;
}

.on:hover{
    background-color: rgba(181, 38, 11, 1);
    color: white;
}

.label_box{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.related_items_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.question{
    margin: 10px;
}

.save{
    margin-top: 50px;
}




</style>