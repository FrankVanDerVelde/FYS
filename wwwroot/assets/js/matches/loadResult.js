// Select the node that will be observed for mutations
const targetNode = document.getElementsByClassName('toegepaste-filters')[0];
var filters = [];
// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: false };
var activeFiltersCount = 0;

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {

    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {

            if(mutation.addedNodes.length >= activeFiltersCount)
            {
                filters.push(mutation);
                activeFiltersCount++;
            }
            else
            {
                filters.pop(mutation);
                activeFiltersCount--;
            }
            console.log(filters);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
//observer.disconnect();
