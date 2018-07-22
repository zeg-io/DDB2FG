const fieldMap = require('./fieldMap')

const applyMap = (charSheet, pdfItem, mapRule) => {
  if (mapRule.charCodeAt8226 && pdfItem.fieldValue.charCodeAt(0) === 8226)
    charSheet[mapRule.to][mapRule.position] = '1'
  else if (mapRule.bool && pdfItem.fieldValue === 'Yes') {
    if (!charSheet[mapRule.to])
      charSheet[mapRule.to] = 0
    charSheet[mapRule.to] += 1
  } else if (mapRule.ph && mapRule.position) {
    if (pdfItem.fieldValue === 'P')
      charSheet[mapRule.to][mapRule.position] = '1'
    else if (pdfItem.fieldValue === 'H')
      charSheet[mapRule.to][mapRule.position] = '3'
  } else if (mapRule.position)
    charSheet[mapRule.to][mapRule.position] = pdfItem.fieldValue
  else
    charSheet[mapRule.to] = pdfItem.fieldValue
}

const postProcessing = charSheet => {
  const classArray = charSheet.classString
  
}

const parseChar = (charSheet, pdfArray) => {
  fieldMap.forEach(mapRule => {
    // Find field name and value
    const pdfItem = pdfArray.find(f => f.fieldName.trim() === mapRule.from)
    
    applyMap(charSheet, pdfItem, mapRule)
  })
  
  charSheet = postProcessing(charSheet)
}

const parseCharOld = charArray => {
  for (var i = 0; i < charArray.length; i++) {
      // classString = charArray[i].fieldValue
      // classArray = classString.split('/')
      // numClasses = parseInt(classArray.length)
    
      // isSingleRace = charRace.split(' ')
      // if (isSingleRace.length == 1) {
      //   popCharRace = isSingleRace[0]
      // } else {
      //   if (charRace == 'Variant Human') {
      //     popCharRace = 'human variant'
      //   } else {
      //     popCharRace = isSingleRace[1]
      //   }
      // }
    
      // var pickles
      // pickles = charArray[i].fieldValue.split('\n')
      // for (b = 0; b < pickles.length; b++) {
      //   if (pickles[b] == '=== LANGUAGES === ') {
      //     //console.log("Languages: " + pickles[b+1]);
      //     charLanguages = pickles[b + 1].split(', ')
      //   }
      //   if (pickles[b] == '=== ARMOR === ') {
      //     //console.log("Languages: " + pickles[b+1]);
      //     charProficiencies.push('Armor: ' + pickles[b + 1])
      //   } else if (pickles[b] == '=== WEAPONS === ') {
      //     //console.log("Languages: " + pickles[b+1]);
      //     charProficiencies.push('Weapons: ' + pickles[b + 1])
      //   } else if (pickles[b] == '=== TOOLS === ') {
      //     //console.log("Languages: " + pickles[b+1]);
      //     charProficiencies.push('Tools: ' + pickles[b + 1])
      //   }
      // }
  }
  //$("#textHere").val(JSON.stringify(charArray));
  //buildOutput();
  fileUploaded2(pdfFileName)
  //doPage2();
}

module.exports = parseChar
