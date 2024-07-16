// id("surahDIV").style.display = "none";

const api = "QuranApi/";
const surahJson = "surah.json";
let darkMode = false;
let searchMode = "Surah";
let currentSurah = "";


//Change Search Mode
function SearchMode(){
  if (searchMode == "Surah"){
    searchMode = "Quran"
    id("input").placeholder = "...ابحث في القرأن"
    setCssVar("search-mode-btn-color", "#D20000C4", darkMode, "#CA00D2C4")
    id("input").value = ""
  }
  else if (searchMode == "Quran"){
    searchMode = "InSurah";
    id("input").placeholder = "...ابحث في السورة"
    setCssVar("search-mode-btn-color", "#00D228C4", darkMode, "#99D200C4")
    id("input").value = ""
  }
  else if (searchMode == "InSurah"){
    searchMode = "Surah";
    id("input").placeholder = "...اكتب اسم السورة"
    setCssVar("search-mode-btn-color", "#18AFADC4", darkMode, "#AF8518C4")
    id("input").value = ""
  }
}

// Run By Search Mode
function RunBySearchMode() {
  if (searchMode == "Surah"){
    searchSurah();
  }
  else {
    searchAyah();
  }
}

// Short Way to Get Elemnt By Id
function id(id){
  return document.getElementById(id)
}

// Check if Element is in Viewport
function isElementVisible(value) { 
  const item = value.getBoundingClientRect(); 
  return ( 
  item.top >= 0 && 
  item.left >= 0 && 
  item.bottom <= ( 
  window.innerHeight || 
  document.documentElement.clientHeight) && 
  item.right <= ( 
  window.innerWidth || 
  document.documentElement.clientWidth) 
  ); 
}

// Check if Element Height is Enough
function isHeightEnough(element, value) {
  if(element.offsetHeight > value){
    return false
  }
  else {
    return true
  }
}

// Change The value Of Root Css Variable
// Give the Property Name without (--)
function setCssVar(v, value, condition=false, value2) {
  const root = document.querySelector(':root');
  const property = '--'+v;
  root.style.setProperty(property, value)
  if (condition ){
    root.style.setProperty(property, value2)
  }
}

// Dynamically Shrinks Options if out of Space
while(!isHeightEnough(id("optionsDIV"), 50)){
  const tashkelSize = window.getComputedStyle(id("tashkelDIV")).fontSize;
  let tSize = Number(tashkelSize.replace(/\D/g, ""));
  id("tashkelDIV").style.fontSize = (tSize - 2) + "px";
  
  const ayahSize = window.getComputedStyle(id("ayahDIV")).fontSize;
  let aSize = Number(ayahSize.replace(/\D/g, ""));
  id("ayahDIV").style.fontSize = (aSize - 2) + "px";
  
  const darkModeSize = window.getComputedStyle(id("darkModeDIV")).fontSize;
  let dSize = Number(darkModeSize.replace(/\D/g, ""));
  id("darkModeDIV").style.fontSize = (dSize - 2) + "px";
  
  
}

// DarkMode
function DarkMode() {
  setCssVar("bkg-color", "#DCDCDC", darkMode, "#3B3B3B");
  setCssVar("border-color", "#18AFAD", darkMode, "#F2A900");
  setCssVar("border-focused-color", "#1A908D", darkMode, "#B37300");
  setCssVar("text-color", "black", darkMode, "white")
  setCssVar("div-bkg-color","white", darkMode, "#4c4c4c");
  setCssVar("text-inv-color", "white", darkMode, "black");
  setCssVar("stroke-color", "#0E6261", darkMode, "#B37300");
  setCssVar("checkbox-bkg-color", "#E8E8E8", darkMode, "#2E2E2E");
  setCssVar("highlight-color", "#18AFAD4F", darkMode, "#F2A9004F");   setCssVar("input-bkg-color", "white", darkMode, "#4c4c4c");
  if (searchMode == "Quran"){
    setCssVar("search-mode-btn-color", "#D20000C4", darkMode, "#CA00D2C4");
  }
  else if (searchMode == "InSurah") {
    setCssVar("search-mode-btn-color", "#00D228C4", darkMode, "#99D200C4");
  }
  else {
    setCssVar("search-mode-btn-color", "#18AFADC4", darkMode, "#AF8518C4");
  }
}

