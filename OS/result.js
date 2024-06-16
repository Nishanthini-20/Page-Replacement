const pages = JSON.parse(localStorage.getItem('pages'));
const capacity = parseInt(localStorage.getItem('capacity'));
const fifoTable =
document.getElementById('fifoTable').getElementsByTagName('tbody')[0];
const lruTable =
document.getElementById('lruTable').getElementsByTagName('tbody')[0];
const optimalTable =
document.getElementById('optimalTable').getElementsByTagName('tbody')[0];
const fifoFaults = document.getElementById('fifoFaults');
const lruFaults = document.getElementById('lruFaults');
const optimalFaults = document.getElementById('optimalFaults');
runAlgorithm(fifoPageReplacement, fifoTable, fifoFaults);
runAlgorithm(lruPageReplacement, lruTable, lruFaults);
runAlgorithm(optimalPageReplacement, optimalTable, optimalFaults);
function runAlgorithm(algorithm, table, faultElement) {
 const result = algorithm(pages, capacity);
 let pageFaults = 0;
 result.forEach(entry => {
 if (entry.fault) pageFaults++;
 const row = table.insertRow();
 const cell1 = row.insertCell(0);
 const cell2 = row.insertCell(1);
 cell1.textContent = entry.page;
 cell2.textContent = `[${entry.memory.join(', ')}]`;
 });
 faultElement.textContent = `Page Faults: ${pageFaults}`;
}
function fifoPageReplacement(pages, capacity) {
 let memory = [];
 let result = [];
 let pageFaults = 0;
 pages.forEach(page => {
 let fault = false;
 if (!memory.includes(page)) {
 pageFaults++;
 fault = true;
 if (memory.length < capacity) {
 memory.push(page);
 } else {
 memory.shift();
 memory.push(page);
 }
 }
 result.push({ page: page, memory: [...memory], fault });
 });
 return result;
}
function lruPageReplacement(pages, capacity) {
 let memory = [];
 let pageOrder = [];
 let result = [];
 let pageFaults = 0;
 pages.forEach(page => {
 let fault = false;
 if (!memory.includes(page)) {
 pageFaults++;
 fault = true;
 if (memory.length < capacity) {
 memory.push(page);
 pageOrder.push(page);
 } else {
 const lruPage = pageOrder.shift();
 memory.splice(memory.indexOf(lruPage), 1);
 memory.push(page);
 pageOrder.push(page);
 }
 } else {
 pageOrder.splice(pageOrder.indexOf(page), 1);
 pageOrder.push(page);
 }
 result.push({ page: page, memory: [...memory], fault });
 });
 return result;
}
function optimalPageReplacement(pages, capacity) {
 let memory = [];
 let result = [];
 let pageFaults = 0;
 pages.forEach((page, i) => {
 let fault = false;
 if (!memory.includes(page)) {
 pageFaults++;
 fault = true;
 if (memory.length < capacity) {
 memory.push(page);
 } else {
 let furthestUse = -1;
 let pageToRemove = memory[0];
 memory.forEach(m => {
 const nextUse = pages.slice(i + 1).indexOf(m);
 if (nextUse === -1) {
 pageToRemove = m;
return false;
 } else if (nextUse > furthestUse) {
 furthestUse = nextUse;
 pageToRemove = m;
 }
 });
 memory.splice(memory.indexOf(pageToRemove), 1);
 memory.push(page);
 }
 }
 result.push({ page: page, memory: [...memory], fault });
 });
 return result;
}
