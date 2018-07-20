pdfFileName = "";
xmlFile = "";
//PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
//PDFJS.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.js';
PDFJS.workerSrc = 'js/pdf.worker.js';
startXML = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
startXML += "<root version=\"3.3\" release=\"8|CoreRPG:3\">\n";
startXML += "\t<character>\n";
endXML = "\t</character>\n</root>\n";

classArray = [];
profBonus = 0;

// Skills - 0: total; 1: prof
skillAcro = [0, 0];
skillAnim = [0, 0];
skillArca = [0, 0];
skillAthl = [0, 0];
skillDece = [0, 0];
skillHist = [0, 0];
skillInsi = [0, 0];
skillInti = [0, 0];
skillInve = [0, 0];
skillMedi = [0, 0];
skillNatu = [0, 0];
skillPerc = [0, 0];
skillPerf = [0, 0];
skillPers = [0, 0];
skillReli = [0, 0];
skillSlei = [0, 0];
skillStea = [0, 0];
skillSurv = [0, 0];

// Abilities - 0: score; 1: save; 2: savemodifier; 3: saveprof; 4: bonus 
var abilSTR = [0,0,0,0,0];
var abilCHA = [0,0,0,0,0];
var abilCON = [0,0,0,0,0];
var abilDEX = [0,0,0,0,0];
var abilINT = [0,0,0,0,0];
var abilWIS = [0,0,0,0,0];

numClasses = 0;
charName = "";
charBG = "";
charRace = "";
charAlign = "";
charDSS = 0;
charDSF = 0;
charHPmax = 0;
charPassive = 0;
charInit = 0;
charSpeed = "";
charPerTraits = "";
charIdeals = "";
charBonds = "";
charFlaws = "";
charLanguages = [];
charTraits = [];
charFeats = [];
charXP = 0;
charFeatures = [];
charProficiencies = [];
charPage1 = [];
charPage2 = [];
charPage3 = [];
charAge = "";
charHeight = "";
charWeight = "";
charEyes = "";
charSkin = "";
charHair = "";
charCP = "";
charSP = "";
charEP = "";
charGP = "";
charPP = "";
charSenses = "";
charFT1 = "";
charFT2 = "";
charFT3 = "";
charFTfull = "";
startFeatures = 0;
endFeatures = 0;
startTraits = 0;
endTraits = 0;
startFeats = 0;
endFeats = 0;
featTraitArray = [];
allFeatures = [];
allTraits = [];
allFeats = [];

charRef = 0;
popCharRace = "";

hasAppear = 0;

charSpellCan = [];
charSpell1st = [];
charSpell2nd = [];
charSpell3rd = [];
charSpell4th = [];
charSpell5th = [];
charSpell6th = [];
charSpell7th = [];
charSpell8th = [];
charSpell9th = [];
charSpellSlots1 = "";
charSpellSlots2 = "";
charSpellSlots3 = "";
charSpellSlots4 = "";
charSpellSlots5 = "";
charSpellSlots6 = "";
charSpellSlots7 = "";
charSpellSlots8 = "";
charSpellSlots9 = "";

$(function() {
   //console.log( "DOM ready!");
   
   //$("#pdfUpload").hide();
   
   var uploadObj = $("#fileuploader").uploadFile({
      url:"upload.php",
      multiple:false,
      dragDrop:true,
      maxFileCount:1,
      fileName:"myfile",
      allowedTypes: "pdf",
      onSuccess:function(files,data,xhr,pd) {
         $("#pdfUpload").show();
         //files: list of files
         //data: response from server
         //xhr : jquer xhr object
         pdfFileName = "uploads/" + JSON.parse(data)[0];
         xmlFile = (JSON.parse(data)[0]).replace(/\.[^/.]+$/, "");
         fileUploaded1(pdfFileName);
         //fileUploaded2(pdfFileName);
         //fileUploaded3(pdfFileName);
      }
   });
   
   $("#copyoutput").on( "click", function() {
      if ($("#textHere").val() == "") {
         alert("You haven't generated the data yet.");
         return;
      }
      var pcFilename = xmlFile + ".xml";
      
      var textFile = new Blob([$("#textHere").val()], {
         type: 'text/plain'
      });
      invokeSaveAsDialog(textFile, pcFilename);
   });
   
   $(".clearme").on("click", function() {
       reset_character();
       uploadObj.reset();
   });

   $("input[name=char_ref").on("click", function() {
      switch($(this).val()) {
         case "no":
            charRef = 0;
            break;
         case "yes":
            charRef = 1;
            break;
         default:
            charRef = 0;
      }
   });

   $("#pdfUpload").hide();
   
   //parseChar(charPage1, charPage2, charPage3);
});

function fileUploaded1(pdfName) {
   var loadingTask1 = PDFJS.getDocument(pdfName);
   loadingTask1.promise.then(function(pdf) {
      //console.log('PDF loaded');
      var pageNumber = 1;
      pdf.getPage(pageNumber).then(function(page) {
         //console.log('Page loaded');
         page.getAnnotations().then(function(annotationContent) {
            charPage1 = annotationContent;
            parseChar(charPage1);
         });
      }, function (reason) {
         // PDF loading error
         console.error(reason);
      });
   });
}

function fileUploaded2(pdfName) {
   var loadingTask2 = PDFJS.getDocument(pdfName);
   loadingTask2.promise.then(function(pdf2) {
      //console.log('PDF loaded');
      var pageNumber = 2;
      pdf2.getPage(pageNumber).then(function(page2) {
         //console.log('Page loaded');
         page2.getAnnotations().then(function(annotationContent2) {
            charPage2 = annotationContent2;
            doPage2(charPage2);
         });
      }, function (reason) {
         // PDF loading error
         console.error(reason);
      });
   });
}

function fileUploaded3(pdfName) {
   var loadingTask3 = PDFJS.getDocument(pdfName);
   loadingTask3.promise.then(function(pdf) {
      //console.log('PDF loaded');
      var pageNumber = 3;
      pdf.getPage(pageNumber).then(function(page) {
         //console.log('Page loaded');
         page.getAnnotations().then(function(annotationContent) {
            charPage3 = annotationContent;
            //parseChar(charPage3);
            doPage3(charPage3);
         });
      }, function (reason) {
         // PDF loading error
         console.error(reason);
      });
   });
}

