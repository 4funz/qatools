<template>
  <div class="container">
    <div class="button-column">
      <h4>Button Groups</h4>
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
        <h3>THEME selected:</h3>
        <textarea :value="selectedThemeValuesString" readonly></textarea>
        <button @click="copyToClipboard(selectedThemeValuesString)">Copy to Clipboard</button>
      </div>

      <div>
        <h3>DEPLOY selected:</h3>
        <textarea :value="selectedDeployValuesString" readonly></textarea>
        <button @click="copyToClipboard(selectedDeployValuesString)">Copy to Clipboard</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedLabels = ref([]);
const selectedThemeValues = ref([]);
const selectedDeployValues = ref([]);

const mappings = {
"qa-james": { themeValue: "alturos", deployValue: "qa-james" },
"qa-qa": { themeValue: "alturos", deployValue: "qa-qa" },
"qa-qa2": { themeValue: "alturos", deployValue: "qa-qa2" },
"qa-cypress": { themeValue: "alturos", deployValue: "qa-cypress" },
"qa-cypress-ch": { themeValue: "alturos", deployValue: "qa-cypress-ch" },
"qa-mdlw": { themeValue: "alturos", deployValue: "qa-mdlw" },
"qa-testio": { themeValue: "alturos", deployValue: "qa-testio" },
"qa-themes": { themeValue: "alturos", deployValue: "qa-themes" },
"a7billing1-zib": { themeValue: "alturos", deployValue: "a7billing1-zib" },
"a7billingdev1-zib": { themeValue: "alturos", deployValue: "a7billingdev1-zib" },
"a7billingqa1-zib": { themeValue: "alturos", deployValue: "a7billingqa1-zib" },
"a7billingqa2-zib": { themeValue: "alturos", deployValue: "a7billingqa2-zib" },
"a7billingqa3-zib": { themeValue: "alturos", deployValue: "a7billingqa3-zib" },
"a7leogang-leogang": { themeValue: "leogang", deployValue: "a7leogang-leogang" },
"a7mys-vwp": { themeValue: "wallis", deployValue: "a7mys-vwp" },
"a7qaaletsch-aletsch": { themeValue: "aletsch", deployValue: "a7qaaletsch-aletsch" },
"a7qaalpesvaudoises-vaudoises": { themeValue: "alpesvaudoises", deployValue: "a7qaalpesvaudoises-vaudoises" },
"a7qaandermatt-and": { themeValue: "andermatt", deployValue: "a7qaandermatt-and" },
"a7qajamesovplus-mob": { themeValue: "alturos", deployValue: "a7qajamesovplus-mob" },
"a7qajamesovplus-rhb": { themeValue: "alturos", deployValue: "a7qajamesovplus-rhb" },
"a7qajamesovplus-sob": { themeValue: "alturos", deployValue: "a7qajamesovplus-sob" },
"a7qajbm-toi": { themeValue: "interlaken", deployValue: "a7qajbm-toi" },
"a7qamgb-mgb": { themeValue: "mgb", deployValue: "a7qamgb-mgb" },
"a7qamob-mob": { themeValue: "mob", deployValue: "a7qamob-mob" },
"a7qamyzillertal-mayr": { themeValue: "zillertal", deployValue: "a7qamyzillertal-mayr" },
"a7qarhb-rhb": { themeValue: "rhb", deployValue: "a7qarhb-rhb" },
"a7qasob-sob": { themeValue: "sob", deployValue: "a7qasob-sob" },
"a7stageaccommodation-vwp": { themeValue: "alturos", deployValue: "a7stageaccommodation-vwp" },
"a7stagerailaway-sbb": { themeValue: "sbb", deployValue: "a7stagerailaway-sbb" },
"a7ps3aletsch-aletsch": { themeValue: "alturos", deployValue: "a7ps3aletsch-aletsch" },
"a7ps3test-aletsch": { themeValue: "alturos", deployValue: "a7ps3test-aletsch" },
"ps3-c1": { themeValue: "alturos", deployValue: "ps3-c1" },
"ps3test-c2": { themeValue: "alturos", deployValue: "ps3test-c2" },
"alturos": { themeValue: "alturos", deployValue: "alturos" },
"alturos-cust": { themeValue: "alturos", deployValue: "alturos-cust" },
"aletsch-aletsch": { themeValue: "aletsch", deployValue: "aletsch-aletsch" },
"alpesvaudoises": { themeValue: "alpesvaudoises", deployValue: "alpesvaudoises" },
"andermatt": { themeValue: "andermatt", deployValue: "andermatt" },
"andermatt-aut": { themeValue: "andermatttourism", deployValue: "andermatt-aut" },
"andermatt-sdt": { themeValue: "disentissedrun", deployValue: "andermatt-sdt" },
"destosqa": { themeValue: "alturos", deployValue: "destosqa" },
"dev1": { themeValue: "alturos", deployValue: "dev1" },
"jbm-jbm": { themeValue: "jungfrau", deployValue: "jbm-jbm" },
"jbm-toi": { themeValue: "interlaken", deployValue: "jbm-toi" },
"leogang-leogang": { themeValue: "leogang", deployValue: "leogang-leogang" },
"lux-lux": { themeValue: "luxemburg", deployValue: "lux-lux" },
"marketing": { themeValue: "alturos", deployValue: "marketing" },
"mgb-ggb": { themeValue: "gornergrat", deployValue: "mgb-ggb" },
"mgb-mgb": { themeValue: "mgb", deployValue: "mgb-mgb" },
"mob-gpx": { themeValue: "mobgpx", deployValue: "mob-gpx" },
"mob-mob": { themeValue: "mob", deployValue: "mob-mob" },
"myz-app": { themeValue: "zillertal", deployValue: "myz-app" },
"myz-hfb": { themeValue: "zillertal", deployValue: "myz-hfb" },
"myz-hgb": { themeValue: "zillertal", deployValue: "myz-hgb" },
"myz-hzb": { themeValue: "zillertal", deployValue: "myz-hzb" },
"myz-mayrhofen": { themeValue: "mayrhofen", deployValue: "myz-mayrhofen" },
"myz-myzat": { themeValue: "zillertal", deployValue: "myz-myzat" },
"myz-myzatbe": { themeValue: "zillertal", deployValue: "myz-myzatbe" },
"myz-za": { themeValue: "zillertalarena", deployValue: "myz-za" },
"rhb-gex": { themeValue: "gex", deployValue: "rhb-gex" },
"rhb-landwasserwelt": { themeValue: "landwasserwelt", deployValue: "rhb-landwasserwelt" },
"rhb-rhb": { themeValue: "rhb", deployValue: "rhb-rhb" },
"sbb-bls": { themeValue: "bls", deployValue: "sbb-bls" },
"sbb-sbb": { themeValue: "sbb", deployValue: "sbb-sbb" },
"skiline-skilinex": { themeValue: "skilineshop", deployValue: "skiline-skilinex" },
"sob-asc": { themeValue: "asconalocarno", deployValue: "sob-asc" },
"sob-bellinzona": { themeValue: "bellinzona", deployValue: "sob-bellinzona" },
"sob-dfb": { themeValue: "dfb", deployValue: "sob-dfb" },
"sob-gopex": { themeValue: "gopex", deployValue: "sob-gopex" },
"sob-luganoregion": { themeValue: "lugano", deployValue: "sob-luganoregion" },
"sob-saentis": { themeValue: "saentis", deployValue: "sob-saentis" },
"sob-sob": { themeValue: "sob", deployValue: "sob-sob" },
"sob-stgb": { themeValue: "stgallen", deployValue: "sob-stgb" },
"sob-ticinopass": { themeValue: "ticinopass", deployValue: "sob-ticinopass" },
"tuz-luz": { themeValue: "luzern", deployValue: "tuz-luz" },
"tuz-msf": { themeValue: "melchsee", deployValue: "tuz-msf" },
"tuz-rigi": { themeValue: "rigi", deployValue: "tuz-rigi" },
"tuz-sgv": { themeValue: "sgv", deployValue: "tuz-sgv" },
"tuz-stoos": { themeValue: "stoos", deployValue: "tuz-stoos" },
"vwp-vwp": { themeValue: "wallis", deployValue: "vwp-vwp" },
"vwp-belalp": { themeValue: "belalp", deployValue: "vwp-belalp" },
"crans-montana": { themeValue: "crans-montana", deployValue: "crans-montana" },
"htg-htg": { themeValue: "hochschwarzwald", deployValue: "htg-htg" },
"tegernsee-tegernsee": { themeValue: "tegernsee", deployValue: "tegernsee-tegernsee" },
};

