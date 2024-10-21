<template>
  <div class="container">
    <div class="button-column">
      <!-- Search Container -->
      <div class="search-container">
        <!-- Search Input -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
        />
        <!-- Clear Search Button ('x' icon) -->
        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">x</button>
      </div>

      <!-- Show message when no results are found -->
      <div v-if="Object.keys(filteredButtonGroups).length === 0" class="no-results-message">
        No results found.
      </div>

      <div v-for="(buttons, groupName) in filteredButtonGroups" :key="groupName">
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
        <h3>THEME values:</h3>
        <textarea :value="selectedThemeValuesString" readonly></textarea>
        <button @click="copyToClipboard(selectedThemeValuesString)">
          Copy to Clipboard
        </button>
      </div>

      <div>
        <h3>DEPLOY values:</h3>
        <textarea
          v-model="deployInput"
          @input="processDeployInput"
          :class="{'invalid-input': hasInvalidInput}"
          ref="deployTextarea"
        ></textarea>
        <button @click="copyToClipboard(deployInput)">Copy to Clipboard</button>
      </div>
      <Toast />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { mappings } from '~/data/mappings';
import './styles.css'; // Import the separated CSS file
import { prefixes } from './data/prefixes';

const selectedLabels = ref([]);
const selectedThemeValues = ref([]);
const deployInput = ref('');
const hasInvalidInput = ref(false);
const searchQuery = ref('');

const toast = useToast();

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.add({ severity: 'success', summary: 'Copied', detail: 'Copied to clipboard', life: 3000 });
    })
    .catch(err => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy', life: 3000 });
    });
};

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

  groups['OTHER'] = Object.keys(mappings)
    .filter(label => !prefixes.some(prefix => label.startsWith(prefix)))
    .map(label => ({
      label,
      value: label
    }));

  return groups;
});

const filteredButtonGroups = computed(() => {
  if (!searchQuery.value) {
    return buttonGroups.value;
  }

  const searchLower = searchQuery.value.toLowerCase();
  return Object.keys(buttonGroups.value).reduce((acc, groupName) => {
    const filteredButtons = buttonGroups.value[groupName].filter(button =>
      button.label.toLowerCase().includes(searchLower)
    );
    if (filteredButtons.length) {
      acc[groupName] = filteredButtons;
    }
    return acc;
  }, {});
});

const toggleLabel = (label) => {
  if (selectedLabels.value.includes(label)) {
    selectedLabels.value = selectedLabels.value.filter(selected => selected !== label);
  } else {
    selectedLabels.value.push(label);
  }
  updateDeployValues();
  updateSelectedValues();
  processDeployInput();
};

const updateDeployValues = () => {
  deployInput.value = selectedLabels.value.join(' ');
};

const updateSelectedValues = () => {
  const currentSelectedThemeValues = selectedLabels.value.map(label => mappings[label]?.themeValue);
  const uniqueThemes = new Set(currentSelectedThemeValues);
  selectedThemeValues.value = Array.from(uniqueThemes);
};

const processDeployInput = () => {
  hasInvalidInput.value = false; // Reset the invalid state at the beginning
  const deployValues = deployInput.value.trim().split(/\s+/);
  const selectedValues = []; // Array to hold valid selected values
  let invalidFound = false; // Flag to track if any invalid values are found

  // Loop through the entered values
  deployValues.forEach(value => {
    if (mappings[value]) {
      selectedValues.push(value); // Push valid values to the array
    } else {
      invalidFound = true; // Set flag if invalid value is found
    }
  });

  // Update the selected labels and theme values based on valid selections
  selectedLabels.value = selectedValues; 
  updateSelectedValues();

  // Set the hasInvalidInput state based on whether invalid values were found
  hasInvalidInput.value = invalidFound; 
};

const clearSearch = () => {
  searchQuery.value = '';
};

const selectedThemeValuesString = computed(() => selectedThemeValues.value.join(' '));
</script>
