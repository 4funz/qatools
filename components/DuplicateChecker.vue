<template>
    <div class="duplicate-checker-container">
        <h3>Duplicate Checker</h3>

        <div v-for="(input, index) in textAreas" :key="index" class="grid">
            <!-- Textarea Column -->
            <div class="grid-item">
                <textarea v-model="input.value" :placeholder="'Paste text in textarea ' + (index + 1)"
                    class="styled-textarea">
          </textarea>
            </div>
            <!-- Output Column -->
            <div class="grid-item">
                <div class="output-area styled-output">
                    <p v-if="input.result">{{ input.result }}</p>
                </div>
            </div>
        </div>

        <!-- Buttons to add textareas and submit -->
        <div class="button-group">
            <button @click="addNewTextarea" class="styled-button">Add another textarea</button>
            <button @click="checkForDuplicates" class="styled-button">Submit</button>
        </div>

        <!-- Duplicates Section -->
        <div v-if="duplicatesFound.length" class="duplicates-section styled-output">
            <h4>Duplicates:</h4>
            <div v-for="(dup, index) in duplicatesFound" :key="index">
                <p v-if="dup.duplicates.length > 0">
                    {{ dup.textareas }}: {{ dup.duplicates.join(' ') }}
                </p>
                <p v-else>
                    {{ dup.textareas }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const textAreas = ref([{ value: '', result: '' }]); // Initialize with one textarea
const duplicatesFound = ref([]); // Store duplicates found across textareas

// Add a new textarea dynamically
const addNewTextarea = () => {
    textAreas.value.push({ value: '', result: '' });
};

// Function to check for duplicates across all textareas
const checkForDuplicates = () => {
    const allTexts = textAreas.value.map(area => area.value.split(/\s+/)); // Split text areas into words
    const wordCount = {}; // To track the occurrence of each word across textareas
    const wordOccurrences = {}; // To track in which textareas the word occurs

    duplicatesFound.value = []; // Clear previous results

    // Count occurrences of each word and store where they appear
    allTexts.forEach((words, textareaIndex) => {
        words.forEach(word => {
            if (word.trim() !== '') {
                wordCount[word] = (wordCount[word] || 0) + 1;
                if (!wordOccurrences[word]) {
                    wordOccurrences[word] = [];
                }
                wordOccurrences[word].push(`textarea${textareaIndex + 1}`);
            }
        });
    });

    // Process results for each textarea
    textAreas.value.forEach((area, index) => {
        const areaWords = allTexts[index];
        const uniqueWords = [];

        areaWords.forEach(word => {
            if (wordCount[word] === 1) {
                uniqueWords.push(word);
            }
        });

        // Display result for the textarea
        if (uniqueWords.length === 0) {
            area.result = 'All words are duplicates';
        } else {
            area.result = `Uniques: ${uniqueWords.join(' ')}`;
        }
    });

    // Find and display duplicates across textareas
    const duplicateGroups = {};

    Object.keys(wordOccurrences).forEach(word => {
        if (wordCount[word] > 1) {
            const textareaKey = wordOccurrences[word].sort().join(' '); // Create a key based on textareas where the duplicate occurred
            if (!duplicateGroups[textareaKey]) {
                duplicateGroups[textareaKey] = [];
            }
            duplicateGroups[textareaKey].push(word); // Collect duplicates by textareas
        }
    });

    // Populate the duplicatesFound array to display grouped duplicates
    duplicatesFound.value = Object.keys(duplicateGroups).map(key => ({
        textareas: key,
        duplicates: duplicateGroups[key]
    }));

    // Check if duplicatesFound is empty and set a message if so
    if (duplicatesFound.value.length === 0) {
        duplicatesFound.value.push({ textareas: 'No duplicates detected', duplicates: [] });
    }
};

</script>

<style scoped>
/* Duplicate checker grid system */
.duplicate-checker-container {
    padding: 20px;
    /* Add padding for internal spacing */
    margin: 0 20px;
    /* Add space on both sides */
}

/* Grid layout for textareas and outputs */
.grid {
    display: grid;
    /* Ensure grid layout */
    grid-template-columns: 1fr 1fr;
    /* Two equal columns */
    gap: 20px;
    /* Space between the columns */
    margin-bottom: 20px;
    /* Adds space between each grid row */
}

/* Styling for each item in the grid */
.grid-item {
    background-color: #1e1e1e;
    /* Matches environment feature */
    padding: 10px;
    /* Internal padding */
}

/* Textarea styling */
.styled-textarea {
    width: 100%;
    /* Ensures textarea takes full width */
    height: 100px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #222;
    color: #ffffff;
    border: 1px solid #444;
    padding: 10px;
}

/* Output area */
.output-area {
    background-color: #333;
    /* Background for output area */
    color: #ffffff;
    /* Text color for output */
    padding: 10px;
    /* Padding for output area */
    font-family: Arial, sans-serif;
    /* Change font to a more readable one */
    font-size: 16px;
    /* Increase font size for better readability */
}

/* Duplicate checker output section */
.duplicates-section {
    background-color: #1e1e1e;
    padding: 20px;
    border: 1px solid #333;
    border-radius: 4px;
    margin-top: 20px;
    font-family: Arial, sans-serif;
    /* Ensure the same font for duplicate section */
    font-size: 16px;
    /* Increase font size for better readability */
}
</style>