// Group buttons based on prefixes
const prefixes = ['sbb', 'myz','sob', 'tuz', 'sob','mgb', 'mob', 'vwp', 'rhb', 'a7', 'qa', ];

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

const toggleLabel = (label) => {
  if (selectedLabels.value.includes(label)) {
    selectedLabels.value = selectedLabels.value.filter(selected => selected !== label);
  } else {
    selectedLabels.value.push(label);
  }
  updateSelectedValues();
};

const updateSelectedValues = () => {
  // Get all currently selected themes based on the selected labels
  const currentSelectedThemeValues = selectedLabels.value.map(label => mappings[label]?.themeValue);
  
  // Use a Set to keep track of unique themes
  const uniqueThemes = new Set();

  // Loop through current selected themes to populate uniqueThemes
  currentSelectedThemeValues.forEach(theme => {
    if (theme) {
      uniqueThemes.add(theme); // Add the theme if it exists
    }
  });

  // Now we can update selectedThemeValues based on the unique themes
  selectedThemeValues.value = Array.from(uniqueThemes);

  // Update deploy values, ensuring no duplicates
  selectedDeployValues.value = Array.from(new Set(selectedLabels.value.map(label => mappings[label]?.deployValue))).filter(Boolean);
};

const selectedThemeValuesString = computed(() => {
  return selectedThemeValues.value.join(' ');
});