// Request Ayat From API
/* function ayahJson(surah, ayah){
  if(ayah){
    return `${surah}/${ayah}.json`
  }
  else{
    return `${surah}.json`
  }
} */

// Search Function
// Returns Array With All Matches Up
function searchA(word, array){
  let wordlist = word.split(" ");
  let results = []
  let searchCount = 0;
  
  for (let i of array) {
    let arraylist = i.split(" ");
    for (w of wordlist) {
      if (arraylist.includes(w)) {
        searchCount++;
        if (searchCount == wordlist.length) {
          results.push(i)
          searchCount = 0;
        }
      }
    }
    searchCount = 0;
  }
  return results
}


// SearchSurah Function
async function searchSurah() {
  // Clearing surahDIV & Nav Bar
  id("surahDIV").innerHTML = ''
  id("ayahSearchDIV").style.right = "-50vh";
  
  // Ayah API
  let ayahAPI;
  let ares;
  let adata;
  let ayat;
  
  // Surah API
  let allSurah = [];
  const sres = await fetch("QuranApi/surah.json")
  const sdata = await sres.json()
  sdata.forEach(o => allSurah.push(o.surahNameArabic))
  
  for(let surah of allSurah){
    if (surah === id("input").value){
      ayahAPI = `QuranApi/${allSurah.indexOf(surah) +1}.json`
      currentSurah = allSurah.indexOf(surah) + 1
      ares = await fetch(ayahAPI)
      adata = await ares.json()
      if (id("tashkel").checked){
        ayat = adata.arabic1
      }
      else{
        ayat = adata.arabic2
      }
      
      id("surahDIV").innerHTML += "<p>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>"
      id("surahDIV").style.display = "flex"
    }
    
  }
  
  for(let ayah of ayat){
    id("surahDIV").innerHTML += `<span id="${ayat.indexOf(ayah) + 1}" >${ayah.replaceAll("۟", "ْ")} ${(ayat.indexOf(ayah) + 1).toLocaleString("ar-EG") }<\span>`;
    
  
  }
  DarkMode();
}

