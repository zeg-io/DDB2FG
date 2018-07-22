const fieldMap = require('./fieldMap')

const applyMap = (charSheet, pdfItem, mapRule) => {
  let to = mapRule.to,
      fieldValue = mapRule.fieldValue,
      position
  
  if (mapRule.position)
    position = mapRule.position
  
  if (mapRule.charCodeAt8226 && fieldValue.charCodeAt(0) === 8226)
    charSheet[to][position] = '1'
  else if (mapRule.bool && fieldValue === 'Yes') {
    if (!charSheet[to])
      charSheet[to] = 0
    charSheet[to] += 1
  } else if (mapRule.ph && position) {
    if (fieldValue === 'P')
      charSheet[to][position] = '1'
    else if (fieldValue === 'H')
      charSheet[to][position] = '3'
  } else if (position)
    charSheet[to][position] = fieldValue
  else
    charSheet[to] = fieldValue
}

const postProcessing = charSheet => {
  const classArray = charSheet.classString.split('/')
  
  charSheet.numClasses = parseInt(classArray.length, 10)
  
  charSheet.isSingleRace = charSheet.charRace.split(' ')
  if (charSheet.isSingleRace.length === 1)
    charSheet.popCharRace = charSheet.isSingleRace[0]
  else if (charSheet.charRace === 'Variant Human')
    charSheet.popCharRace = 'human variant'
  else
    charSheet.popCharRace = charSheet.isSingleRace[1]
  
  // So why pickles? I've named a variable Fred before, but never pickles
  let pickles = charSheet.unformattedProficiencies.fieldValue.split('\n')
  
  for (let b = 0; b < pickles.length; b++) {
    if (pickles[b] === '=== LANGUAGES === ')
      charSheet.charLanguages = pickles[b + 1].split(', ')
    
    if (pickles[b] === '=== ARMOR === ')
      charSheet.charProficiencies.push('Armor: ' + pickles[b + 1])
    else if (pickles[b] === '=== WEAPONS === ')
      charSheet.charProficiencies.push('Weapons: ' + pickles[b + 1])
    else if (pickles[b] === '=== TOOLS === ')
      charSheet.charProficiencies.push('Tools: ' + pickles[b + 1])
  }
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
  
  }
  //$("#textHere").val(JSON.stringify(charArray));
  //buildOutput();
  fileUploaded2(pdfFileName)
  //doPage2();
}

module.exports = parseChar