function parseChar(charArray) {
   //console.log("Array 1: " + charArray1.length);
   //console.log("Array 2: " + charArray2.length);
   //console.log("Array 3: " + charArray3.length);
   
   //while ((charArray1.length < 1) || (charArray2.length < 1) || (charArray3.length < 1)) {
   //   // Wait until charArray is populated?)
   //}
   while (charArray.length < 1) {
      // Wait until charArray is populated?)
   }
   // Try to concatenate json objects
   //var charArray = charArray1.concat(charArray2).concat(charArray3);
   //charArray = charArray1;
   //console.log("Total Array : " + charArray.length);
   //for (var i = 0; i < charArray.length; i++) {
   // $('#textHere').append(charArray[i].fieldName + "-->" + charArray[i].fieldValue + "\n");
   //}
   //return(1);
   for (var i = 0; i < charArray.length; i++) {
      if (charArray[i].fieldName == "CHamod") {
         abilCHA[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "STRmod") {
         abilSTR[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "CONmod") {
         abilCON[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "INTmod") {
         abilINT[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "WISmod") {
         abilWIS[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "DEXmod ") {
         abilDEX[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "CHA") {
         abilCHA[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "STR") {
         abilSTR[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "CON") {
         abilCON[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "INT") {
         abilINT[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "WIS") {
         abilWIS[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "DEX") {
         abilDEX[4] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Charisma") {
         abilCHA[1] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Strength") {
         abilSTR[1] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Constitution") {
         abilCON[1] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Intelligence") {
         abilINT[1] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Wisdom") {
         abilWIS[1] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ST Dexterity") {
         abilDEX[1] = charArray[i].fieldValue;
      } else if ((charArray[i].fieldName == "StrProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilSTR[3] = "1";
      } else if ((charArray[i].fieldName == "DexProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilDEX[3] = "1";
      } else if ((charArray[i].fieldName == "ConProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilCON[3] = "1";
      } else if ((charArray[i].fieldName == "IntProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilINT[3] = "1";
      } else if ((charArray[i].fieldName == "WisProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilWIS[3] = "1";
      } else if ((charArray[i].fieldName == "ChaProf") && (charArray[i].fieldValue.charCodeAt(0) == 8226)) {
         abilCHA[3] = "1";
      } else if (charArray[i].fieldName == "CharacterName") {
         charName = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "CLASS  LEVEL") {
         classString = charArray[i].fieldValue;
         classArray = classString.split("/");
         numClasses = parseInt(classArray.length);
      } else if (charArray[i].fieldName == "ProfBonus") {
         profBonus = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Acrobatics") {
         skillAcro[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Animal") {
         skillAnim[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Arcana") {
         skillArca[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Athletics") {
         skillAthl[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Deception ") {
         skillDece[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "History ") {
         skillHist[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Insight") {
         skillInsi[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Intimidation") {
         skillInti[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Investigation ") {
         skillInve[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Medicine") {
         skillMedi[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Nature") {
         skillNatu[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Perception ") {
         skillPerc[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Performance") {
         skillPerf[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Persuasion") {
         skillPers[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Religion") {
         skillReli[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "SleightofHand") {
         skillSlei[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Stealth ") {
         skillStea[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Survival") {
         skillSurv[0] = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "AcrobaticsProf") {
          if (charArray[i].fieldValue == "P") {
             skillAcro[1] = "1";
          } else if (charArray[i].fieldValue == "H") {
            skillAcro[1] = "3";
          }
      } else if (charArray[i].fieldName == "AnimalHandlingProf") {
          if (charArray[i].fieldValue == "P") {
             skillAnim[1] = "1";
          } else if (charArray[i].fieldValue == "H") {
             skillAnim[1] = "3";
          }
      } else if (charArray[i].fieldName == "ArcanaProf") {
          if (charArray[i].fieldValue == "P") {
             skillArca[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillArca[1] = "3";
            }
      } else if (charArray[i].fieldName == "AthleticsProf") {
          if (charArray[i].fieldValue == "P") {
             skillAthl[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillAthl[1] = "3";
            }
      } else if (charArray[i].fieldName == "DeceptionProf") {
          if (charArray[i].fieldValue == "P") {
             skillDece[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillDece[1] = "3";
            }
      } else if (charArray[i].fieldName == "HistoryProf") {
          if (charArray[i].fieldValue == "P") {
             skillHist[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillHist[1] = "3";
            }
      } else if (charArray[i].fieldName == "InsightProf") {
          if (charArray[i].fieldValue == "P") {
             skillInsi[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillInsi[1] = "3";
            }
      } else if (charArray[i].fieldName == "IntimidationProf")  {
          if (charArray[i].fieldValue == "P") {
             skillInti[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillInti[1] = "3";
            }
      } else if (charArray[i].fieldName == "InvestigationProf")  {
          if (charArray[i].fieldValue == "P") {
             skillInve[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillInve[1] = "3";
            }
      } else if (charArray[i].fieldName == "MedicineProf")  {
          if (charArray[i].fieldValue == "P") {
             skillMedi[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillMedi[1] = "3";
            }
      } else if (charArray[i].fieldName == "NatureProf")  {
          if (charArray[i].fieldValue == "P") {
             skillNatu[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillNatu[1] = "3";
            }
      } else if (charArray[i].fieldName == "PerceptionProf")  {
          if (charArray[i].fieldValue == "P") {
             skillPerc[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillPerc[1] = "3";
            }
      } else if (charArray[i].fieldName == "PerformanceProf")  {
          if (charArray[i].fieldValue == "P") {
             skillPerf[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillPerf[1] = "3";
            }
      } else if (charArray[i].fieldName == "PersuasionProf")  {
          if (charArray[i].fieldValue == "P") {
             skillPers[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillPers[1] = "3";
            }
      } else if (charArray[i].fieldName == "ReligionProf")  {
          if (charArray[i].fieldValue == "P") {
             skillReli[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillReli[1] = "3";
            }
      } else if (charArray[i].fieldName == "SleightOfHandProf")  {
          if (charArray[i].fieldValue == "P") {
             skillSlei[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillSlei[1] = "3";
            }
      } else if (charArray[i].fieldName == "StealthProf")  {
          if (charArray[i].fieldValue == "P") {
             skillStea[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillStea[1] = "3";
            }
      } else if (charArray[i].fieldName == "SurvivalProf")  {
          if (charArray[i].fieldValue == "P") {
             skillSurv[1] = "1";
            } else if (charArray[i].fieldValue == "H") {
                skillSurv[1] = "3";
            }
      } else if (charArray[i].fieldName == "BACKGROUND") {
         charBG = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "RACE") {
         //console.log(charArray[i].fieldValue);
         charRace = charArray[i].fieldValue;
         
         isSingleRace = charRace.split(" ");
         if (isSingleRace.length == 1) {
            popCharRace = isSingleRace[0];
         } else {
            if (charRace == "Variant Human") {
               popCharRace = "human variant";
            } else {
               popCharRace = isSingleRace[1];
            }
         }
      } else if (charArray[i].fieldName == "Alignment") {
         charAlign = charArray[i].fieldValue;
      } else if ((charArray[i].fieldName == "Check Box 12") && (charArray[i].fieldValue == "Yes")) {
         charDSS += 1;
      } else if ((charArray[i].fieldName == "Check Box 13") && (charArray[i].fieldValue == "Yes")) {
         charDSS += 1;
      } else if ((charArray[i].fieldName == "Check Box 14") && (charArray[i].fieldValue == "Yes")) {
         charDSS += 1;
      } else if ((charArray[i].fieldName == "Check Box 15") && (charArray[i].fieldValue == "Yes")) {
         charDSF += 1;
      } else if ((charArray[i].fieldName == "Check Box 16") && (charArray[i].fieldValue == "Yes")) {
         charDSF += 1;
      } else if ((charArray[i].fieldName == "Check Box 17") && (charArray[i].fieldValue == "Yes")) {
         charDSF += 1;
      } else if (charArray[i].fieldName == "MaxHP") {
         charHPmax = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Passive1") {
         charPassive = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Init") {
         charInit = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Speed") {
         charSpeed = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "PersonalityTraits ") {
         charPerTraits = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Ideals") {
         charIdeals = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Bonds") {
         charBonds = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "Flaws") {
         charFlaws = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "ProficienciesLang") {
      //   charLanguages = charArray[i].fieldValue.split('\n\n')[0].split(':')[1].replace(/,\s*$/, "").split(', ');
      //   charProficiencies = charArray[i].fieldValue.split('\n\nProficiencies:')[1].replace(/,\s*$/, "").split(', ');
      //   charProficiencies.forEach(function(s) {
      //      var regex1 = /Saving Throws|Athletics|Acrobatics|Animal Handling|Arcana|Deception|History|Insight|Intimidation|Investigation|Medicine|Nature|Perception|Performance|Persuasion|Religion|Sleight of Hand|Stealth|Survival/;
      //      if (regex1.test(s)) {
      //         var index = charProficiencies.indexOf(s);
      //         if (index !== -1) {
      //            charProficiencies.splice(index, 1);
      //         }
      //      }
      //   });
        var pickles;
        pickles = charArray[i].fieldValue.split("\n");
        for (b = 0; b < pickles.length; b++) {
            if (pickles[b] == "=== LANGUAGES === ") {
                //console.log("Languages: " + pickles[b+1]);
                charLanguages = pickles[b+1].split(', ');
            }
            if (pickles[b] == "=== ARMOR === ") {
                //console.log("Languages: " + pickles[b+1]);
                charProficiencies.push("Armor: " + pickles[b+1]);
            } else if (pickles[b] == "=== WEAPONS === ") {
                //console.log("Languages: " + pickles[b+1]);
                charProficiencies.push("Weapons: " + pickles[b+1]);
            } else if (pickles[b] == "=== TOOLS === ") {
                //console.log("Languages: " + pickles[b+1]);
                charProficiencies.push("Tools: " + pickles[b+1]);
            } 
        }
      } else if (charArray[i].fieldName == "Features and Traits") {
         //charTraits = charArray[i].fieldValue.split('Traits:\n- ')[1].replace(/,\s*$/, "").replace(/- /g, "").replace(/\n$/, '').split('\n');
         //charFeatures = charArray[i].fieldValue.split(':\n- ')[1].split('Traits:\n-')[0].replace(/- /g, "").replace(/,\s*$/, "").split('\n');
      } else if (charArray[i].fieldName == "XP") {
         charXP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "CP") {
         charCP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "SP") {
         charSP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "EP") {
         charEP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "GP") {
         charGP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "PP") {
         charPP = charArray[i].fieldValue;
      } else if (charArray[i].fieldName == "AdditionalSenses") {
        charSenses = charArray[i].fieldValue;
      }
   }
   //$("#textHere").val(JSON.stringify(charArray));
   //buildOutput();
   fileUploaded2(pdfFileName);
   //doPage2();
}

function buildOutput() {
   allXML = startXML;
   buildXML = "";
   buildXML += "\t\t<abilities>\n";
   buildXML += "\t\t\t<charisma>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilCHA[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilCHA[1]) + "</save>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilCHA[3]) + "</saveprof>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilCHA[0]) + "</score>\n";
   buildXML += "\t\t\t</charisma>\n";
   buildXML += "\t\t\t<strength>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilSTR[0]) + "</score>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilSTR[1]) + "</save>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilSTR[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilSTR[3]) + "</saveprof>\n";
   buildXML += "\t\t\t</strength>\n";
   buildXML += "\t\t\t<constitution>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilCON[0]) + "</score>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilCON[1]) + "</save>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilCON[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilCON[3]) + "</saveprof>\n";
   buildXML += "\t\t\t</constitution>\n";
   buildXML += "\t\t\t<dexterity>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilDEX[0]) + "</score>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilDEX[1]) + "</save>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilDEX[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilDEX[3]) + "</saveprof>\n";
   buildXML += "\t\t\t</dexterity>\n";
   buildXML += "\t\t\t<intelligence>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilINT[0]) + "</score>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilINT[1]) + "</save>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilINT[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilINT[3]) + "</saveprof>\n";
   buildXML += "\t\t\t</intelligence>\n";
   buildXML += "\t\t\t<wisdom>\n";
   buildXML += "\t\t\t\t<savemodifier type=\"number\">0</savemodifier>\n";
   buildXML += "\t\t\t\t<score type=\"number\">" + parseInt(abilWIS[0]) + "</score>\n";
   buildXML += "\t\t\t\t<save type=\"number\">" + parseInt(abilWIS[1]) + "</save>\n";
   buildXML += "\t\t\t\t<bonus type=\"number\">" + parseInt(abilWIS[4]) + "</bonus>\n";
   buildXML += "\t\t\t\t<saveprof type=\"number\">" + parseInt(abilWIS[3]) + "</saveprof>\n";
   buildXML += "\t\t\t</wisdom>\n";
   buildXML += "\t\t</abilities>\n";
   buildXML += "\t\t<name type=\"string\">" + charName + "</name>\n";
   buildXML += "\t\t<background type=\"string\">" + charBG + "</background>\n";

   if (charRef > 0) {
      buildXML += "\t\t<backgroundlink type=\"windowreference\">\n";
      buildXML += "\t\t\t<class>reference_background</class>\n";
      buildXML += "\t\t\t<recordname>reference.backgrounddata." + charBG.toLowerCase() + "@*</recordname>\n";
      buildXML += "\t\t</backgroundlink>\n";
   }

   buildXML += "\t\t<alignment type=\"string\">" + charAlign + "</alignment>\n";
   buildXML += "\t\t<race type=\"string\">" + charRace + "</race>\n";
   if (charRef > 0) {
      buildXML += "\t\t<racelink type=\"windowreference\">\n";
      buildXML += "\t\t\t<class>reference_race</class>\n";
      buildXML += "\t\t\t<recordname>reference.racedata." + replaceDash(popCharRace.toLowerCase()) + "@*</recordname>\n";
      buildXML += "\t\t</racelink>\n";
   }
   buildXML += "\t\t<senses type=\"string\">" + charSenses + "</senses>\n"
   buildXML += "\t\t<perception type=\"number\">" + parseInt(charPassive) + "</perception>\n";
   
   buildXML += "\t\t<hp>\n";
   buildXML += "\t\t\t<deathsavefail type=\"number\">" + parseInt(charDSF) + "</deathsavefail>\n";
   buildXML += "\t\t\t<deathsavesuccess type=\"number\">" + parseInt(charDSS) + "</deathsavesuccess>\n";
   buildXML += "\t\t\t<total type=\"number\">" + parseInt(charHPmax) + "</total>\n";
   buildXML += "\t\t</hp>\n";
   
   buildXML += "\t\t<initiative>\n";
	buildXML += "\t\t\t<misc type=\"number\">0</misc>\n";
	buildXML += "\t\t\t<temporary type=\"number\">0</temporary>\n";
	buildXML += "\t\t\t<total type=\"number\">" + parseInt(charInit) + "</total>\n";
	buildXML += "\t\t</initiative>\n";
   
   buildXML += "\t\t<speed>\n";
   buildXML += "\t\t\t<armor type=\"number\">0</armor>\n";
	buildXML += "\t\t\t<base type=\"number\">" + parseInt(charSpeed) + "</base>\n";
	buildXML += "\t\t\t<misc type=\"number\">0</misc>\n";
	buildXML += "\t\t\t<temporary type=\"number\">0</temporary>\n";
	buildXML += "\t\t\t<total type=\"number\">" + parseInt(charSpeed) + "</total>\n";
   buildXML += "\t\t</speed>\n";
   
   buildXML += "\t\t<personalitytraits type=\"string\">" + fixQuote(charPerTraits) + "</personalitytraits>\n";
   buildXML += "\t\t<ideals type=\"string\">" + fixQuote(charIdeals) + "</ideals>\n";
   buildXML += "\t\t<bonds type=\"string\">" + fixQuote(charBonds) + "</bonds>\n";
   buildXML += "\t\t<flaws type=\"string\">" + fixQuote(charFlaws) + "</flaws>\n";
   
   buildXML += "\t\t<classes>\n";
   for (var i = 0; i < numClasses; i++) {  
      thisIteration = pad(i + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";

      thisClass = trim1(classArray[i]);
      thisClass = thisClass.split(" ");
      className = thisClass[0];
      classLevel = thisClass[1];

      buildXML += "\t\t\t\t<hddie type=\"dice\">";

      if (className == "Fighter") {
         buildXML += "d10";
      } else if (className == "Barbarian") {
         buildXML += "d12";
      } else if (className == "Bard") {
         buildXML += "d8";
      } else if (className == "Cleric") {
         buildXML += "d8";
      } else if (className == "Druid") {
         buildXML += "d8";
      } else if (className == "Monk") {
         buildXML += "d8";
      } else if (className == "Paladin") {
         buildXML += "d10";
      } else if (className == "Ranger") {
         buildXML += "d10";
      } else if (className == "Rogue") {
         buildXML += "d8";
      } else if (className == "Sorcerer") {
         buildXML += "d6";
      } else if (className == "Warlock") {
         buildXML += "d8";
      } else if (className == "Wizard") {
         buildXML += "d6";
      }
      buildXML += "</hddie>\n";
      buildXML += "\t\t\t\t<profbonus type=\"number\">" + parseInt(profBonus) + "</profbonus>\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + thisClass[0] + "</name>\n";
      buildXML += "\t\t\t\t<level type=\"number\">" + thisClass[1] + "</level>\n";
      if (charRef > 0) {
         buildXML += "\t\t\t\t<shortcut type=\"windowreference\">\n";
         buildXML += "\t\t\t\t\t<class>reference_class</class>\n";
         buildXML += "\t\t\t\t\t<recordname>reference.classdata." + className.toLowerCase() + "@*</recordname>\n";
         buildXML += "\t\t\t\t</shortcut>\n";
      }
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</classes>\n";
   
   // Skills
   buildXML += "\t\t<skilllist>\n";
   buildXML += "\t\t\t<id-00001>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Perception</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillPerc[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">wisdom</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillPerc[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00001>\n";
   buildXML += "\t\t\t<id-00002>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Insight</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillInsi[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">wisdom</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillInsi[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00002>\n";
   buildXML += "\t\t\t<id-00003>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Religion</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillReli[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">intelligence</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillReli[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00003>\n";
   buildXML += "\t\t\t<id-00004>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Animal Handling</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillAnim[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">wisdom</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillAnim[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00004>\n";
   buildXML += "\t\t\t<id-00005>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Nature</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillNatu[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">intelligence</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillNatu[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00005>\n";
   buildXML += "\t\t\t<id-00006>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Arcana</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillArca[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">intelligence</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillArca[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00006>\n";
   buildXML += "\t\t\t<id-00007>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Persuasion</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillPers[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">charisma</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillPers[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00007>\n";
   buildXML += "\t\t\t<id-00008>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Medicine</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillMedi[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">wisdom</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillMedi[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00008>\n";
   buildXML += "\t\t\t<id-00009>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Survival</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillSurv[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">wisdom</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillSurv[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00009>\n";
   buildXML += "\t\t\t<id-00010>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Performance</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillPerf[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">charisma</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillPerf[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00010>\n";
   buildXML += "\t\t\t<id-00011>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Acrobatics</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillAcro[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">dexterity</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillAcro[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00011>\n";
   buildXML += "\t\t\t<id-00012>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Athletics</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillAthl[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">strength</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillAthl[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00012>\n";
   buildXML += "\t\t\t<id-00013>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Sleight of Hand</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillSlei[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">dexterity</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillSlei[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00013>\n";
   buildXML += "\t\t\t<id-00014>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Intimidation</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillInti[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">charisma</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillInti[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00014>\n";
   buildXML += "\t\t\t<id-00015>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Deception</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillDece[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">charisma</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillDece[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00015>\n";
   buildXML += "\t\t\t<id-00016>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Investigation</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillInve[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">intelligence</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillInve[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00016>\n";
   buildXML += "\t\t\t<id-00017>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">Stealth</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillStea[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">dexterity</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillStea[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00017>\n";
   buildXML += "\t\t\t<id-00018>\n";
   buildXML += "\t\t\t\t<misc type=\"number\">0</misc>\n";
   buildXML += "\t\t\t\t<name type=\"string\">History</name>\n";
   buildXML += "\t\t\t\t<prof type=\"number\">" + parseInt(skillHist[1]) + "</prof>\n";
   buildXML += "\t\t\t\t<stat type=\"string\">intelligence</stat>\n";
   buildXML += "\t\t\t\t<total type=\"number\">" + parseInt(skillHist[0]) + "</total>\n";
   buildXML += "\t\t\t</id-00018>\n";
   buildXML += "\t\t</skilllist>\n";
   
   buildXML += "\t\t<languagelist>\n";
   for (l = 0; l < charLanguages.length; l++) {
      thisIteration = pad(l + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + charLanguages[l] + "</name>\n";
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</languagelist>\n";
   
   buildXML += "\t\t<traitlist>\n";
   for (m = 0; m < allTraits.length; m++) {
      thisIteration = pad(m + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";
      buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + allTraits[m] + "</name>\n";
      buildXML += "\t\t\t\t<source type=\"string\">" + convert_case(popCharRace) + "</source>\n";
      buildXML += "\t\t\t\t<type type=\"string\">racial</type>\n";
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</traitlist>\n";
   
   buildXML += "\t\t<featurelist>\n";
   for (n = 0; n < allFeatures.length; n++) {
      thisIteration = pad(n + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";
      buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + fixQuote(allFeatures[n]) + "</name>\n";
      buildXML += "\t\t\t\t<source type=\"string\">" + convert_case(charBG) + "</source>\n";
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</featurelist>\n";

   buildXML += "\t\t<featlist>\n";
   for (n = 0; n < allFeats.length; n++) {
      thisIteration = pad(n + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";
      buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + fixQuote(allFeats[n]) + "</name>\n";
      buildXML += "\t\t\t\t<source type=\"string\">" + convert_case(charBG) + "</source>\n";
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</featlist>\n";
   
   buildXML += "\t\t<proficiencylist>\n";
   for (o = 0; o < charProficiencies.length; o++) {
      thisIteration = pad(o + 1, 5);
      buildXML += "\t\t\t<id-" + thisIteration + ">\n";
      buildXML += "\t\t\t\t<name type=\"string\">" + fixQuote(charProficiencies[o]) + "</name>\n";
      buildXML += "\t\t\t</id-" + thisIteration + ">\n";
   }
   buildXML += "\t\t</proficiencylist>\n";
   
   buildXML += "\t\t<exp type=\"number\">" + parseInt(charXP) + "</exp>\n";
   buildXML += "\t\t<age type=\"string\">" + fixQuote(charAge) + "</age>\n";
   buildXML += "\t\t<height type=\"string\">" + fixQuote(charHeight) + "</height>\n";
   buildXML += "\t\t<weight type=\"string\">" + fixQuote(charWeight) + "</weight>\n";
   buildXML += "\t\t<gender type=\"string\">" + fixQuote(charGender) + "</gender>\n";

   
   // Build up Eyes, Hair & Skin if present
   if (charEyes != "") {
      hasAppear += 1; 
   }
   if (charHair != "") {
      hasAppear += 2;
   }
   if (charSkin != "") {
      hasAppear += 4;
   }
   
   // Only populate if PC has specific entries for the following
   if (hasAppear == 1) {
      buildXML += "\t\t<appearance type=\"string\">Eyes: " + fixQuote(charEyes) + "</appearance>\n";
   } else if (hasAppear == 2) {
      buildXML += "\t\t<appearance type=\"string\">Hair: " + fixQuote(charHair) + "</appearance>\n";
   } else if (hasAppear == 3) {
      buildXML += "\t\t<appearance type=\"string\">Eyes: " + fixQuote(charEyes) + "\\nHair: " + fixQuote(charHair) + "</appearance>\n";
   } else if (hasAppear == 4) {
      buildXML += "\t\t<appearance type=\"string\">Skin: " + fixQuote(charSkin) + "</appearance>\n";
   } else if (hasAppear == 5) {
      buildXML += "\t\t<appearance type=\"string\">Eyes: " + fixQuote(charEyes) + "\\nSkin: " + fixQuote(charSkin) + "</appearance>\n";
   } else if (hasAppear == 6) {
      buildXML += "\t\t<appearance type=\"string\">Hair: " + fixQuote(charHair) + "\\nSkin: " + fixQuote(charSkin) + "</appearance>\n";
   } else if (hasAppear == 7) {
      buildXML += "\t\t<appearance type=\"string\">Eyes: " + fixQuote(charEyes) + "\\nHair: " + fixQuote(charHair) + "\\nSkin: " + fixQuote(charSkin) + "</appearance>\n";

   }

   buildXML += "\t\t<coins>\n";
   buildXML += "\t\t\t<slot1>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">" + parseInt(charPP) + "</amount>\n";
   buildXML += "\t\t\t\t<name type=\"string\">PP</name>\n";
   buildXML += "\t\t\t</slot1>\n";
   buildXML += "\t\t\t<slot2>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">" + parseInt(charGP) + "</amount>\n";
   buildXML += "\t\t\t\t<name type=\"string\">GP</name>\n";
   buildXML += "\t\t\t</slot2>\n";
   buildXML += "\t\t\t<slot3>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">" + parseInt(charEP) + "</amount>\n";
   buildXML += "\t\t\t\t<name type=\"string\">EP</name>\n";
   buildXML += "\t\t\t</slot3>\n";
   buildXML += "\t\t\t<slot4>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">" + parseInt(charSP) + "</amount>\n";
   buildXML += "\t\t\t\t<name type=\"string\">SP</name>\n";
   buildXML += "\t\t\t</slot4>\n";
   buildXML += "\t\t\t<slot5>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">" + parseInt(charCP) + "</amount>\n";
   buildXML += "\t\t\t\t<name type=\"string\">CP</name>\n";
   buildXML += "\t\t\t</slot5>\n";
   buildXML += "\t\t\t<slot6>\n";
   buildXML += "\t\t\t\t<amount type=\"number\">0</amount>\n";
   buildXML += "\t\t\t</slot6>\n";
   buildXML += "\t\t</coins>\n";

   buildXML += "\t\t<deity type=\"string\">" + fixQuote(charDeity) + "</deity>\n";

   // Let's try to get Size populated
   if ((popCharRace == "halfling") || (popCharRace == "gnome")) {
      buildXML += "\t\t<size type=\"string\">Small</size>\n";
   } else {
      buildXML += "\t\t<size type=\"string\">Medium</size>\n";
   }

   // Weak attempt at spells, so much is built into FG
   buildXML += "\t\t<powers>\n";

   charTotalSpells = 0;
   charSpellCan.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">0</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell1st.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">1</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell2nd.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">2</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell3rd.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">3</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell4th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">4</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell5th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">5</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell6th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">6</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell7th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">7</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell8th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">8</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   charSpell9th.forEach(function(element) {
      if (element !== "") {
         charTotalSpells += 1;
         thisIteration = pad(charTotalSpells, 5);
         buildXML += "\t\t\t<id-" + thisIteration + ">\n";
         buildXML += "\t\t\t\t<group type=\"string\">Spells</group>\n";
         buildXML += "\t\t\t\t<level type=\"number\">9</level>\n";
         buildXML += "\t\t\t\t<locked type=\"number\">1</locked>\n";
         buildXML += "\t\t\t\t<name type=\"string\">" + element + "</name>\n";
         buildXML += "\t\t\t</id-" + thisIteration + ">\n";
      }
   });
   buildXML += "\t\t</powers>\n";
   
   buildXML += "\t\t<powermeta>\n";
   
   buildXML += "\t\t\t<spellslots1>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots1) + "</max>\n";
	buildXML += "\t\t\t</spellslots1>\n";
   buildXML += "\t\t\t<spellslots2>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots2) + "</max>\n";
	buildXML += "\t\t\t</spellslots2>\n";
   buildXML += "\t\t\t<spellslots3>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots3) + "</max>\n";
	buildXML += "\t\t\t</spellslots3>\n";
   buildXML += "\t\t\t<spellslots4>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots4) + "</max>\n";
	buildXML += "\t\t\t</spellslots4>\n";
   buildXML += "\t\t\t<spellslots5>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots5) + "</max>\n";
	buildXML += "\t\t\t</spellslots5>\n";
   buildXML += "\t\t\t<spellslots6>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots6) + "</max>\n";
	buildXML += "\t\t\t</spellslots6>\n";
   buildXML += "\t\t\t<spellslots7>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots7) + "</max>\n";
	buildXML += "\t\t\t</spellslots7>\n";
   buildXML += "\t\t\t<spellslots8>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots8) + "</max>\n";
	buildXML += "\t\t\t</spellslots8>\n";
   buildXML += "\t\t\t<spellslots9>\n";
	buildXML += "\t\t\t\t<max type=\"number\">" + parseInt(charSpellSlots9) + "</max>\n";
	buildXML += "\t\t\t</spellslots9>\n";
   
   buildXML += "\t\t</powermeta>\n";
   
   allXML += buildXML + endXML;
   $('#textHere').val(allXML);
}

function trim1 (str) {
   return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function pad(num, size) {
   var s = num + "";
    
   while (s.length < size) s = "0" + s;
   return s;
}

function fixQuote(badString) {
   return badString.replace(/\n/g, '\\n').replace(/\u2019/g, "'").replace(/\u2014/g, "-").replace(/"/g, "&#34;").replace(/\u2022/g, ":");
   //console.log("Pickles: " + "—".charCodeAt(0));
}

function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        file.type = 'video/webm';
    }

    var fileExtension = file.type.split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}

function convert_case(str) {
  var lower = str.toLowerCase();
  return lower.replace(/(^| )(\w)/g, function(x) {
    return x.toUpperCase();
  });
}

function replaceDash(str) {
   firstStep = str.replace(/-/g, "_");
   return firstStep.replace(/ /g, "_");
}

function removeEntry(array, element) {
    const index = array.indexOf(element);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function reset_character() {
   pdfFileName = "";
   xmlFile = "";
   classArray = [];
   profBonus = 0;
   skillAcro = [0, 0];
   skillAnim = [0, 0];
   skillArca = [0, 0];
   skillAthl = [0, 0];
   skillDece = [0, 0];
   skillHist = [0, 0];
   skillInsi = [0, 0];
   skillInti = [0, 0];
   skillInve = [0, 0];
   skillMedi = [0, 0];
   skillNatu = [0, 0];
   skillPerc = [0, 0];
   skillPerf = [0, 0];
   skillPers = [0, 0];
   skillReli = [0, 0];
   skillSlei = [0, 0];
   skillStea = [0, 0];
   skillSurv = [0, 0];
   var abilSTR = [0,0,0,0,0];
   var abilCHA = [0,0,0,0,0];
   var abilCON = [0,0,0,0,0];
   var abilDEX = [0,0,0,0,0];
   var abilINT = [0,0,0,0,0];
   var abilWIS = [0,0,0,0,0];
   numClasses = 0;
   charName = "";
   charBG = "";
   charRace = "";
   charAlign = "";
   charDSS = 0;
   charDSF = 0;
   charHPmax = 0;
   charPassive = 0;
   charInit = 0;
   charSpeed = "";
   charPerTraits = "";
   charIdeals = "";
   charBonds = "";
   charFlaws = "";
   charDeity = "";
   charLanguages = [];
   charTraits = [];
   charFeats = [];
   charXP = 0;
   charFeatures = [];
   charProficiencies = [];
   charRef = 0;
   popCharRace = "";
   charAge = "";
   charHeight = "";
   charWeight = "";
   charGender = "";
   charEyes = "";
   charSkin = "";
   charHair = "";
   hasAppear = 0;
   charSpellSlots1 = "";
   charSpellSlots2 = "";
   charSpellSlots3 = "";
   charSpellSlots4 = "";
   charSpellSlots5 = "";
   charSpellSlots6 = "";
   charSpellSlots7 = "";
   charSpellSlots8 = "";
   charSpellSlots9 = "";

   $("#textHere").val('');
   $("#pdfUpload").hide();
}

function doPage2(charArray2) {
   if (isEmpty(charArray2)) {
      //console.log("charArray2 is empty");
   } else {
      while (charArray2.length < 1) {
         // Wait until charArray is populated?)
      }
      for (var p = 0; p < charArray2.length; p++) {
         if (charArray2[p].fieldName == "Age") {
            charAge = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "Height") {
            charHeight = fixQuote(charArray2[p].fieldValue);
         } else if (charArray2[p].fieldName == "Weight") {
            charWeight = fixQuote(charArray2[p].fieldValue);
         } else if (charArray2[p].fieldName == "Eyes") {
            charEyes = fixQuote(charArray2[p].fieldValue);
         } else if (charArray2[p].fieldName == "Skin") {
            charSkin = fixQuote(charArray2[p].fieldValue);
         } else if (charArray2[p].fieldName == "Hair") {
            charHair = fixQuote(charArray2[p].fieldValue);
         } else if (charArray2[p].fieldName == "CP") {
            charCP = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "SP") {
            charSP = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "EP") {
            charEP = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "GP") {
            charGP = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "PP") {
            charPP = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "FeaturesTraits1") {
            charFT1 = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "FeaturesTraits2") {
            charFT2 = charArray2[p].fieldValue;
         } else if (charArray2[p].fieldName == "FeaturesTraits3") {
            charFT3 = charArray2[p].fieldValue;
         }
      }
      
      // Combine FeaturesTraitsFeats
      charFTfull = charFT1 + " " + charFT2 + " " + charFT3;
      featTraitArray = charFTfull.split("\n");
      for (c = 0; c < featTraitArray.length; c++) {
          if (featTraitArray[c].includes("FEATURES")) {
              startFeatures = c + 2;
              tempCounter = c + 2;
              while(!featTraitArray[tempCounter].match(/===/) ) {
                if (tempCounter >= featTraitArray.length - 1) {
                    tempCounter = featTraitArray.length;
                    break;
                }
                 tempCounter += 1 ;
              }
              endFeatures = tempCounter;
          }
          if (featTraitArray[c].includes("TRAITS")) {
            startTraits = c + 2;
            tempCounter = c + 2;
            while(!featTraitArray[tempCounter].match(/===/) ) {
                if (tempCounter >= featTraitArray.length - 1) {
                    tempCounter = featTraitArray.length;
                   break;
                }
                tempCounter += 1 ;
               }
               endTraits = tempCounter;
          }
          if (featTraitArray[c].includes("FEATS")) {
            startFeats = c + 2;
            tempCounter = c + 2;
            while(!featTraitArray[tempCounter].match(/===/) ) {
                if (tempCounter >= featTraitArray.length - 1) {
                    tempCounter = featTraitArray.length;
                   break;
                }
                tempCounter += 1 ;
               }
               endFeats = tempCounter;
          }
          
      }

      charFeatures = featTraitArray.slice(startFeatures, endFeatures);
      charTraits = featTraitArray.slice(startTraits, endTraits);
      charFeats = featTraitArray.slice(startFeats, endFeats);

      featureArray = [];
      traitArray = [];
      featArray = [];
      patt = new RegExp(/^\*/);
      for(d = 0; d < charFeatures.length; d++) {
         if (patt.test(charFeatures[d])) {
            featureArray.push(d);
         }
      }
      for(j = 0; j < charTraits.length; j++) {
        if (patt.test(charTraits[j])) {
            traitArray.push(j);
        }
     }
     for(p = 0; p < charFeats.length; p++) {
        if (patt.test(charFeats[p])) {
            featArray.push(p);
        }
     }

      
      // We have how many features there are (featureCount)
      // We have which line each feature starts (featureArray)
      for(f= 0; f < featureArray.length; f++) {
          thisList = "";
          lastEntry = 42;
          if (featureArray[f + 1] === undefined) {

            lastEntry = charFeatures.length;
          } else {
              lastEntry = featureArray[f + 1];
          }
          for(g = featureArray[f]; g < lastEntry; g++) {
              if (g <= lastEntry) {
                  if (charFeatures[g] == "") 
                     continue;
                 thisList += fixQuote(charFeatures[g]).replace("|", "").trim() + "\n";
              } else {
                  continue;
              }
          }
          allFeatures.push(thisList.trim());
      }


      for(g= 0; g < traitArray.length; g++) {
        thisList = "";
        lastEntry = 42;
        if (traitArray[g + 1] === undefined) {
            lastEntry = charTraits.length;
        } else {
            lastEntry = traitArray[g + 1];
        }
        for(j = traitArray[g]; j < lastEntry; j++) {
            if (j <= lastEntry) {
                if (charTraits[j] == "") 
                    continue;
                thisList += fixQuote(charTraits[j]).replace("|", "").trim() + "\n";
            } else {
                continue;
            }
        }
        allTraits.push(thisList.trim());
    }

    for(m= 0; m < featArray.length; m++) {
        thisList = "";
        lastEntry = 42;
        if (featArray[m + 1] === undefined) {
            lastEntry = charFeats.length;
        } else {
            lastEntry = featArray[m + 1];
        }
        for(n = featArray[m]; n < lastEntry; n++) {
            if (n <= lastEntry) {
                if (charFeats[n] == "") 
                    continue;
                thisList += fixQuote(charFeats[n]).replace("|", "").trim() + "\n";
            } else {
                continue;
            }
        }
        allFeats.push(thisList.trim());
    }

      fileUploaded3(pdfFileName);
   }
}

function doPage3(charArray3) {
   if (isEmpty(charArray3)) {
      //console.log("charArray3 is empty");
   } else {
      while (charArray3.length < 1) {
         // Wait until charArray is populated?)
      }
      
      for (var q = 0; q < charArray3.length; q++) {
         if (charArray3[q].fieldValue == null || charArray3[q].fieldValue == "") {

         } else {
            var fixedString = fixQuote(charArray3[q].fieldValue);
         }
         if (charArray3[q].fieldName == "AGE") {
            charAge = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "HEIGHT") {
            charHeight = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "WEIGHT") {
            charWeight = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "EYES") {
            charEyes = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SKIN") {
            charSkin = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "HAIR") {
            charHair = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "GENDER") {
            charGender = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "PersonalityTraits ") {
            charPerTraits = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "Ideals") {
            charIdeals = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "Bonds") {
            charBonds = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "Flaws") {
            charFlaws = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "ALIGNMENT") {
            charAlign = charArray3[q].fieldValue;
         } else if (charArray3[q].fieldName == "FAITH") {
             charDeity = charArray3[q].fieldValue;
         // Start Cantrips
         } else if (charArray3[q].fieldName == "Spells 1014") {
            charSpellCan[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1016") {
            charSpellCan[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1017") {
            charSpellCan[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1018") {
            charSpellCan[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1019") {
            charSpellCan[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1020") {
            charSpellCan[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1021") {
            charSpellCan[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1022") {
            charSpellCan[7] = fixQuote(charArray3[q].fieldValue);
         // Start Level 1 spells
         } else if (charArray3[q].fieldName == "Spells 1015") {
            charSpell1st[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1023") {
            charSpell1st[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1024") {
            charSpell1st[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1025") {
            charSpell1st[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1026") {
            charSpell1st[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1027") {
            charSpell1st[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1028") {
            charSpell1st[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1029") {
            charSpell1st[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1030") {
            charSpell1st[8] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1031") {
            charSpell1st[9] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1032") {
            charSpell1st[10] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1033") {
            charSpell1st[11] = fixQuote(charArray3[q].fieldValue);
         // Start Level 2 spells
         } else if (charArray3[q].fieldName == "Spells 1046") {
            charSpell2nd[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1034") {
            charSpell2nd[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1035") {
            charSpell2nd[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1036") {
            charSpell2nd[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1037") {
            charSpell2nd[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1038") {
            charSpell2nd[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1039") {
            charSpell2nd[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1040") {
            charSpell2nd[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1041") {
            charSpell2nd[8] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1042") {
            charSpell2nd[9] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1043") {
            charSpell2nd[10] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1044") {
            charSpell2nd[11] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1045") {
            charSpell2nd[12] = fixQuote(charArray3[q].fieldValue);
         // Start Level 3 spells
         } else if (charArray3[q].fieldName == "Spells 1048") {
            charSpell3rd[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1047") {
            charSpell3rd[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1049") {
            charSpell3rd[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1050") {
            charSpell3rd[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1051") {
            charSpell3rd[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1052") {
            charSpell3rd[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1053") {
            charSpell3rd[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1054") {
            charSpell3rd[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1055") {
            charSpell3rd[8] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1056") {
            charSpell3rd[9] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1057") {
            charSpell3rd[10] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1058") {
            charSpell3rd[11] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1059") {
            charSpell3rd[12] = fixQuote(charArray3[q].fieldValue);
         // Start Level 4 spells
         }  else if (charArray3[q].fieldName == "Spells 1061") {
            charSpell4th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1060") {
            charSpell4th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1062") {
            charSpell4th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1063") {
            charSpell4th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1064") {
            charSpell4th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1065") {
            charSpell4th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1066") {
            charSpell4th[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1067") {
            charSpell4th[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1068") {
            charSpell4th[8] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1069") {
            charSpell4th[9] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1070") {
            charSpell4th[10] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1071") {
            charSpell4th[11] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1072") {
            charSpell4th[12] = fixQuote(charArray3[q].fieldValue);
         // Start Level 5 spells
         } else if (charArray3[q].fieldName == "Spells 1074") {
            charSpell5th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1073") {
            charSpell5th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1075") {
            charSpell5th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1076") {
            charSpell5th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1077") {
            charSpell5th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1078") {
            charSpell5th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1079") {
            charSpell5th[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1080") {
            charSpell5th[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1081") {
            charSpell5th[8] = fixQuote(charArray3[q].fieldValue);
         // Start Level 6 spells
         } else if (charArray3[q].fieldName == "Spells 1083") {
            charSpell6th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1082") {
            charSpell6th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1084") {
            charSpell6th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1085") {
            charSpell6th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1086") {
            charSpell6th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1087") {
            charSpell6th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1088") {
            charSpell6th[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1089") {
            charSpell6th[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1090") {
            charSpell6th[8] = fixQuote(charArray3[q].fieldValue);
         // Start Level 7 spells
         } else if (charArray3[q].fieldName == "Spells 1092") {
            charSpell7th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1091") {
            charSpell7th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1093") {
            charSpell7th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1094") {
            charSpell7th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1095") {
            charSpell7th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1096") {
            charSpell7th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1097") {
            charSpell7th[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1098") {
            charSpell7th[7] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 1099") {
            charSpell7th[8] = fixQuote(charArray3[q].fieldValue);
         // Start Level 8 spells
         } else if (charArray3[q].fieldName == "Spells 10101") {
            charSpell8th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10100") {
            charSpell8th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10102") {
            charSpell8th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10103") {
            charSpell8th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10104") {
            charSpell8th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10105") {
            charSpell8th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10106") {
            charSpell8th[6] = fixQuote(charArray3[q].fieldValue);
         // Start Level 9 spells
         } else if (charArray3[q].fieldName == "Spells 10108") {
            charSpell9th[0] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10107") {
            charSpell9th[1] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 10109") {
            charSpell9th[2] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 101010") {
            charSpell9th[3] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 101011") {
            charSpell9th[4] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 101012") {
            charSpell9th[5] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "Spells 101013") {
            charSpell9th[6] = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 19") {
            charSpellSlots1 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 20") {
            charSpellSlots2 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 21") {
            charSpellSlots3 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 22") {
            charSpellSlots4 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 23") {
            charSpellSlots5 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 24") {
            charSpellSlots6 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 25") {
            charSpellSlots7 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 26") {
            charSpellSlots8 = fixQuote(charArray3[q].fieldValue);
         } else if (charArray3[q].fieldName == "SlotsTotal 27") {
            charSpellSlots9 = fixQuote(charArray3[q].fieldValue);
         }
      }
      buildOutput();
   }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