// SearchAyah Function 
async function searchAyah() {
  let search = id("input").value.trim();
  id("ayahSearchDIV").style.right = "-50vh";
  
  if (searchMode == "Quran"){
    // Array With All Ayah In
    let allArabic2Ayah = [];
    for(let i = 1;i <= 114;i++){
      const res = await fetch(`QuranApi/${i}.json`)
      const data = await res.json()
      const ayat = await data.arabic2
      const surahNo = await data.surahNo
      
      
      for (ayah of ayat){
        allArabic2Ayah.push(`${surahNo} : ${ayah} : ${ayat.indexOf(ayah)}`)
      }
    }

    
    // Return All Ayah Matches With Search
    let arabic2Results = searchA(search, allArabic2Ayah)
    
    
    // Get Arabic1 Version Of arabic2Results
    let arabic1Results = [];
    for (ayah of arabic2Results){
      const ayahList1 = ayah.split(":");
      let ayahList2 = [];
      for (i of ayahList1){
        ayahList2.push(i.trim())
      }
      
      const res = await fetch(`QuranApi/${ayahList2[0]}.json`)
      
      const data = await res.json();
      
      const arabic1 = data.arabic1;
      
      for (i of arabic1){
        if (arabic1.indexOf(i) == ayahList2[2]){
          arabic1Results.push(`${ayahList2[0]} : ${i.replaceAll("۟", "ْ")} : ${ayahList2[2]}`)
        }
      }
    }
    
    // Cleaning surahDIV 
    id("surahDIV").innerHTML = "";
    
    // Pushing Search Result In surahDIV
    for (let ayah of arabic1Results){
      const ayahList1 = ayah.split(":");
      let ayahList2 = [];
      for (i of ayahList1){
        ayahList2.push(i.trim())
      }
      const surahNo = ayahList2[0];
      const ayahh = ayahList2[1];
      const ayahNo = Number(ayahList2[2]) + 1;
      
      let allSurah = [];
      const sres = await fetch("QuranApi/surah.json")
      const sdata = await sres.json()
      sdata.forEach(o => allSurah.push(o.surahNameArabic))
      
      
      
      id("surahDIV").innerHTML += `<span class="${surahNo} ${ayahNo}">${ayahh} ${ayahNo.toLocaleString("ar-EG")} [${allSurah[surahNo - 1]}]<\span>`
    }
    
  }
  else if (searchMode == "InSurah") {
    console.log("Function Detected")
    const inres = await fetch(`QuranApi/${currentSurah}.json`);
    const indata = await inres.json()
    const ayatList = indata.arabic2;
    
    
    
    
    let searchResult = searchA(search, ayatList);
    let indexOfAyahResult = [];
    for (let i of searchResult){
      indexOfAyahResult.push((ayatList.indexOf(i)) + 1)
    }
    
    id(`${indexOfAyahResult[0]}`).scrollIntoView({
    behavior:'smooth',
    block:'center'
  })
  
  const ope = setInterval(() => {
    if(isElementVisible(id(`${indexOfAyahResult[0]}`))){
      id(`${indexOfAyahResult[0]}`).style.animation = "highlight 2s"
      setTimeout(() => {
        id(`${indexOfAyahResult[0]}`).style.animation = "";
        clearInterval(ope)
      }, 1000)
    }
    
  })
  
  id("ayahSearchDIV").style.right = 0
  
  let indexOfAyahToNavigate = 0;
  function navigateAyah(Ope) {
    if (Ope == "Down"){
      indexOfAyahToNavigate++;
      
      if (indexOfAyahToNavigate > (indexOfAyahResult.length - 1)){
        indexOfAyahToNavigate = 0; 
      }
      
      id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).scrollIntoView({
        behavior: 'auto',
        block: 'center'
      })
    
    
      const ope = setInterval(() => {
      if(isElementVisible(id(`${indexOfAyahResult[indexOfAyahToNavigate]}`))){
        id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).style.animation = "highlight 2s"
        setTimeout(() => {
          id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).style.animation = "";
          clearInterval(ope)
        }, 1000)
      }
      })
      
    
      
    }
    else if (Ope == "Up"){
      indexOfAyahToNavigate--;
      
      if (indexOfAyahToNavigate < 0){
        indexOfAyahToNavigate = 0;
      }
      
      id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).scrollIntoView({
        behavior: 'auto',
        block: 'center'
      })
    
    
      const ope = setInterval(() => {
      if(isElementVisible(id(`${indexOfAyahResult[indexOfAyahToNavigate]}`))){
        id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).style.animation = "highlight 2s"
        setTimeout(() => {
          id(`${indexOfAyahResult[indexOfAyahToNavigate]}`).style.animation = "";
          clearInterval(ope)
        }, 1000)
      }
      })
    }
    else {
      console.log("navigateAyah Function: Invalid Operator")
    }
  }
    
  id("navDown").onclick = () => navigateAyah("Down")
  id("navUp").onclick = () => navigateAyah("Up")
  
  }
  else {
    console.log("Search Mode Undefined")
  }
}

// Ayah Input Change Listenee
id("searchAyah").addEventListener('change', () => {
  let ayah = id("searchAyah").value;
  id(`${ayah}`).scrollIntoView({
    behavior:'smooth',
    block:'center'
  })
  id("searchAyah").value = "";
  
  const ope = setInterval(() => {
    if(isElementVisible(id(`${ayah}`))){
      id(`${ayah}`).style.animation = "highlight 2s"
      setTimeout(() => {
        id(`${ayah}`).style.animation = "";
        clearInterval(ope)
      }, 1000)
    }
  })
  
})

// Taskel Mode Change Listener
id("tashkel").addEventListener('change', () => {
  if (searchMode == "Surah") {
    searchSurah();
    id("searchAyah").value = "";
  }
  
})

// Trigger DarkMode Option
id("darkMode").addEventListener('change', () => {
  
  if (id("darkMode").checked) {
    darkMode = true;
  }
  else {
    darkMode = false
  }
  DarkMode();
})

