<template>
  <div class="container">
    <div class="button-column">
      <!-- <h4>Button Groups</h4> -->
      <div v-for="(buttons, groupName) in buttonGroups" :key="groupName">
        <h5>{{ groupName }}</h5>
        <div class="button-group">
          <button 
            v-for="button in buttons" 
            :key="button.value" 
            :class="['btn', { 'selected': selectedLabels.includes(button.value) }]"
            @click="toggleLabel(button.value)"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="output-column">
      <div>
        <h3>THEME Values:</h3>
        <textarea :value="selectedThemeValuesString" readonly></textarea>
        <button @click="copyToClipboard(selectedThemeValuesString)">Copy to Clipboard</button>
      </div>

      <div>
        <h3>DEPLOY Values:</h3>
        <textarea 
          v-model="deployInput" 
          @input="processDeployInput"
          :class="{'invalid-input': hasInvalidInput}" 
          ref="deployTextarea">
        </textarea>
        <button @click="copyToClipboard(deployInput)">Copy to Clipboard</button>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { mappings } from './data/mappings';
import { prefixes } from './data/prefixes';
import { useToast } from '#imports';

const selectedLabels = ref([]);
const selectedThemeValues = ref([]);
const deployInput = ref('');
const hasInvalidInput = ref(false);

const toast = useToast();

// const mappings = {
//   "qa-james": { themeValue: "orange", deployValue: "qa-james" },
//   "qa-qa": { themeValue: "orange", deployValue: "qa-qa" },
//   "qa-qa2": { themeValue: "orange", deployValue: "qa-qa2" },
//   "a7billing1-zib": { themeValue: "orange", deployValue: "a7billing1-zib" },
//   "sob-asc": { themeValue: "green", deployValue: "sob-asc" },
//   // Add more mappings if necessary
// };

// Group buttons based on prefixes
//const prefixes = ['qa-', 'a7', 'sob'];

const buttonGroups = computed(() => {
  const groups = prefixes.reduce((acc, prefix) => {
    const groupName = prefix.toUpperCase();
    acc[groupName] = Object.keys(mappings)
      .filter(label => label.startsWith(prefix))
      .map(label => ({
        label,
        value: label
      }));
    return acc;
  }, {});

  // Add the OTHER group last
  groups['OTHER'] = Object.keys(mappings)
    .filter(label => !prefixes.some(prefix => label.startsWith(prefix)))
    .map(label => ({
      label,
      value: label
    }));

  return groups;
});

// Toggle button selection
const toggleLabel = (label) => {
  if (selectedLabels.value.includes(label)) {
    selectedLabels.value = selectedLabels.value.filter(selected => selected !== label);
  } else {
    selectedLabels.value.push(label);
  }
  updateDeployValues();
  updateSelectedValues();
};

// Update deploy values when buttons are clicked
const updateDeployValues = () => {
  deployInput.value = selectedLabels.value.join(' ');
};

// Update theme values based on selected labels
const updateSelectedValues = () => {
  const currentSelectedThemeValues = selectedLabels.value.map(label => mappings[label]?.themeValue);

  const uniqueThemes = new Set();
  currentSelectedThemeValues.forEach(theme => {
    if (theme) {
      uniqueThemes.add(theme); // Add the theme if it exists
    }
  });

  selectedThemeValues.value = Array.from(uniqueThemes);
};

// Watcher to keep the textarea deploy values and selectedLabels in sync
watch(deployInput, (newValue) => {
  processDeployInput();
});

const selectedThemeValuesString = computed(() => {
  return selectedThemeValues.value.join(' ');
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.add({ severity: 'success', summary: 'Copied to clipboard', life: 3000 });
    })
    .catch(err => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy', life: 3000 });
    });
};

// Process input in the deployValues textarea
const processDeployInput = () => {
  hasInvalidInput.value = false;
  
  // Split the input text into individual values by space or newline
  const deployValues = deployInput.value.trim().split(/\s+/);

  // Keep track of whether any invalid inputs are found
  let invalidFound = false;

  // Clear existing selected labels before processing new input
  selectedLabels.value = [];

  deployValues.forEach(value => {
    if (mappings[value]) {
      // If valid, add to selected labels
      selectedLabels.value.push(value);
    } else {
      // If invalid, mark it
      invalidFound = true;
    }
  });

  hasInvalidInput.value = invalidFound;

  // Update selected values
  updateSelectedValues();
};
</script>

<style>
body {
  background-color: #121212;
  color: #ffffff;
}

.container {
  display: flex;
  height: 100vh;
}

.button-column {
  flex: 1;
  padding: 20px;
  border-right: 1px solid #333;
  overflow-y: auto;
  background-color: #1e1e1e;
}

.output-column {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #1e1e1e;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 15px;
  border: 1px solid #007bff;
  background-color: #333;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

button.selected {
  background-color: #007bff;
  border-color: #0056b3;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004085;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #222;
  color: #ffffff;
  border: 1px solid #444;
  padding: 10px;
  resize: none;
}

textarea.invalid-input {
  border-color: red;
  color: red;
}
</style>