const selectedDeployValuesString = computed(() => {
  return selectedDeployValues.value.join(' ');
});

// Function to copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Copied to clipboard: ' + text); // You can replace this with a more user-friendly notification
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};
</script>

<style>
body {
  background-color: #121212; /* Dark background */
  color: #ffffff; /* Light text color */
}

.container {
  display: flex; /* Use flexbox for layout */
  height: 100vh; /* Full viewport height */
}

.button-column {
  flex: 1; /* Left side takes up available space */
  padding: 20px; /* Padding around buttons */
  border-right: 1px solid #333; /* Right border to separate columns */
  overflow-y: auto; /* Allow scrolling if content overflows */
  background-color: #1e1e1e; /* Darker background for button column */
}

.output-column {
  flex: 1; /* Right side takes up available space */
  padding: 20px; /* Padding around output */
  overflow-y: auto; /* Allow scrolling if content overflows */
  background-color: #1e1e1e; /* Darker background for output column */
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Space between buttons */
  margin-bottom: 20px; /* Space between groups */
}

button {
  padding: 10px 15px;
  border: 1px solid #007bff;
  background-color: #333; /* Dark button background */
  color: #ffffff; /* Light button text */
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

button.selected {
  background-color: #007bff; /* Highlight color for selected buttons */
  color: #ffffff; /* Light text for selected buttons */
  border-color: #0056b3; /* Darker border for selected buttons */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); /* Glow effect for selected buttons */
}

button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

button:active {
  background-color: #004085; /* Even darker blue on click */
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  margin-bottom: 10px; /* Add space below textarea */
  background-color: #222; /* Dark background for textarea */
  color: #ffffff; /* Light text for textarea */
  border: 1px solid #444; /* Border color for textarea */
  padding: 10px; /* Padding inside textarea */
  resize: none; /* Prevent resizing */
}
</style>
